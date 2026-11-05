/* Daily Tech: a local-only Obsidian dashboard for DataviewJS.
   Data remains in Markdown notes; this view never changes article metadata. */
const source = '"References/Tech Articles/Articles"';
const asList = value => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value.array === "function") return value.array();
  if (typeof value[Symbol.iterator] === "function") return Array.from(value);
  return [value];
};
const dayString = value => {
  if (!value) return null;
  if (typeof value.toISODate === "function") return value.toISODate();
  const m = String(value).match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
};
const pages = dv.pages(source)
  .where(p => p.type === "tech-article" && p.file && p.file.path)
  .array()
  .map(p => ({
    path: p.file.path,
    title: String(p.title || p.file.name),
    summary: String(p.summary || ""),
    source: String(p.source || ""),
    topic: String(p.topic || ""),
    categories: asList(p.categories).map(String),
    date: dayString(p.collected),
    published: dayString(p.published),
    status: String(p.status || "inbox")
  }))
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || a.title.localeCompare(b.title, "ko"));
const now = new Date();
const state = { year: now.getFullYear(), month: now.getMonth(), day: null,
  topic: "전체", query: "", status: "전체", page: 0 };
const statuses = { inbox: "읽기 대기", reading: "읽는 중",
  reviewed: "학습 완료", archived: "보관" };
const root = document.createElement("div");
root.className = "tech-archive";
dv.container.appendChild(root);

