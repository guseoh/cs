---
type: tech-article
title: "늘어가는 조회트래픽 Elasticsearch로 분산시키기"
aliases: []
summary: "조회 트래픽과 필터·정렬 요구가 계속 늘어날 때 메인 DB에 인덱스를 더하는 방식만 고집하지 않고, Elasticsearch/OpenSearch를 조회 모델로 분리해 읽기 부하를 격리하는 설계 사례다."
source: "NAVER D2"
published: 2025-06-25
collected: 2026-09-27
url: "https://d2.naver.com/helloworld/3675627"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "DB·데이터"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/DB-데이터"
migration_origin: notion
---

# 늘어가는 조회트래픽 Elasticsearch로 분산시키기

> [!abstract] 한 줄 정리
> 조회 트래픽과 필터·정렬 요구가 계속 늘어날 때 메인 DB에 인덱스를 더하는 방식만 고집하지 않고, Elasticsearch/OpenSearch를 조회 모델로 분리해 읽기 부하를 격리하는 설계 사례다.

> NAVER D2 · 2025-06-25

## 핵심 내용

- **문제:** 플레이스 리뷰 조회량과 조회 조건이 늘면서 메인 DB의 조회 부담이 커졌고, 인덱스를 계속 추가하는 방식에는 한계가 생겼다.
- **접근:** Elasticsearch/OpenSearch를 별도의 조회용 저장소로 두어 읽기 트래픽을 메인 DB에서 분산하는 방향을 선택했다.
- **구조:** 발표는 기존 리뷰 조회 흐름에서 출발해 조회용 DB 도입, CQRS 관점의 읽기 분리, Feature Toggle을 이용한 전환 흐름을 다룬다.
- **주의점:** 조회 저장소를 추가하면 장애 시 원본 DB로 되돌아갈 경로가 필요하므로 자동 fallback까지 함께 설계 대상으로 삼는다.

## 왜 읽을까

DB 인덱스 최적화만으로 모든 조회 문제를 해결하려 하기보다, 읽기 요구가 커졌을 때 저장소의 책임 자체를 분리하는 판단 기준을 볼 수 있다. 특히 신규 조회 경로를 도입할 때 Feature Toggle과 fallback을 같이 설계한다는 점이 운영 관점에서 유용하다.

**프로젝트에 적용 — DevPedia**

- [ ] Recruitment 목록의 검색·필터·정렬 요구가 커질 때 우선 RDB 인덱스와 실행 계획으로 한계를 측정한다.
- [ ] 별도 검색 저장소가 실제로 필요해진다면 원본 DB와 조회 모델의 정합성 기준을 먼저 정의한다.
- [ ] 신규 조회 경로는 한 번에 전환하지 않고 Feature Toggle과 fallback을 포함해 검증한다.

---

**원문:** [늘어가는 조회트래픽 Elasticsearch로 분산시키기](https://d2.naver.com/helloworld/3675627)
