---
type: tech-article
title: "Express SPA에서 Next.js 16으로: E2E 테스트 기반 TDD 마이그레이션"
aliases: []
summary: "레거시를 점진적으로 교체할 때 새 구현부터 시작하지 않고 기존 사용자 시나리오를 E2E 테스트로 먼저 고정하면, 무엇이 그대로 동작해야 하는가를 실행 가능한 명세로 만들 수 있다."
source: "스터닝 개발팀 · Medium"
published: 2025-12-05
collected: 2026-09-25
url: "https://medium.com/@team_stunning/express-spa%EC%97%90%EC%84%9C-next-js-16%EC%9C%BC%EB%A1%9C-e2e-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B8%B0%EB%B0%98-tdd-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-0a6a10d8f01a"
topic: "리팩터링"
categories:
  - "리팩터링"
  - "테스트"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/리팩터링"
  - "tech/테스트"
migration_origin: notion
---

# Express SPA에서 Next.js 16으로: E2E 테스트 기반 TDD 마이그레이션

> [!abstract] 한 줄 정리
> 레거시를 점진적으로 교체할 때 새 구현부터 시작하지 않고 기존 사용자 시나리오를 E2E 테스트로 먼저 고정하면, 무엇이 그대로 동작해야 하는가를 실행 가능한 명세로 만들 수 있다.

> 스터닝 개발팀 · Medium · 2025-12-05

## 핵심 내용

- **문제:** Express + React SPA 기반 통합 계정 시스템은 API 라우팅·세션·메타태그 처리 등이 한 서버에 얽혀 유지보수 비용이 커졌지만 여러 서비스가 의존해 Big Bang 재작성은 위험했다.
- **접근:** 점진 전환을 선택하고, V2 코드를 쓰기 전에 로그인·회원가입·비밀번호 찾기·소셜 로그인 등 V1 주요 기능의 E2E 커버리지를 100%로 만들었다.
- **구조:** 기존 Express와 신규 Next.js가 같은 Redis 세션을 읽고 쓰도록 호환성을 유지하고, 초기에는 Next.js rewrites로 기존 API를 호출하면서 단계적으로 V2 API로 옮겼다.
- **결과:** 기존 사용자 시나리오의 회귀 없이 전환했고 V1/V2 세션 호환성을 유지했다. 테스트가 새 구현의 통과 기준이자 실행 가능한 명세 역할을 했다.
- **트레이드오프:** 완전 재작성보다 전환 기간이 길고 두 시스템의 호환 계층을 유지해야 하지만, 장애 위험과 롤백 비용을 낮출 수 있다.

## 왜 읽을까

리팩터링 전에 테스트를 보강하라는 원칙을 실제 인증 시스템 마이그레이션에 적용한 사례다. 구현 세부보다 기존 동작을 먼저 고정하고 작은 단위로 교체하는 순서가 특히 참고할 만하다.

**프로젝트에 적용 — DevPedia**

- [ ] 인증·회원 기능의 현재 API 계약을 통합 테스트로 먼저 고정한다.
- [ ] Security 설정이나 세션 전략을 바꾸기 전에 로그인·로그아웃·/me·권한 실패 시나리오를 회귀 세트로 만든다.
- [ ] 큰 인증 리팩터링은 기존 계약을 유지한 채 내부 구현만 단계적으로 바꾼다.

---

**원문:** [Express SPA에서 Next.js 16으로: E2E 테스트 기반 TDD 마이그레이션](https://medium.com/@team_stunning/express-spa%EC%97%90%EC%84%9C-next-js-16%EC%9C%BC%EB%A1%9C-e2e-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B8%B0%EB%B0%98-tdd-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-0a6a10d8f01a)
