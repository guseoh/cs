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

- **문제:** 배포 없이 프로퍼티를 바꿀 수 있는 Spring Cloud Config는 편리하지만 Config Server 자체가 SPOF가 되면 서비스 안정성을 해칠 수 있다.
- **접근:** 기본 Spring Cloud Config 구조를 그대로 사용하는 데서 멈추지 않고 운영 환경에 맞는 고가용성 구성을 검토하고 커스터마이징했다.
- **구조:** 설정 저장소로 MySQL을 사용하고 Kafka 기반 이중화를 적용하며, Service API에서는 필요한 빈만 선택적으로 리프레시하는 구성을 다룬다.
- **주의점:** 동적 설정 변경은 편리함만 볼 것이 아니라 설정 저장소·전파 경로·리프레시 대상이 실패했을 때 서비스에 미치는 영향까지 함께 봐야 한다.

## 왜 읽을까

설정 중앙화가 곧 안정성 향상을 의미하지 않는다는 점을 보여준다. 공통 인프라를 추가할 때 그 구성요소가 새 장애 경계가 되는지, 그리고 장애 시 애플리케이션이 어떤 상태를 유지해야 하는지를 생각하기 좋은 사례다.

**프로젝트에 적용 — PawCycle**

- [ ] 운영 설정 중 정말 런타임 변경이 필요한 값과 배포로 관리해도 되는 값을 먼저 구분한다.
- [ ] 중앙 설정 시스템을 도입한다면 장애 시 기존 설정으로 계속 서비스할 수 있는지 확인한다.
- [ ] 설정 변경이 전체 Bean 재생성이나 예상하지 못한 사이드 이펙트를 만들지 않는지 통합 테스트로 검증한다.

---

**원문:** [Spring Cloud Config HA 적용을 위한 커스터마이징](https://d2.naver.com/helloworld/6269411)
