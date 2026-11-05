---
type: tech-article
title: "이제 Redis를 멈춰보겠습니다: @CacheEvict 파헤치기"
aliases: []
summary: "Spring의 편리한 캐시 추상화도 구현체까지 내려가 보면 운영 Redis에 위험한 명령으로 이어질 수 있다. `@CacheEvict(allEntries=true)`는 기본 설정에서 전체 키 탐색과 삭제를 유발하므로 캐시 규모와 실행 경로를 함께 봐야 한다."
source: "우아한형제들 기술블로그"
published: 2025-11-04
collected: 2026-09-23
url: "https://techblog.woowahan.com/23138/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/장애-운영"
migration_origin: notion
---

# 이제 Redis를 멈춰보겠습니다: @CacheEvict 파헤치기

> [!abstract] 한 줄 정리
> Spring의 편리한 캐시 추상화도 구현체까지 내려가 보면 운영 Redis에 위험한 명령으로 이어질 수 있다. `@CacheEvict(allEntries=true)`는 기본 설정에서 전체 키 탐색과 삭제를 유발하므로 캐시 규모와 실행 경로를 함께 봐야 한다.

> 우아한형제들 기술블로그 · 2025-11-04

## 핵심 내용

- **구조:** `@CacheEvict(allEntries=true)`는 Spring 내부에서 cache-wide clear로 변환되고, Spring Data Redis의 `RedisCache.clear()`와 `RedisCacheWriter`를 거쳐 전체 캐시 제거 전략으로 이어진다.
- **주의점:** Spring Data Redis의 기본 BatchStrategy는 `KEYS`다. `KEYS`는 전체 키 집합을 O(N)으로 스캔하며 싱글 스레드 Redis의 다른 요청을 지연시킬 수 있고, 많은 키를 `DEL`하는 작업도 이벤트 루프를 오래 점유할 수 있다.
- **접근:** Lettuce 환경에서는 BatchStrategy를 `SCAN`으로 바꿀 수 있지만 이것도 전체 키를 순회한다. 글의 실행 사례에서는 SCAN으로 바꾼 뒤에도 캐시량이 많아 API가 60초 타임아웃에 도달했다.
- **결과:** 운영 중 `allEntries=true`를 일반 API 경로에서 사용하는 대신 정확한 key 단위 삭제를 우선하고, 전체 삭제가 꼭 필요하면 관리 endpoint나 별도 배치 로직으로 분리하는 것을 권한다.

## 왜 읽을까

어노테이션 한 줄이 실제로 어떤 Redis 명령까지 내려가는지를 Spring 소스 코드 계층을 따라가며 확인한다. “추상화가 편리하다”와 “운영 비용이 안전하다”는 별개의 문제라는 감각을 잡기에 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis 캐시를 도입할 경우 캐시 무효화가 단일 key인지 전체 namespace인지 먼저 구분한다.
- [ ] 캐시 전체 삭제 API를 사용자 요청 경로에 두지 않고 관리·배치 경로로 분리한다.
- [ ] Redis 명령 latency와 CPU, API p95/p99를 함께 측정해 캐시 관리 작업이 서비스 요청을 막지 않는지 확인한다.

---

**원문:** [이제 Redis를 멈춰보겠습니다: @CacheEvict 파헤치기](https://techblog.woowahan.com/23138/)
