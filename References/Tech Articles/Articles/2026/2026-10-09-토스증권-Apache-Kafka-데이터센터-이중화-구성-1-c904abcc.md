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

데이터센터 두 곳에서 서비스와 Kubernetes가 Active-Active로 운영되더라도 메시지 브로커 Kafka가 단일 데이터센터에만 남아 있다면 전체 서비스의 장애 복원력은 제한된다. 토스증권은 데이터센터를 가로지르는 Stretched Cluster와 각 센터에서 독립적으로 운영하며 미러링하는 Active-Active를 비교했다.

 ```mermaid
flowchart LR
 A[DC1 Producer] --> B[DC1 Kafka]
 C[DC2 Producer] --> D[DC2 Kafka]
 B <-->|비동기 미러링| D
 E[DC1 Consumers] --> B
 F[DC2 Consumers] --> D
```

*원문의 Active-Active 선택을 나타내는 가로형 개념도다. 양방향 미러링은 소비자 Offset의 즉각적 일치나 글로벌 총순서를 보장하지 않는다.*

Stretched Cluster는 단일 논리 Kafka를 구성하기에 토픽·Consumer 관리가 단순할 수 있지만 데이터센터 간 네트워크 지연과 분리 상황이 복제·리더 선출에 직접 영향을 준다. Active-Active는 로컬 Kafka에 빠르게 접근하고 센터별 장애를 격리할 수 있지만 토픽과 ACL, 수천 개 Consumer Group Offset을 서로 맞추고 양방향 메시지 미러링을 운영해야 한다. 같은 토픽 이름을 두 센터에서 사용하고 Split DNS로 Producer가 기본적으로 지역 클러스터에 기록하도록 했다.

| 선택지 | 장점 | 주된 운영 비용 |
| --- | --- | --- |
| Stretched Cluster | 논리적 단일 클러스터 | 센터 간 지연·네트워크 분리 민감 |
| Independent Active-Active | 로컬 접근·센터 장애 격리 | 토픽·ACL·Offset·양방향 미러링 |
| Split DNS | Producer 지역성 유지 | DNS와 전환 절차 관리 |
| 비동기 미러링 | 센터 간 느슨한 결합 | 지연·중복·복구 시 일관성 점검 |

토스증권은 운영 중 양쪽 클러스터의 복잡한 Offset·미러링 책임을 감수하더라도 데이터센터 간 통신 의존을 낮추는 선택을 했다. 다만 비동기 미러링은 센터 간 일시적 지연이 있을 수 있어 장애 전환 중 중복·누락·순서 보장을 자동으로 제공하지 않는다. 실제 복구 목적 시간과 Consumer 위치, 양방향 쓰기 충돌 정책은 별도 설계 대상으로 남는다.

## 왜 읽을까

'고가용성'을 서버 인스턴스 개수로 판단하지 않고 데이터 흐름의 상태 보유 지점까지 추적하는 설계 사고를 배울 수 있다. 네트워크 분리, 지연, 복제, 오프셋 전환과 운영 부담을 함께 평가하는 기준이 유용하다.

**프로젝트에 적용 — FutMatch**

- [ ] 경기 참가·취소·알림 이벤트의 데이터 흐름에서 DB, 큐, 워커 등 상태 보유 지점을 표시한다.
- [ ] 한 구성요소가 중단됐을 때 메시지 유실·중복·지연 허용 범위를 정의하고 복구 시나리오를 작성한다.
- [ ] 현재 규모에서는 Kafka 이중화를 도입하지 말고 DB 트랜잭션·Outbox·멱등 소비 등 단순한 신뢰성 장치를 우선 검토한다.

---

**원문:** [토스증권 Apache Kafka 데이터센터 이중화 구성 #1](https://toss.tech/article/32821)
