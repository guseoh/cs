---
type: tech-article
title: "ID-JAG The Hard Way: 실패로 배우는 AI 에이전트 보안 핸즈온"
aliases: []
summary: "AI 에이전트가 사용자를 대신해 도구를 호출하기 시작하면 '누가 누구의 권한으로 무엇을 할 수 있는가'를 토큰과 정책 수준에서 분리해야 합니다."
source: "techblog.lycorp.co.jp"
published: 
collected: 2026-08-01
url: "https://techblog.lycorp.co.jp/ko/id-jag-the-hard-way-learning-ai-agent-authz-through-failure"
topic: "보안"
categories:
  - "보안"
projects:
  - "DevPedia"
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/보안"
migration_origin: notion
---

# ID-JAG The Hard Way: 실패로 배우는 AI 에이전트 보안 핸즈온

> [!abstract] 한 줄 정리
> AI 에이전트가 사용자를 대신해 도구를 호출하기 시작하면 '누가 누구의 권한으로 무엇을 할 수 있는가'를 토큰과 정책 수준에서 분리해야 합니다.

> techblog.lycorp.co.jp

## 핵심 내용

AI 에이전트가 보호된 MCP/API를 호출하는 상황에서 delegated identity, token, authorization policy와 신뢰 관계를 실패 사례 중심으로 다룹니다. 단순 API key 공유가 아니라 사용자의 권한과 에이전트 자체 권한을 구분하고 최소 권한으로 위임하는 구조가 핵심입니다.

AI 에이전트가 사용자의 자격 증명을 대신 갖고 있다는 이유만으로 모든 도구를 호출할 수 있게 하면 **권한 위임의 주체와 목적**을 구분하지 못한다. 사용자가 접근 가능한 자료라도 특정 에이전트·작업에는 필요하지 않을 수 있으며, MCP 서버가 원본 요청자와 도구 실행 권한을 검증하지 않으면 토큰 혼동이나 권한 상승이 가능하다.

| 보안 질문 | 검증해야 할 계약 |
| --- | --- |
| 누가 요청했는가? | 사용자·에이전트의 식별 |
| 어떤 범위를 위임했는가? | Scope·Resource·행위 권한 |
| 누구에게 발급된 토큰인가? | Audience·Issuer·유효 기간 |
| 권한이 변경되면? | 만료·철회·재인증 |
| 도구 실행 기록은? | 호출 주체와 사용 목적 감사 |

실패 시나리오로 정책의 빈틈을 찾는 것이 이 글의 학습 방법이다. 단순 공용 API Key를 여러 에이전트에 복사하는 방식은 사용자의 권한 경계를 표현할 수 없다.

## 왜 읽을까

에이전트 보안을 프롬프트 인젝션 하나로 축약하지 않고 인증·인가 시스템의 문제로 연결해 이해할 수 있습니다.

**프로젝트에 적용**

**DevPedia·PawCycle 공통** — 향후 AI 에이전트가 GitHub나 내부 API를 호출한다면 사용자 세션/서비스 계정/에이전트 권한을 섞지 않고 작업별 최소 권한과 감사 로그를 남기는 기준을 세울 수 있습니다.

---

**원문:** [ID-JAG The Hard Way: 실패로 배우는 AI 에이전트 보안 핸즈온](https://techblog.lycorp.co.jp/ko/id-jag-the-hard-way-learning-ai-agent-authz-through-failure)
