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

`@Cacheable`이 반환하는 Java record를 Redis에 저장할 때 첫 요청은 정상이고 두 번째 요청에서만 역직렬화 오류가 발생할 수 있다. 최초 요청은 캐시 미스라 실제 메서드를 실행하지만 다음 요청은 JSON을 역직렬화해야 하므로 오류 경로가 달라지기 때문이다.

우아한형제들은 GenericJackson2JsonRedisSerializer가 타입 정보를 추가하는 Jackson DefaultTypeResolverBuilder의 조건을 추적했다. 기본 `NON_FINAL` 정책은 record가 암묵적으로 `final` 클래스라는 점 때문에 대상에서 빠질 수 있고, 저장된 JSON에 타입 메타데이터가 없어 객체의 구체적인 형식을 복원하지 못했다. 기존 직렬화 정책을 모두 바꾸는 대신 record 클래스만 처리하도록 `RecordSupportingTypeResolver`를 확장했다.

```java
// 타입 정책의 예외 규칙을 표현한 학습용 의사 코드
boolean useForType(JavaType type) {
    return type.getRawClass().isRecord() || existingPolicy(type);
}
```

*실제 Jackson 오버라이드 API의 완성본이 아니며 기존 정책에 record를 포함하는 핵심 아이디어만 보여준다.*

| 호출 단계 | 처리 내용 | 오류 발견 여부 |
| --- | --- | --- |
| 최초 Cache Miss | 서비스 메서드 실행→직렬화 | 정상처럼 보일 수 있음 |
| 다음 Cache Hit | 저장된 JSON 역직렬화 | 타입 메타데이터 누락 오류 |
| 타입 정책 수정 | Record 타입 포함 | 양방향 동등성 검증 |
| 배포 전환 | 기존 캐시와 신규 포맷 | 하위 호환/만료 정책 |

수정 후에는 같은 record를 캐시 미스와 캐시 히트 양쪽에서 반복 조회해 정확한 타입과 필드가 복원되는지 테스트했다. 한 번 저장할 때 정상이라는 사실은 캐시 경로의 회귀 검증을 대체하지 못하며 구버전 캐시의 역직렬화 호환성·TTL 만료 시점도 배포 전략에 포함해야 한다.

## 왜 읽을까

프레임워크 설정 문제를 추측으로 고치는 대신, 실제 serializer와 Jackson 내부의 타입 판정 지점까지 내려가 원인을 좁히는 과정이 좋다. 특히 "첫 요청 성공"이 기능 정상의 증거가 아닐 수 있다는 점을 캐시의 상태 변화와 연결해 볼 수 있다.

Spring의 추상화 뒤에서 어떤 라이브러리가 어떤 규칙으로 객체를 직렬화하는지 이해해야 운영에서만 나타나는 오류를 설명할 수 있다는 점도 배울 만하다.

**프로젝트에 적용 — DevPedia**

- [ ] Redis 캐시를 실제로 도입하게 될 때 DTO를 record로 사용한다면 캐시 미스뿐 아니라 동일 키의 두 번째 호출인 캐시 히트 경로를 반드시 검증한다.
- [ ] serializer 설정을 변경할 때는 Redis에 실제 저장된 JSON과 타입 메타데이터를 함께 확인한다.
- [ ] 캐시 도입 전에는 필요성을 먼저 측정하고, 이 글의 해결책을 선적용하지 않는다.

---

**원문:** [Spring Cache(@Cacheable) + Spring Data Redis 사용 시 record 직렬화 오류 원인과 해결](https://techblog.woowahan.com/22767/)
