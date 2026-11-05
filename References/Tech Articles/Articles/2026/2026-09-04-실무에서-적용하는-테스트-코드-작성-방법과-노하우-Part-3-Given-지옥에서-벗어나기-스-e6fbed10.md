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

- **문제:** 필드가 많은 객체를 매 테스트마다 직접 만들면 Given 절이 본래 검증하려는 행동보다 길어지고, 필드 하나 추가될 때 수많은 테스트가 함께 깨진다.
- **문제:** Gradle 멀티모듈에서는 한 모듈의 `src/test` 헬퍼를 다른 모듈이 바로 재사용할 수 없어 Fixture 코드가 여러 모듈로 복제되기 쉽다.
- **접근:** `DomainFixture`에 현실적인 기본값을 두고 테스트가 실제로 관심 있는 값만 override하도록 만들며, 외부 요청 객체는 `DomainIoFixture`로 기존 도메인 객체를 재사용해 중복 필드 셋업을 줄인다.
- **구조:** Gradle `java-test-fixtures`와 `src/testFixtures`를 사용해 테스트 전용 객체 생성 코드와 Mock 지원 코드를 모듈 사이에서 공유한다.
- **트레이드오프:** Fixture가 편하다는 이유로 모든 값을 숨기면 테스트 의도가 다시 흐려질 수 있으므로, 해당 시나리오에서 의미 있는 값은 테스트 본문에 명시적으로 남기는 것이 중요하다.

## 왜 읽을까

테스트 개수를 늘리는 것보다 테스트를 작성하고 수정하는 비용을 낮추는 일이 왜 중요한지 보여준다. 특히 규모가 커질수록 Fixture 자체가 하나의 테스트 설계 자산이 된다는 관점을 얻을 수 있다.

**프로젝트에 적용 — DevPedia**

- [ ] Codex가 생성한 테스트에서 Given 절이 지나치게 길어지는 도메인을 찾아 공통 Fixture 후보를 분리한다.
- [ ] 기본값으로 감춰도 되는 필드와 각 시나리오에서 반드시 드러나야 하는 값을 구분한다.
- [ ] 여러 모듈에서 같은 테스트 데이터 생성기가 복제되기 시작할 때만 `testFixtures` 같은 공유 구조를 도입한다.

---

**원문:** [실무에서 적용하는 테스트 코드 작성 방법과 노하우 Part 3: Given 지옥에서 벗어나기 - 스노우볼을 굴려라](https://tech.kakaopay.com/post/given-test-code-2/)
