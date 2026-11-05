---
type: tech-article
title: "장시간 비동기 작업, Kafka 대신 RDB 기반 Task Queue로 해결하기"
aliases: []
summary: "30분 이상 걸리는 비동기 작업에 Kafka를 계속 맞추기보다, 작업의 상태·재시도·복구가 핵심이라는 요구를 다시 정의해 RDB Task Queue + Heartbeat 구조로 단순화한 사례다."
source: "우아한형제들 기술블로그"
published: 2025-11-25
collected: 2026-09-26
url: "https://techblog.woowahan.com/23625/"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "동시성·분산"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/동시성-분산"
migration_origin: notion
---

# 장시간 비동기 작업, Kafka 대신 RDB 기반 Task Queue로 해결하기

> [!abstract] 한 줄 정리
> 30분 이상 걸리는 비동기 작업에 Kafka를 계속 맞추기보다, 작업의 상태·재시도·복구가 핵심이라는 요구를 다시 정의해 RDB Task Queue + Heartbeat 구조로 단순화한 사례다.

> 우아한형제들 기술블로그 · 2025-11-25

## 핵심 내용

- **문제:** 원래 10분 이내였던 엑셀 생성이 외부 API 호출 증가로 30분 이상 걸리면서 Kafka의 5분 `max.poll.interval.ms`를 넘겼고, 리밸런싱으로 같은 메시지가 다른 Consumer에 재할당돼 중복 메일이 발송됐다.
- **주의점:** 비동기 실행 후 즉시 ACK하는 핫픽스는 중복을 막았지만, 작업 중 장애나 배포가 발생하면 이미 ACK된 작업이 유실될 수 있었다. timeout을 1시간으로 늘리는 방법도 실제 장애 감지를 늦추는 문제가 있었다.
- **구조:** 작업을 RDB에 `PENDING/IN_PROGRESS/DONE/FAILED` 상태와 heartbeat, retry count로 저장하고 Worker가 3초마다 폴링한다. Redis 분산 락으로 작업을 선점하고 1분마다 heartbeat를 갱신한다.
- **복구:** heartbeat가 2분 이상 끊긴 작업은 복구 스케줄러가 다시 `PENDING`으로 돌리고, 실패 작업은 최대 3회 재시도한다. 복구 스케줄러 자체는 ShedLock으로 단일 실행을 보장한다.
- **트레이드오프:** RDB 폴링 때문에 분당 20~30회 쿼리가 추가되고 처리 시작이 최대 약 3초 늦어지지만, 이 워크로드에서는 허용 가능한 비용으로 판단했다.

## 왜 읽을까

“Kafka를 쓰고 있으니 Kafka 안에서 해결한다”가 아니라 작업 특성을 다시 정의하고 기술을 제거하는 의사결정이 좋다. 짧고 높은 처리량의 이벤트와, 수십 분 동안 상태 추적·재시도·복구가 필요한 작업은 같은 메시징 문제처럼 보여도 요구가 다르다는 점을 배울 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 장시간 배치나 외부 API 연계 작업이 생기면 처리 시간, 상태 추적, 재시도, 배포 중 복구 요구를 먼저 표로 정의한다.
- [ ] Kafka/메시지 브로커를 도입하기 전에 RDB 작업 테이블만으로 요구를 충족할 수 있는지 비교한다.
- [ ] 중복 방지뿐 아니라 Worker가 처리 도중 죽었을 때 작업을 누가, 어떤 기준으로 다시 가져가는지 장애 시나리오로 검증한다.

---

**원문:** [장시간 비동기 작업, Kafka 대신 RDB 기반 Task Queue로 해결하기](https://techblog.woowahan.com/23625/)
