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

- **문제:** EC2 c6g.2xlarge 72대를 피크 기준으로 고정 운영했다. Kubernetes CPU 기반 HPA는 파티션 불균등 분배로 일부 Pod가 포화되어도 평균 CPU가 임계치 아래여서 확장하지 못했다.
- **구조:** 소스 토픽별 Kafka Streams 앱으로 분리해 배포·장애·스케일링을 격리하고, KEDA Kafka scaler로 consumer lag을 기준으로 replica를 조절했다.
- **접근:** 자정 로그 급증에는 lag이 쌓이기 전 cron trigger로 미리 확장했다. Pod당 다중 stream thread로 JVM 오버헤드와 rebalance 유발 이벤트를 줄였지만 단일 Pod 장애 영향 범위가 커지는 비용도 고려했다.
- **수치:** EC2 대비 인프라 비용을 80% 이상 절감했다. 운영 환경은 최소 replica를 유지하고 트래픽이 적은 시간에는 2대까지 줄어든다.
- **주의점:** KEDA의 파티션 균등 옵션은 Pod 수만 고려하지만 실제 작업 분배는 Pod×thread 기준이다. 24 파티션·Pod당 4 thread라면 균등한 replica는 1·2·3·6이며, 이를 지원하는 개선 PR을 진행 중이라고 설명한다.

## 왜 읽을까

'CPU가 높으면 서버를 늘린다'는 일반론이 워크로드 특성 때문에 실패하는 사례다. 소비 지연, 파티션 수, 리밸런싱, JVM 기동 시간, 피크 예측을 함께 고려하는 스케일링 의사결정을 배울 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 CPU 평균 외에 p95/p99, Hikari pending, 작업 대기열처럼 실제 포화 신호를 함께 기록한다.
- [ ] 피크가 예측 가능한 배치·이벤트 처리 작업이 있는지 확인하고 사전 확장이 필요한지 판단한다.
- [ ] Kafka/KEDA는 실제 비동기 처리량 병목이 확인되기 전에는 도입하지 않는다.

---

**원문:** [Kafka Streams를 k8s로 옮기며 얻은 스케일링 설계: 비용 80% 절감까지](https://tech.devsisters.com/posts/kafka-streams-keda-scaling/)
