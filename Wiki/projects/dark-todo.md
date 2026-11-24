---
id: PRJ-DARK-TODO
type: project
project: dark-todo
status: active
created_at: 2026-11-03
updated_at: 2026-11-24
evidence_level: source-verified
capture_mode: manual
sources:
  - https://github.com/guseoh/dark-todo-planner/pull/178
  - https://github.com/guseoh/dark-todo-planner/releases/tag/tern-v0.3.3
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45327878159
  - https://github.com/guseoh/dark-todo-planner/pull/174
  - https://github.com/guseoh/dark-todo-planner/pull/141
  - https://github.com/guseoh/dark-todo-planner/pull/165
  - https://github.com/guseoh/dark-todo-planner/pull/166
  - https://github.com/guseoh/dark-todo-planner/pull/167
  - https://github.com/guseoh/dark-todo-planner/pull/168
  - https://github.com/guseoh/dark-todo-planner/pull/171
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45193432113
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45140860278
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45133232457
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45134811012
  - https://github.com/guseoh/dark-todo-planner/releases/tag/tern-v0.1.2
  - https://github.com/guseoh/dark-todo-planner/commit/4692397c054e910f47d0749f8079ad8d2593e33f
  - https://github.com/guseoh/dark-todo-planner/blob/main/package.json
  - https://github.com/guseoh/dark-todo-planner/blob/main/src/components/settings/DesktopUpdateCard.tsx
  - https://github.com/guseoh/dark-todo-planner/blob/main/src/pages/SettingsPage.tsx
  - https://github.com/guseoh/dark-todo-planner/blob/main/src/App.tsx
  - https://github.com/guseoh/dark-todo-planner/actions/runs/45022062078
depends_on: []
supersedes: []
related_to: [DTD-0001, DTD-0002, DTD-0003, DTD-0004, DTD-0005, DTD-0007, DTD-0008, DTD-0009, DTD-0010]
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

