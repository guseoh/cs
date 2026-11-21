---
id: PRJ-DEVELOPMENT-TOOLING
type: project
project: shared
status: active
created_at: 2026-11-21
updated_at: 2026-11-21
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://orca.dev/
  - https://orca.dev/docs/settings
depends_on: []
supersedes: []
related_to: [SHD-0001]
---

# 공통 개발 환경 운영

## 현재 상태 (2026-11-21)

개발 도구의 기본 선택은 **Orca**로 사용자 확정이다. 선택 의사 외에 Orca의 실제 설치·초기화·에이전트 로그인·플러그인 설치·벤치마크가 완료되었다는 증거는 없다.

## 확정된 결정

- [SHD-0001: 개발 작업 도구를 Orca로 통일](../decisions/SHD-0001.md)

## 제약 조건

Java/Spring 프로젝트의 코딩·테스트, 여러 에이전트와 Git Worktree 간 격리, 리뷰·PR 검증을 고려해야 한다. 구체적인 CLI 설정·최대 동시 실행 수·플러그인 선택·성능 수치는 **권고 또는 미검증** 상태다. VS Code 확장 호환이나 IntelliJ 수준의 Java IDE 기능을 전제하지 않는다.

## 미해결 질문과 다음 작업

Orca 실제 설치 버전 및 Windows에서의 터미널·Git·JDK·Gradle·Maven 환경을 점검하고, Claude Code/Codex와 Worktree 동작 및 Java 테스트·디버그 대안을 프로젝트별로 검증한다. 필요할 때만 플러그인을 활성화하고 성능·보안 비용을 확인한다.

## 근거와 검증 범위

사용자 도구 선택 선언과 Orca 공식 문서를 구분해 기록했다. 코드를 실행하거나 로컬 개발환경에 접근하지 않았다.
