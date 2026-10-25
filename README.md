# CS Notes — Obsidian Vault

Java·Spring·데이터베이스·인프라 학습 노트와 프로젝트 기술 기록을 관리하는 **Obsidian Vault**입니다. 데스크톱과 노트북에서 GitHub의 `main` 브랜치를 통해 내용을 동기화합니다.

> 이 저장소는 **공개(Public)** 상태입니다. 비밀번호, 인증 토큰, 개인 정보, 민감한 운영 정보는 노트 및 `.obsidian` 설정에 기록하거나 커밋하지 않습니다.

## 디렉터리

| 디렉터리 | 내용 |
| --- | --- |
| `Study/` | Java, Spring, JPA, Database, Infra, Performance 등의 학습 노트 |
| `Project/` | 프로젝트 설계·성능·운영 기록 |
| `Attachments/` | 노트에 삽입된 이미지 등의 첨부파일 |
| `Excalidraw/` | 다이어그램과 Excalidraw 라이브러리 |
| `Book/`, `Templates/` | 독서 기록 및 노트 템플릿 |
| `.obsidian/` | 두 기기에서 공유하는 플러그인·CSS·기본 설정 |
| `scripts/` | Windows PowerShell 백업 스크립트 |

## 기기 간 동기화

1. 다른 기기로 이동하기 전에 Obsidian에서 노트를 저장하고 **Commit-and-sync**를 실행합니다.
2. 새 기기에서 Obsidian을 열면 시작 시 Pull을 시도합니다. 오류 여부를 확인한 후 편집합니다.
3. 같은 노트를 두 기기에서 동시에 편집하지 않습니다. 충돌 시 파일별로 변경 사항을 확인합니다.

자동 동기화 간격은 **15분**이며, 기본 커밋 메시지는 `chore(vault): sync {{date}} ({{numFiles}} files)`입니다. 중요한 수정은 예를 들어 `docs(jpa): 영속성 컨텍스트 정리`처럼 의미 있는 메시지로 수동 커밋할 수 있습니다. 과거 커밋 이력은 재작성하지 않습니다.

자세한 절차와 충돌 대응 방법은 [Obsidian 동기화 가이드](.github/OBSIDIAN_SYNC.md)를 참고하세요.

## 백업 및 복구

Git 동기화는 독립적인 전체 백업을 대체하지 않습니다. Vault 폴더 **밖**에 ZIP 백업을 만들고 복구를 점검합니다.

- [Windows 백업 및 복구 가이드](.github/OBSIDIAN_BACKUP.md)
- [PowerShell 백업 스크립트](scripts/Backup-ObsidianVault.ps1)

## 추적 파일 정책

- 노트, 첨부파일, 공유 CSS, 플러그인 설정 및 실행 파일은 Git으로 공유합니다.
- `.obsidian/workspace*.json`, 캐시·로그, `.trash/`, `Resources/PDF/` 등 기기별·임시 파일은 `.gitignore`에서 제외합니다.
- 플러그인 업데이트 및 CSS 변경은 한 기기에서 확인한 후 동기화합니다. 두 기기의 변경 상태를 확인하기 전에는 이미지나 설정 파일을 일괄 삭제하지 않습니다.
