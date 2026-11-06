---
type: tech-article
title: "카카오페이 여신코어 DDD(Domain Driven Design, 도메인 주도 설계)로 구축하기"
aliases: []
summary: "DDD는 패키지를 예쁘게 나누는 기법이 아니라, 복잡한 정책의 소유권과 트랜잭션 경계를 팀이 함께 합의하고 그 경계를 코드와 모듈로 강제하는 방법에 가깝다."
source: "카카오페이 기술 블로그"
published: 2025-05-23
collected: 2026-09-04
url: "https://tech.kakaopay.com/post/backend-domain-driven-design/"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# 카카오페이 여신코어 DDD(Domain Driven Design, 도메인 주도 설계)로 구축하기

> [!abstract] 한 줄 정리
> DDD는 패키지를 예쁘게 나누는 기법이 아니라, 복잡한 정책의 소유권과 트랜잭션 경계를 팀이 함께 합의하고 그 경계를 코드와 모듈로 강제하는 방법에 가깝다.

> 카카오페이 기술 블로그 · 2025-05-23

## 핵심 내용

외부 솔루션으로 운영하던 후불결제 여신코어를 내재화하면서 회원·심사·승인·납부·연체 등 복잡하고 정책이 명확한 도메인을 팀 내부에서 안정적으로 소유해야 했다. 도메인 전문가·기획자·개발자가 함께 유비쿼터스 언어를 만들고 Bounded Context와 Aggregate Root를 먼저 정의했다. 각 Bounded Context는 Gradle 모듈 경계로, Aggregate는 일관성을 유지하는 트랜잭션 경계로 삼았다.

Application은 JPA Entity를 직접 다루지 않고 DomainEntity와 DomainRepository를 통해 명령을 전달한다. 여러 도메인이 반드시 함께 수행해야 하는 핵심 흐름은 별도의 Biz-component에 모아 API와 Batch가 공통으로 사용하게 했다. 대량 처리 배치는 JPA Entity 직접 접근이 더 효율적인 경우가 있어 Batch 전용 Entity를 별도로 만들었고, 같은 테이블을 표현하는 Entity 중복이라는 유지보수 비용이 생겼다.

글에서도 현재 구조를 절대적인 정답으로 두지 않는다. 설계 규칙을 강하게 지키는 대가로 생긴 중복과 복잡성을 실제 운영 경험과 함께 드러낸다.

Bounded Context는 모듈을 몇 개로 나누느냐보다 **어떤 언어와 정책을 같은 일관성 경계 안에 둘 것인가**를 먼저 결정하는 장치다. Aggregate Root가 트랜잭션 불변식을 보호하고 Application 계층은 도메인 동작을 조율하도록 하면서도, 대량 Batch에서는 별도 접근 모델이 필요한 현실적인 예외를 허용했다. 이 예외는 단순한 규칙 위반이 아니라 성능 이득과 중복 Entity 유지 비용의 교환이다.

| 설계 영역 | 선택 | 남는 비용 |
| --- | --- | --- |
| 도메인 분리 | Bounded Context별 Gradle 모듈 | 경계 간 호출·통합 관리 |
| 상태 일관성 | Aggregate 중심 트랜잭션 | Aggregate 간 조정 |
| 대량 배치 | 전용 JPA Entity 허용 | 같은 테이블에 대한 이중 모델 유지 |

## 왜 읽을까

DDD의 개념 설명보다 실제 팀이 어떤 기준으로 경계를 정하고 코드에서 그 경계를 어떻게 강제했는지 볼 수 있다. 특히 DDD를 적용했을 때 좋아지는 점뿐 아니라 Batch·JPA와 만나는 지점에서 생기는 비용까지 보여줘 기술 선택의 트레이드오프를 생각하기 좋다.

**프로젝트에 적용 — FutMatch**

- [ ] 예약·매칭·결제 같은 핵심 기능부터 각 도메인이 반드시 지켜야 하는 불변식과 상태 전이를 먼저 문장으로 적는다.
- [ ] 모든 기능을 DDD나 멀티모듈로 나누기보다 실제로 함께 변경되는 정책과 트랜잭션 경계가 분명한 곳에서만 Aggregate 경계를 검토한다.
- [ ] 조회·통계·배치처럼 도메인 모델을 우회하는 편이 효율적인 경로가 생길 때, 설계 순수성과 처리 효율 사이의 비용을 별도 기록한다.

---

**원문:** [카카오페이 여신코어 DDD(Domain Driven Design, 도메인 주도 설계)로 구축하기](https://tech.kakaopay.com/post/backend-domain-driven-design/)
