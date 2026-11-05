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

- **문제:** 피크 시간이 지난 자정에도 Redis New Connection 지표가 줄지 않았고, 파이프라이닝이 새 연결을 만드는지부터 의심했다.
- **구조:** `RedisTemplate.executePipelined()`은 공유 연결이 아니라 전용 연결을 사용하지만, 풀을 설정했다면 전용 연결도 풀에서 재사용된다. 당시 최대 풀 크기는 20이었다.
- **원인:** GenericObjectPool의 기본 LIFO 특성 때문에 일부 연결이 오래 idle 상태로 남았고, ElastiCache의 `timeout=100` 설정이 100초 동안 사용하지 않은 연결을 끊었다. Lettuce ConnectionWatchDog가 이를 다시 연결하면서 New Connection이 증가했다.
- **검증:** 로컬에서도 사용하지 않는 연결이 실제로 100초 간격으로 재연결되는 것을 재현했다. 피크 때 늘어난 연결이 한산한 시간에 idle이 되면서 자정에 신규 연결 지표가 더 높아지는 현상을 설명할 수 있었다.
- **트레이드오프:** 서버의 idle timeout을 무작정 늘리기보다 애플리케이션 커넥션 풀의 LIFO→FIFO 변경 등 연결 사용 패턴을 조정하는 방안을 검토했다.

## 왜 읽을까

Spring의 추상화에서 시작한 현상이 Redis 서버 설정과 네트워크 연결 수명까지 이어지는 과정을 따라갈 수 있다. 지표가 이상할 때 눈에 보이는 설정 하나를 바꾸기보다 실제 연결 생성·반납·종료 경로를 소스와 재현 테스트로 좁혀 가는 방식이 특히 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis를 사용하는 경로에서 `NewConnections`, 활성/idle 연결 수, command latency를 함께 관측한다.
- [ ] 파이프라이닝이나 풀을 적용했다면 “풀을 쓴다 = 연결 생성 문제가 없다”로 가정하지 않고 실제 재사용 여부를 부하 테스트로 확인한다.
- [ ] OCI/운영 환경의 서버측 idle timeout과 Lettuce pool 설정이 서로 어떤 상호작용을 만드는지 기록한다.

---

**원문:** [Redis New Connection 증가 이슈 돌아보기](https://techblog.woowahan.com/23121/)
