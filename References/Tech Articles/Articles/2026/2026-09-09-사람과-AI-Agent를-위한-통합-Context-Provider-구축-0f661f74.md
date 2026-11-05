---
type: tech-article
title: "사람과 AI Agent를 위한 통합 Context Provider 구축"
aliases: []
summary: "AI Agent의 품질을 모델이나 프롬프트만으로 해결하기보다, 팀의 데이터와 서빙 자산을 자동으로 모아 필요한 맥락을 공급하는 공통 Context Provider에 투자한 사례다."
source: "NAVER D2"
published: 2026-06-22
collected: 2026-09-09
url: "https://d2.naver.com/helloworld/7056385"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
migration_origin: notion
---

# 사람과 AI Agent를 위한 통합 Context Provider 구축

> [!abstract] 한 줄 정리
> AI Agent의 품질을 모델이나 프롬프트만으로 해결하기보다, 팀의 데이터와 서빙 자산을 자동으로 모아 필요한 맥락을 공급하는 공통 Context Provider에 투자한 사례다.

> NAVER D2 · 2026-06-22

## 핵심 내용

- **문제:** 팀 내부 맥락을 충분히 알지 못하는 Agent는 질문 의도를 제대로 이해하지 못하거나 엉뚱한 답을 내놓을 수 있다. 발표는 이 문제에서 출발해 왜 공통 Context 계층이 필요한지 설명한다.
- **접근:** 팀 데이터와 서빙 계층의 자산을 자동으로 수집하고 AI가 사용할 수 있도록 제공하는 플랫폼을 구축했다.
- **구조:** 발표는 `Agentic Context Platform`과 `Context Provider`를 중심으로, 서로 다른 질문에 필요한 컨텍스트를 어떻게 연결하는지 데모와 함께 설명한다.
- **결과:** 단일 Agent마다 데이터를 따로 연결하는 대신 공통 Context Provider를 통해 사람과 Agent가 같은 팀 자산을 탐색할 수 있는 기반을 만들고, 실제 팀 생산성 경험과 이후 확장 방향을 공유한다.

## 왜 읽을까

AI 기능을 추가할 때 모델 선택이나 프롬프트 작성부터 시작하기 쉽지만, 실제 팀 환경에서는 **정확한 내부 맥락을 어디서 어떻게 공급할지**가 별도의 아키텍처 문제라는 점을 보여준다. Agent별 임시 연결 대신 공통 Context 계층을 둘 가치가 언제 생기는지 생각해보기 좋다.

**프로젝트에 적용 — DevPedia**

- [ ] AI가 참조해야 할 소스를 도메인 규칙, API 계약, DB 스키마, 운영 문서처럼 먼저 구분한다.
- [ ] Agent가 각 소스를 직접 뒤지는 구조와 별도 Context Provider가 필요한 구조를 비교한다.
- [ ] 어떤 정보가 최신이고 신뢰 가능한지 판단할 기준을 Context 계층의 책임으로 둘지 검토한다.

현재 규모에서는 별도 플랫폼을 먼저 만들기보다, AI가 반복해서 같은 프로젝트 맥락을 찾아야 하는 문제가 실제로 생길 때 공통 Context 계층을 후보로 검토하는 정도가 적절하다.

---

**원문:** [사람과 AI Agent를 위한 통합 Context Provider 구축](https://d2.naver.com/helloworld/7056385)
