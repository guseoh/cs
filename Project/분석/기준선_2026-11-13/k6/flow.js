// 기준선: 로그인 회원의 구매 흐름 (담기 → 체크아웃 → 결제 승인 → 주문 목록), 1 VU 순차 60초
import http from 'k6/http';
import { Rate, Trend, Counter } from 'k6/metrics';

const BASE = __ENV.BASE_URL;
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(BASE || '')) throw new Error('loopback BASE_URL only');
const SKU = Number(__ENV.SKU_ID);

const t = {
  cart: new Trend('s_cart_add', true), checkout: new Trend('s_checkout', true),
  confirm: new Trend('s_confirm', true), orders: new Trend('s_orders', true),
};
const errors = new Rate('s_errors');
const flows = new Counter('s_flows');
const failedSteps = new Counter('s_failed_steps');

export const options = {
  noCookiesReset: true,                               // k6 기본값은 회차마다 쿠키 초기화
  scenarios: { flow: { executor: 'constant-vus', vus: 1, duration: '60s', gracefulStop: '10s' } },
  summaryTrendStats: ['med', 'p(95)', 'p(99)', 'max'],
};

let csrf = null;
let addressId = null;

function token() {
  const r = http.get(`${BASE}/api/auth/csrf`);
  return JSON.parse(r.body).token;
}
function json(method, path, body, extra) {
  const headers = Object.assign({ 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf }, extra || {});
  return http.request(method, `${BASE}${path}`, body === null ? null : JSON.stringify(body), { headers, redirects: 0 });
}
function login() {
  csrf = token();
  const r = json('POST', '/api/auth/login', { email: __ENV.QA_EMAIL, password: __ENV.QA_PASSWORD });
  if (r.status !== 200) throw new Error('login failed ' + r.status);
  csrf = token();                                   // 로그인 후 토큰 회전
  const list = http.get(`${BASE}/api/addresses`);
  const arr = JSON.parse(list.body);
  const items = Array.isArray(arr) ? arr : (arr.items || []);
  if (items.length > 0) { addressId = items[0].addressId || items[0].id; return; }
  const c = json('POST', '/api/addresses', { name: '기준선', recipientName: '측정', recipientPhone: '010-0000-0000',
    postalCode: '00000', addressLine1: '측정용 주소', addressLine2: '' });
  const created = JSON.parse(c.body);
  addressId = created.addressId || created.id;
}
let failLogs = 0;

export default function () {
  if (!csrf) login(); else csrf = token();          // 회차마다 토큰 재발급(프론트 동작과 동일)
  let ok = true;
  const step = (name, res, expect) => {
    t[name].add(res.timings.duration);
    const pass = expect.includes(res.status);
    if (!pass) {
      ok = false; failedSteps.add(1, { step: name, status: String(res.status) });
      if (failLogs++ < 3) console.log(`FAIL ${name} ${res.status} ${String(res.body || '').substring(0, 160)}`);
    }
    return pass;
  };
  if (!step('cart', json('POST', '/api/cart/items', { skuId: SKU, quantity: 1 }), [200, 201, 204])) { errors.add(true); return; }
  const key = `base-${__VU}-${__ITER}-${Date.now()}`;
  const co = json('POST', '/api/checkout', { addressId }, { 'Idempotency-Key': key });
  if (!step('checkout', co, [200, 201])) { errors.add(true); return; }
  const body = JSON.parse(co.body);
  const cf = json('POST', '/api/payments/toss/confirm',
    { paymentKey: `base_${key}`, providerOrderId: body.providerOrderId, amount: body.amount });
  step('confirm', cf, [200]);
  step('orders', http.get(`${BASE}/api/orders`), [200]);
  flows.add(1);
  errors.add(!ok);
}

export function handleSummary(data) {
  const m = data.metrics;
  const pick = k => (m[k] ? m[k].values : null);
  const out = { flows: m.s_flows ? m.s_flows.values.count : 0, errorRate: pick('s_errors') ? pick('s_errors').rate : null,
    failedSteps: m.s_failed_steps ? m.s_failed_steps.values.count : 0,
    cartAdd: pick('s_cart_add'), checkout: pick('s_checkout'), confirm: pick('s_confirm'), orders: pick('s_orders') };
  return { [__ENV.RESULT]: JSON.stringify(out, null, 2), stdout: JSON.stringify(out) + '\n' };
}
