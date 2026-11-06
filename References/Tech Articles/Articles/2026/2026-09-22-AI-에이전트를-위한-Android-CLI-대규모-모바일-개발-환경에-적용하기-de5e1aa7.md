---
type: tech-article
title: "AI 에이전트를 위한 Android CLI: 대규모 모바일 개발 환경에 적용하기"
aliases: []
summary: "대규모 코드베이스에서 AI 에이전트의 성능은 모델만이 아니라 도구의 입출력 계약에 크게 좌우된다. CLI를 얇은 래퍼와 Skill로 감싸 오류·출력·fallback을 결정론적으로 만들면 토큰 낭비와 오작동을 함께 줄일 수 있다."
source: "LY Corporation Tech Blog"
published: 2026-07-30
collected: 2026-09-22
url: "https://techblog.lycorp.co.jp/ko/android-cli-for-ai-agents-at-scale"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
  - "인프라·DevOps"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
  - "tech/인프라-DevOps"
migration_origin: notion
---

# AI 에이전트를 위한 Android CLI: 대규모 모바일 개발 환경에 적용하기

> [!abstract] 한 줄 정리
> 대규모 코드베이스에서 AI 에이전트의 성능은 모델만이 아니라 도구의 입출력 계약에 크게 좌우된다. CLI를 얇은 래퍼와 Skill로 감싸 오류·출력·fallback을 결정론적으로 만들면 토큰 낭비와 오작동을 함께 줄일 수 있다.

> LY Corporation Tech Blog · 2026-07-30

## 핵심 내용

대형 Android 저장소에서 에이전트에게 grep/glob의 수천 줄 결과를 그대로 넘기면 컨텍스트가 채워져 실제 코드 변경에 필요한 정보가 묻힌다. LY는 Android Studio가 가진 의미론적 인덱스와 Android CLI를 사용해 정의·사용처 같은 구조적 질문을 빠르게 해결하는 방식을 선택했다.

CLI 바이너리를 저장소에 버전 고정해 개발자·CI·에이전트의 실행 환경을 맞췄다. CLI를 모델에 직접 노출하지 않고 Wrapper에서 `--no-metrics` 등 조직 정책을 강제하고 오류 형식을 안정화한다. Skill은 사용처 검색의 필요 조건과 실행·Fallback 순서를 알려주며 IDE 인덱스가 준비되지 않았다면 grep/glob 등 텍스트 탐색으로 되돌리는 명시적 규칙을 둔다.

```text
# 대형 저장소에서 에이전트 출력 계약의 개념 예시
Command: semantic-find-usages --symbol UserRepository
stdout: 23 matching files; detailed results at /tmp/usages.txt
Next: 필요한 2개 파일 범위만 다시 읽기
Fallback: Gradle sync 미준비면 제한된 grep/glob
```

*실제 제품의 CLI 옵션과 경로가 아닌 반환 범위를 줄이는 방식을 표현했다.*

| 접근 방식 | 장점 | 한계 |
| --- | --- | --- |
| grep/glob | 인덱스 없이 사용 | 문자열 동명이인·대량 결과 |
| Android CLI semantic index | 심볼 의미 기반 탐색 | IDE Sync 최신성 의존 |
| Wrapper + Skill | 정책·출력 표준화 | 도구 자체의 정확성 보증은 아님 |
| 파일 기반 상세 결과 | 컨텍스트 절약 | 파일 수명·참조 관리 |

사용처 수가 많을 때에는 전체 결과를 stdout에 흘리지 않고 상세 결과는 파일로 저장한 뒤 요약·파일 경로만 반환한다. 에이전트는 필요한 부분만 다시 읽어 토큰과 반복 호출을 줄인다. 하지만 Gradle Sync가 오래된 상태나 이름이 같은 심볼의 충돌은 인덱스의 한계로 남기 때문에 정답이라 주장하기 전에 실제 컴파일·테스트로 검증해야 한다.

## 왜 읽을까

AI 도구를 더 많이 붙이는 것보다 '에이전트가 도구를 어떤 계약으로 사용하게 할 것인가'가 중요하다는 걸 실제 대규모 저장소 사례로 보여준다. Codex나 Claude Code를 프로젝트 자동화에 쓰면서 토큰·재시도·환경 차이를 줄이는 방법을 구체적으로 생각할 수 있다.

**프로젝트에 적용 — DevPedia**

- [ ] Codex가 자주 실행하는 검증·검색 명령의 장황한 출력을 요약하고 상세 결과는 artifact로 분리한다.
- [ ] 도구 실패 시 재시도·fallback·중단 조건을 명시해 무한 반복을 막는다.
- [ ] 개발자 PC와 CI에서 동일한 검증 도구 버전을 쓰도록 프로젝트 단위로 고정할 수 있는지 점검한다.

---

**원문:** [AI 에이전트를 위한 Android CLI: 대규모 모바일 개발 환경에 적용하기](https://techblog.lycorp.co.jp/ko/android-cli-for-ai-agents-at-scale)
