---
type: tech-article
title: "Grafana에서 자연어로 장애 원인을 분석하기: LLM 에이전트 기반 SRELens 개발기"
aliases: []
summary: "관측성 데이터를 한곳에 모으는 것만으로는 장애 분석이 쉬워지지 않습니다. 운영 지식을 LLM이 쓸 수 있는 형태로 명문화하고, 도구 호출과 비용·재시도·근거 범위를 코드로 통제해야 실제 운영 도구가 됩니다."
source: "LY Corporation Tech Blog"
published: 2026-07-31
collected: 2026-08-20
url: "https://techblog.lycorp.co.jp/ko/analyzing-incident-root-causes-in-grafana-using-natural-language-with-llm-agent"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "AI·개발도구"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/AI-개발도구"
migration_origin: notion
---

# Grafana에서 자연어로 장애 원인을 분석하기: LLM 에이전트 기반 SRELens 개발기

> [!abstract] 한 줄 정리
> 관측성 데이터를 한곳에 모으는 것만으로는 장애 분석이 쉬워지지 않습니다. 운영 지식을 LLM이 쓸 수 있는 형태로 명문화하고, 도구 호출과 비용·재시도·근거 범위를 코드로 통제해야 실제 운영 도구가 됩니다.

> LY Corporation Tech Blog · 2026-07-31

## 핵심 내용

- **문제:** 메트릭·로그·트레이스·프로파일이 서로 다른 화면과 라벨 체계에 흩어져 있어, 장애 시 사람이 시간 범위와 서비스명·트레이스 ID를 계속 옮겨가며 맥락을 연결해야 했습니다.
- **구조:** Loki·Grafana·Tempo·Mimir·Pyroscope로 LGTM-P 스택을 구성한 뒤, Grafana 플러그인인 SRELens가 LLM과 MCP 게이트웨이를 통해 여러 관측성 도구를 한 흐름으로 조회하도록 설계했습니다.
- **접근:** 프롬프트를 전역 안전 정책, 데이터소스별 운영 지식, 사용자·팀 맥락의 3개 레이어로 분리했습니다. 데이터소스별 라벨 차이와 조회 관습은 YAML 프래그먼트로 명문화해 불필요한 탐색 라운드를 줄였습니다.
- **주의점:** 에이전트 루프는 기본 최대 10라운드, 동일 도구·인자 중복 호출 차단, 도구별 재시도 기본 2회, 결과 크기·히스토리 제한을 둬 무한 재시도와 컨텍스트 폭증을 막았습니다.
- **운영:** 사용자별 토큰·요청량 제한과 HTTP 429를 두고, Redis 장애 시 대화 기록·개인화만 제한하되 단일 분석 요청은 계속 처리하도록 부분 장애를 격리했습니다.

## 왜 읽을까

AI를 관측성 화면에 붙였다는 사실보다, **LLM을 어디까지 믿고 어디부터 정책과 코드로 고정해야 하는지**가 더 중요한 글입니다. 장애 분석처럼 잘못된 확신의 비용이 큰 도구에서 근거가 부족하면 '모른다'고 말하게 만드는 설계도 참고할 만합니다.

**프로젝트에 적용 — PawCycle**

- [ ] Grafana 대시보드에서 자주 반복하는 장애 분석 순서를 `메트릭 → 로그 → 원인 후보`로 먼저 문서화하기
- [ ] 서비스명·로그 필드·주요 메트릭처럼 운영자가 머릿속으로 기억하는 규칙을 명시적인 운영 메타데이터로 남기기
- [ ] 향후 AI 분석을 붙인다면 조회 전용 도구부터 시작하고, 도구 호출 횟수·결과 크기·비용 상한을 먼저 설계하기

---

**원문:** [Grafana에서 자연어로 장애 원인을 분석하기: LLM 에이전트 기반 SRELens 개발기](https://techblog.lycorp.co.jp/ko/analyzing-incident-root-causes-in-grafana-using-natural-language-with-llm-agent)
