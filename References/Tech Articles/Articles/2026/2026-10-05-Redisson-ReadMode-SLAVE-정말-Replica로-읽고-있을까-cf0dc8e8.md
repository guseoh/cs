---
type: tech-article
title: "Redisson ReadMode.SLAVE, 정말 Replica로 읽고 있을까?"
aliases: []
summary: "Redis 읽기 분리 설정은 선언만으로 보장되지 않는다. 실제 노드별 명령 흐름을 관측해 설정이 의도대로 동작하는지 확인하고, 복제 지연과 장애 시 fallback까지 함께 설계해야 한다."
source: "W컨셉 기술 블로그"
published: 2025-12-10
collected: 2026-10-05
url: "https://medium.com/@wconceptTech/redisson-readmode-slave-%EC%A0%95%EB%A7%90-replica%EB%A1%9C-%EA%B0%80%EA%B3%A0-%EC%9E%88%EC%9D%84%EA%B9%8C-945a3a81b4b7"
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

# Redisson ReadMode.SLAVE, 정말 Replica로 읽고 있을까?

> [!abstract] 한 줄 정리
> Redis 읽기 분리 설정은 선언만으로 보장되지 않는다. 실제 노드별 명령 흐름을 관측해 설정이 의도대로 동작하는지 확인하고, 복제 지연과 장애 시 fallback까지 함께 설계해야 한다.

> W컨셉 기술 블로그 · 2025-12-10

## 핵심 내용

- **문제:** Redisson의 `ReadMode.SLAVE`를 적용했지만 실제 GET·MGET·LRANGE 같은 읽기 명령이 Replica로 가는지 설정만으로 확신할 수 없었다.
- **접근:** ElastiCache 지표와 `INFO commandstats`를 먼저 확인했지만 누적 통계와 다른 트래픽이 섞이는 한계 때문에 개발 환경에서 `MONITOR`로 Master와 Replica의 실시간 명령을 동시에 추적했다.
- **결과:** LPOP·DEL·RPUSH 같은 쓰기는 Master, GET·MGET·LRANGE 같은 읽기는 Replica로 전달되는 것을 직접 확인했다. `SCAN`은 작업 특성상 양쪽에서 관측됐다.
- **주의점:** Replica 복제는 비동기라 최신 데이터가 즉시 보장되지 않는다. 강한 일관성이 필요한 조회는 Master 사용을 검토해야 하며, Replica 장애 시 동작도 배포 형태에 맞게 준비해야 한다.
- **주의점:** `MONITOR`는 모든 명령을 출력해 성능에 영향을 줄 수 있으므로 상시 운영 관측 도구처럼 사용하면 안 된다.

## 왜 읽을까

Spring/Redis 설정을 넣고 끝내지 않고 실제 런타임 동작을 증명하는 과정이 좋다. 간접 지표에서 출발해 더 강한 증거로 내려가는 트러블슈팅 흐름을 익힐 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis 읽기 분리를 도입한다면 Master/Replica별 실제 명령 라우팅을 개발 환경에서 검증한다.
- [ ] 복제 지연이 허용되는 조회와 최신성이 필요한 조회를 구분한다.
- [ ] Replica 장애 시 fallback 또는 재시도 정책을 테스트한다.

---

**원문:** [Redisson ReadMode.SLAVE, 정말 Replica로 읽고 있을까?](https://medium.com/@wconceptTech/redisson-readmode-slave-%EC%A0%95%EB%A7%90-replica%EB%A1%9C-%EA%B0%80%EA%B3%A0-%EC%9E%88%EC%9D%84%EA%B9%8C-945a3a81b4b7)
