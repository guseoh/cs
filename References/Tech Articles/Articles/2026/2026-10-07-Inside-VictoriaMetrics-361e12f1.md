---
type: tech-article
title: "Inside VictoriaMetrics"
aliases: []
summary: "VictoriaMetrics를 단순한 모니터링 저장소로 보지 않고 수집 → 라우팅 → 저장 → 조회 파이프라인으로 분해해 내부 동작을 따라간다. 메트릭 시스템도 결국 데이터 유입량·카디널리티·저장 구조·조회 비용의 균형 문제라는 걸 이해하기 좋다."
source: "NAVER D2"
published: 2026-06-02
collected: 2026-10-07
url: "https://d2.naver.com/helloworld/9290861"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "DB·데이터"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/DB-데이터"
migration_origin: notion
---

# Inside VictoriaMetrics

> [!abstract] 한 줄 정리
> VictoriaMetrics를 단순한 모니터링 저장소로 보지 않고 수집 → 라우팅 → 저장 → 조회 파이프라인으로 분해해 내부 동작을 따라간다. 메트릭 시스템도 결국 데이터 유입량·카디널리티·저장 구조·조회 비용의 균형 문제라는 걸 이해하기 좋다.

> NAVER D2 · 2026-06-02

## 핵심 내용

- **구조:** VictoriaMetrics의 주요 경로를 `vmagent → vminsert → vmstorage → vmselect` 순서로 따라가며 각 컴포넌트의 책임을 분리해 설명한다.
- **접근:** 메트릭을 많이 수집하는 것 자체보다 어떤 레이블과 시계열을 어떤 방식으로 수집·라우팅·저장하는지가 이후 저장 비용과 조회 성능을 결정한다는 관점으로 접근한다.
- **주의점:** 시계열 시스템에서는 레이블 조합이 늘어날수록 카디널리티가 커질 수 있으므로, 수집 단계의 선택이 저장·조회 계층의 부담으로 전파된다.
- **트레이드오프:** 관측 가능성을 높이려고 모든 것을 수집하면 운영 비용과 쿼리 부하도 함께 커진다. 필요한 질문에 답할 수 있는 지표와 불필요한 시계열을 구분하는 것이 중요하다.

## 왜 읽을까

Prometheus/VictoriaMetrics 같은 도구를 설정법으로만 배우지 않고 데이터가 실제로 어느 경로를 지나가는지 이해할 수 있다. 이후 OOM, 느린 쿼리, 디스크 증가 같은 증상을 만났을 때 어느 계층부터 조사할지 판단하는 기반이 된다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 수집하는 메트릭마다 “어떤 운영 질문에 답하기 위한 값인가”를 연결해 본다.
- [ ] Hikari active/pending, Tomcat busy, API p95/p99처럼 현재 쓰는 지표의 레이블 카디널리티가 불필요하게 커지지 않는지 확인한다.
- [ ] 모니터링 저장 비용과 애플리케이션 성능 영향을 함께 측정해 관측 자체가 새로운 병목이 되지 않게 한다.

---

**원문:** [Inside VictoriaMetrics](https://d2.naver.com/helloworld/9290861)
