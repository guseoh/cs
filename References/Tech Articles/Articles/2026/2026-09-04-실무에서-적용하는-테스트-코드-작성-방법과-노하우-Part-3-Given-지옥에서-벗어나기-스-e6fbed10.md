---
type: tech-article
title: "실무에서 적용하는 테스트 코드 작성 방법과 노하우 Part 3: Given 지옥에서 벗어나기 - 스노우볼을 굴려라"
aliases: []
summary: "좋은 Fixture는 테스트 데이터를 숨기는 것이 아니라, 테스트의 관심사와 무관한 기본값을 걷어내고 각 테스트에서 중요한 차이만 보이게 만든다."
source: "카카오페이 기술 블로그"
published: 2025-02-26
collected: 2026-09-04
url: "https://tech.kakaopay.com/post/given-test-code-2/"
topic: "테스트"
categories:
  - "테스트"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/테스트"
migration_origin: notion
---

# 실무에서 적용하는 테스트 코드 작성 방법과 노하우 Part 3: Given 지옥에서 벗어나기 - 스노우볼을 굴려라

> [!abstract] 한 줄 정리
> 좋은 Fixture는 테스트 데이터를 숨기는 것이 아니라, 테스트의 관심사와 무관한 기본값을 걷어내고 각 테스트에서 중요한 차이만 보이게 만든다.

> 카카오페이 기술 블로그 · 2025-02-26

## 핵심 내용

필드가 많은 객체를 매 테스트마다 직접 만들면 Given 절이 본래 검증하려는 행동보다 길어지고, 필드 하나 추가될 때 수많은 테스트가 함께 깨진다. Gradle 멀티모듈에서는 한 모듈의 `src/test` 헬퍼를 다른 모듈이 바로 재사용할 수 없어 Fixture 코드가 여러 모듈로 복제되기 쉽다.

`DomainFixture`에 현실적인 기본값을 두고 테스트가 실제로 관심 있는 값만 override하도록 만들며, 외부 요청 객체는 `DomainIoFixture`로 기존 도메인 객체를 재사용해 중복 필드 셋업을 줄인다. Gradle `java-test-fixtures`와 `src/testFixtures`를 사용해 테스트 전용 객체 생성 코드와 Mock 지원 코드를 모듈 사이에서 공유한다.

Fixture가 편하다는 이유로 모든 값을 숨기면 테스트 의도가 다시 흐려질 수 있으므로, 해당 시나리오에서 의미 있는 값은 테스트 본문에 명시적으로 남기는 것이 중요하다.

Fixture가 의미 있는 이유는 테스트 객체를 만드는 **과정**과 테스트가 검증하려는 **조건**을 분리하기 때문이다. 기본값은 공통 정책으로 공유하되 결과를 좌우하는 값은 테스트 본문에서 override해야, 실패했을 때 원인을 코드 한 화면에서 찾을 수 있다.

```java
// 개념 설명용 재구성: 실제 검증 조건만 드러내는 Fixture 사용
Order order = OrderFixture.validOrder()
    .withQuantity(0)
    .build();
// 이후 수량 0에 대한 도메인 검증을 테스트
```

`src/testFixtures`는 테스트 도우미의 배포·재사용 경계다. 도메인 프로덕션 코드에 테스트 생성 로직을 섞지 않고 다른 Gradle 모듈이 테스트 전용 의존성으로 참조하게 한다.

## 왜 읽을까

테스트 개수를 늘리는 것보다 테스트를 작성하고 수정하는 비용을 낮추는 일이 왜 중요한지 보여준다. 특히 규모가 커질수록 Fixture 자체가 하나의 테스트 설계 자산이 된다는 관점을 얻을 수 있다.

**프로젝트에 적용 — DevPedia**

- [ ] Codex가 생성한 테스트에서 Given 절이 지나치게 길어지는 도메인을 찾아 공통 Fixture 후보를 분리한다.
- [ ] 기본값으로 감춰도 되는 필드와 각 시나리오에서 반드시 드러나야 하는 값을 구분한다.
- [ ] 여러 모듈에서 같은 테스트 데이터 생성기가 복제되기 시작할 때만 `testFixtures` 같은 공유 구조를 도입한다.

---

**원문:** [실무에서 적용하는 테스트 코드 작성 방법과 노하우 Part 3: Given 지옥에서 벗어나기 - 스노우볼을 굴려라](https://tech.kakaopay.com/post/given-test-code-2/)
