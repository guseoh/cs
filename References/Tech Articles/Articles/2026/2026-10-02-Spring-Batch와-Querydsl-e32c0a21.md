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

- **문제:** Spring Batch의 일반적인 PagingItemReader처럼 OFFSET/LIMIT을 사용하면 페이지가 뒤로 갈수록 앞의 데이터를 읽고 버리는 비용이 증가해 대용량 처리 시간이 길어진다.
- **접근:** 커버링 인덱스와 No-Offset 방식을 비교하고, 이전 페이지의 마지막 식별자를 기준으로 다음 범위를 조회하는 Querydsl 기반 ItemReader를 구현한다.
- **구조:** `OFFSET n`으로 위치를 세는 대신 정렬 키에 `id < lastId` 같은 조건을 적용해 인덱스가 다음 데이터 위치부터 탐색하도록 만든다.
- **주의점:** No-Offset은 정렬과 조회 조건에 사용할 수 있는 고유하고 일관된 키가 필요하며, 복합 정렬이나 중간 데이터 변경이 있는 경우 페이징 기준을 더 세심하게 설계해야 한다.

## 왜 읽을까

오래된 글이지만 Spring Batch와 RDB 페이징 성능을 연결해서 이해하기 좋은 고전적인 사례다. 단순히 ‘OFFSET이 느리다’를 외우는 대신 DB가 큰 OFFSET을 처리할 때 실제로 어떤 일을 하는지와 애플리케이션의 Reader 설계가 어떻게 연결되는지 볼 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 주문·상품 등 대량 데이터를 배치 처리할 때 OFFSET 기반 페이지가 뒤로 갈수록 느려지는지 실행 계획과 처리 시간으로 측정한다.
- [ ] 정렬 키가 안정적이라면 마지막 PK 기반 keyset/No-Offset 방식과 비교 측정한다.
- [ ] 처리량뿐 아니라 DB connection 점유 시간과 p95/p99도 함께 기록해 전체 시스템 영향까지 확인한다.

---

**원문:** [Spring Batch와 Querydsl](https://techblog.woowahan.com/2662/)