## 2026-11-23 메모·낙서장 통합 편집기 병합
- [DTD-0005](../decisions/DTD-0005.md): 메모와 낙서장의 Tiptap 3 기반 작성 즉시 서식 적용, 중복 UI 정리, 기존 Markdown 저장 및 안전한 원본 편집 경로 유지를 결정했다.
- [소스 PR #167](https://github.com/guseoh/dark-todo-planner/pull/167)은 사용자의 요청으로 2026-11-23 `main`에 Squash 병합됐다([병합 커밋](https://github.com/guseoh/dark-todo-planner/commit/e9c092f2128c1234026181435da9b24666243fb2)). 공통 편집기 분리, 메모 카드 요약, 낙서장 도구 정리가 적용된 소스 상태다. 운영 배포나 Windows 설치본의 시각 검증 성공을 이 병합만으로 판단하지 않는다.
- [PR CI #45135007610](https://github.com/guseoh/dark-todo-planner/actions/runs/45135007610)에서 타입·단위·빌드·의존성 감사와 로컬 Worker/D1·브라우저·반응형 검증이 통과했다. `main` 병합 후 [운영 배포 CI](https://github.com/guseoh/dark-todo-planner/actions/runs/45135922038)는 별도 확인 대상으로 남긴다. Windows 설치본의 한글 IME·Markdown 특수 구문 왕복·좁은 창 수동 시각 QA는 여전히 미완료다.

## 2026-11-23 Preview 배포 검증
- [PR #167의 개선 코드](https://github.com/guseoh/dark-todo-planner/pull/167)를 운영과 분리된 Cloudflare Worker `dark-todo-planner-preview`에 배포했다. [GitHub Actions #45134811012](https://github.com/guseoh/dark-todo-planner/actions/runs/45134811012)의 Preview-only 배포 작업이 성공했으며, 검증 시 제공된 URL은 https://dark-todo-planner-preview.guseoh.workers.dev 이다.
- 배포 중 정적 자산 32개 업로드 및 `/api/health` 응답 `{"status":"ok","database":"connected"}`를 확인했다. 설정 검증에서 Preview와 Production이 별도의 D1 데이터베이스를 사용하는 것도 확인했다.
- **이 Preview 전용 배포에서는** DB 마이그레이션과 Production Worker 배포를 수행하지 않았다. 임시 배포 workflow 파일은 성공 후 PR 브랜치에서 제거했으며, 배포된 Preview Worker는 유지된다.
- 이 결과는 서버 배포·헬스 확인 근거이며 Preview 로그인, 실제 사용자 데이터 CRUD, Windows Tern 설치본 실행 및 수동 시각 QA 완료를 의미하지 않는다.

## 2026-11-23 PR #167 병합 이후 검증 경계
- 병합 사실은 [소스 PR #167](https://github.com/guseoh/dark-todo-planner/pull/167)과 정확한 [병합 커밋](https://github.com/guseoh/dark-todo-planner/commit/e9c092f2128c1234026181435da9b24666243fb2)으로 확인했다. 배포 결과는 [main CI #45135922038](https://github.com/guseoh/dark-todo-planner/actions/runs/45135922038)을 별도 확인한다.
- 별도 Preview 로그인 정보는 사용자에게 제공되지 않았으므로 Preview 사용자 인증·사용성 테스트는 수행되지 않았다. 실 운영 데이터와 로그인 정보는 Wiki에 기록하지 않는다.

## 2026-11-23 Tern 메모 인라인 편집 PR #168 병합
- [DTD-0007](../decisions/DTD-0007.md): 기존 2열 메모 카드 + 수정 모달 대신 한 열 목록과 동일 화면의 Tiptap 편집기를 도입한다. 저장된 메모 색상은 전체 카드 도색이 아닌 얇은 강조선·선택 배경·문서 표식으로 표현한다.
- [소스 PR #168](https://github.com/guseoh/dark-todo-planner/pull/168)은 2026-11-23 사용자의 명시적 승인 후 `main`에 [Squash 커밋 `d36611b`](https://github.com/guseoh/dark-todo-planner/commit/d36611b063c68adb8b5f7a4e98d48946885bee05)으로 병합됐다. 기존 Markdown 저장·색상·Todo/프로젝트 연결·명시적 저장을 유지하고 빠른 문서 전환 시 초안 손실을 줄이는 동작을 보완했다.
- [자동 CI #45139937246](https://github.com/guseoh/dark-todo-planner/actions/runs/45139937246): 타입·단위·빌드·Worker/D1·Chromium 브라우저 스모크·반응형 검사 통과. 표·HTML·수식 문서는 기본 읽기 렌더링에서 원본 편집으로 전환할 수 있도록 보호했다.
- [Production Actions #45140860278](https://github.com/guseoh/dark-todo-planner/actions/runs/45140860278)은 병합 커밋 `d36611b` 기준 모든 작업이 **성공**했다. Cloudflare Worker 배포와 운영 헬스 체크까지 성공했으므로 소스·서버 반영 완료로 기록한다. 실제 Windows 앱의 화면·데이터 조작 수동 확인과는 구분한다. **실제 Windows Tern 창**의 UI·한글 IME, 고급 Markdown 원본 보존, 초안 복구는 수동 검증 미완료 상태다. 장기 개선 제안으로 메모별 버전 충돌 감지와 검색/색상 필터를 평가할 수 있으나 이번 시안에는 포함하지 않는다.

## 2026-11-23 Tern 메모 색상·전환 지연 후속 수정 (#169)
- 원인: `MemoForm.color`의 저장 전 선택값이 메모 목록과 문서 헤더의 서버 저장 색상에 반영되지 않았다. 문서 전환 때 Tiptap 편집기 재초기화와 불필요한 카드 렌더링도 지연 가능 요인이었다.
- [PR #169](https://github.com/guseoh/dark-todo-planner/pull/169)은 사용자에게 보고된 UI 결함의 수정으로 [Squash 커밋 `1ea3cb0`](https://github.com/guseoh/dark-todo-planner/commit/1ea3cb047225e6f3d788ba4d943f8c125e6ba07a)으로 `main` 병합됐다. 색상 변경이 목록·문서 표식에 즉시 나타나며, 기존 **명시적 서버 저장** 정책을 유지한다.
- `memo(MemoCard)`, 안정적 콜백·검색 메모이제이션, `useDeferredValue`, Tiptap extension 설정 재사용으로 전환 시 반복 작업을 완화했다. [PR CI #45143506248](https://github.com/guseoh/dark-todo-planner/actions/runs/45143506248) 성공, [main CI #45144105661](https://github.com/guseoh/dark-todo-planner/actions/runs/45144105661)은 대량 Todo 20건 생성 스모크의 HTTP 429 때문에 두 차례 실패했고 Production 배포는 건너뛰었다. [테스트 재시도 PR #170](https://github.com/guseoh/dark-todo-planner/pull/170)은 서버 제한을 건드리지 않고 해당 픽스처만 61초 대기 후 이어서 생성하도록 수정했고 [PR CI #45144934194](https://github.com/guseoh/dark-todo-planner/actions/runs/45144934194) 성공 후 [커밋 `9eba0ec`](https://github.com/guseoh/dark-todo-planner/commit/9eba0ec9494c5eccd0e978291ee8f2effee2462e)으로 병합했다. [최종 main CI #45145541206](https://github.com/guseoh/dark-todo-planner/actions/runs/45145541206)의 타입·단위·빌드·Worker/D1·Chromium 회귀·Production Worker 배포·운영 헬스 체크가 **모두 성공**했으며, 메모 개선 소스가 운영 서버에 반영됐다. Windows Tern 설치본에서 직접 확인하는 단계만 남겼다.
- 검증 한계: GitHub Actions Chromium 메모 전환 시간 66ms는 단일 테스트 환경 기록이며 실제 Windows Tern의 미세 지연과 데이터 동기화 충돌은 수동 확인이 필요하다.

## 2026-11-23 — Tern 오늘 작업 공간 개편 (#171)
- [DTD-0008](../decisions/DTD-0008.md): 기존 데이터·API를 유지하며 오늘 화면을 계획·집중·실행·마무리 중심으로 정리한다.
- [소스 PR #171](https://github.com/guseoh/dark-todo-planner/pull/171)은 [CI #45192538149](https://github.com/guseoh/dark-todo-planner/actions/runs/45192538149)의 타입·단위·빌드·Worker/D1·Chromium 회귀 전체 성공 후 [Squash 커밋 `433eba5`](https://github.com/guseoh/dark-todo-planner/commit/433eba5417ebfa00996f61552e60aabb3038e371)으로 `main` 병합됐다. 이 PR에서 지난 일정 이동 실패 피드백, Todo가 없는 날 회고 접근, 측정 기록 조회 실패 상태, 다음 작업 후보 직접 추가, 선택 우선 지난 일정 정리, 주간 마감 위험, 부가 위젯 펼치기 및 좁은 창 정보 접근을 구현했다.
- 검증 중 발견한 UI 회귀: 기존 스모크가 요구한 빠른 입력의 헤더 근접성을 첫 시안이 벗어나 요약을 입력 아래로 옮겼다. 이후 기존 빈 화면 문구를 기다리는 구식 검증 문자열도 새 안내 문구에 맞춰 갱신했다.
- 최신 PR 검증·운영 Worker 배포·Windows Tern에서의 수동 시각 확인은 **서로 별개**로 기록한다. 기존 스키마·API·실사용 데이터는 변경하지 않았다.

- [main Production CI #45193432113](https://github.com/guseoh/dark-todo-planner/actions/runs/45193432113)은 병합 커밋 `433eba5`의 타입·단위·빌드·Worker/D1·Chromium 회귀·Production Worker 배포 및 운영 헬스 체크가 **모두 성공**했다. 소스와 서버 반영 완료가 검증됐으며, Windows Tern 설치본 직접 사용·다기기 동기화 QA는 별도다.

## 2026-11-24 — Windows Tern 소스 main 병합 및 릴리스 서명 키 차단
- [DTD-0009](../decisions/DTD-0009.md): Windows Tern을 유일한 프런트엔드 릴리스 기준으로 전환하고 웹/PWA 중심 결정 DTD-0004를 이력 보존 상태로 대체했다. Cloudflare Workers·D1 데이터는 유지한다.
- [PR #174](https://github.com/guseoh/dark-todo-planner/pull/174)은 [Squash 커밋 `7f6a735`](https://github.com/guseoh/dark-todo-planner/commit/7f6a735b9ad847eff7493544a210cd75ea1e25de)으로 `main` 병합되었다. Tauri Rust 네이티브 소스·번들 React UI·고정 API 전송·트레이/빠른 입력·앱 자동 업데이트 확인·서명된 Windows 릴리스 워크플로 및 백엔드 전용 배포 파이프라인을 포함한다.
- [PR Windows 빌드 #45210193873](https://github.com/guseoh/dark-todo-planner/actions/runs/45210193873) 및 [PR CI #45210193932](https://github.com/guseoh/dark-todo-planner/actions/runs/45210193932)는 성공했다. GitHub에 네이티브 소스가 반영된 사실과 실제 Windows 설치·실행 성공은 구분한다.
- [main Windows 릴리스 #45211267185](https://github.com/guseoh/dark-todo-planner/actions/runs/45211267185)는 **서명 키가 없어 실패**했다. `TAURI_SIGNING_PRIVATE_KEY`와 `TERN_UPDATER_PUBLIC_KEY`가 비어 있었으며, Windows 서명 설치 파일 및 `latest.json`을 새로 게시하지 못했다. 최신 확인 공개 릴리스는 `tern-v0.2.0`이다.
- **후속 조건:** 기존 0.2.0의 서명 키·설치 ID와 새 구성의 호환성을 확인하고, Actions Secrets에 키를 안전하게 등록한 뒤 릴리스 재실행 및 v0.2.0→새 버전 설치·자동 업데이트를 구분하여 검증해야 한다. 기존 개인키를 복구하지 못하면 기존 설치본에서의 인플레이스 자동 업데이트는 보장되지 않는다. 비밀키·계정 정보는 Wiki에 기록하지 않는다.

## 2026-11-24 — Windows 릴리스 정상화 및 CI/CD 경량화 결정
- [릴리스 v0.3.2](https://github.com/guseoh/dark-todo-planner/releases/tag/tern-v0.3.2)와 [v0.3.3](https://github.com/guseoh/dark-todo-planner/releases/tag/tern-v0.3.3)의 서명 설치 파일 및 manifest 게시를 확인했다. 위의 최초 서명 키 차단은 역사적 상태이며 현재 릴리스 발행 차단으로 해석하지 않는다. 실제 설치본의 후속 자동 업데이트 성공은 별도 검증 대상이다.
- [DTD-0010](../decisions/DTD-0010.md): 변경 영역별 PR 검증, main의 Windows 패키징 1회 및 발행 전 검증, 데이터 관련 통합 테스트 유지, 주기적 회귀 분리를 확정했다. [소스 PR #178](https://github.com/guseoh/dark-todo-planner/pull/178)은 기록 시점에 검증 중이며 병합·실측 효과는 미확인이다.

- 추가 확정: 운영 웹 UI/PWA는 제공하지 않는다. Worker API와 React/Tauri 번들을 독립적으로 빌드한다. 기존 최초 경량화 CI와 cargo check는 통과했지만 API 전용 전환 후 검증 및 배포 결과는 미확인이다. 소스 PR #178에서 진행한다.
