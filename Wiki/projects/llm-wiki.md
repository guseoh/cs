---
id: PRJ-LLM-WIKI
type: project
project: llm-wiki
status: active
created_at: 2026-11-03
updated_at: 2026-11-24
evidence_level: source-verified
sources:
  - https://github.com/guseoh/cs
  - https://github.com/guseoh/cs/pull/10
  - https://github.com/guseoh/cs/actions/runs/44237946734
  - https://github.com/guseoh/cs/actions/runs/41600021909
  - https://github.com/guseoh/cs/pull/19
depends_on: []
supersedes: []
related_to: [WIKI-0001, WIKI-0002, WIKI-0004, WIKI-0005]
---

# LLM Wiki 프로젝트 스냅샷

## 현재 상태 (2026-11-24)

- Markdown 중심 Wiki와 첫 검증 도구는 [PR #10](https://github.com/guseoh/cs/pull/10)으로 2026-11-03에 `main`에 병합됐다. 병합 커밋은 [014efc5](https://github.com/guseoh/cs/commit/014efc500aae9fca927ffe822beff7d050cbceef)다.
- [수집 워크플로](../../.github/workflows/wiki-intake.yml)는 예약 실행과 수동 실행을 지원한다. 11월 18일 [실행 기록](https://github.com/guseoh/cs/actions/runs/44237946734)은 성공으로 표시되지만 기존 [후보 PR #19](https://github.com/guseoh/cs/pull/19)가 열려 있어 수집·저널 갱신·PR 생성 단계는 건너뛰었다.
- 소유자가 공개 Issue로 전달한 후보는 [handoff 워크플로](../../.github/workflows/wiki-handoff.yml)를 거쳐 리뷰 PR로 들어간다. [11월 3일 실행](https://github.com/guseoh/cs/actions/runs/41600021909)에서 후보 생성과 PR 생성 단계의 성공을 확인했다.
- 기존 검색의 진입점은 [Wiki 인덱스](../index.md)다. 프로젝트 스냅샷, 결정 ID, 관련 근거를 함께 읽는다.

## 확정된 결정

- [WIKI-0001](../decisions/WIKI-0001.md) — Wiki와 Study의 역할을 분리한다.
- [WIKI-0002](../decisions/WIKI-0002.md) — 기존 공개 GitHub Markdown 저장소를 공통 근거로 사용한다.

## 제약 조건

- 공개 자료에서 확인 가능한 근거와 공개 가능한 요약만 기록한다. 비공개 대화와 인증 정보는 제외한다.
- 후보와 기존 결정은 [검토·승인 절차](../capture-policy.md)를 따른다. 클라이언트 간 공유는 GitHub 접근과 현재 문서 조회가 필요하다.
- Vault의 로컬 적용은 [멀티기기 Git 동기화 규칙](../../.github/OBSIDIAN_SYNC.md)에 따라 개별 확인한다.

## 미해결 질문과 다음 작업

- 후보 PR #19는 종료되었으며 미병합 상태임을 2026-11-24 확인했다. 과거 후보의 실제 반영은 별개로 취급한다.
- Wiki 도구의 CI, GitHub 병합, 기기별 Vault 반영을 각각 검증한다.

## 근거와 검증 범위

- 2026-11-03의 스냅샷은 병합 전 상태를 기록했다. 확인 가능한 현재 근거를 2026-11-18에 대조했으며 [월별 이력](../history/2026-11.md)에 시점을 남겼다.
- 확인 범위는 공개 GitHub의 PR 상태, 실행 단계, 대상 파일과 로컬 검증이다. 비공개 대화 접근이나 운영 런타임을 검증하지 않았다.

## 2026-11-24 Wiki PR 브랜치 수명주기

- [WIKI-0004](../decisions/WIKI-0004.md): 승인된 Wiki PR 병합 후 안전한 일회성 원격 브랜치 삭제 및 재확인을 완료 기준으로 확정했다. 최초 조회 당시 자동 head 브랜치 삭제 설정은 꺼져 있었다. 후속 조회에서 자동 head 삭제 활성화, 원격 main 단독 유지, 열린 PR 0개를 확인했다. 이 상태는 V2 작업 시작 전 스냅샷이며 로컬 동기화는 별도다.

- [WIKI-0005](../decisions/WIKI-0005.md): 공통 규칙과 프로젝트 정책 분리, main 중심 수명주기, 누락 방지 및 생성 후 검증으로 V2 개선을 진행한다. 구현·CI·병합·브랜치 정리는 PR 근거에서 각각 확인한다.
