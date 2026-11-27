# 저장소 에이전트 공통 규칙

이 저장소는 Obsidian Vault와 AI 공통 장기 기억을 관리한다. `Study/`, `Project/`, `Book/`, 첨부 파일 및 Obsidian 설정은 원본이다. Wiki 작업을 위해 원본을 재구성·삭제·일괄 수정하지 않는다.

## 작업 진입점
- 이전 결정, 프로젝트 현황, 후속 작업, 설계 근거가 필요한 경우 [Wiki/index.md](Wiki/index.md)와 [Wiki/AGENTS.md](Wiki/AGENTS.md)를 먼저 읽고 관련 문서만 조회한다. 일반 문법 질문·인사에는 조회를 강제하지 않는다.
- Wiki 작성은 [기록 정책](Wiki/capture-policy.md), [스키마](Wiki/schema.md), [인수인계 계약](Wiki/handoff.md)을 따른다. 프로젝트 원본과 현재 사용자 지시를 확인한다.
- 공개 저장소에 비공개 대화, 개인정보, 인증 정보, 민감한 운영 세부사항을 기록하지 않는다. GitHub 접근이 없으면 기록 완료를 주장하지 않는다.

## Obsidian 에이전트 연동
- 프로젝트 루트 `AGENTS.md`를 공통 진입점으로 사용한다. 공식 Obsidian Agent Skills 및 CLI 활용과 접근 제한은 [Wiki 실행 계약](Wiki/AGENTS.md#obsidian-및-클라이언트-접근)을 따른다. 프로젝트별 규칙이나 사용자 전역 지침을 중복 생성하지 않는다.

## Git 및 동기화
- 평상시 원격 브랜치는 `main`만 유지한다. 작업은 최신 main에서 분리하고, Wiki 변경은 검토 PR을 사용한다. 승인 없는 병합·강제 push·미반영 작업 삭제를 금지한다.
- 병합 및 일회성 브랜치 정리의 상세 기준은 [Wiki/AGENTS.md](Wiki/AGENTS.md)를 따른다. Daily Tech의 PR 없는 반영은 아래의 별도 예외다.
- [멀티기기 동기화](.github/OBSIDIAN_SYNC.md)를 준수한다. 원격 변경만으로 로컬 기기 동기화를 완료 판정하지 않는다.

## Daily Tech
기술 아티클은 Wiki가 아니라 [전용 아카이브 계약](References/Tech%20Articles/README.md)을 따른다.
- 매 실행 최신 main에서 `daily-tech` 임시 브랜치를 생성한다. 기존 브랜치가 남아 있으면 미반영 작업 여부를 확인하고 덮어쓰지 않는다.
- 새 공개 아티클만 추가하고 전체 아카이브 중복 및 추가 전용 검증을 수행한다. 마지막 스테이징 SHA의 CI 성공과 main 불변을 확인한 경우에만 PR 없이 non-force fast-forward한다.
- main의 반영과 임시 브랜치 삭제를 검증한다. 실패·권한 부족·CI 미완료면 중단하고 실제 상태를 보고한다. 브리핑 전달과 저장 성공은 별개다.
