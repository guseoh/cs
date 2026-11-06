---
type: tech-article
title: "Kafka Connect로 DB 데이터 쉽게 연동하기"
aliases: []
summary: "Kafka Connect JDBC Source로 DB 동기화를 쉽게 만들 수 있지만, 폴링 기반 CDC의 오프셋과 트랜잭션 타이밍 때문에 삭제·갱신·지연 커밋 데이터가 누락될 수 있으므로 데이터 특성에 맞는 방식 선택이 중요하다는 글이다."
source: "컬리 기술 블로그"
published: 2025-03-04
collected: 2026-09-12
url: "https://helloworld.kurly.com/blog/kafka-connect-pipeline/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "동시성·분산"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/동시성-분산"
migration_origin: notion
---

# Kafka Connect로 DB 데이터 쉽게 연동하기

> [!abstract] 한 줄 정리
> Kafka Connect JDBC Source로 DB 동기화를 쉽게 만들 수 있지만, 폴링 기반 CDC의 오프셋과 트랜잭션 타이밍 때문에 삭제·갱신·지연 커밋 데이터가 누락될 수 있으므로 데이터 특성에 맞는 방식 선택이 중요하다는 글이다.

> 컬리 기술 블로그 · 2025-03-04

## 핵심 내용

여러 운영 DB를 Kafka로 복제하는 작업에 애플리케이션마다 새로운 CDC 코드를 작성하면 설정·배포·모니터링 비용이 반복된다. 컬리는 MySQL·Oracle·PostgreSQL 등에서 공통 JDBC Source Connector를 사용해 JSON 명세로 폴링 방식의 파이프라인을 구성했다.

로그 기반 CDC는 모든 변경에 가까운 이벤트를 추적하지만 DB 로그 접근 권한과 벤더별 설정 부담이 있다. JDBC 기반 폴링은 접근이 쉽고 데이터베이스 간 이식성이 높지만 Incrementing 모드는 이미 읽은 ID의 UPDATE를 잡지 못하고, 삭제되거나 폴링 구간 안에서 생성됐다 사라진 중간 상태도 놓칠 수 있다. Timestamp 모드에서도 긴 트랜잭션이 오래된 시간으로 늦게 Commit되면 더 최신 타임스탬프를 먼저 처리한 오프셋에서 밀려 영구 누락될 수 있다.

```json
{
  "mode": "timestamp+incrementing",
  "timestamp.column.name": "updated_at",
  "incrementing.column.name": "id",
  "timestamp.delay.interval.ms": "60000"
}
```

*JDBC Source Connector의 개념 예시다. 실제 원문의 프로덕션 Delay 값·컬럼명은 별도 확인이 필요하다.*

| 수집 방식 | 잡을 수 있는 변경 | 놓칠 수 있는 사건 |
| --- | --- | --- |
| Incrementing | 새 고유 키 INSERT | 기존 키 UPDATE/DELETE |
| Timestamp | 특정 시각 이후 변경 | 늦게 커밋된 구시각 행 |
| 로그 기반 CDC | 로그에 기록된 INSERT/UPDATE/DELETE | 로그 보관·권한 제약 |
| Delay Interval | 늦은 커밋 여유 | 데이터 최신성 지연 |

`timestamp.delay.interval.ms`는 현재 시각 바로 앞 구간을 즉시 읽지 않고 일정 시간 기다려 늦게 Commit된 행을 포착할 여유를 준다. 지연을 늘리면 누락 가능성은 낮아지지만 데이터가 다음 시스템에 반영되는 시간이 늘어난다. 이 값은 DB 트랜잭션 지연 분포와 허용 가능한 최신성 요구를 관측해 설정해야 한다.

## 왜 읽을까

"Kafka Connect를 쓰면 CDC가 된다"는 수준을 넘어, 어떤 변경을 절대로 놓치면 안 되는지에 따라 로그 기반과 쿼리 기반 CDC의 적합성이 달라진다는 점을 구체적인 타임라인 예제로 이해할 수 있다.

특히 오프셋이 단순 진행 숫자가 아니라 데이터 누락 여부를 결정하는 상태라는 점, 그리고 정합성과 지연이 서로 트레이드오프라는 점이 실무적으로 중요하다.

**프로젝트에 적용 — PawCycle**

- [ ] 향후 외부 상품·재고·파트너 데이터를 연동할 일이 생기면 먼저 INSERT만 필요한지 UPDATE/DELETE 이력까지 필요한지 계약을 정의한다.
- [ ] 쿼리 기반 CDC를 선택한다면 긴 트랜잭션과 out-of-order commit을 재현하는 테스트를 만든다.
- [ ] 데이터 누락이 허용되지 않는 영역이라면 구현 편의성만으로 JDBC polling을 선택하지 않고 로그 기반 CDC 또는 다른 동기화 방식을 비교한다.

---

**원문:** [Kafka Connect로 DB 데이터 쉽게 연동하기](https://helloworld.kurly.com/blog/kafka-connect-pipeline/)
