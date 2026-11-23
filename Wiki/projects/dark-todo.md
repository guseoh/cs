---
id: PRJ-DARK-TODO
type: project
project: dark-todo
status: active
created_at: 2026-11-03
updated_at: 2026-11-23
evidence_level: source-verified
capture_mode: manual
sources:
  - https://github.com/guseoh/dark-todo-planner/pull/141
  - https://github.com/guseoh/dark-todo-planner/pull/165
  - https://github.com/guseoh/dark-todo-planner/pull/166
  - https://github.com/guseoh/dark-todo-planner/pull/167
  - https://github.com/guseoh/dark-todo-planner/releases/tag/tern-v0.1.2
  - https://github.com/guseoh/dark-todo-planner/commit/4692397c054e910f47d0749f8079ad8d2593e33f
  - https://github.com/guseoh/dark-todo-planner/blob/main/package.json
  - https://github.com/guseoh/dark-todo-planner/blob/main/src/components/settings/DesktopUpdateCard.tsx
  - https://github.com/guseoh/dark-todo-planner/blob/main/src/pages/SettingsPage.tsx
  - https://github.com/guseoh/dark-todo-planner/blob/main/src/App.tsx
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45022062078
depends_on: []
supersedes: []
related_to: [DTD-0001, DTD-0002, DTD-0003, DTD-0004, DTD-0005]
---
# Dark Todo Planner — 프로젝트 현황

