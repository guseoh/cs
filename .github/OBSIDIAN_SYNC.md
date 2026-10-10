# Obsidian 멀티 기기 동기화 운영 가이드

이 Vault는 **데스크탑과 노트북의 로컬 Git 저장소 ↔ GitHub `guseoh/cs`(`main`)** 구조로 관리한다.

## 동기화 규칙

1. 다른 기기로 이동하기 전, 현재 기기에서 노트를 저장하고 Obsidian Git의 **Commit-and-sync** 실행이 성공했는지 확인한다.
2. 새 기기에서는 작업 시작 전에 원격 변경을 Pull한다. `autoPullOnBoot=true`로 설정되어 있더라도 오류 알림을 확인한다.
3. **같은 노트를 두 기기에서 동시에 편집하지 않는다.** 오프라인 작업이 있었다면 원격 변경 여부를 먼저 확인한다.
4. 플러그인이 15분 간격으로 자동 백업/동기화하지만, 기기를 바꾸기 직전에는 수동 동기화를 한 번 실행한다.
5. 동기화 오류가 발생했다면 다음 기기에서 해당 파일을 수정하지 않는다. 오류 발생 상태의 파일을 별도 위치에 복사하여 보존한다.

## 문제 발생 시

- 먼저 `git status --short --branch`, `git fetch origin`, `git rev-list --left-right --count HEAD...origin/main`으로 상태를 확인한다.
- `git pull --ff-only origin main`은 **작업 트리가 깨끗하고**, 로컬에 원격과 갈라진 커밋이 없을 때만 사용한다.
- 충돌 발생 시 `git reset --hard`, `git clean -fd`, 강제 Push 또는 `ours`/`theirs` 일괄 선택으로 덮어쓰지 않는다.
- 노트 및 첨부파일을 백업하고 파일 단위로 차이를 검토하여 병합한다. GitHub에 Push한 사실만으로 다른 로컬 기기가 동기화되었다고 가정하지 않는다.

## 공유 설정과 기기별 설정

| 구분 | 관리 |
| --- | --- |
| 학습 노트, 템플릿, 첨부파일 | Git 공유 |
| `.obsidian/snippets/*.css`, `.obsidian/appearance.json`, `.obsidian/hotkeys.json` | Git 공유 |
| `.obsidian/community-plugins.json`, 플러그인 파일 및 설정 | Git 공유. 플러그인 업데이트는 한 기기에서 수행 후 확인 |
| `.obsidian/workspace.json`, `.obsidian/workspace-mobile.json`, `.obsidian/cache/` | 기기별 유지, Git 제외 |
| `Resources/PDF/` | Git 제외. 양쪽에서 필요한 PDF가 있는지 따로 확인 |
| `.trash/` 및 기타 임시 파일 | Git 제외 |

## 플러그인·CSS 변경 절차

1. 한 기기에서 플러그인을 업데이트하거나 CSS를 수정한 다음, Obsidian에서 실제 표시와 주요 기능을 확인한다.
2. Git 변경 파일을 검토한다. 플러그인 업데이트는 `main.js`, `styles.css`, `manifest.json`, `data.json`을 함께 변경할 수 있다.
3. 변경 내용을 Push하고 다른 기기에서 Pull한 후 작동을 확인한다.
4. 기기마다 다른 UI 배치나 비밀키, 인증 파일, 절대경로가 포함된 설정은 공용 Git 이력에 올리지 않는다.

## 백업

Git의 버전 이력 외에도 Vault 전체를 주기적으로 독립적인 저장소나 디스크에 백업한다. 복구 연습으로 노트, 첨부 이미지 및 설정이 정상적으로 열리는지 확인한다.

> 이 문서는 운영 가이드이며, 로컬 데스크탑·노트북의 현재 작업 상태를 자동으로 확인하거나 동기화하지 않는다.
