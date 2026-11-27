---
id: PRJ-HERMIT
type: project
project: shared
status: active
created_at: 2026-11-27
updated_at: 2026-11-27
evidence_level: source-verified
capture_mode: manual
sources:
  - https://github.com/guseoh/hermit
  - https://github.com/guseoh/hermit/commit/dc07cb3
  - https://github.com/guseoh/hermit/commit/b12629b
  - https://github.com/guseoh/hermit/blob/b12629b/docs/design/hermit-master-plan.md
depends_on: []
supersedes: []
related_to: [PRJ-DEVELOPMENT-TOOLING, SHD-0001, SHK-0003]
---

# Hermit (Windows 에이전트 IDE)

## 현재 상태 (2026-11-27)

- **저장소 및 기준 버전:** 공개 저장소 [guseoh/hermit](https://github.com/guseoh/hermit) 기준 커밋 `dc07cb3`(배포본 v0.1.7, `package.json` 로컬 버전 표기는 `0.1.2`이며 CI에서 동적 계산)의 전체 코드를 심층 검토하고, 개선·확장 마스터 플랜을 [docs/design/hermit-master-plan.md](https://github.com/guseoh/hermit/blob/b12629b/docs/design/hermit-master-plan.md)(커밋 `b12629b`)로 `main`에 반영했다.
- **확인된 구현 범위:** Electron 45 기반 프레임워크·번들러 없는 바닐라 구조(`node-pty`, `@xterm/xterm` 6, `electron-updater`, 지연 로드 TipTap 3) 위에 공용 Codex App Server 멀티플렉싱(`codex-host.cjs`), 지속 Claude Code stream-json 세션(`claude.cjs`), Named Pipe TUI 훅(`agent-hooks.cjs`), Git worktree 격리·임시 인덱스 기반 체크포인트(`checkpoints.cjs`), PowerShell 5.1 OSC 777 명령 결과 구조화(`prompt.ps1`), 통합 WorkArea 탭/분할(`panels.js`), Orca 기반 단색 디자인 시스템(`styles.css`)이 구현되어 있다.
- **미구현·제안 상태:** [SHK-0003](../knowledge/SHK-0003.md) 및 `docs/design/hermit-master-plan.md`에 정리된 Stage A~D 개선안(버그 수정, 10대 UI/UX 마찰 해소, 점진적 ES 모듈 분리, 파일 탐색기·경량 코드 탭, Google Antigravity `agy` 3번째 프로바이더 연동 등)은 **설계·제안 단계**이며 코드 구현·테스트·런타임 검증은 아직 수행하지 않았다.

## 확정된 결정

- 현재까지 `guseoh/hermit`의 개별 구현 범위나 Stage 착수 순서를 확정하는 독립 Decision은 아직 등록하지 않았다.
- 공통 개발 환경 도구의 기존 결정은 [SHD-0001](../decisions/SHD-0001.md)을 유지한다.
- 마스터 플랜 작성 과정에서 사용자와 **점진적 모듈 분리(수정·신규 도메인부터 번들러 없는 ES Modules + 경량 Store로 분리)** 방향과 **타 에이전트 IDE(Orca, T3 Code, Conductor, Codex App, Claude Code Desktop, Google Antigravity) 패턴의 선별 반영** 원칙에 합의했다([SHK-0003](../knowledge/SHK-0003.md)).

## 제약 조건

- **Windows PowerShell 5.1 · 초경량 메모리 · 로컬 BYOS CLI 원칙:** 클라우드 VM·SSH 원격 호스트·모바일 앱·Slack 봇·Monaco 에디터·다국어 i18n·플러그인 마켓 등은 범위 밖으로 제외한다.
- **패키징 및 데이터 호환:** `node-pty`와 `.ps1` 스크립트 제약으로 `asar: false`를 사용하며, 앱 데이터 경로(`%APPDATA%\powershell-workbench`)와 `appId`는 기존 설치본 호환을 위해 유지한다.
- **즉시 정비 필요한 코드 결함(소스 확인):** 공용 Codex 세션에서 `turn/completed` 시 타 스레드 대기 승인이 초기화되는 버그(`agent.cjs:176-180`), `changes.cjs:588`의 실제 `0x00` NUL 바이트, Claude 프로세스 트리 미정리(`claude.cjs`), Claude TUI 복귀 시 대화 미동기화, 체크포인트 되돌리기 취소 중 턴 시작 경합, 매초 `localStorage` 전체 직렬화(`renderer.js:26-35`), 3,757줄 단일 전역 `workspace.js` 구조가 확인되었다.

## 미해결 질문과 다음 작업

- **Q1 (터미널 모델 통합):** 작업 하단 접이식 터미널(또는 에디터 분할 탭) 1원화 + 플로팅 단축키 보조 유지 vs 2트랙 유지(중복 버튼 3곳 정리).
- **Q2 (Worktree 환경 자동화):** `.worktreeinclude` 파일 복사 + Windows 디렉터리 정션(`node_modules`) 선택 공유 도입 여부.
- **Q3 (경량 코드 뷰어/편집기):** CodeMirror 6 지연 로드 도입 vs 외부 에디터 연동 + 내부 읽기 전용 뷰어 유지.
- **Q4 (착수 우선순위):** Stage A(치명 버그·성능·즉시 체감 UX) 선행 여부.
- **Q5 (Google Antigravity 연동 범위):** 벤치마크 UX 패턴 선별 도입에 더해 `agy` CLI를 3번째 에이전트 프로바이더로 연동할지 여부.

## 근거와 검증 범위

- **소스 검증 완료:** `guseoh/hermit` 커밋 `dc07cb3`의 메인·프리로드·렌더러·PowerShell·스타일·문서(`docs/handoff.md`, `docs/history.md`, `docs/STYLEGUIDE.md`, `docs/design/`) 전수 정독 및 `changes.cjs` NUL 바이트(588행) 직접 확인. 문서 커밋 `b12629b`의 `main` 반영 확인.
- **미검증:** 이번 분석·문서화 과정에서 Hermit 앱 실행, `npm test`, `node test/ui-smoke.cjs`, 자동 업데이트 및 실제 Codex·Claude·`agy` CLI 호출은 새로 실행하지 않았다.
