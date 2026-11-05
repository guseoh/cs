---
type: tech-article
title: "Spark Connect on Kubernetes #1: 견고한 Spark Connect 만들기"
aliases: []
summary: "여러 사용자가 하나의 long-running 서버를 공유하면 기존 기본값의 전제가 깨질 수 있다. 안정성은 장애를 없애는 것보다 한 사용자의 실패가 다른 사용자에게 번지지 않도록 실패 범위를 줄이는 데서 시작한다."
source: "Toss Tech"
published: 2026-06-19
collected: 2026-09-28
collected_dates:
  - 2026-09-28
  - 2026-08-13
url: "https://toss.tech/article/spark-connect-on-kubernetes-1"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "설계·아키텍처"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# Spark Connect on Kubernetes #1: 견고한 Spark Connect 만들기

> [!abstract] 한 줄 정리
> 여러 사용자가 하나의 long-running 서버를 공유하면 기존 기본값의 전제가 깨질 수 있다. 안정성은 장애를 없애는 것보다 한 사용자의 실패가 다른 사용자에게 번지지 않도록 실패 범위를 줄이는 데서 시작한다.

> Toss Tech · 2026-06-19

## 핵심 내용

- **문제:** Spark Connect는 여러 세션이 하나의 Driver와 SparkContext를 공유해 Executor 실패가 누적되면 문제 쿼리 하나가 서버 전체 세션을 함께 종료시킬 수 있었다.
- **접근:** 글로벌 Executor 실패 카운터를 사실상 비활성화하고 Task·Stage 단위 실패 한도로 문제 쿼리만 끊도록 조정했으며, `spark.driver.maxResultSize`로 거대한 결과가 Driver 메모리에 들어오기 전에 차단했다.
- **구조:** Spark Connect 서버를 여러 Replica로 나눠 각 Replica가 독립적인 Driver·SparkContext·Executor를 갖게 해 장애 영향 범위를 서버 전체에서 Replica 하나로 축소했다.
- **트레이드오프:** 기존 세션은 상태가 있는 원래 Replica에 고정해야 하지만 새 세션은 한가한 서버로 보내야 해서, 단순 consistent hash 대신 Task 사용률과 활성 세션 수를 반영하는 전용 Gateway를 만들었다.
- **주의점:** Gateway가 Kubernetes API에 직접 의존하지 않도록 서버 생명주기는 Controller가 맡고, Gateway는 Redis에 게시된 상태만 읽게 해 Data Plane과 Control Plane의 장애 경계를 분리했다.

## 왜 읽을까

고가용성을 단순히 Replica 수를 늘리는 문제로 보지 않는다. 기본 설정이 어떤 전제를 갖고 만들어졌는지 확인하고, 실패 격리·상태 있는 라우팅·Control/Data Plane 분리까지 이어가는 설계 과정을 볼 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 한 요청의 OOM·지연·외부 의존성 실패가 다른 요청까지 얼마나 전파되는지 확인한다.
- [ ] readiness와 timeout을 정상/비정상 판정뿐 아니라 장애 영향 범위를 제한하는 관점에서 검토한다.
- [ ] 운영 구조가 커지면 트래픽 처리 경로와 배포·제어 경로가 같은 장애 원인에 묶여 있지 않은지 점검한다.

---

**원문:** [Spark Connect on Kubernetes #1: 견고한 Spark Connect 만들기](https://toss.tech/article/spark-connect-on-kubernetes-1)
