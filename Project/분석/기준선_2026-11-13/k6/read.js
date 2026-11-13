// 기준선: 공개 읽기 경로 (열린 모델, 30초 예열 + 60초 측정)
import http from 'k6/http';
import { Rate, Trend, Counter } from 'k6/metrics';

const BASE = __ENV.BASE_URL;
const TARGET = __ENV.TARGET || 'list';           // list | detail
const RATE = Number(__ENV.RATE || 50);
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(BASE || '')) throw new Error('loopback BASE_URL only');

const latency = new Trend('m_latency', true);
const errors = new Rate('m_errors');
const reqs = new Counter('m_requests');

export const options = {
  discardResponseBodies: true,
  scenarios: {
    warmup: { executor: 'constant-vus', vus: 2, duration: '30s', exec: 'warm', gracefulStop: '0s' },
    measure: { executor: 'constant-arrival-rate', rate: RATE, timeUnit: '1s', duration: '60s',
      startTime: '30s', preAllocatedVUs: 50, maxVUs: 200, exec: 'measure', gracefulStop: '5s' },
  },
  summaryTrendStats: ['med', 'p(95)', 'p(99)', 'max'],
};

export function setup() {
  const res = http.get(`${BASE}/api/products`, { responseType: 'text' });
  const body = JSON.parse(res.body);
  const items = body.items || body.products || body.content || body;
  const ids = (Array.isArray(items) ? items : []).map(p => p.id || p.productId).filter(Boolean);
  if (TARGET === 'detail' && ids.length === 0) throw new Error('no product ids');
  return { ids };
}

function path(data) {
  if (TARGET === 'list') return '/api/products';
  return `/api/products/${data.ids[Math.floor(Math.random() * data.ids.length)]}`;
}

export function warm(data) { http.get(`${BASE}${path(data)}`); }

export function measure(data) {
  const r = http.get(`${BASE}${path(data)}`, { tags: { name: TARGET } });
  reqs.add(1);
  latency.add(r.timings.duration);
  errors.add(r.status !== 200);
}

export function handleSummary(data) {
  const m = data.metrics;
  const out = {
    target: TARGET, rate: RATE,
    requests: m.m_requests ? m.m_requests.values.count : 0,
    dropped: m.dropped_iterations ? m.dropped_iterations.values.count : 0,
    errorRate: m.m_errors ? m.m_errors.values.rate : null,
    latencyMs: m.m_latency ? m.m_latency.values : null,
  };
  return { [__ENV.RESULT]: JSON.stringify(out, null, 2), stdout: JSON.stringify(out) + '\n' };
}
