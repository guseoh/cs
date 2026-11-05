---
type: tech-article
title: "LINE 서비스의 대규모 광고 데이터를 처리하기 위한 Spark on Kubernetes 적용기"
aliases: []
summary: "스토리지와 컴퓨팅이 결합된 YARN의 자원 경합을 분리하기 위해 Spark 실행 환경을 Kubernetes로 옮겼고, 자원 격리와 독립적인 실행 환경을 확보하면서 처리량과 비용을 함께 개선했다."
source: "LY Corporation Tech Blog"
published: 
collected: 2026-10-05
url: "https://techblog.lycorp.co.jp/ko/processing-large-scale-data-with-spark-on-kubernetes"
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

# LINE 서비스의 대규모 광고 데이터를 처리하기 위한 Spark on Kubernetes 적용기

> [!abstract] 한 줄 정리
> 스토리지와 컴퓨팅이 결합된 YARN의 자원 경합을 분리하기 위해 Spark 실행 환경을 Kubernetes로 옮겼고, 자원 격리와 독립적인 실행 환경을 확보하면서 처리량과 비용을 함께 개선했다.

> LY Corporation Tech Blog

## 핵심 내용

- **문제:** LINE Ads는 하루 수백억 건 이상, 초당 수십만 건 이상의 이벤트를 처리한다. 데이터 피처 증가로 주요 테이블 크기가 2022년 대비 2025년 약 2.91배가 되면서 HDFS와 Spark가 같은 노드 자원을 경쟁하는 YARN 구조의 한계가 커졌다.
- **구조:** Spark Driver와 Executor를 Kubernetes Pod로 실행하고 Spark Operator, YuniKorn, GitHub Actions·ArgoCD, Prometheus/OpenSearch 계층을 조합했다. YuniKorn의 gang scheduling으로 필요한 Executor 자원이 확보될 때까지 잡을 대기시킨다.
- **주의점:** 전환 직후 컨테이너 OOM이 반복됐다. JVM 밖에서 쓰는 Parquet·Netty 등의 off-heap과 Kubernetes 오버헤드를 고려해 `spark.executor.memoryOverhead` 비율을 기존 0.1에서 0.2 이상으로 높였다.
- **수치:** 스트리밍 예시에서 YARN은 200코어로 평균 200K events/s, Kubernetes는 100코어로 653K events/s를 처리해 약 226% 성능 향상을 기록했다.
- **결과:** 컴퓨팅 자원 기준 연간 비용을 40% 이상 절감했고 Spark 버전·의존성도 Hadoop 노드와 분리해 운영할 수 있게 됐다.

## 왜 읽을까

Kubernetes 전환을 유행이나 추상적 확장성으로 설명하지 않고 기존 자원 경합을 측정 가능한 문제로 정의하고, 전환 후 새로 생긴 OOM·스토리지 실패까지 다룬다. 아키텍처 변경의 이득과 새 책임을 같이 볼 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 애플리케이션 CPU뿐 아니라 DB·스토리지·다른 워크로드와의 자원 경합을 같은 시간축으로 관찰한다.
- [ ] 컨테이너 메모리를 JVM heap과 동일시하지 않고 off-heap·런타임 오버헤드까지 포함해 한도를 검증한다.
- [ ] 최적화 전후에는 처리량과 비용뿐 아니라 장애 시 복구 동작도 함께 기록한다.

---

**원문:** [LINE 서비스의 대규모 광고 데이터를 처리하기 위한 Spark on Kubernetes 적용기](https://techblog.lycorp.co.jp/ko/processing-large-scale-data-with-spark-on-kubernetes)
