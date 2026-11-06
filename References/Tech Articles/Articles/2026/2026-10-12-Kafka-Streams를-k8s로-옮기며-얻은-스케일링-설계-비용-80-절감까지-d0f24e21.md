---
type: tech-article
title: "Kafka Streams를 k8s로 옮기며 얻은 스케일링 설계: 비용 80% 절감까지"
aliases: []
summary: "Kafka consumer는 평균 CPU가 낮아도 특정 파티션의 처리가 밀릴 수 있다. 소비 지연(lag)과 예측 가능한 피크 시간을 결합해 스케일링하고, 스레드·파티션 균형까지 고려해야 한다."
source: "데브시스터즈 DEVTECH"
published: 2026-09-03
collected: 2026-10-12
url: "https://tech.devsisters.com/posts/kafka-streams-keda-scaling/"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
  - "tech/성능"
migration_origin: notion
---

# Kafka Streams를 k8s로 옮기며 얻은 스케일링 설계: 비용 80% 절감까지

> [!abstract] 한 줄 정리
> Kafka consumer는 평균 CPU가 낮아도 특정 파티션의 처리가 밀릴 수 있다. 소비 지연(lag)과 예측 가능한 피크 시간을 결합해 스케일링하고, 스레드·파티션 균형까지 고려해야 한다.

> 데브시스터즈 DEVTECH · 2026-09-03

## 핵심 내용

데브시스터즈의 Kafka Streams Log Transformer는 피크 시점에 맞춰 EC2 c6g.2xlarge 72대를 고정 운영했다. Kubernetes로 이전한 뒤 일반 HPA의 평균 CPU를 기준으로 늘리려 했지만 파티션이 고르게 배치되지 않으면 일부 Pod만 CPU가 포화돼도 평균이 낮아 확장되지 않는 문제가 있었다.

 ```mermaid
flowchart LR
 A[Kafka 파티션·Consumer Lag] --> B[KEDA Kafka Scaler]
 C[자정 선제 Cron Trigger] --> B
 B --> D[Replica 수 결정]
 D --> E[Kafka Streams Pod×Thread]
 E --> F[Lag·처리 지연·비용 검증]
```

*원문에서 확인한 워크로드 전용 스케일링 경계를 가로형으로 재구성했다. Consumer Lag는 실시간 처리 지연의 신호이며 CPU 평균과 역할이 다르다.*

처리 중인 Kafka 토픽마다 애플리케이션을 분리해 배포·장애 영역을 나누고, KEDA Kafka scaler가 Consumer Lag을 기준으로 확장하도록 변경했다. 자정에는 로그가 급격히 증가하는 특성을 이용해 lag가 실제로 쌓이기 전에 cron trigger로 미리 scale-out했다. Pod당 여러 Stream Thread를 실행하면 JVM 및 재균형 비용을 줄일 수 있지만 Pod 하나가 죽었을 때 영향을 받는 태스크도 함께 증가한다. 파티션 24개에 Pod마다 thread 4개라면 균등한 배분 조건은 1·2·3·6 replica 같은 조합이 된다.

| 전환 항목 | 기존/문제 | 선택과 효과 |
| --- | --- | --- |
| 인프라 | EC2 72대 피크 고정 | Kubernetes/KEDA 동적 확장 |
| HPA 신호 | 평균 CPU의 파티션 편중 은폐 | Kafka consumer lag 사용 |
| 자정 트래픽 | Lag 증가 후 대응 시 늦음 | Cron 사전 확장 |
| 실행 단위 | Pod만 기준으로 계산 | Pod×Thread와 파티션 수 함께 판단 |
| 비용 | 기존 EC2 고정 규모 | 80% 이상 절감(원문 환경) |

최소 Replica를 유지하되 한산한 시점에는 2개까지 축소하며, 기존 EC2 대비 인프라 비용을 80% 이상 절감했다. 원문은 KEDA가 계산하는 파티션 단위와 실제 워커의 Pod×thread 실행 단위가 달라지는 문제를 개선 PR로 다루고 있다고 설명한다. 실측 트래픽·Lag 회복 시간·파티션 수를 무시하고 단순히 CPU 기준을 낮추는 것은 적합한 해결책이 아니다.

## 왜 읽을까

'CPU가 높으면 서버를 늘린다'는 일반론이 워크로드 특성 때문에 실패하는 사례다. 소비 지연, 파티션 수, 리밸런싱, JVM 기동 시간, 피크 예측을 함께 고려하는 스케일링 의사결정을 배울 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 CPU 평균 외에 p95/p99, Hikari pending, 작업 대기열처럼 실제 포화 신호를 함께 기록한다.
- [ ] 피크가 예측 가능한 배치·이벤트 처리 작업이 있는지 확인하고 사전 확장이 필요한지 판단한다.
- [ ] Kafka/KEDA는 실제 비동기 처리량 병목이 확인되기 전에는 도입하지 않는다.

---

**원문:** [Kafka Streams를 k8s로 옮기며 얻은 스케일링 설계: 비용 80% 절감까지](https://tech.devsisters.com/posts/kafka-streams-keda-scaling/)
