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

## 왜 읽을까

캐시 인프라를 기술 선택으로 시작하지 않고 문제의 생명주기와 정합성 범위를 먼저 정의하는 접근이 좋습니다.

---

**원문:** [@RequestCache: HTTP 요청 범위 캐싱을 위한 커스텀 애너테이션 개발기](https://d2.naver.com/helloworld/7610642)
