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

Kafka Streams에서 5분 주기로 모인 데이터를 자정에 집계하면 23:59에 생성된 이벤트도 실제 Kafka 발행이 00:00을 넘어서 다음 날의 윈도우에 들어갈 수 있다. 집계 기준은 메시지가 브로커에 도착한 시각이 아니라 업무 데이터의 생성 시각이어야 하므로 컬리는 이벤트 시간 기반 집계를 검토했다.

 ```mermaid
flowchart LR
 A[원본 이벤트의 생성 시각] --> B[TimestampExtractor]
 B --> C[Tumbling Window·Grace]
 D[파티션별 Dummy Event] --> E[Stream Time 전진]
 E --> C
 C --> F[Suppress 후 윈도우 결과]
```

*원문 근거를 바탕으로 자체 재구성한 가로형 학습 도식이다.*

`TimestampExtractor`로 원본 데이터의 생성 시각을 읽고 Tumbling Window와 Grace Period, Suppress를 이용해 한 시각 구간을 한 번 집계하고 충분히 늦게 도착하는 데이터를 허용하도록 했다. 하지만 Suppress는 Stream Time이 윈도우 종료·Grace를 지나야 결과를 내보낼 수 있으므로 토픽에 새 이벤트가 없으면 시간이 흘러도 결과가 발행되지 않을 수 있다. Processor의 단순 `forward`는 원천 스트림 시간 전진으로 인정되지 않았고 WindowStore를 수동 탐색하는 방식은 중복 결과를 만들었다.

```text
# 집계 시각의 차이를 나타내는 학습용 예시
Event Time: 23:59:50
Kafka Arrival: 00:00:20
윈도우 소속: 도착 시각이 아닌 23:55~00:00 구간
```

*실제 Window 크기·Grace 값은 서비스에서 허용하는 지연과 재처리 정책으로 결정한다.*

최종 접근은 각 소스 파티션에 Dummy Event를 추가해 Stream Time을 앞으로 이동시키는 것이었다. 파티션별로 진행 상태가 달라질 수 있고 실제 데이터와 Dummy를 구분해야 하므로 테스트에서 자정 경계, 지연 도착, 파티션의 무활동, Replay 시 중복 발행 여부까지 확인해야 한다. 이벤트 시간에 맞추는 것과 정확히 한 번 출력한다는 보장은 서로 다른 계약이다.

## 왜 읽을까

Kafka Streams API 사용법보다 더 중요한 `event time`, `stream time`, `grace period`가 실제 정산 경계와 어떻게 충돌하는지 보여준다. 특히 실패한 두 접근과 중복 문제까지 공개해 시간 기반 분산 처리에서 무엇을 먼저 정의해야 하는지 판단 기준을 얻기 좋다.

**프로젝트에 적용 — FutMatch**

- [ ] 추후 이벤트 기반 매칭·참여 집계를 도입할 때 이벤트 자체의 발생 시각을 payload에 명시한다.
- [ ] 자정·마감 직전 이벤트와 지연 도착 이벤트를 별도 테스트 케이스로 둔다.
- [ ] 파티션별 시간 진행과 재처리 시 중복 가능성을 검증한 뒤 윈도우 처리를 도입한다.

---

**원문:** [Kafka Streams 윈도우 도입기](https://helloworld.kurly.com/blog/2025-kafka-streams-window/)
