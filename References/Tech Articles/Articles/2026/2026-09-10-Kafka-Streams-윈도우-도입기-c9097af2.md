---
type: tech-article
title: "Kafka Streams 윈도우 도입기"
aliases: []
summary: "시간 기반 집계에서는 몇 분짜리 윈도우인가보다 이벤트 시간·스트림 시간·유예 시간의 의미를 먼저 정의해야 정산 경계와 지연 이벤트에서 데이터 정합성을 지킬 수 있다."
source: "컬리 기술 블로그"
published: 2025-12-01
collected: 2026-09-10
url: "https://helloworld.kurly.com/blog/2025-kafka-streams-window/"
topic: "동시성·분산"
categories:
  - "동시성·분산"
  - "DB·데이터"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/동시성-분산"
  - "tech/DB-데이터"
migration_origin: notion
---

# Kafka Streams 윈도우 도입기

> [!abstract] 한 줄 정리
> 시간 기반 집계에서는 몇 분짜리 윈도우인가보다 이벤트 시간·스트림 시간·유예 시간의 의미를 먼저 정의해야 정산 경계와 지연 이벤트에서 데이터 정합성을 지킬 수 있다.

> 컬리 기술 블로그 · 2025-12-01

## 핵심 내용

- **문제:** 원천 데이터가 5분 단위로 수집·발행돼 23:59에 생성된 데이터가 00:00 이후 Kafka에 들어오면 다음 날 집계 윈도우에 포함될 수 있었다.
- **구조:** 이벤트를 겹치지 않는 구간에서 한 번만 집계하기 위해 Tumbling Window와 grace period, suppress를 조합했다.
- **접근:** Kafka 발행 시각이 아니라 데이터 생성 시각을 사용하도록 `TimestampExtractor`를 적용해 event time 기준을 맞췄다.
- **주의점:** Processor 내부 `forward`는 stream time을 전진시키지 못했고, WindowStore를 강제로 훑어 발행하는 방식은 중복 결과를 만들었다. 최종적으로 source topic에 파티션별 dummy event를 넣어 각 파티션의 stream time을 전진시켰다.
- **트레이드오프:** 시간 기반 로직은 경계 시점, late event, 재계산 정책까지 함께 정의해야 하며 테스트도 단순 CRUD보다 까다롭다.

## 왜 읽을까

Kafka Streams API 사용법보다 더 중요한 `event time`, `stream time`, `grace period`가 실제 정산 경계와 어떻게 충돌하는지 보여준다. 특히 실패한 두 접근과 중복 문제까지 공개해 시간 기반 분산 처리에서 무엇을 먼저 정의해야 하는지 판단 기준을 얻기 좋다.

**프로젝트에 적용 — FutMatch**

- [ ] 추후 이벤트 기반 매칭·참여 집계를 도입할 때 이벤트 자체의 발생 시각을 payload에 명시한다.
- [ ] 자정·마감 직전 이벤트와 지연 도착 이벤트를 별도 테스트 케이스로 둔다.
- [ ] 파티션별 시간 진행과 재처리 시 중복 가능성을 검증한 뒤 윈도우 처리를 도입한다.

---

**원문:** [Kafka Streams 윈도우 도입기](https://helloworld.kurly.com/blog/2025-kafka-streams-window/)
