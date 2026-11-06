---
type: tech-article
title: "Spark Connect on Kubernetes #2: Operator로 만드는 Control Plane"
aliases: []
summary: "상태를 가진 장기 실행 서버는 새 서버가 Ready라는 사실만으로 안전하게 교체할 수 없다. 단일 서버의 복구와 서비스 단위의 교체를 분리하고, 신규 세션 전환·기존 세션 drain·재시도 상한을 함께 설계해야 한다."
source: "토스 기술 블로그 · 토스증권 Data Infra팀"
published: 2026-10-14
collected: 2026-10-15
url: "https://toss.tech/article/spark-connect-on-kubernetes-2"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
  - "tech/장애-운영"
migration_origin: notion
---

# Spark Connect on Kubernetes #2: Operator로 만드는 Control Plane

> [!abstract] 한 줄 정리
> 상태를 가진 장기 실행 서버는 새 서버가 Ready라는 사실만으로 안전하게 교체할 수 없다. 단일 서버의 복구와 서비스 단위의 교체를 분리하고, 신규 세션 전환·기존 세션 drain·재시도 상한을 함께 설계해야 한다.

> 토스 기술 블로그 · 토스증권 Data Infra팀 · 2026-10-14

## 핵심 내용

Spark Connect에서 사용자의 Driver 세션은 특정 서버의 메모리에 남기 때문에 Deployment처럼 단순히 Pod를 교체하면 이미 실행 중인 세션이 끊어진다. 토스증권은 개별 서버 상태를 다루는 Apache Spark Operator와 테넌트가 원하는 replica 수·generation을 관리하는 Spark Tenant Operator를 구분했다.

![Apache Spark Operator와 Spark Tenant Operator의 책임 분리](https://static.toss.im/ipd-tcs/toss_core/live/c64fb3ee-5264-4502-b5ac-a65bd3042f23/p2-03-two-operators-revised-techblog.png)

*그림 1. 원문 두 Operator 역할도: 단일 SparkApplication 실행과 테넌트 세대 관리의 경계를 분리 — [출처: 원문 기술 블로그](https://toss.tech/article/spark-connect-on-kubernetes-2)*

![Spark Application attempt와 tenant generation의 차이](https://static.toss.im/ipd-tcs/toss_core/live/1fd787c4-89b5-43a9-b528-9a3f65b5d635/p2-11-attempt-generation-techblog.png)

*그림 2. 원문 attempt와 generation 설명도: 서버 재기동과 테넌트 전체 교체는 서로 다른 이벤트 — [출처: 원문 기술 블로그](https://toss.tech/article/spark-connect-on-kubernetes-2)*

새 설정이 나오면 Tenant Operator는 새 generation의 SparkApplication을 준비하고 모두 일정 시간 안정적으로 Ready일 때만 `currentGeneration`을 변경한다. Gateway는 그 이후의 신규 세션만 새 서버로 보내고 기존 세션은 원래 Driver에서 drain하도록 남긴다. Application 재시도 횟수는 제한하며 모든 서버가 실패한 상태에서는 무한 교체하지 않는다. gRPC 포트 검사를 readiness에 사용했을 때 Driver와 Executor DNS 준비 조건이 서로를 기다리는 교착도 발생해 IP 직접 연결 등으로 수정했다.

| 책임 | Apache Spark Operator | Spark Tenant Operator / Gateway |
| --- | --- | --- |
| 생명주기 | 개별 Driver Pod·attempt | 테넌트 replica 수·generation |
| 장애 | 제한된 재시도 | 정상 서버 남았을 때만 교체 |
| 설정 변경 | 새 Application 실행 | 새 세대 검증 뒤 신규 세션 전환 |
| 기존 세션 | Driver 메모리 종속 | drain 후 종료, 기본 90분 한계 |

기존 세션은 기본 90분 drain 한도를 지나면 강제 종료될 수 있으므로 무중단을 무제한 보장한다고 할 수 없다. 운영 메모리에서는 72시간 관측 중 단순 Heap 고정·PreTouch만 적용한 cgroup anonymous memory가 9.26GiB에서 10.5GiB를 넘었지만 `MALLOC_ARENA_MAX=2`는 약 9.06GiB를 유지했다. 운영 설정은 `max(4, cores)` 정책으로 정했고 원문 집필 시점에 20개 이상의 테넌트를 지원했다.

## 왜 읽을까

준비 상태(readiness), 주소 발견(discovery), 기존 연결의 종료(drain)는 서로 다른 계약이라는 점을 실전 장애로 보여준다. 특히 재시도 횟수 제한을 상위 컨트롤러가 우회하지 않게 설계한 판단은 복구 자동화가 오히려 장애를 증폭하는 상황을 예방하는 데 중요하다.

메모리 분석도 JVM Heap 지표만으로 OOM을 설명할 수 없을 때 glibc arena와 cgroup 지표까지 내려가야 한다는 좋은 사례다.

**프로젝트에 적용 — PawCycle**

- [ ] 현재 배포 방식에서 readiness가 실제 요청 처리 가능 상태를 검사하는지 확인한다.
- [ ] 배포 중 진행 중인 요청과 세션이 어떻게 종료되는지, 롤백 조건과 강제 종료 시점을 문서화한다.
- [ ] 재시도 한도와 실패 시 알림 조건을 구분하고, 반복 실패가 무한 재시작으로 이어지지 않는지 점검한다.

---

**원문:** [Spark Connect on Kubernetes #2: Operator로 만드는 Control Plane](https://toss.tech/article/spark-connect-on-kubernetes-2)
