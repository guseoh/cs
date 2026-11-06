---
type: tech-article
title: "Spring Cloud Config HA 적용을 위한 커스터마이징"
aliases: []
summary: "동적 설정이라는 편의 기능이 새로운 단일 장애점이 되지 않도록 Spring Cloud Config의 저장·전파·리프레시 구조를 운영 요구에 맞게 확장한 사례다."
source: "NAVER D2"
published: 2025-07-09
collected: 2026-09-27
url: "https://d2.naver.com/helloworld/6269411"
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

# Spring Cloud Config HA 적용을 위한 커스터마이징

> [!abstract] 한 줄 정리
> 동적 설정이라는 편의 기능이 새로운 단일 장애점이 되지 않도록 Spring Cloud Config의 저장·전파·리프레시 구조를 운영 요구에 맞게 확장한 사례다.

> NAVER D2 · 2025-07-09

## 핵심 내용

Spring Cloud Config는 서비스 프로퍼티를 재배포 없이 변경할 수 있지만 설정 Server나 저장소가 단일 장애 지점이면 설정을 바꾸려다 서비스 전체의 불안정을 만들 수 있다. NAVER는 Config Server를 별도 운영 컴포넌트로 보고 HA와 동적 반영 범위를 함께 검토했다.

```mermaid
flowchart LR
 A[설정 관리자] --> B[MySQL 정본 저장]
 B --> C[Kafka 설정 변경 알림]
 C --> D[복수 Config Server]
 D --> E[Service API 선택적 Bean Refresh]
 E --> F[설정 버전·적용상태 관측]
```

*원문에서 확인한 처리 경계를 가로형으로 자체 재구성한 학습용 도식이다.*

설정 정본은 MySQL에 저장하고 Kafka 기반의 변경 전파 구조를 구성했으며 여러 Config Server 인스턴스가 장애를 분산하도록 했다. Service API는 모든 Bean을 한 번에 다시 구성하는 대신 변경 영향이 명확한 대상만 선택적으로 Refresh한다. 설정은 코드처럼 버전과 승인 이력이 필요하며, 서버가 일시적으로 연결되지 않을 때 시작을 실패시킬지 마지막 정상 설정을 유지할지도 정책으로 정해야 한다.

| 설정 계층 | 책임 | 검증해야 할 실패 |
| --- | --- | --- |
| MySQL | 정본·이력 | 쓰기 중단·오래된 값 |
| Kafka | 변경 통지 | 전달 누락·순서 |
| Config Server | 조회·전달 HA | 인스턴스별 버전 불일치 |
| Service Bean | 필요한 설정 반영 | 과도한 리프레시·중간 상태 |

동적 설정은 편리하지만 DB·Kafka·Config Server·각 애플리케이션 캐시 중 어떤 단계가 실패했는지 관측할 수 있어야 한다. 보안 키처럼 민감한 값은 일반 변경 이벤트에 원문을 싣지 않고 비밀 저장소로 분리해야 하며, 설정 동기화의 성공은 모든 서비스 인스턴스가 같은 버전을 적용했는지 확인할 때 확정된다. 원문에 일률적인 CPU나 비용 Before/After는 제시되지 않았다.

## 왜 읽을까

설정 중앙화가 곧 안정성 향상을 의미하지 않는다는 점을 보여준다. 공통 인프라를 추가할 때 그 구성요소가 새 장애 경계가 되는지, 그리고 장애 시 애플리케이션이 어떤 상태를 유지해야 하는지를 생각하기 좋은 사례다.

**프로젝트에 적용 — PawCycle**

- [ ] 운영 설정 중 정말 런타임 변경이 필요한 값과 배포로 관리해도 되는 값을 먼저 구분한다.
- [ ] 중앙 설정 시스템을 도입한다면 장애 시 기존 설정으로 계속 서비스할 수 있는지 확인한다.
- [ ] 설정 변경이 전체 Bean 재생성이나 예상하지 못한 사이드 이펙트를 만들지 않는지 통합 테스트로 검증한다.

---

**원문:** [Spring Cloud Config HA 적용을 위한 커스터마이징](https://d2.naver.com/helloworld/6269411)
