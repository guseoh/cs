---
type: tech-article
title: "critical-script, 배달의민족 웹뷰 로딩 성능을 30% 개선한 인라인 스크립트 로딩 전략 이야기"
aliases: []
summary: "느린 API나 번들을 각각 더 빠르게 만드는 대신, HTML 파싱 직후 API 호출을 시작해 JavaScript 다운로드·실행과 병렬화하면 로딩의 임계 경로를 단축할 수 있다."
source: "우아한형제들 기술블로그 · 추용혁"
published: 2026-10-21
collected: 2026-10-25
url: "https://techblog.woowahan.com/27864/"
topic: "성능"
categories:
  - "성능"
  - "설계·아키텍처"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# critical-script, 배달의민족 웹뷰 로딩 성능을 30% 개선한 인라인 스크립트 로딩 전략 이야기

> [!abstract] 한 줄 정리
> 느린 API나 번들을 각각 더 빠르게 만드는 대신, HTML 파싱 직후 API 호출을 시작해 JavaScript 다운로드·실행과 병렬화하면 로딩의 임계 경로를 단축할 수 있다.

> 우아한형제들 기술블로그 · 추용혁 · 2026-10-21

## 핵심 내용

웹뷰 초기 화면의 로딩 지연은 JavaScript 번들 다운로드, React 렌더링, API 호출이 직렬로 이어질 때 생기는 임계 경로 문제였다. 배달의민족은 API 자체의 처리 시간을 단축한 것이 아니라 HTML 파싱 중 작은 인라인 스크립트에서 API 요청을 먼저 시작해 메인 번들 실행과 네트워크 요청을 병렬화했다.

![기존 로딩 워터폴과 API 병렬화에 따른 LCP 시점 비교](https://techblog.woowahan.com/wp-content/uploads/2026/10/waterfall-overlay-750x360.png)

*그림 1. API 호출 시점을 번들 실행과 겹치게 당겨 임계 경로를 줄인 원문 그림 — [출처: 원문 기술 블로그](https://techblog.woowahan.com/27864/)*

![실제 사용자의 가게홈 상품상세 LCP 전후 비교](https://techblog.woowahan.com/wp-content/uploads/2026/10/results-lcp-750x353.png)

*그림 2. 가게홈과 상품상세에서 p50·p75·p90 LCP 개선을 비교한 원문 측정 결과 — [출처: 원문 기술 블로그](https://techblog.woowahan.com/27864/)*

인라인 스크립트가 `fetch()`로 시작한 Promise를 전역 캐시에 넣으면 앱의 Axios 인터셉터가 동일 URL의 결과를 재사용할 수 있다. 처음에는 코드가 별도 패키지로 떨어져 유지보수가 어려웠으므로 페이지 파일 옆의 `*.critical.ts`를 Vite 플러그인이 인라인 코드로 빌드하도록 바꿨다. 플러그인은 실수로 무거운 라이브러리가 들어가지 않도록 기본 산출물 크기를 8KB로 제한한다.

```ts
// 원문 critical-script의 핵심 패턴을 축약해 재구성
const url = getStoreHomeUrl(storeId);
window.__prefetch__ ??= { cache: new Map() };
window.__prefetch__.cache.set(url, fetch(url));
```

요청을 먼저 시작했다는 사실만으로 중복 요청이 사라지는 것은 아니다. 메인 앱이 동일한 Promise를 반드시 재사용하도록 해야 한다.

| 측정 조건 | 적용 전 | 적용 후·변화 |
| --- | ---: | ---: |
| 갤럭시 S22+·Wi-Fi의 실험 LCP | 1,340ms | 847ms(약 37% 개선) |
| 실제 사용자 Sentry RUM | 적용 전 1주일 | 적용 후 1주일, LCP p50/p75/p90 약 25~35% 개선 |
| 적용 페이지 수 | 초기 일부 페이지 | 약 80개로 확대 |
| 중요 인라인 스크립트 크기 | 별도 최적화 필요 | 기본 8KB 상한 설정 |

*실험실의 단일 기기 수치와 실제 사용자 데이터는 서로 다른 측정 집단이다. API 계산이나 네트워크 전송 자체의 시간을 줄였다는 뜻은 아니다.*

갤럭시 S22+·Wi-Fi 실험에서는 LCP가 1,340ms에서 847ms로 약 37% 개선됐다. 실제 사용자 Sentry 데이터에서도 적용 전후 각각 1주일에 걸친 LCP 분위수 p50·p75·p90이 25~35% 개선되었다. 그러나 CPU 계산이나 네트워크 전송량 자체가 줄어든 것은 아니며, 별도 런타임에서 실행되므로 메인 앱의 모듈 싱글톤·polyfill과 동일한 환경이라고 가정할 수 없다.

## 왜 읽을까

성능 개선의 단위를 함수·쿼리에서 로딩 워터폴 전체로 확장하는 사고법을 배울 수 있다. 실험에서 얻은 성능 이득을 유지하면서 코드 응집도와 확장성을 개선한 후속 설계도 실무적으로 가치가 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 상품 목록·상세 페이지에서 Performance 탭으로 HTML·번들·API·이미지 요청의 시작 순서를 기록한다.
- [ ] 중요한 API 호출이나 LCP 이미지 로딩을 앞당길 수 있는 구간이 있는지 먼저 판단한다. 웹뷰 전용 구현을 그대로 복제하지 않는다.
- [ ] 변경 전후 동일 기기·네트워크 조건에서 LCP와 중복 요청 여부를 재측정한다.

---

**원문:** [critical-script, 배달의민족 웹뷰 로딩 성능을 30% 개선한 인라인 스크립트 로딩 전략 이야기](https://techblog.woowahan.com/27864/)
