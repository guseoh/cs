---
type: tech-article
title: "Redis New Connection 증가 이슈 돌아보기"
aliases: []
summary: "Redis 신규 연결 수 증가를 단순 풀 설정 문제로 보지 않고 Spring Data Redis → Lettuce → 커넥션 풀 → ElastiCache timeout까지 추적해, 트래픽이 줄어든 시간에 오히려 재연결이 늘어난 원인을 밝혀낸 운영 트러블슈팅 사례다."
source: "우아한형제들 기술블로그"
published: 2025-10-14
collected: 2026-09-26
url: "https://techblog.woowahan.com/23121/"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "DB·데이터"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/DB-데이터"
migration_origin: notion
---

# Redis New Connection 증가 이슈 돌아보기

> [!abstract] 한 줄 정리
> Redis 신규 연결 수 증가를 단순 풀 설정 문제로 보지 않고 Spring Data Redis → Lettuce → 커넥션 풀 → ElastiCache timeout까지 추적해, 트래픽이 줄어든 시간에 오히려 재연결이 늘어난 원인을 밝혀낸 운영 트러블슈팅 사례다.

> 우아한형제들 기술블로그 · 2025-10-14

## 핵심 내용

Redis의 New Connection이 자정에도 높게 유지되면 부하가 다시 늘어난 것처럼 보이지만 실제로는 피크 때 만들어진 유휴 연결이 재접속되는 것일 수 있다. 우아한형제들은 파이프라인이 연결을 매번 새로 생성한다는 가설을 먼저 세웠지만, `RedisTemplate.executePipelined()`의 전용 연결도 풀에 포함돼 재사용된다는 사실을 확인했다.

```mermaid
flowchart LR
 A[트래픽 피크에 연결 풀 증가] --> B[LIFO: 일부 연결만 재사용]
 B --> C[사용하지 않는 연결 100초 경과]
 C --> D[Redis idle timeout 종료]
 D --> E[Lettuce WatchDog 재연결]
 E --> F[New Connection 메트릭 상승]
```

*원문 근거를 가로 방향으로 자체 재구성한 학습용 도식이다.*

Lettuce 연결 풀의 최대 크기는 20이었고 GenericObjectPool의 기본 LIFO 전략 때문에 자주 쓰는 연결만 다시 선택되며 나머지는 오래 idle로 남았다. ElastiCache의 `timeout=100`은 100초간 미사용 연결을 끊었고 Lettuce ConnectionWatchDog가 이를 다시 열면서 New Connection 메트릭이 증가했다. 피크 이후 트래픽이 줄어들수록 풀의 사용하지 않는 커넥션이 늘어난 역설적인 현상이다.

| 요소 | 설정·동작 | 관측 결과 |
| --- | --- | --- |
| Pipelined 연결 | 전용이나 풀에서 재사용 | 매번 새 연결이 아님 |
| Pool | 최대 크기 20, 기본 LIFO | 일부 연결 장시간 Idle |
| Redis idle timeout | 100초 | 미사용 연결 닫힘 |
| Lettuce WatchDog | 끊긴 연결 복원 | 신규 연결 수 증가 |
| 후보 조정 | LIFO→FIFO | 연결 사용의 고른 분포 확인 |

개발 환경에서 idle 연결이 실제로 100초 주기로 다시 연결되는 것을 확인한 뒤 서버 timeout을 무조건 늘리지 않고 풀의 LIFO→FIFO 전략 등 연결의 재사용 패턴을 변경하는 대안을 검토했다. New Connection 수 자체가 API 장애는 아니지만 재연결이 많은 이유를 파악하지 않고 풀 크기만 늘리면 같은 문제가 심해질 수 있다.

## 왜 읽을까

Spring의 추상화에서 시작한 현상이 Redis 서버 설정과 네트워크 연결 수명까지 이어지는 과정을 따라갈 수 있다. 지표가 이상할 때 눈에 보이는 설정 하나를 바꾸기보다 실제 연결 생성·반납·종료 경로를 소스와 재현 테스트로 좁혀 가는 방식이 특히 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis를 사용하는 경로에서 `NewConnections`, 활성/idle 연결 수, command latency를 함께 관측한다.
- [ ] 파이프라이닝이나 풀을 적용했다면 “풀을 쓴다 = 연결 생성 문제가 없다”로 가정하지 않고 실제 재사용 여부를 부하 테스트로 확인한다.
- [ ] OCI/운영 환경의 서버측 idle timeout과 Lettuce pool 설정이 서로 어떤 상호작용을 만드는지 기록한다.

---

**원문:** [Redis New Connection 증가 이슈 돌아보기](https://techblog.woowahan.com/23121/)
