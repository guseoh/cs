---
type: tech-article
title: "Querydsl 대량 데이터 처리 완전 정리: Count 병목부터 커서 기반 페이지네이션, Batch Insert/Update까지"
aliases: []
summary: "대량 조회의 병목을 Count, Offset, 쓰기 경로로 나눠 측정하고, Slice·커서 페이지네이션·Querydsl-SQL Batch로 단계적으로 해결한다. 최적화마다 정확성·트랜잭션 경계라는 조건이 따라온다는 점까지 확인할 수 있다."
source: "카카오페이 기술 블로그"
published: 2026-09-16
collected: 2026-09-21
url: "https://tech.kakaopay.com/post/querydsl-paging-strategy/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/성능"
migration_origin: notion
---

# Querydsl 대량 데이터 처리 완전 정리: Count 병목부터 커서 기반 페이지네이션, Batch Insert/Update까지

> [!abstract] 한 줄 정리
> 대량 조회의 병목을 Count, Offset, 쓰기 경로로 나눠 측정하고, Slice·커서 페이지네이션·Querydsl-SQL Batch로 단계적으로 해결한다. 최적화마다 정확성·트랜잭션 경계라는 조건이 따라온다는 점까지 확인할 수 있다.

> 카카오페이 기술 블로그 · 2026-09-16

## 핵심 내용

- **문제:** Content 쿼리와 Count 쿼리를 그대로 재사용하면 불필요한 조인이 Count에도 따라붙고, 데이터가 커질수록 Count 자체가 병목이 된다. Total Count가 필요하지 않다면 Slice로 Count를 없애고 `pageSize + 1`건을 조회해 `hasNext`를 판정한다.
- **수치:** Spring Batch Reader 비교에서 100만 건 기준 `JpaPagingItemReader`는 1,048,979ms, No-Offset 방식은 28,732ms였다. 1,048,576건 데이터의 페이지 위치별 비교에서도 offset은 첫 페이지 대비 마지막이 3.3배까지 느려졌지만 cursor는 1.0배 수준을 유지했다.
- **접근:** 읽기 병목을 줄인 뒤에는 Querydsl-SQL의 `addBatch()`와 `execute()`를 이용해 Batch Insert/Update로 쓰기 병목을 줄인다. MySQL `IDENTITY` 전략에서는 JPA `saveAll`만으로 JDBC Batch Insert가 되지 않는 이유도 함께 설명한다.
- **주의점:** Count 쿼리에서 조인을 제거하려면 결과 행 수가 변하지 않는 관계인지 검증해야 한다. 또한 `SQLQueryFactory`가 DataSource에서 직접 커넥션을 얻으면 JPA 트랜잭션과 별도 경계가 될 수 있어 원자성을 별도로 확인해야 한다.
- **트레이드오프:** Count와 Content의 코루틴 병렬화는 JDBC 블로킹 시간을 겹칠 수 있지만, `@Transactional` 내부에서 스레드가 바뀌면 트랜잭션의 ThreadLocal 컨텍스트가 전파되지 않아 같은 패턴을 그대로 적용하면 안 된다.

## 왜 읽을까

JPA/Querydsl에서 흔히 쓰는 Page와 `saveAll`이 데이터가 커졌을 때 왜 병목이 되는지 SQL·JDBC·트랜잭션까지 내려가 설명한다. 특히 단순히 “커서가 빠르다”가 아니라 실제 측정과 정확성 조건을 함께 다뤄 대량 데이터 최적화의 판단 순서를 익히기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 상품·구독 목록에서 Total Count가 실제 UX에 필요한지 먼저 구분하고, 불필요하면 Slice 후보로 검토한다.
- [ ] 깊은 페이지 조회가 실제 병목으로 측정되면 offset과 business key/ID 기반 cursor를 동일 데이터셋에서 비교한다.
- [ ] 대량 bootstrap·migration 쓰기 경로는 JPA 단건 처리와 Batch의 처리량을 비교하되 트랜잭션·실패 복구 계약을 함께 검증한다.

---

**원문:** [Querydsl 대량 데이터 처리 완전 정리: Count 병목부터 커서 기반 페이지네이션, Batch Insert/Update까지](https://tech.kakaopay.com/post/querydsl-paging-strategy/)
