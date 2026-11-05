---
type: tech-article
title: "Scaling to Infinity: 한계를 넘어서는 LY Corporation의 관측 가능성 플랫폼 진화기"
aliases: []
summary: "관측 데이터가 커질수록 범용 저장소의 단순 확장보다 실제 조회 패턴과 데이터 수명에 맞춘 저장 계층 설계가 중요해진다. MySQL→OpenTSDB→자체 TSDB로 진화한 이유와 그 과정의 운영 한계를 함께 볼 수 있다."
source: "LY Corporation Tech Blog"
published: 
collected: 2026-09-17
collected_dates:
  - 2026-09-17
  - 2026-07-21
url: "https://techblog.lycorp.co.jp/ko/the-evolution-of-the-ly-observability-platform"
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

# Scaling to Infinity: 한계를 넘어서는 LY Corporation의 관측 가능성 플랫폼 진화기

> [!abstract] 한 줄 정리
> 관측 데이터가 커질수록 범용 저장소의 단순 확장보다 실제 조회 패턴과 데이터 수명에 맞춘 저장 계층 설계가 중요해진다. MySQL→OpenTSDB→자체 TSDB로 진화한 이유와 그 과정의 운영 한계를 함께 볼 수 있다.

> LY Corporation Tech Blog

## 핵심 내용

- **문제:** SOA에서 MSA로 전환하며 모니터링 대상과 지표가 급증했고 MySQL은 저장 비용, 쓰기 부하, 조회 지연과 경직된 태그 스키마 한계에 부딪혔다.
- **접근:** 2016년 OpenTSDB를 도입했지만 태그 수·문자 제약과 대용량 조회 전 warm-up 필요성이 운영 복잡도를 만들자 2018년 자체 TSDB 개발을 시작해 2019년 전환했다.
- **구조:** 조회의 85%가 최근 26시간에 집중된다는 패턴에서 아이디어를 얻어 hot 지표는 IMDB, 오래된 데이터는 Cassandra에 두는 다중 계층 저장소를 구성했다.
- **수치:** 현재 일간 수조 건의 지표를 처리하며, 자체 엔진 도입 뒤 2019년 이후 하루 지표 수집량이 매년 2,000억 건 이상 증가했다.
- **트레이드오프:** Kubernetes 전환 뒤 cardinality가 폭증하면서 IMDB의 동일 사양 노드 제약과 Cassandra 리밸런싱에 수십 시간이 걸리는 문제가 다시 나타났다. 자체 엔진도 한 번 만들고 끝나는 해법이 아니었다.

## 왜 읽을까

Observability를 Grafana 화면 구성 정도가 아니라 대규모 시계열 데이터를 어떤 비용 구조로 저장하고 조회할 것인가의 문제로 볼 수 있다. 특히 기존 API 호환성을 유지하면서 내부 저장 아키텍처를 교체한 점도 점진적 마이그레이션 관점에서 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 성능 실험에서 모든 지표를 무기한 수집하지 말고 어떤 지표가 장애·병목 판단에 실제 필요한지 먼저 정한다.
- [ ] Grafana/Prometheus를 붙일 때 수집 주기와 label cardinality가 만드는 저장 비용을 같이 관찰한다.
- [ ] 규모가 작을 때부터 자체 TSDB 같은 해법을 선도입하지 않고, 실제 보관량·조회 패턴이 병목이 된 뒤 저장 전략을 비교한다.

---

**원문:** [Scaling to Infinity: 한계를 넘어서는 LY Corporation의 관측 가능성 플랫폼 진화기](https://techblog.lycorp.co.jp/ko/the-evolution-of-the-ly-observability-platform)
