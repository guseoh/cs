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

Spring의 `@CacheEvict(allEntries=true)`는 코드에서는 한 줄이지만 Redis에서는 해당 Cache에 속하는 여러 키를 지우기 위한 네트워크 작업을 수행한다. 우아한형제들 사례는 기본 `RedisCacheWriter`의 대량 삭제 전략이 Redis의 싱글 스레드 처리 특성과 만나 운영 API까지 지연시킬 수 있는 위험을 분석했다.

어노테이션은 Spring Cache의 cache-wide clear로 변환되고 `RedisCache.clear()`·`RedisCacheWriter`까지 전달된다. Spring Data Redis의 기본 BatchStrategy는 `KEYS`로 키 패턴의 전체 집합을 찾고 삭제할 수 있어 O(N) 스캔과 대량 DEL이 단일 이벤트 루프를 점유한다. Lettuce 환경에서는 SCAN 전략으로 순회 부담을 나눌 수 있지만 결국 모든 키를 방문해야 하는 작업량은 그대로 남는다.

```java
// 위험 범위가 서로 다른 Spring Cache 무효화 예
@CacheEvict(cacheNames = "products", key = "#productId")
void evictOne(long productId) {}

// 모든 엔트리 삭제: 운영 API 경로에서 사용 전에 검토
@CacheEvict(cacheNames = "products", allEntries = true)
void clearAll() {}
```

*코드는 동작 차이 설명용이며 운영 정책·메서드 계약을 그대로 복제하지 않았다.*

| 방법 | 실제 비용 | 사용 맥락 |
| --- | --- | --- |
| Key 하나 삭제 | 지정 키의 DEL | 일반 데이터 갱신 |
| KEYS 기반 전체 삭제 | O(N) 키 탐색·대량 DEL | 운영 중 차단 위험 |
| SCAN 기반 전체 삭제 | 단계적 키 순회 | 총량·삭제 비용은 남음 |
| 관리 작업 분리 | 사용자 요청과 격리 | 권한·쿼터·재생성 부하 확인 |

원문의 실험에서는 SCAN으로 바꾼 뒤에도 데이터가 많아 API가 60초 타임아웃에 도달했다. 따라서 사용자 요청 경로에서는 가능한 한 정확한 키 단위 무효화를 택하고, 꼭 필요한 전체 삭제는 권한 있는 관리 작업이나 별도 배치로 분리해야 한다. `@CacheEvict`가 캐시 미스 후 재생성 부하를 일으킬 수 있다는 점도 고려해야 한다.

## 왜 읽을까

어노테이션 한 줄이 실제로 어떤 Redis 명령까지 내려가는지를 Spring 소스 코드 계층을 따라가며 확인한다. “추상화가 편리하다”와 “운영 비용이 안전하다”는 별개의 문제라는 감각을 잡기에 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis 캐시를 도입할 경우 캐시 무효화가 단일 key인지 전체 namespace인지 먼저 구분한다.
- [ ] 캐시 전체 삭제 API를 사용자 요청 경로에 두지 않고 관리·배치 경로로 분리한다.
- [ ] Redis 명령 latency와 CPU, API p95/p99를 함께 측정해 캐시 관리 작업이 서비스 요청을 막지 않는지 확인한다.

---

**원문:** [이제 Redis를 멈춰보겠습니다: @CacheEvict 파헤치기](https://techblog.woowahan.com/23138/)
