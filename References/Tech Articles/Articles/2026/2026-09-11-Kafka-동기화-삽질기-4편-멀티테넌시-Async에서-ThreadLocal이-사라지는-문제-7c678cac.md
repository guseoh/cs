---
type: tech-article
title: "Kafka 동기화 삽질기 4편: 멀티테넌시 + @Async에서 ThreadLocal이 사라지는 문제"
aliases: []
summary: "동기 코드를 `@Async`나 코루틴으로 바꾸면 비즈니스 로직만 비동기가 되는 것이 아니라 ThreadLocal·MDC·트랜잭션·예외 처리 같은 실행 컨텍스트 경계까지 다시 설계해야 한다는 실전 사례다."
source: "ClOr"
published: 2026-03-29
collected: 2026-09-11
url: "https://clor.tistory.com/41"
topic: "동시성·분산"
categories:
  - "동시성·분산"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/동시성-분산"
  - "tech/장애-운영"
migration_origin: notion
---

# Kafka 동기화 삽질기 4편: 멀티테넌시 + @Async에서 ThreadLocal이 사라지는 문제

> [!abstract] 한 줄 정리
> 동기 코드를 `@Async`나 코루틴으로 바꾸면 비즈니스 로직만 비동기가 되는 것이 아니라 ThreadLocal·MDC·트랜잭션·예외 처리 같은 실행 컨텍스트 경계까지 다시 설계해야 한다는 실전 사례다.

> ClOr · 2026-03-29

## 핵심 내용

- **문제:** Schema-per-Tenant 구조에서 `TenantContext`를 ThreadLocal에 두고 있었는데 `@Async` 적용 직후 새 스레드에서 컨텍스트가 사라져 NPE와 잘못된 스키마 접근이 발생했다. 동기 실행에서는 정상이라 비동기 전환 시에만 드러난 문제였다.
- **접근:** Spring `TaskDecorator`에서 호출 스레드의 tenant ID와 MDC를 캡처해 비동기 스레드에 주입하고, 작업 종료 시 반드시 `clear()`하도록 구성했다. 코루틴은 `CoroutineContext`로 별도 전파하는 방식을 비교했다.
- **주의점:** MDC 역시 ThreadLocal 기반이라 tenant 정보만 복사하면 운영 로그에서 요청·테넌트 추적이 끊긴다. 컨텍스트 전파와 정리는 한 세트로 다뤄야 스레드풀 재사용 과정에서 오염을 막을 수 있다.
- **수치:** 적용 전 `@Async` 실행 시 NPE가 100% 발생했고 잘못된 스키마 접근도 간헐적으로 나타났다. 적용 후 두 문제는 0건이 됐고, 동기화 처리 시간은 순차 120초에서 병렬 35초로 줄었다.
- **결과:** 단순 병렬화보다 중요한 것은 스레드 경계를 넘는 상태를 명시적으로 정의하는 일이었다. 글은 비동기 전환을 컨텍스트·트랜잭션·에러 처리까지 포함한 인프라 레이어 변경으로 정리한다.

## 왜 읽을까

`ThreadLocal`을 알고 있어도 실제 Spring 비동기 실행에서 무엇이 함께 사라지는지 놓치기 쉽다. 성능 개선을 위해 비동기화를 적용했을 때 데이터 경계와 관측 가능성을 동시에 깨뜨릴 수 있다는 점을 작은 코드와 Before/After로 확인할 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 주문·구독 후처리 등을 비동기로 바꿀 때 SecurityContext, MDC, 요청/업무 식별자처럼 스레드 로컬에 의존하는 상태가 있는지 먼저 목록화한다.
- [ ] 컨텍스트 전파가 필요하다면 주입뿐 아니라 작업 종료 후 정리까지 테스트한다.
- [ ] 처리 시간 개선과 함께 잘못된 사용자/업무 컨텍스트 사용, 로그 추적 누락, 예외 전파 여부도 회귀 검증 항목으로 둔다.

---

**원문:** [Kafka 동기화 삽질기 4편: 멀티테넌시 + @Async에서 ThreadLocal이 사라지는 문제](https://clor.tistory.com/41)
