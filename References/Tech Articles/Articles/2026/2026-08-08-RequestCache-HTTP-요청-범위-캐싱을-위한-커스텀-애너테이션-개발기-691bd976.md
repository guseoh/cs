---
type: tech-article
title: "@RequestCache: HTTP 요청 범위 캐싱을 위한 커스텀 애너테이션 개발기"
aliases: []
summary: "캐시는 범위를 넓힐수록 좋은 것이 아니라 중복이 실제로 발생하는 가장 작은 범위에 적용하는 편이 안전합니다."
source: "d2.naver.com"
published: 
collected: 2026-08-08
url: "https://d2.naver.com/helloworld/7610642"
topic: "성능"
categories:
  - "성능"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
migration_origin: notion
---

# @RequestCache: HTTP 요청 범위 캐싱을 위한 커스텀 애너테이션 개발기

> [!abstract] 한 줄 정리
> 캐시는 범위를 넓힐수록 좋은 것이 아니라 중복이 실제로 발생하는 가장 작은 범위에 적용하는 편이 안전합니다.

> d2.naver.com

## 핵심 내용

하나의 HTTP 요청을 처리하는 동안 같은 외부 API 호출이나 같은 연산이 여러 번 발생하는 문제를 해결하기 위해 `@RequestCache`라는 요청 범위 캐싱 기능을 만든 사례입니다. Redis 같은 전역 캐시를 먼저 도입하지 않고 동일 요청 안에서만 값 재사용이 필요한 문제 범위를 정확히 좁혔습니다.

요청 범위 캐시의 목적은 여러 사용자 사이에 데이터를 공유하는 것이 아니라 **같은 HTTP 요청에서 반복 계산되는 값을 한 번만 획득하는 것**이다. 전역 Redis 캐시를 사용하면 만료·무효화·테넌트 분리 같은 추가 정책을 설계해야 하지만, 요청 처리 시작과 종료를 생명주기로 정하면 공유 범위를 작게 유지할 수 있다. 반대로 같은 사용자라도 다음 요청에서 다시 조회해야 하는 데이터까지 오래 저장해서는 안 된다.

```java
// 개념 설명용 재구성: 동일 요청에서만 결과를 재사용한다는 계약
@RequestCache
public ProductSnapshot loadProduct(String productId) {
    return remoteProductClient.fetch(productId);
}
```

요청 범위를 벗어나 비동기 실행이나 별도 스레드로 넘어갈 때 캐시 컨텍스트가 그대로 전달되는지, 파라미터 조합이 다른 호출을 동일한 키로 잘못 묶지 않는지 확인해야 한다. 도입 전에는 한 요청에서 실제 중복 호출이 얼마나 일어나는지 계측해 이득을 검증하는 것이 순서다.

## 왜 읽을까

캐시 인프라를 기술 선택으로 시작하지 않고 문제의 생명주기와 정합성 범위를 먼저 정의하는 접근이 좋습니다.

---

**원문:** [@RequestCache: HTTP 요청 범위 캐싱을 위한 커스텀 애너테이션 개발기](https://d2.naver.com/helloworld/7610642)
