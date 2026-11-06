---
type: tech-article
title: "R2DBC Connection Pool 실종 사건"
aliases: []
summary: "`initialSize`를 설정했다고 애플리케이션 시작 시 실제 DB 커넥션이 만들어지는 것은 아니다. R2DBC와 reactor-pool 내부 코드를 따라가며 자원 생성 시점을 확인하고, 필요하면 명시적 warmup으로 시작 시점의 준비 상태를 보장해야 한다."
source: "카카오페이 기술 블로그"
published: 2024-06-11
collected: 2026-09-02
url: "https://tech.kakaopay.com/post/r2dbc-connection-pool-missing/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/장애-운영"
migration_origin: notion
---

# R2DBC Connection Pool 실종 사건

> [!abstract] 한 줄 정리
> `initialSize`를 설정했다고 애플리케이션 시작 시 실제 DB 커넥션이 만들어지는 것은 아니다. R2DBC와 reactor-pool 내부 코드를 따라가며 자원 생성 시점을 확인하고, 필요하면 명시적 warmup으로 시작 시점의 준비 상태를 보장해야 한다.

> 카카오페이 기술 블로그 · 2024-06-11

## 핵심 내용

IntelliJ에서 실행할 때는 시작 직후 커넥션이 생성되는 것처럼 보였지만 Gradle로 만든 JAR과 개발 환경에서는 애플리케이션 시작 시 커넥션 풀이 초기화되지 않았다. `initialSize`는 `SimpleDequePool`의 크기 정책을 설정할 뿐 `buildPool()` 생성 시점에 실제 커넥션을 즉시 만드는 코드가 아니다. 필요한 자원은 reactive pool의 acquire 흐름에서 비동기적으로 할당된다.

r2dbc-pool과 reactor-pool 구현을 직접 추적해 생성 시점을 확인했고, r2dbc-pool이 제공하는 `warmup()`을 명시적으로 호출해 최소 커넥션을 애플리케이션 시작 전에 확보했다. IntelliJ의 Actuator HealthCheck 통합 동작이 DB 연결을 먼저 발생시켜 실제 런타임 동작을 가릴 수 있었다. IDE 실행 결과보다 실제 빌드 산출물과 배포 환경을 기준으로 검증해야 한다.

Reactive Pool은 생성자 호출과 실제 커넥션 확보가 같은 시점에 일어나지 않는다는 점을 먼저 이해해야 한다. `initialSize` 설정은 확보할 규모의 의도를 나타내지만, 비동기 자원을 **구독·요청**하지 않으면 DB 연결이 아직 만들어지지 않을 수 있다. IDE의 상태 확인 도구가 연결을 먼저 열어 테스트 결과가 달라졌다면 그것은 배포 환경의 준비 완료를 증명하지 못한다.

확인할 순서는 프로세스 기동, 첫 acquire 시점, warmup 호출 완료, 첫 실제 요청 지연이다. Warmup을 통해 시작 단계에서 필요한 연결을 확보하더라도 DB 장애나 네트워크 단절에 대한 요청 단계의 오류 처리는 여전히 필요하다.

## 왜 읽을까

설정 이름만 보고 프레임워크의 동작을 추측하면 위험하다는 사례다. `initialSize`라는 이름에서 기대한 의미와 실제 구현이 달랐고, 문제를 해결하려면 Spring 설정이 아니라 **r2dbc-pool → reactor-pool 구현까지 내려가야 했다.**

또 개발 도구의 편의 기능이 문제를 숨길 수도 있다는 점 때문에, 시작 준비 상태와 Health Check를 설계할 때도 참고할 가치가 높다.

**프로젝트에 적용 — PawCycle**

- [ ] 로컬 IDE가 아니라 실제 JAR·Docker 이미지로 애플리케이션 시작 시 DB 커넥션 생성과 readiness 시점을 확인한다.
- [ ] HikariCP 또는 향후 Reactive DB 풀 설정에서 설정 이름만 믿지 말고 실제 초기화 시점과 실패 동작을 측정한다.
- [ ] 외부 의존성이 준비되지 않았을 때 Health Check가 어떤 상태를 반환해야 하는지 운영 기준을 명확히 한다.

---

**원문:** [R2DBC Connection Pool 실종 사건](https://tech.kakaopay.com/post/r2dbc-connection-pool-missing/)