## 현재 상태 (2026-11-22 기준)
- GitHub `main` 최신 확인 커밋은 [`4692397`](https://github.com/guseoh/dark-todo-planner/commit/4692397c054e910f47d0749f8079ad8d2593e33f)이다.
- 웹 애플리케이션은 React/Vite, API는 Hono/Cloudflare Workers, 데이터베이스는 Cloudflare D1을 사용한다. Windows 데스크톱 앱 Tern은 Tauri 2 기반으로 소개되고 있으며, 기존 웹/PWA 진입점도 유지된다.
- [PR #165](https://github.com/guseoh/dark-todo-planner/pull/165) 병합으로 `@tauri-apps/api` 2.12.5 의존성, `DesktopUpdateCard`, `SettingsPage`의 Tauri 감지 분기가 추가됐다. 데스크톱 설정 화면은 `invoke("desktop_update", { checkNow })`를 호출한다.
- [PR #166](https://github.com/guseoh/dark-todo-planner/pull/166) 병합으로 README가 웹 진입점과 Tern 설치·업데이트 안내 중심으로 간소화됐다.
- [Tern 0.1.2 릴리스](https://github.com/guseoh/dark-todo-planner/releases/tag/tern-v0.1.2)에 Windows 11 x64 설치 파일, `latest.json`, 서명 파일이 게시됐다. 설치 파일 자산은 공개되어 있으나 이 Wiki 검토에서 실제 Windows 설치·실행을 수행한 것은 아니다.
- [main CI 실행 #45022062078](https://github.com/guseoh/dark-todo-planner/actions/runs/45022062078)은 타입 검사, 단위 테스트, 백업 암호화 회귀, 웹 빌드·Wrangler dry-run, 의존성 감사, 로컬 Worker/D1·Chromium 스모크와 Production D1 migration·Worker 배포·Health 확인까지 성공했다. 이 Workflow는 웹/Worker 검증이며 Tauri 네이티브 앱 빌드 검증은 아니다.
- React의 `src/App.tsx`에는 앱 창 안에서 `Ctrl+Shift+K` 키보드 이벤트를 받아 기존 빠른 입력 상태를 여는 처리가 있다. 다만 전역 단축키를 네이티브에서 이 React 흐름으로 전달하는 연결 코드는 현재 추적되는 프런트엔드 파일에서 확인되지 않았다.

## 확정된 결정
- [DTD-0001](../decisions/DTD-0001.md): 중립적이고 콘텐츠 중심인 UI.
- [DTD-0002](../decisions/DTD-0002.md): Inbox UI를 제거하되 기존 INBOX 데이터 보존.
- [DTD-0003](../decisions/DTD-0003.md): Today 정렬 저장과 Calendar 상세 간소화.
- [DTD-0004](../decisions/DTD-0004.md): 기존 웹 애플리케이션을 유지하면서 Tauri 2 기반 Windows 데스크톱 앱 추가.

## 제약 조건 및 재검토 결과
- 저장된 Todo, 기존 INBOX 레코드, 사용자 지정 카테고리·메모 색상, 키보드 조작과 백업 형식을 보존한다.
- 기존 React 화면, HTTPS 웹 애플리케이션, Hono API, Cloudflare Workers/D1, 인증 계약과 IndexedDB 오프라인 변경 큐를 유지한다. 별도 데이터베이스나 중복 Todo 입력 화면을 도입하지 않는다.
- Edge PWA와 웹 사용 경로를 계속 제공한다. Tauri WebView의 사용자 데이터 프로필은 브라우저와 별도이므로 로그인 세션이 자동 승계된다고 가정하지 않는다.
- **네이티브 소스 추적성 공백:** 2026-11-22 확인한 `main` 및 `tern-v0.1.2` 태그의 Git 트리에는 `src-tauri/`, `Cargo.toml`, `tauri.conf.json`, Rust 명령 구현이 없다. `.github/workflows/`에도 Tauri Windows 빌드·릴리스 Workflow가 확인되지 않았다. 이는 이 저장소에 공개·추적된 소스가 없다는 뜻이며, 별도 저장소나 로컬 빌드 경로의 존재 여부까지 단정하지 않는다.
- `DesktopUpdateCard`가 호출하는 `desktop_update` 네이티브 명령의 구현은 현재 저장소에서 확인할 수 없다. 따라서 updater 서명 검증, 업데이트 정책, IPC 권한, 원격 출처 허용 범위, 트레이·전역 단축키 동작과 설치본 재현 가능성을 독립 감사할 수 없다.
- README는 14줄로 축약되면서 기존 기능 개요, 로컬 개발 환경 설정, 테스트·빌드·감사 명령, 기능 범위 문서 및 배포·백업 Runbook 링크가 제거됐다. 사용자용 설치 안내는 간결해졌지만 개발자·유지보수자 진입 문서가 약해졌다.

## 미해결 질문과 다음 작업
1. Tern 네이티브 소스의 정본 위치를 확인한다. 별도 저장소에 있다면 이 저장소 README와 Wiki에서 연결하고, 릴리스 태그·빌드 커밋·서명 산출물의 출처를 추적할 수 있게 한다. 이 저장소가 정본이라면 Tauri 설정·Rust 코드와 재현 가능한 Windows 빌드 Workflow를 커밋한다.
2. 전역 `Ctrl+Shift+K`가 메인 창 복원·포커스 후 기존 React 빠른 입력을 여는 전체 경로를 검증한다. 단축키 충돌, 한글 IME, 창 닫기·트레이 숨김, 절전 복귀도 포함한다.
3. 운영 HTTPS 출처만 허용하는 Tauri capability/IPC 범위, 네이티브 명령 allowlist, updater 서명·버전 검증 및 실패 복구를 소스와 설치본에서 확인한다.
4. README에 개발·테스트·배포·Runbook 문서 링크를 복원하거나 별도 개발자 안내 문서를 만들고 연결한다.
5. Windows 11 x64에서 설치, 최초 로그인, 웹과 동일 Todo 조회·저장, 오프라인 재연결, 업데이트를 직접 검증한다.
6. 2026-11-03 스냅샷에서 기록했던 암호화 D1 백업 실패와 Today/Calendar 수동 확인 항목은 이번 재검토에서 재검증하지 않았다. 현재 정상으로 간주하지 말고 별도 확인한다.

## 근거와 검증 범위
이번 상태는 2026-11-22 GitHub `main`, 병합 PR #165/#166, Tern 0.1.2 릴리스 자산, 프런트엔드 파일과 main CI 실행 결과를 확인해 작성했다. CI 성공은 해당 웹/Worker 작업의 자동 검증·배포 근거이며, Tauri 네이티브 소스·빌드·설치·실행 성공을 의미하지 않는다. 이 검토에서 Windows 설치본을 실행하거나 실제 사용자 계정으로 운영 데이터 변경을 수행하지 않았다.

## 2026-11-23 메모·낙서장 통합 편집기 진행 (병합 전)
- [DTD-0005](../decisions/DTD-0005.md): 메모와 낙서장의 Tiptap 3 기반 작성 즉시 서식 적용, 중복 UI 정리, 기존 Markdown 저장 및 안전한 원본 편집 경로 유지를 결정했다.
- [소스 PR #167](https://github.com/guseoh/dark-todo-planner/pull/167)은 초안 상태의 변경이다. 공통 편집기 분리, 메모 카드 요약, 낙서장 도구 정리가 제안됐으며, 운영 배포나 Windows 설치본의 시각 검증을 주장하지 않는다.
- 후속 확인: 타입·단위·빌드·브라우저 스모크 결과, 한국어 IME, Markdown 왕복 보존, 다크/라이트 및 좁은 창, 저장 실패·로컬 초안 복구를 확인한 뒤 병합을 결정한다.
