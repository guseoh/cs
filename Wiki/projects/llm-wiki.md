---
id: PRJ-LLM-WIKI
type: project
project: llm-wiki
status: active
created_at: 2026-11-03
updated_at: 2026-11-18
evidence_level: source-verified
sources:
  - https://github.com/guseoh/cs
  - https://github.com/guseoh/cs/pull/10
  - https://github.com/guseoh/cs/actions/runs/44237946734
  - https://github.com/guseoh/cs/actions/runs/41600021909
  - https://github.com/guseoh/cs/pull/19
depends_on: []
supersedes: []
related_to: [WIKI-0001, WIKI-0002]
---

# LLM Wiki 프로젝트 스냅샷

## Current state (as of 2026-11-18)

- Markdown 중심 Wiki와 첫 검증 도구는 [PR #10](https://github.com/guseoh/cs/pull/10)으로 2026-11-03에 `main`에 병합됐다. 병합 커밋은 [014efc5](https://github.com/guseoh/cs/commit/014efc500aae9fca927ffe822beff7d050cbceef)다.
- [수집 워크플로](../../.github/workflows/wiki-intake.yml)는 예약 실행과 수동 실행을 지원한다. 11월 18일 [실행 기록](https://github.com/guseoh/cs/actions/runs/44237946734)은 성공으로 표시되지만 기존 [후보 PR #19](https://github.com/guseoh/cs/pull/19)가 열려 있어 수집·저널 갱신·PR 생성 단계는 건너뛰었다.
- 소유자가 공개 Issue로 전달한 후보는 [handoff 워크플로](../../.github/workflows/wiki-handoff.yml)를 거쳐 리뷰 PR로 들어간다. [11월 3일 실행](https://github.com/guseoh/cs/actions/runs/41600021909)에서 후보 생성과 PR 생성 단계의 성공을 확인했다.
- 기존 검색의 진입점은 [Wiki 인덱스](../index.md)다. 프로젝트 스냅샷, 결정 ID, 관련 근거를 함께 읽는다.

## Accepted decisions

- [WIKI-0001](../decisions/WIKI-0001.md) — Wiki와 Study의 역할을 분리한다.
- [WIKI-0002](../decisions/WIKI-0002.md) — 기존 공개 GitHub Markdown 저장소를 공통 근거로 사용한다.

## Constraints

- 공개 자료에서 확인 가능한 근거와 공개 가능한 요약만 기록한다. 비공개 대화와 인증 정보는 제외한다.
- 후보와 기존 결정은 [검토·승인 절차](../capture-policy.md)를 따른다. 클라이언트 간 공유는 GitHub 접근과 현재 문서 조회가 필요하다.
- Vault의 로컬 적용은 [멀티기기 Git 동기화 규칙](../../.github/OBSIDIAN_SYNC.md)에 따라 개별 확인한다.

## Open questions and next actions

- 후보 PR #19는 2026-11-18 조회 시점에 열려 있었다. 이 통합 작업으로 해당 후보의 검토 및 반영 여부를 다시 판정한다.
- Wiki 도구의 CI, GitHub 병합, 기기별 Vault 반영을 각각 검증한다.

## Evidence and verification limits

- 2026-11-03의 스냅샷은 병합 전 상태를 기록했다. 확인 가능한 현재 근거를 2026-11-18에 대조했으며 [월별 이력](../history/2026-11.md)에 시점을 남겼다.
- 확인 범위는 공개 GitHub의 PR 상태, 실행 단계, 대상 파일과 로컬 검증이다. 비공개 대화 접근이나 운영 런타임을 검증하지 않았다.
