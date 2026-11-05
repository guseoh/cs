---
type: tech-article
title: "토스증권 Apache Kafka 데이터센터 이중화 구성 #1"
aliases: []
summary: "서버가 두 데이터센터에서 Active-Active로 동작해도 상태를 가진 Kafka가 단일 장애점이면 전체 서비스의 이중화는 성립하지 않는다. 클러스터 독립성·복제 지연·운영 복잡성 사이에서 장애 목표를 먼저 정해야 한다."
source: "토스증권 기술 블로그"
published: 2025-01-08
collected: 2026-10-09
url: "https://toss.tech/article/32821"
topic: "동시성·분산"
categories:
  - "동시성·분산"
  - "설계·아키텍처"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/동시성-분산"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# 토스증권 Apache Kafka 데이터센터 이중화 구성 #1

> [!abstract] 한 줄 정리
> 서버가 두 데이터센터에서 Active-Active로 동작해도 상태를 가진 Kafka가 단일 장애점이면 전체 서비스의 이중화는 성립하지 않는다. 클러스터 독립성·복제 지연·운영 복잡성 사이에서 장애 목표를 먼저 정해야 한다.

> 토스증권 기술 블로그 · 2025-01-08

## 핵심 내용

- **문제:** 두 데이터센터의 Kubernetes와 서비스 서버는 Active-Active였지만, MSA의 메시지 브로커인 Kafka가 함께 이중화되지 않으면 데이터센터 장애 시 서비스가 멈춘다.
- **구조:** 독립 Kafka 두 개를 양방향 미러링하는 Active-Active와 데이터센터를 가로지르는 단일 Stretched Cluster를 비교했다.
- **트레이드오프:** Active-Active는 로컬 접근 지연과 장애 격리가 유리하지만 수백 토픽의 양방향 미러링, 수천 Consumer Group Offset 동기화, 이중 권한·토픽 관리가 필요하다.
- **선택:** Stretched Cluster의 데이터센터 간 통신 지연과 네트워크 분리 위험을 우선 회피하고 Active-Active를 채택했다. 글은 이를 토스증권의 요구사항에 따른 선택으로 설명한다.
- **운영:** 양쪽 클러스터에 같은 토픽 이름을 사용하고 Producer는 Split DNS로 로컬 Kafka에 쓰게 했다. 상대 데이터센터에는 미러링으로 전달하며 Consumer 전환은 별도 정책으로 설계한다.

## 왜 읽을까

'고가용성'을 서버 인스턴스 개수로 판단하지 않고 데이터 흐름의 상태 보유 지점까지 추적하는 설계 사고를 배울 수 있다. 네트워크 분리, 지연, 복제, 오프셋 전환과 운영 부담을 함께 평가하는 기준이 유용하다.

**프로젝트에 적용 — FutMatch**

- [ ] 경기 참가·취소·알림 이벤트의 데이터 흐름에서 DB, 큐, 워커 등 상태 보유 지점을 표시한다.
- [ ] 한 구성요소가 중단됐을 때 메시지 유실·중복·지연 허용 범위를 정의하고 복구 시나리오를 작성한다.
- [ ] 현재 규모에서는 Kafka 이중화를 도입하지 말고 DB 트랜잭션·Outbox·멱등 소비 등 단순한 신뢰성 장치를 우선 검토한다.

---

**원문:** [토스증권 Apache Kafka 데이터센터 이중화 구성 #1](https://toss.tech/article/32821)
