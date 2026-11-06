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

팀마다 자체 AI Agent를 개발하며 코드 저장소·문서·지표·운영 데이터를 개별 연결하면 같은 조직 지식이 반복 구축되고 권한·최신성을 일관되게 설명하기 어렵다. NAVER D2의 Context Provider 발표는 사람과 AI가 동일한 팀 자산을 탐색할 수 있도록 공통 컨텍스트 계층을 만드는 문제를 다룬다.

 ```mermaid
flowchart LR
 A[문서·코드·지표·팀 자산] --> B[Context 수집·정규화]
 B --> C[공통 Context Provider]
 D[사람의 질문] --> C
 E[AI Agent] --> C
 C --> F[출처·권한·최신성 근거]
```

*원문 근거를 바탕으로 자체 재구성한 가로형 학습 도식이다.*

Agentic Context Platform은 여러 팀 데이터와 서빙 계층의 자산을 수집하고, 질문의 의도에 따라 실제 필요한 범위를 찾아 반환하는 Context Provider를 공통 접점으로 둔다. 한 번의 모델 호출에 모든 자료를 넣는 대신 출처와 문서 버전, 자산 소유자·갱신 시각을 함께 전달해야 근거를 좁힐 수 있다. 서로 다른 검색 대상이 같은 지표명을 쓰더라도 도메인 권한과 정본을 구분하는 설계가 필요하다.

| 계층 | 제공할 계약 | 검증해야 할 위험 |
| --- | --- | --- |
| 자산 수집 | 문서·코드·지표 식별자 | 중복·삭제·버전 차이 |
| Context Provider | 질문별 자료 선택 | 무관한 맥락 과다 주입 |
| 권한 | 호출 사용자 범위 | Agent의 권한 확대 방지 |
| 응답 | 출처·갱신 근거 | 오래된 자료를 정본으로 오인 |

이 발표는 공통 Context 제공의 구조와 데모, 조직 활용 경험을 보여주지만 독립적인 생산성 향상률이나 전체 답변 정확도 수치를 제시하지 않는다. Context Provider는 올바른 자료 접근을 돕는 인터페이스이지 누락된 지식과 충돌을 자동으로 해결하는 마법 같은 메모리는 아니다. 중요한 데이터 수정은 조회 컨텍스트 제공과 분리된 승인 경계에서 수행해야 한다.

## 왜 읽을까

AI 기능을 추가할 때 모델 선택이나 프롬프트 작성부터 시작하기 쉽지만, 실제 팀 환경에서는 **정확한 내부 맥락을 어디서 어떻게 공급할지**가 별도의 아키텍처 문제라는 점을 보여준다. Agent별 임시 연결 대신 공통 Context 계층을 둘 가치가 언제 생기는지 생각해보기 좋다.

**프로젝트에 적용 — DevPedia**

- [ ] AI가 참조해야 할 소스를 도메인 규칙, API 계약, DB 스키마, 운영 문서처럼 먼저 구분한다.
- [ ] Agent가 각 소스를 직접 뒤지는 구조와 별도 Context Provider가 필요한 구조를 비교한다.
- [ ] 어떤 정보가 최신이고 신뢰 가능한지 판단할 기준을 Context 계층의 책임으로 둘지 검토한다.

현재 규모에서는 별도 플랫폼을 먼저 만들기보다, AI가 반복해서 같은 프로젝트 맥락을 찾아야 하는 문제가 실제로 생길 때 공통 Context 계층을 후보로 검토하는 정도가 적절하다.

---

**원문:** [사람과 AI Agent를 위한 통합 Context Provider 구축](https://d2.naver.com/helloworld/7056385)
