---
id: PRJ-AGENTLAB
type: project
project: agentlab
status: active
created_at: 2026-11-05
updated_at: 2026-11-05
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://github.com/guseoh/spring-ai-agent
  - https://github.com/guseoh/spring-ai-agent/blob/master/src/main/java/project/agentlab/agent/AgentService.java
  - https://github.com/guseoh/spring-ai-agent/blob/master/build.gradle
depends_on: []
supersedes: []
related_to: [AGT-0001, AGT-0002, AGK-0001, BLR-0002, BLR-0005]
---

# AgentLab — Spring AI and Agent fundamentals

## Current state (as of 2026-11-05)

AI Agent의 일반 동작 원리를 Java/Spring 관점에서 이해하고, Spring AI로 최소 기능을 직접 구현해 모델·백엔드 경계를 확인하는 **학습 전용 프로젝트**다. 실제 Hermes 등 오픈소스 Agent는 배운 원리의 구현 비교 사례로 사용한다. 모델 학습, 자체 Agent Framework 개발, 복잡한 제품·배포 구축은 현재 목적이 아니다.

[원본 저장소](https://github.com/guseoh/spring-ai-agent)의 공개 `master`를 2026-11-05 읽기 검토했다. `AgentService`는 `ChatClient.prompt().user(message).call().content()`를 사용하는 **v0.1 단일 모델 호출** 코드다. 1단계 학습 설명 및 v0.1 구현 보고는 있었지만 이 Wiki 작업은 빌드·API 호출 테스트를 실행하지 않았다. 2단계 `SystemMessage + UserMessage → Prompt` 구현은 현재 **제시된 예제**이며 원격 코드 반영은 확인되지 않았다.

## Accepted decisions

- [AGT-0001](../decisions/AGT-0001.md): 백엔드 통합 중심의 Agent 원리 학습 목적과 13단계 순서 유지.
- [AGT-0002](../decisions/AGT-0002.md): 문제 중심·이론 깊이·단계 경계·최소 실습·근거 자료를 갖춘 강의 방식.
- [BLR-0002](../decisions/BLR-0002.md): Java/Spring 백엔드 기본기를 우선하고 AI·클라우드 전용 심화는 순차적으로 배분.
- [BLR-0005](../decisions/BLR-0005.md): 별도 도메인 설계 프로젝트에서 AI 위임 및 코드 검증을 함께 훈련.

## Constraints

- 학습의 층위는 일반 Agent 원리 / Spring AI API·추상화 / 특정 오픈소스 Agent의 설계 선택으로 구분한다.
- 이번 단계의 핵심 원리는 깊게 다루되 나중 로드맵의 상세 구현을 현재 단계에서 앞당기지 않는다.
- 읽기 좋은 한국어 설명형 문단, 용어 설명, 주제별 한글 기술 자료 및 적절한 실제 이미지/링크를 활용한다.
- AI가 만든 코드·출력의 정확성, 서버 권한·정합성·안정성은 따로 검증한다.

## Open questions and next actions

- 2단계 Prompt & Context의 `v0.2`를 저장소에 반영하고 실제 두 가지 한계(파일 접근 불가, Conversation 부재)를 확인할지 후속 진행.
- 단계별 실습 깊이 차등화, Structured Output·평가 보강은 **제안 상태**이며 로드맵 변경 아님.
- 향후 프로젝트에 AI 기능을 통합하는 시나리오의 세부 도메인·스택은 미확정.

## Evidence and verification limits

- 사용자 확정 학습 방향은 대화 요약을 바탕으로 작성했으나 비공개 메시지 원문은 게시하지 않았다.
- 공개 원본 `master`에서 `build.gradle`의 Spring AI 2.0.0/2.0.1 BOM 중복 선언을 확인했다. 수정이나 실제 Gradle 검증은 하지 않았다.
- 실사용 AI API 호출·모델 응답 품질·런타임 운영 상태는 이번에 확인하지 않았다.
- 개념형 Q&A는 [AGK-0001](../knowledge/AGK-0001.md)에 별도 정리했다.