function elt(parent, tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined && value !== null) node.textContent = String(value);
  parent.appendChild(node);
  return node;
}
function pad(n) { return String(n).padStart(2, "0"); }
function iso(y, m, day) { return y + "-" + pad(m + 1) + "-" + pad(day); }
function countText(n) { return n + "편"; }
function button(parent, label, className, click, ariaLabel) {
  const b = elt(parent, "button", className, label);
  b.type = "button";
  if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
  b.addEventListener("click", click);
  return b;
}
function openNote(entry) {
  // Native Obsidian navigation; never uses external URLs or custom protocols.
  app.workspace.openLinkText(entry.path, "", false);
}
function monthCount(date) { return pages.filter(p => p.date === date).length; }
function renderCalendar(parent) {
  const section = elt(parent, "section", "tech-archive__calendar-wrap");
  const heading = elt(section, "div", "tech-archive__section-head");
  const name = elt(heading, "div", "");
  elt(name, "span", "tech-archive__eyebrow", "BROWSE BY DATE");
  elt(name, "h2", "tech-archive__heading", "날짜별 아카이브");
  elt(heading, "span", "tech-archive__hint", "날짜 선택 → 해당 글 보기");

  const toolbar = elt(section, "div", "tech-archive__monthbar");
  const controls = elt(toolbar, "div", "tech-archive__month-controls");
  button(controls, "‹", "tech-archive__nav", () => {
    const next = new Date(state.year, state.month - 1, 1);
    state.year = next.getFullYear(); state.month = next.getMonth(); render();
  }, "이전 달");
  elt(controls, "strong", "tech-archive__month-title", state.year + "년 " + (state.month + 1) + "월");
  button(controls, "›", "tech-archive__nav", () => {
    const next = new Date(state.year, state.month + 1, 1);
    state.year = next.getFullYear(); state.month = next.getMonth(); render();
  }, "다음 달");
  button(toolbar, "이번 달", "tech-archive__outline", () => {
    state.year = now.getFullYear(); state.month = now.getMonth(); state.day = null; state.page = 0; render();
  });

  const calendar = elt(section, "div", "tech-archive__calendar");
  ["일","월","화","수","목","금","토"].forEach((day, i) => {
    const head = elt(calendar, "div", "tech-archive__weekday" + (i === 0 ? " tech-archive__sunday" : ""), day);
    head.setAttribute("aria-hidden", "true");
  });
  const offset = new Date(state.year, state.month, 1).getDay();
  const lastDay = new Date(state.year, state.month + 1, 0).getDate();
  const total = Math.ceil((offset + lastDay) / 7) * 7;
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < total; i++) {
    const day = i - offset + 1;
    if (day < 1 || day > lastDay) {
      elt(calendar, "div", "tech-archive__empty");
      continue;
    }
    const date = iso(state.year, state.month, day);
    const articles = pages.filter(p => p.date === date);
    const selected = state.day === date;
    const cell = button(calendar, "", "tech-archive__day" +
      (selected ? " is-selected" : "") + (date === todayIso ? " is-today" : ""),
      () => { state.day = selected ? null : date; state.page = 0; render(); },
      date + " · " + countText(articles.length));
    const top = elt(cell, "span", "tech-archive__day-top");
    elt(top, "span", "tech-archive__day-number", day);
    if (articles.length) elt(top, "span", "tech-archive__day-count", countText(articles.length));
    articles.slice(0, 2).forEach(p => {
      const snippet = elt(cell, "span", "tech-archive__day-article", p.title);
      snippet.title = p.title;
    });
    if (articles.length > 2) elt(cell, "span", "tech-archive__overflow", "+" + (articles.length - 2) + "편");
  }
  if (state.day) {
    const selectedLine = elt(section, "div", "tech-archive__selected");
    elt(selectedLine, "span", "", state.day + " · " + countText(monthCount(state.day)));
    button(selectedLine, "날짜 선택 해제", "tech-archive__plain-button", () => {
      state.day = null; state.page = 0; render();
    });
  }
}
function articleMatch(p) {
  if (state.day && p.date !== state.day) return false;
  if (state.topic !== "전체" && !p.categories.includes(state.topic) && p.topic !== state.topic) return false;
  if (state.status !== "전체" && p.status !== state.status) return false;
  const q = state.query.trim().toLocaleLowerCase();
  return !q || [p.title, p.summary, p.source, p.topic, ...p.categories].join(" ").toLocaleLowerCase().includes(q);
}
let resultHost;
function renderResults() {
  resultHost.replaceChildren();
  const matching = pages.filter(articleMatch);
  const header = elt(resultHost, "div", "tech-archive__result-head");
  const left = elt(header, "div", "tech-archive__result-title");
  elt(left, "h3", "", state.day ? "선택한 날짜의 글" : "기술 자료 목록");
  elt(left, "span", "", countText(matching.length));
  if (state.day) button(header, "전체 날짜로 돌아가기", "tech-archive__plain-button", () => {
    state.day = null; state.page = 0; render();
  });
  if (!matching.length) {
    const empty = elt(resultHost, "div", "tech-archive__no-results");
    elt(empty, "strong", "", "조건에 맞는 글이 없습니다.");
    elt(empty, "p", "", "다른 날짜나 태그를 선택하거나 검색어를 변경해 보세요.");
    return;
  }
  const perPage = 10;
  const count = Math.ceil(matching.length / perPage);
  state.page = Math.min(state.page, count - 1);
  matching.slice(state.page * perPage, state.page * perPage + perPage).forEach((p, i) => {
    const item = elt(resultHost, "article", "tech-archive__article");
    const meta = elt(item, "div", "tech-archive__article-meta");
    elt(meta, "span", "", p.date || "날짜 미확인");
    elt(meta, "span", "", p.source || "출처 미확인");
    elt(meta, "span", "tech-archive__article-topic", p.topic || "기타");
    const title = button(item, p.title, "tech-archive__article-link", () => openNote(p));
    title.title = p.title;
    if (p.summary) elt(item, "p", "tech-archive__summary", p.summary);
    const bottom = elt(item, "div", "tech-archive__article-foot");
    for (const category of p.categories.slice(0, 2)) elt(bottom, "span", "tech-archive__category", category);
    if (p.status in statuses) elt(bottom, "span", "tech-archive__status", statuses[p.status]);
  });
  if (count > 1) {
    const paging = elt(resultHost, "div", "tech-archive__pagination");
    button(paging, "이전", "tech-archive__outline", () => { state.page--; renderResults(); },
      "이전 페이지").disabled = state.page === 0;
    elt(paging, "span", "", (state.page + 1) + " / " + count);
    button(paging, "다음", "tech-archive__outline", () => { state.page++; renderResults(); },
      "다음 페이지").disabled = state.page >= count - 1;
  }
}
function renderExplorer(parent) {
  const section = elt(parent, "section", "tech-archive__explorer");
  const heading = elt(section, "div", "tech-archive__section-head");
  const name = elt(heading, "div", "");
  elt(name, "span", "tech-archive__eyebrow", "EXPLORE ARTICLES");
  elt(name, "h2", "tech-archive__heading", "주제와 글 탐색");
  elt(heading, "span", "tech-archive__hint", "대표·보조 주제 모두 검색");
  const subjects = [...new Set(pages.flatMap(p => p.categories))].filter(Boolean).sort((a, b) => a.localeCompare(b, "ko"));
  const tags = elt(section, "div", "tech-archive__tags");
  ["전체", ...subjects].forEach(subject => {
    const b = button(tags, subject, "tech-archive__chip" + (state.topic === subject ? " is-active" : ""), () => {
      state.topic = subject; state.page = 0; render();
    });
    b.setAttribute("aria-pressed", String(state.topic === subject));
  });

  const tools = elt(section, "div", "tech-archive__tools");
  const search = elt(tools, "input", "tech-archive__search");
  search.type = "search";
  search.placeholder = "제목, 기술 내용, 출처 검색";
  search.setAttribute("aria-label", "기술 글 검색");
  search.value = state.query;
  search.addEventListener("input", () => { state.query = search.value; state.page = 0; renderResults(); });
  const select = elt(tools, "select", "tech-archive__select");
  select.setAttribute("aria-label", "읽기 상태 필터");
  [["전체","전체 상태"],["inbox","읽기 대기"],["reading","읽는 중"],
   ["reviewed","학습 완료"],["archived","보관"]].forEach(([value, label]) => {
    const o = elt(select, "option", "", label);
    o.value = value;
  });
  select.value = state.status;
  select.addEventListener("change", () => { state.status = select.value; state.page = 0; renderResults(); });
  resultHost = elt(section, "div", "tech-archive__results");
  renderResults();
}
function render() {
  root.replaceChildren();
  const top = elt(root, "div", "tech-archive__intro");
  const label = elt(top, "div", "tech-archive__eyebrow", "DAILY TECH  /  KNOWLEDGE ARCHIVE");
  elt(top, "p", "tech-archive__lead", "읽을거리를 쌓는 곳에서, 설계 판단을 꺼내 쓰는 곳으로.");
  elt(top, "p", "tech-archive__description",
    "국내 기술 블로그의 문제, 구현 과정, 트레이드오프, 검증 결과를 기록합니다. 날짜를 고르거나 분야를 선택하면 글을 바로 열 수 있습니다.");
  const stats = elt(root, "div", "tech-archive__stats");
  const datasets = [
    [pages.length, "등록된 글"],
    [new Set(pages.map(p => p.date).filter(Boolean)).size, "수집 날짜"],
    [new Set(pages.flatMap(p => p.categories)).size, "분류 주제"],
    [pages.filter(p => p.status === "inbox").length, "읽기 대기"]
  ];
  for (const [number, caption] of datasets) {
    const stat = elt(stats, "div", "tech-archive__stat");
    elt(stat, "strong", "", number.toLocaleString("ko-KR"));
    elt(stat, "span", "", caption);
  }
  renderCalendar(root);
  renderExplorer(root);
}
render();
