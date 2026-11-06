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

대용량 목록에서 Content와 Count 쿼리를 동일한 Join으로 작성하면 Count에는 필요하지 않은 연산까지 수행하고 페이지가 뒤쪽으로 갈수록 OFFSET 스캔 비용도 커진다. 카카오페이는 Querydsl과 Spring Batch를 활용해 읽기의 두 병목을 먼저 분리한 뒤 쓰기의 JDBC Batch까지 확인했다.

전체 개수가 필요 없는 화면에는 Slice로 `pageSize+1`건을 읽고 마지막 한 건으로 `hasNext`를 판정한다. Count가 필요하다면 Content에서 필요한 JOIN이 결과 건수에 영향이 없는지 확인하고 불필요한 JOIN만 제거한다. 대량 배치 Reader는 키셋/No-Offset으로 마지막 정렬 키를 저장해 바로 다음 범위를 읽도록 만들었다. 쓰기 경로는 Querydsl-SQL의 `addBatch()`와 `execute()`를 사용해 여러 INSERT/UPDATE를 하나의 배치로 모으는 구조다.

```java
// Slice 조회의 핵심 논리를 축약한 예시
List<Order> rows = query.limit(pageSize + 1).fetch();
boolean hasNext = rows.size() > pageSize;
List<Order> content = rows.subList(0, Math.min(rows.size(), pageSize));
```

정렬 키가 고유하고 일관적이어야 중간 변경의 누락·중복을 줄일 수 있다.

| 대량 처리 비교 | 기존 | 개선 |
| --- | ---: | ---: |
| 100만 건 Reader | 1,048,979ms | 28,732ms |
| OFFSET 마지막/첫 페이지 | 약 3.3배 | Keyset 약 1.0배 |
| Count | 필요 없는 JOIN 포함 | 결과 수 불변일 때 제거 |
| 쓰기 | 개별 saveAll | Querydsl SQL JDBC Batch |

원문의 100만 건 Reader 실험에서 JpaPagingItemReader 1,048,979ms에 비해 No-Offset은 28,732ms였고, OFFSET 마지막 페이지는 첫 페이지 대비 3.3배 느려졌지만 커서는 거의 1.0배 수준을 유지했다. 단순 `saveAll`은 MySQL IDENTITY 키 생성 방식 때문에 기대한 JDBC Batch가 수행되지 않을 수 있다. Querydsl SQLFactory의 커넥션 경계가 JPA 트랜잭션과 분리되거나 Kotlin 코루틴에서 스레드가 바뀌면 원자성이 깨질 수 있어 코드·성능·트랜잭션을 함께 검증해야 한다.

## 왜 읽을까

JPA/Querydsl에서 흔히 쓰는 Page와 `saveAll`이 데이터가 커졌을 때 왜 병목이 되는지 SQL·JDBC·트랜잭션까지 내려가 설명한다. 특히 단순히 “커서가 빠르다”가 아니라 실제 측정과 정확성 조건을 함께 다뤄 대량 데이터 최적화의 판단 순서를 익히기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 상품·구독 목록에서 Total Count가 실제 UX에 필요한지 먼저 구분하고, 불필요하면 Slice 후보로 검토한다.
- [ ] 깊은 페이지 조회가 실제 병목으로 측정되면 offset과 business key/ID 기반 cursor를 동일 데이터셋에서 비교한다.
- [ ] 대량 bootstrap·migration 쓰기 경로는 JPA 단건 처리와 Batch의 처리량을 비교하되 트랜잭션·실패 복구 계약을 함께 검증한다.

---

**원문:** [Querydsl 대량 데이터 처리 완전 정리: Count 병목부터 커서 기반 페이지네이션, Batch Insert/Update까지](https://tech.kakaopay.com/post/querydsl-paging-strategy/)
