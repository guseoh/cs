---
type: tech-article
title: "Spring Cache(@Cacheable) + Spring Data Redis 사용 시 record 직렬화 오류 원인과 해결"
aliases: []
summary: "Spring Cache와 Redis에서 record가 첫 요청은 정상인데 캐시 히트부터 실패하는 원인을 Jackson의 타입 정보 결정 로직까지 추적해 해결한 런타임 트러블슈팅 사례다."
source: "우아한형제들 기술블로그"
published: 2025-08-19
collected: 2026-09-12
url: "https://techblog.woowahan.com/22767/"
topic: "장애·운영"
categories:
  - "장애·운영"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
migration_origin: notion
---

# Spring Cache(@Cacheable) + Spring Data Redis 사용 시 record 직렬화 오류 원인과 해결

> [!abstract] 한 줄 정리
> Spring Cache와 Redis에서 record가 첫 요청은 정상인데 캐시 히트부터 실패하는 원인을 Jackson의 타입 정보 결정 로직까지 추적해 해결한 런타임 트러블슈팅 사례다.

> 우아한형제들 기술블로그 · 2025-08-19

## 핵심 내용

- **문제:** `record` 반환값을 `@Cacheable`로 Redis에 저장하면 최초 요청은 정상 처리되지만, 두 번째 요청부터 캐시된 JSON을 역직렬화하는 시점에 예외가 발생했다.
- **주의점:** 컴파일 단계에서는 드러나지 않고 캐시 미스인 첫 호출도 정상이라, 실제 캐시 히트 경로를 테스트하지 않으면 코드 리뷰나 일반 테스트에서 놓치기 쉬운 유형의 오류다.
- **원인:** 사용한 `GenericJackson2JsonRedisSerializer`의 타입 정보 추가 로직이 기본적으로 `NON_FINAL` 타입을 대상으로 하는데, Java record는 자동으로 final 클래스가 되므로 타입 메타데이터가 누락됐다.
- **접근:** Jackson의 `DefaultTypeResolverBuilder.useForType()` 동작을 추적한 뒤 기존 정책은 유지하면서 record일 때만 타입 정보를 추가하는 `RecordSupportingTypeResolver`를 구현했다.
- **결과:** 커스텀 TypeResolver 적용 후 캐시 미스와 캐시 히트 모두 같은 record 객체로 정상 직렬화·역직렬화되는 것을 테스트로 확인했다.

## 왜 읽을까

프레임워크 설정 문제를 추측으로 고치는 대신, 실제 serializer와 Jackson 내부의 타입 판정 지점까지 내려가 원인을 좁히는 과정이 좋다. 특히 "첫 요청 성공"이 기능 정상의 증거가 아닐 수 있다는 점을 캐시의 상태 변화와 연결해 볼 수 있다.

Spring의 추상화 뒤에서 어떤 라이브러리가 어떤 규칙으로 객체를 직렬화하는지 이해해야 운영에서만 나타나는 오류를 설명할 수 있다는 점도 배울 만하다.

**프로젝트에 적용 — DevPedia**

- [ ] Redis 캐시를 실제로 도입하게 될 때 DTO를 record로 사용한다면 캐시 미스뿐 아니라 동일 키의 두 번째 호출인 캐시 히트 경로를 반드시 검증한다.
- [ ] serializer 설정을 변경할 때는 Redis에 실제 저장된 JSON과 타입 메타데이터를 함께 확인한다.
- [ ] 캐시 도입 전에는 필요성을 먼저 측정하고, 이 글의 해결책을 선적용하지 않는다.

---

**원문:** [Spring Cache(@Cacheable) + Spring Data Redis 사용 시 record 직렬화 오류 원인과 해결](https://techblog.woowahan.com/22767/)
