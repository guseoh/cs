---
type: tech-article
title: "Spring Batch 애플리케이션 성능 향상을 위한 주요 팁"
aliases: []
summary: "배치 성능은 프레임워크를 바꾸기보다 반복되는 네트워크·DB I/O 횟수를 먼저 줄이는 것만으로도 큰 폭으로 개선될 수 있으며, 병렬화는 그 다음 수단이어야 한다."
source: "카카오페이 기술 블로그"
published: 2023-09-05
collected: 2026-09-10
url: "https://tech.kakaopay.com/post/spring-batch-performance/"
topic: "성능"
categories:
  - "성능"
  - "DB·데이터"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
  - "tech/DB-데이터"
migration_origin: notion
---

# Spring Batch 애플리케이션 성능 향상을 위한 주요 팁

> [!abstract] 한 줄 정리
> 배치 성능은 프레임워크를 바꾸기보다 반복되는 네트워크·DB I/O 횟수를 먼저 줄이는 것만으로도 큰 폭으로 개선될 수 있으며, 병렬화는 그 다음 수단이어야 한다.

> 카카오페이 기술 블로그 · 2023-09-05

## 핵심 내용

Spring Batch에서 외부 API를 한 건에 약 150ms씩 5만 건 이상 호출하면 네트워크 대기만으로 전체 처리 시간이 길어진다. 여기에 Reader·Processor·Writer가 단건 DB I/O를 반복하면 CPU보다 대기와 트랜잭션 비용이 실제 병목이 된다. 카카오페이는 처리 구간을 나눠 측정한 뒤 묶을 수 있는 I/O와 병렬화할 수 있는 외부 호출을 구분했다.

Processor가 매건 외부 호출·수정을 모두 수행하는 대신 Writer에서 작업을 묶고, 조회 단계에서는 꼭 필요한 필드만 Projection으로 가져와 불필요한 JPA 영속성 컨텍스트를 줄였다. 같은 값으로 업데이트할 레코드는 `WHERE id IN (...)` 조건으로 묶고, 행마다 값이 다른 경우에는 JDBC Batch나 Exposed batch update를 활용했다. API 부하는 10개 병렬 Rail로 나눠 대기 시간을 겹치도록 설계했다.

```sql
-- 같은 상태값으로 여러 행을 바꿀 때의 묶음 갱신 예시
UPDATE notification_job
SET status = 'PROCESSED'
WHERE id IN (:id1, :id2, :id3);
```

*원문의 Querydsl/Batch 실제 구현을 단순화한 학습 예시이며 서로 다른 값의 갱신에는 별도의 Batch Update가 필요하다.*

| 개선 대상 | 원문 관측 | 측정 조건상의 주의점 |
| --- | --- | --- |
| 외부 API | 호출당 약 150ms·5만 건+ | I/O 대기 병목 |
| 같은 값 DB Update | 최대 1,000회 → 약 3회 I/O | IN 갱신 가능 조건 |
| API 처리 | 10개 Rail, 약 10배 | 외부 Rate Limit·순서 |
| 대량 DB 갱신 | 5,000건+ 실험에서 90%+ | Chunk·Packet·트랜잭션 경계 |

원문의 실험에서 동일 값 업데이트 약 1,000회 DB I/O가 3회 수준으로 줄고, API 구간은 10 Rail에서 약 10배 가까이 빨라졌으며 5,000건 이상 갱신한 DB 실험에는 90% 이상 개선도 나타났다. 다만 Chunk를 크게 만들면 연결·트랜잭션을 오래 점유하고 MySQL 패킷 크기나 실패 시 재처리 범위가 커진다. 병렬 Rail은 순서·중복 처리와 스레드별 트랜잭션 경계까지 함께 검증해야 한다.

## 왜 읽을까

Spring Batch 튜닝을 곧바로 partitioning이나 멀티스레드로 연결하지 않고, 먼저 어디서 I/O가 반복되는지 계산하고 단순한 bulk 처리로 줄이는 접근이 좋다. 성능 개선에서 구조적 복잡도를 늘리기 전에 가장 싼 병목부터 제거하는 기준을 배울 수 있다.

**프로젝트에 적용 — DevPedia**

- [ ] 대량 동기화·인덱스 재구축 같은 배치가 생기면 네트워크 대기와 DB I/O 횟수를 먼저 계측한다.
- [ ] 개별 `save/update`가 병목으로 확인될 때만 grouped update나 batch update를 비교한다.
- [ ] 병렬 처리 전후의 처리시간뿐 아니라 DB connection pool, CPU, 실패 복구 난이도까지 함께 기록한다.

---

**원문:** [Spring Batch 애플리케이션 성능 향상을 위한 주요 팁](https://tech.kakaopay.com/post/spring-batch-performance/)
