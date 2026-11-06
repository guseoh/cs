---
type: tech-article
title: "Spring Batch와 Querydsl"
aliases: []
summary: "대용량 배치에서 OFFSET 기반 페이징은 뒤로 갈수록 버려야 하는 행이 늘어 비용이 커진다. 마지막 키를 기준으로 다음 범위를 읽는 No-Offset 방식은 데이터 규모가 커질수록 안정적인 조회 성능을 만들 수 있다."
source: "우아한형제들 기술블로그"
published: 2020-03-16
collected: 2026-10-02
url: "https://techblog.woowahan.com/2662/"
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

# Spring Batch와 Querydsl

> [!abstract] 한 줄 정리
> 대용량 배치에서 OFFSET 기반 페이징은 뒤로 갈수록 버려야 하는 행이 늘어 비용이 커진다. 마지막 키를 기준으로 다음 범위를 읽는 No-Offset 방식은 데이터 규모가 커질수록 안정적인 조회 성능을 만들 수 있다.

> 우아한형제들 기술블로그 · 2020-03-16

## 핵심 내용

대용량 데이터를 Spring Batch로 읽는 과정에서 OFFSET 기반 Paging은 앞 페이지를 지나갈수록 이미 읽은 데이터를 다시 스캔·건너뛰는 비용이 커진다. 쿼리 한 건의 수행 시간이 짧아 보여도 수천 페이지에 반복되면 전체 배치의 처리 시간이 크게 증가할 수 있다.

Querydsl 기반 ItemReader는 매 페이지 번호를 늘리는 대신 마지막으로 읽은 식별자를 다음 쿼리의 탐색 조건으로 사용한다. 정렬이 내림차순이면 `id < :lastId`, 오름차순이면 `id > :lastId` 같은 Keyset 조건을 적용하고 인덱스로 다음 영역을 탐색한다. 선택 컬럼만 읽는 커버링 인덱스가 가능하면 테이블 재접근 비용도 줄일 수 있다. 단, 여러 컬럼으로 정렬하거나 식별자가 중복되는 경우에는 모든 정렬 컬럼을 담은 복합 커서가 필요하다.

```sql
-- 내림차순 No-Offset 페이징 예시
SELECT id, status FROM orders
WHERE id < :lastSeenId
ORDER BY id DESC
LIMIT :chunkSize;
```

마지막 키가 없는 첫 페이지와 작업 재시작 시 커서 복원을 별도 처리해야 한다.

| 방식 | 다음 페이지 탐색 | 성능·정합성 고려 |
| --- | --- | --- |
| OFFSET | OFFSET으로 앞 행 건너뜀 | 깊은 페이지에서 비용 증가 |
| Covering Index | 필요한 컬럼을 인덱스에서 조회 | 인덱스 폭과 유지 비용 |
| Keyset/No-Offset | 마지막 정렬 키 범위 검색 | 유일한 정렬·복합 커서·재시작 상태 |

이 방식을 일반 PagingItemReader를 무조건 대체하는 규칙으로 삼아서는 안 된다. 처리 중 행이 삽입·수정될 때 페이지 경계가 이동할 수 있고, Job 재시작 시 마지막 커서를 ExecutionContext에 정확히 보존해야 누락·중복을 피할 수 있다. 원문은 No-Offset Reader 구현 원리를 제시하지만 DB별로 검증한 일률적인 처리량 개선율을 보장하지는 않는다.

## 왜 읽을까

오래된 글이지만 Spring Batch와 RDB 페이징 성능을 연결해서 이해하기 좋은 고전적인 사례다. 단순히 ‘OFFSET이 느리다’를 외우는 대신 DB가 큰 OFFSET을 처리할 때 실제로 어떤 일을 하는지와 애플리케이션의 Reader 설계가 어떻게 연결되는지 볼 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 주문·상품 등 대량 데이터를 배치 처리할 때 OFFSET 기반 페이지가 뒤로 갈수록 느려지는지 실행 계획과 처리 시간으로 측정한다.
- [ ] 정렬 키가 안정적이라면 마지막 PK 기반 keyset/No-Offset 방식과 비교 측정한다.
- [ ] 처리량뿐 아니라 DB connection 점유 시간과 p95/p99도 함께 기록해 전체 시스템 영향까지 확인한다.

---

**원문:** [Spring Batch와 Querydsl](https://techblog.woowahan.com/2662/)
