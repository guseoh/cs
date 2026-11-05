---
type: tech-article
title: "에이전트, 개념부터 같이 정리해봐요 - 워크플로우 · 하네스 · Context/Memory · MCP/A2A"
aliases: []
summary: "에이전트·워크플로우·하네스·Context/Memory·MCP/A2A처럼 자주 섞여 쓰이는 개념을 원문 스펙과 실제 구현을 기준으로 다시 구분한다. AI 도구를 많이 붙이는 것보다 각 구성요소가 맡는 책임과 경계를 먼저 합의하는 데 도움이 된다."
source: "NAVER D2"
published: 2026-09-30
collected: 2026-10-07
url: "https://d2.naver.com/helloworld/8118359"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
migration_origin: notion
---

# 에이전트, 개념부터 같이 정리해봐요 - 워크플로우 · 하네스 · Context/Memory · MCP/A2A

> [!abstract] 한 줄 정리
> 에이전트·워크플로우·하네스·Context/Memory·MCP/A2A처럼 자주 섞여 쓰이는 개념을 원문 스펙과 실제 구현을 기준으로 다시 구분한다. AI 도구를 많이 붙이는 것보다 각 구성요소가 맡는 책임과 경계를 먼저 합의하는 데 도움이 된다.

> NAVER D2 · 2026-09-30

## 핵심 내용

- **문제:** 에이전트 개발에서는 같은 용어를 팀원마다 다른 뜻으로 사용해 설계 논의가 쉽게 엇갈린다. 특히 Agent와 Workflow, Context와 Memory, MCP와 A2A의 경계가 자주 섞인다.
- **접근:** Anthropic·OpenAI 및 MCP/A2A 스펙 같은 원문과 실제 구현을 다시 확인해 개념을 역할 기준으로 정리한다.
- **구조:** 모델의 추론 자체와 그 모델을 둘러싼 실행 하네스, 한 번의 실행에 주입되는 Context와 세션을 넘어 유지되는 Memory, 도구 연결과 에이전트 간 통신을 서로 다른 책임으로 바라보는 관점이 핵심이다.
- **주의점:** 새 프로토콜이나 에이전트 용어를 붙였다고 기존 REST/API 설계 원칙이 사라지는 것은 아니다. 무엇을 연결하고 어떤 계약을 표준화하려는지부터 구분해야 한다.

## 왜 읽을까

AI 에이전트를 실제 개발 워크플로에 쓰기 시작하면 제품 이름보다 개념 경계가 중요해진다. 특히 Codex 같은 코딩 에이전트를 여러 도구와 연결할 때 “Context를 더 넣자”와 “지속 Memory가 필요하다”, “MCP가 필요하다”는 전혀 다른 설계 결정임을 구분하는 기준점으로 쓰기 좋다.

**프로젝트에 적용 — 공통**

- [ ] Codex 작업 지침, 프로젝트 문서, 일회성 작업 Context를 같은 저장소에 무작정 섞지 않고 수명과 책임별로 분리한다.
- [ ] 외부 도구 연동은 MCP 도입 자체를 목표로 하지 않고 기존 CLI/API 대비 어떤 계약과 발견 가능성을 얻는지 먼저 적는다.
- [ ] 에이전트가 여러 단계 작업을 수행할 때 결정론적 Workflow와 모델 판단이 필요한 Agent 구간을 구분한다.

---

**원문:** [에이전트, 개념부터 같이 정리해봐요 - 워크플로우 · 하네스 · Context/Memory · MCP/A2A](https://d2.naver.com/helloworld/8118359)
