---
type: tech-article
title: "Hexagonal Architecture, 진짜 하실 건가요?"
aliases: []
summary: "아키텍처는 도메인을 보호할 때 가치가 있다. 외부 API 계약이 이미 변경을 흡수하는 서비스에서는 과도한 Port·Adapter·멀티모듈이 오히려 변경 비용을 키울 수 있다."
source: "카카오페이 기술 블로그"
published: 2025-01-21
collected: 2026-10-10
url: "https://tech.kakaopay.com/post/home-hexagonal-architecture/"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "리팩터링"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/리팩터링"
migration_origin: notion
---

# Hexagonal Architecture, 진짜 하실 건가요?

> [!abstract] 한 줄 정리
> 아키텍처는 도메인을 보호할 때 가치가 있다. 외부 API 계약이 이미 변경을 흡수하는 서비스에서는 과도한 Port·Adapter·멀티모듈이 오히려 변경 비용을 키울 수 있다.

> 카카오페이 기술 블로그 · 2025-01-21

## 핵심 내용

- **문제:** 카카오페이 홈 서버는 24개 연동 서버를 연결하고 사용자 홈을 구성하기 위해 평균 약 50회의 API 호출을 수행한다. 연동 응답의 변경이 홈 화면까지 전파되는 문제를 겪었다.
- **접근:** 연동 팀과 표준 API 인터페이스를 합의하는 동시에, out Port·Adapter와 멀티모듈을 갖춘 Hexagonal Architecture로 외부 변경을 격리했다.
- **트레이드오프:** 표준 연동 계약이 이미 변경을 흡수하면서 Port의 보호 효과가 작아졌다. 독립된 핵심 도메인도 모호해 40개가 넘는 out Port와 DTO 변환을 수정하는 부담이 커졌다.
- **결과:** 관심사별 패키징을 적용하고 단일 모듈로 돌아갔으며, PR 기준 8,000줄 이상의 코드를 줄였다. 단, Controller와 외부 API의 DTO 분리는 유지해 외부 변경의 전파를 막았다.

## 왜 읽을까

Hexagonal Architecture를 적용할지 결정할 때, '패턴을 구현할 수 있는가'가 아니라 '보호할 코어가 명확한가, 외부 계약이 이미 충분한가, 변경 비용이 줄어드는가'를 먼저 묻게 하는 실전 사례다. 설계의 일부 원칙은 남기고 과도한 구조만 제거한 점도 중요하다.

**프로젝트에 적용 — DevPedia**

- [ ] 모집글·지원서처럼 규칙이 풍부한 도메인과 단순 외부 응답 조합 기능을 구분한다.
- [ ] Port/Adapter를 추가하기 전에 실제로 변경 가능성이 높은 외부 의존성과 테스트 대체 필요성을 적는다.
- [ ] 불필요한 DTO 매핑은 줄이되 외부 API DTO와 사용자에게 노출하는 응답 DTO의 경계는 유지한다.

---

**원문:** [Hexagonal Architecture, 진짜 하실 건가요?](https://tech.kakaopay.com/post/home-hexagonal-architecture/)
