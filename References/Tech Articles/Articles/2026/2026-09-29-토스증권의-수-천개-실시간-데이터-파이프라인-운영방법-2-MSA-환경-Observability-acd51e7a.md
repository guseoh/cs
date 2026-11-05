---
type: tech-article
title: "토스증권의 수 천개 실시간 데이터 파이프라인 운영방법 #2: MSA 환경 Observability 높이기"
aliases: []
summary: "1만 개 서비스 Pod와 1천 개 Kafka Topic의 실제 연결 관계를 소스 수정 없이 관찰하기 위해, 모든 로그를 모으는 대신 구조적으로 적은 핵심 신호를 골라 다른 운영 데이터와 결합한 사례다."
source: "Toss Tech"
published: 2025-09-19
collected: 2026-09-29
url: "https://toss.tech/article/40783"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "동시성·분산"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/동시성-분산"
migration_origin: notion
---

# 토스증권의 수 천개 실시간 데이터 파이프라인 운영방법 #2: MSA 환경 Observability 높이기

> [!abstract] 한 줄 정리
> 1만 개 서비스 Pod와 1천 개 Kafka Topic의 실제 연결 관계를 소스 수정 없이 관찰하기 위해, 모든 로그를 모으는 대신 구조적으로 적은 핵심 신호를 골라 다른 운영 데이터와 결합한 사례다.

> Toss Tech · 2025-09-19

## 핵심 내용

- **문제:** 서비스 소스 수정 없이 실시간 연결 관계를 100% 커버해야 했지만, netstat는 애플리케이션 의미를 모르고 소스 분석은 실제 배포 상태와 다를 수 있었다.
- **수치:** 라이브 Kafka Broker에는 초당 100만 건 이상의 요청이 있어 전체 request log를 켜면 CPU 100%나 디스크 고갈로 Broker 자체가 위험해졌다. 0.1% 샘플링은 안전했지만 실시간 100% 커버리지 요구를 충족하지 못했다.
- **접근:** 약 30개 Kafka Broker API를 조사해 모든 클라이언트가 기본적으로 약 5분마다 호출하는 METADATA API만 100% 수집했다. 최근 10분 로그를 보면 트래픽 유무와 관계없이 연결 현황을 잡을 수 있게 했다.
- **구조:** METADATA 로그만으로 알 수 없는 Producer/Consumer 및 Consumer Group 정보는 기존 Lag metric과 결합하고, Kubernetes의 conntrack을 IP·Port로 조인해 실제 Pod 이름까지 복원했다. 세 데이터는 ClickHouse에서 결합하고 Materialized View로 사용하기 쉬운 `service_graph` 형태로 제공했다.
- **결과:** Kafka Client ↔ Broker ↔ Topic ↔ Consumer Group ↔ Kubernetes Pod 관계를 실시간으로 조회할 수 있게 되어 리니지와 Grafana 관제에 재사용할 수 있는 운영 데이터가 만들어졌다.

## 왜 읽을까

Observability를 ‘로그를 많이 남기는 것’으로 보지 않고, 필요한 질문에 답할 수 있는 최소 신호를 고르는 문제로 접근한다. 계측 자체가 운영 시스템을 망가뜨릴 수 있다는 점과 여러 불완전한 데이터 소스를 조합해 의미 있는 운영 모델을 만드는 과정도 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 운영 지표를 추가할 때 먼저 ‘장애 때 어떤 질문에 답하려는가’를 적고 필요한 최소 로그·메트릭만 정의한다.
- [ ] 관측을 위해 추가한 로그가 애플리케이션 CPU·디스크·응답시간에 주는 비용도 부하 테스트에 포함한다.
- [ ] 서비스·DB·Redis·외부 API 관계를 추적할 공통 식별자와 대시보드 구조를 미리 정리한다.

---

**원문:** [토스증권의 수 천개 실시간 데이터 파이프라인 운영방법 #2: MSA 환경 Observability 높이기](https://toss.tech/article/40783)
