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

- **구조:** Apache Spark Operator는 개별 SparkApplication의 기동·상태·제한된 재시도를 담당하고, 자체 Spark Tenant Operator는 여러 Application의 replica 수·세대(generation)·교체를 관리한다. Gateway는 신규 세션과 기존 세션을 서로 다른 세대로 라우팅한다.
- **교체:** 새 generation의 모든 서버가 일정 시간 안정적으로 Ready인 경우에만 신규 세션을 전환한다. 기존 세션은 원래 Driver에 남겨 drain하며, 기본 90분이 지나면 강제 정리될 수 있어 세션 단절 위험이 남는다.
- **장애 경계:** Apache Spark Operator의 재시도가 끝나도 무한 재생성하지 않는다. 정상 서버가 최소 1개 남아 있을 때만 상위 Operator가 교체하고, 모두 실패한 상태에서는 자동 교체를 보류한다.
- **시행착오:** Spark UI HTTP probe는 리다이렉트를 성공으로 오인해 실제 Connect 준비를 보장하지 못했다. gRPC 포트 연결 검사로 바꾸자 Executor의 Driver DNS 조회와 Ready 조건이 서로를 기다리는 교착이 드러나 Pod IP 직접 연결 등으로 해결했다.
- **수치·결과:** 72시간 관측에서 Heap 고정·PreTouch만 적용한 cgroup anonymous memory는 9.26GiB→10.5GiB 초과였지만, `MALLOC_ARENA_MAX=2` 비교에서는 9.06GiB를 유지했다. 운영은 `max(4, cores)` 정책을 적용하며, 20개 이상의 테넌트를 운영한다고 보고했다.

## 왜 읽을까

준비 상태(readiness), 주소 발견(discovery), 기존 연결의 종료(drain)는 서로 다른 계약이라는 점을 실전 장애로 보여준다. 특히 재시도 횟수 제한을 상위 컨트롤러가 우회하지 않게 설계한 판단은 복구 자동화가 오히려 장애를 증폭하는 상황을 예방하는 데 중요하다.

메모리 분석도 JVM Heap 지표만으로 OOM을 설명할 수 없을 때 glibc arena와 cgroup 지표까지 내려가야 한다는 좋은 사례다.

**프로젝트에 적용 — PawCycle**

- [ ] 현재 배포 방식에서 readiness가 실제 요청 처리 가능 상태를 검사하는지 확인한다.
- [ ] 배포 중 진행 중인 요청과 세션이 어떻게 종료되는지, 롤백 조건과 강제 종료 시점을 문서화한다.
- [ ] 재시도 한도와 실패 시 알림 조건을 구분하고, 반복 실패가 무한 재시작으로 이어지지 않는지 점검한다.

---

**원문:** [Spark Connect on Kubernetes #2: Operator로 만드는 Control Plane](https://toss.tech/article/spark-connect-on-kubernetes-2)
