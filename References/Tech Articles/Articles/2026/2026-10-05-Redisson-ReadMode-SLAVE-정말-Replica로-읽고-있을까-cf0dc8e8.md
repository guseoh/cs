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

Redisson에 `ReadMode.SLAVE`를 설정했다고 실제 GET이 Replica로 전달됐다는 사실까지 증명되는 것은 아니다. W컨셉 엔지니어는 ElastiCache의 평균 부하나 누적 명령 통계만으로는 해당 애플리케이션의 GET·MGET·LRANGE가 어느 노드에서 수행됐는지 확정할 수 없어 명령 단위로 추적했다.

운영 지표와 `INFO commandstats`는 여러 클라이언트의 활동이 합산되고, 누적 카운터의 차분에도 다른 요청이 섞일 수 있다. 그래서 개발 환경에서 Master와 Replica에 `MONITOR`를 동시에 실행하고 단일 테스트 요청 시점의 명령을 비교했다. LPOP·RPUSH·DEL은 Master, GET·MGET·LRANGE는 Replica로 전달되며 SCAN은 두 쪽에서 나타날 수 있음을 직접 확인했다.

```redis
# 실험 시점의 명령 관찰을 위한 예시 (개발 환경에서만)
MONITOR
# 다른 클라이언트로 GET / MGET / LRANGE 실행 후
# Master·Replica의 출력에서 명령을 비교
```

*읽기 분산은 설정 파일 확인과 실제 네트워크 경로 검증을 구분한다.*

| 명령 성격 | 관찰된 노드 | 중요한 제약 |
| --- | --- | --- |
| GET, MGET, LRANGE | Replica | 비동기 복제 지연 |
| LPOP, DEL, RPUSH | Master | 쓰기 직렬화 경계 |
| SCAN | Master·Replica | 조회/키 탐색 특성 |
| MONITOR 진단 | 각 노드 | 전체 명령 출력으로 부하 가능 |

Replica에 분산해 읽는 선택은 Master 부하를 줄일 수 있지만 비동기 복제 때문에 방금 쓴 값을 즉시 읽을 때 낡은 결과가 반환될 수 있다. 돈·권한·중요 상태는 Master 읽기나 별도 정합성 전략을 검토해야 하며, MONITOR는 모든 명령을 출력해 부하를 만들기 때문에 운영 상시 지표가 아니라 제한된 진단 용도로만 사용한다.

## 왜 읽을까

Spring/Redis 설정을 넣고 끝내지 않고 실제 런타임 동작을 증명하는 과정이 좋다. 간접 지표에서 출발해 더 강한 증거로 내려가는 트러블슈팅 흐름을 익힐 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis 읽기 분리를 도입한다면 Master/Replica별 실제 명령 라우팅을 개발 환경에서 검증한다.
- [ ] 복제 지연이 허용되는 조회와 최신성이 필요한 조회를 구분한다.
- [ ] Replica 장애 시 fallback 또는 재시도 정책을 테스트한다.

---

**원문:** [Redisson ReadMode.SLAVE, 정말 Replica로 읽고 있을까?](https://medium.com/@wconceptTech/redisson-readmode-slave-%EC%A0%95%EB%A7%90-replica%EB%A1%9C-%EA%B0%80%EA%B3%A0-%EC%9E%88%EC%9D%84%EA%B9%8C-945a3a81b4b7)
