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

Schema-per-Tenant 방식에서 현재 테넌트를 `ThreadLocal`에 보관하면 동기 서비스 메서드 안에서는 정상이어도 `@Async`로 스레드가 바뀌는 순간 값이 사라진다. 일부 요청은 NPE로 실패하고 다른 경우에는 잘못된 테넌트의 DB Schema를 선택할 위험도 있다.

Spring `TaskDecorator`는 작업을 스레드풀에 제출하기 전 호출 스레드의 Tenant ID와 MDC를 캡처하고, 실제 워커 스레드가 실행할 때 주입하도록 만든다. 작업이 끝나면 반드시 `finally`에서 TenantContext와 MDC를 clear해야 이전 작업의 ID가 재사용된 스레드에 남지 않는다. 코루틴에서는 ThreadLocal을 무조건 복사하는 대신 별도 `CoroutineContext` 전파 방식과 비교해야 한다.

```java
// TaskDecorator에서 캡처와 정리를 분리한 의사 코드
String tenant = TenantContext.get();
Map<String, String> logContext = MDC.getCopyOfContextMap();
return () -> {
    try {
        TenantContext.set(tenant);
        if (logContext != null) MDC.setContextMap(logContext);
        task.run();
    } finally {
        TenantContext.clear();
        MDC.clear();
    }
};
```

*실제 운영에서는 빈 Context·스레드풀 거절과 트랜잭션 전파를 별도 확인해야 한다.*

| 상태 | @Async 적용 전 | 컨텍스트 전파 후 |
| --- | --- | --- |
| Tenant ID | 호출 스레드에서 유효 | 작업 스레드에 명시 주입 |
| MDC | 워커에서 누락 가능 | 캡처·설정·clear |
| NPE | 비동기에서 100% | 원문 관찰 0건 |
| 동기화 처리 | 120초 순차 | 35초 병렬 |
| 보안 위험 | 스레드풀 간 테넌트 오염 | finally에서 clear 필요 |

원문은 적용 전 비동기 NPE 100%·잘못된 스키마 접근 일부 발생을 보고했고 변경 후 0건이 됐다. 동기화 처리 시간도 순차 120초에서 병렬 35초로 줄었지만 멀티테넌트 격리 테스트를 통과하지 않으면 속도 향상은 오히려 위험을 키운다. `@Async` 도입은 스레드만 늘리는 변경이 아니라 권한·트랜잭션·로깅 경계를 함께 재설계하는 작업이다.

## 왜 읽을까

`ThreadLocal`을 알고 있어도 실제 Spring 비동기 실행에서 무엇이 함께 사라지는지 놓치기 쉽다. 성능 개선을 위해 비동기화를 적용했을 때 데이터 경계와 관측 가능성을 동시에 깨뜨릴 수 있다는 점을 작은 코드와 Before/After로 확인할 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 주문·구독 후처리 등을 비동기로 바꿀 때 SecurityContext, MDC, 요청/업무 식별자처럼 스레드 로컬에 의존하는 상태가 있는지 먼저 목록화한다.
- [ ] 컨텍스트 전파가 필요하다면 주입뿐 아니라 작업 종료 후 정리까지 테스트한다.
- [ ] 처리 시간 개선과 함께 잘못된 사용자/업무 컨텍스트 사용, 로그 추적 누락, 예외 전파 여부도 회귀 검증 항목으로 둔다.

---

**원문:** [Kafka 동기화 삽질기 4편: 멀티테넌시 + @Async에서 ThreadLocal이 사라지는 문제](https://clor.tistory.com/41)
