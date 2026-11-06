---
type: tech-article
title: "Next.js App Router에서 클라이언트 전용 훅의 문제와 팀의 방어 전략"
aliases: []
summary: "작은 프레임워크 API 하나도 공통 레이어에 들어가면 전체 렌더링 전략을 바꾸는 의존성으로 전파될 수 있다. 이런 규칙은 AI 리뷰만 믿기보다 경계 자체를 설계하고 정적 검사와 사람 리뷰를 조합하는 편이 안전하다."
source: "W컨셉 기술 블로그"
published: 2026-04-27
collected: 2026-08-29
url: "https://medium.com/%40wconceptTech/next-js-app-router%EC%97%90%EC%84%9C-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EC%A0%84%EC%9A%A9-%ED%9B%85%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%99%80-%ED%8C%80%EC%9D%98-%EB%B0%A9%EC%96%B4-%EC%A0%84%EB%9E%B5-81e9afad2d7c"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "테스트"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/테스트"
migration_origin: notion
---

# Next.js App Router에서 클라이언트 전용 훅의 문제와 팀의 방어 전략

> [!abstract] 한 줄 정리
> 작은 프레임워크 API 하나도 공통 레이어에 들어가면 전체 렌더링 전략을 바꾸는 의존성으로 전파될 수 있다. 이런 규칙은 AI 리뷰만 믿기보다 경계 자체를 설계하고 정적 검사와 사람 리뷰를 조합하는 편이 안전하다.

> W컨셉 기술 블로그 · 2026-04-27

## 핵심 내용

`useSearchParams` 같은 클라이언트 전용 훅을 공통 훅이 감싸면, 이를 간접 import하는 서버 컴포넌트나 ISR/SSG 경로까지 클라이언트 의존성이 전파될 수 있다. 실제 장애 지점과 원인 파일이 멀리 떨어질 수 있고, 전체 빌드에서만 문제가 드러나기도 한다. 파일 단위 AI 리뷰는 미래의 import 그래프 전체를 보기 어려워 이런 불변식을 놓칠 수 있다.

팀은 우선 가이드 문서와 PR 리뷰 룰을 적용하고, 향후 커스텀 ESLint를 1차 방어선으로 두는 이중화를 검토했다. 예외가 많은 규칙을 성급하게 린트로 고정하면 규칙 자체가 복잡해지는 비용도 고려했다. 현재 라우트의 쿼리를 읽을 필요가 없고 이동 URL만 바꾸는 경우에는 프레임워크 훅 대신 표준 URL API를 사용해 의존성 경계를 낮췄다.

공통 훅의 이름이 안전해 보여도 내부에서 브라우저 전용 API에 의존하면 import 그래프를 따라 서버 렌더링 경계까지 전파될 수 있다. 파일 안에 `'use client'`를 붙이는 처방보다 **이 의존성이 필요한 컴포넌트 범위를 최소화**하는 것이 중요하다. 라우터의 현재 검색 파라미터를 읽지 않고 URL만 만들면 표준 URL API로 충분한 경우가 있다는 예시가 이를 보여 준다.

문서화된 규칙과 정적 분석은 서로 보완적이다. CI에서 항상 지켜야 하는 불변식은 도구로 검증할 가치가 있지만, 예외가 많은 규칙을 성급히 ESLint로 고정하면 오탐 해석과 예외 관리 비용이 더 커질 수 있다.

## 왜 읽을까

공통 코드가 편리하다는 이유만으로 프레임워크 의존성을 위로 끌어올리면 영향 범위가 커진다는 사례다. 무엇을 문서·리뷰로 지키고 무엇을 정적 검사로 강제할지 나누는 기준도 실무적이다.

**프로젝트에 적용 — DevPedia**

- [ ] 공통 Utility·Base 계층이 Spring MVC, Security, JPA 같은 특정 프레임워크 경계를 불필요하게 위로 끌어올리고 있지 않은지 확인한다.
- [ ] 반복해서 발생하는 아키텍처 위반은 문서만 늘리지 말고 ArchUnit·Checkstyle·CI 검증으로 옮길 수 있는지 검토한다.
- [ ] 정적 규칙의 예외가 많다면 무리하게 자동화하지 않고 리뷰 기준으로 남길 이유를 기록한다.

---

**원문:** [Next.js App Router에서 클라이언트 전용 훅의 문제와 팀의 방어 전략](https://medium.com/%40wconceptTech/next-js-app-router%EC%97%90%EC%84%9C-%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EC%A0%84%EC%9A%A9-%ED%9B%85%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%99%80-%ED%8C%80%EC%9D%98-%EB%B0%A9%EC%96%B4-%EC%A0%84%EB%9E%B5-81e9afad2d7c)
