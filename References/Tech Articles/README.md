# 기술 자료 아카이브 운영 규칙

## 원칙

이 폴더는 Notion 데이터베이스의 모사본이 아니다. Obsidian Bases로 검색·상태 관리하고, 기존 학습 노트와 Wikilink로 연결할 수 있는 Markdown 원문 요약 아카이브다.

- 자동 생성할 수 있는 곳: References/Tech Articles/Articles/YYYY/의 새 Markdown 파일.
- 템플릿: References/Tech Articles/기술 글 템플릿.md. 별도의 공용 Templates 폴더를 사용하지 않으며, 수동 작성은 파일을 복제해 Articles/YYYY로 옮긴 뒤 모든 Properties를 입력한다.
- 유일한 사용자 진입점: 기술 자료.md. 날짜·분류·검색·상태 필터는 같은 노트의 Dashboard 뷰에서 처리한다.
- 월간 달력은 Dashboard/view.js와 view.css가 렌더링한다. 기존 Dataview 플러그인의 JavaScript queries를 켜야 한다. 다른 플러그인이나 전역 CSS 설정은 사용하지 않는다.
- 날짜는 수집일(collected) 기준이며 원문 발행일(published)과 구분한다.
- 주제 칩은 Notion 원본 데이터베이스의 11개 `유형` 선택지 이름을 그대로 보존한다. 대표·보조 분류를 모두 필터링하며 아직 가져오지 않은 분류도 표시된다.
- 적용 프로젝트는 기술 유형과 구분되는 별도의 `projects` 목록 속성이다. 대시보드의 **PawCycle** 선택지는 해당 프로젝트와 연결된 노트만 보여준다. 두 필터는 함께 적용할 수 있다.
- 별도 태그/날짜별 마크다운 노트는 생성하지 않는다. 태그 패널과 기존 Bases도 계속 사용할 수 있다.
- 데이터 뷰: 기술 자료.base. 대시보드 아래 접힌 Bases를 통해 메타데이터를 관리할 수 있다.
- 자동 수집기는 **기존 파일을 수정하거나 삭제하지 않는다.** 특히 status, 체크박스, 본문에 남긴 개인 메모를 덮어쓰지 않는다.
- 기존 Study/, Project/, Wiki/, .obsidian/ 설정을 수집기에서 변경하지 않는다. 공용 저장소이므로 비밀정보·개인정보·비공개 사내 내용은 기록하지 않는다.
- 출처를 실제로 열어 제목, 날짜, 본문과 URL을 검증한 후 요약한다. 원문에 없는 대안·수치·검증 결과를 만들어 내지 않는다.
- 기능 설명, 지표, 문제·대안·결과 등은 주제별로 유연하게 작성한다. 매번 동일한 소제목을 억지로 채우지 않는다.

## Properties 계약

| 속성 | 의미 |
| --- | --- |
| type | 반드시 tech-article |
| title | 검증한 원문 제목 |
| aliases | 제목 변경이나 한국어 표시용 별칭 (선택) |
| summary | 목록에서 보일 핵심 요약 1~2문장 |
| topic | 대표 분야. categories 첫 항목과 일치 |
| source | 발행 블로그·조직 |
| published | 원문 발행일. 찾지 못했으면 비워 두고 본문에 미확인 표시 |
| collected | Asia/Seoul 기준 수집일 |
| url | 추적 파라미터와 fragment를 제거한 canonical 원문 URL |
| categories | 기존 11개 주제 중 주 유형 1개, 실제로 필요한 경우 보조 유형 1개 |
| projects | 적용 프로젝트 태그. 예: `[PawCycle]`. 원문에 없는 프로젝트 연관은 억지로 생성하지 않고 빈 목록 허용 |
| status | inbox, reading, reviewed, archived 중 하나 |
| tags | tech-article 및 각 categories에 대응하는 tech/계층형 태그 포함 |

파일명은 YYYY-MM-DD-짧은-주제.md 형태의 읽기 쉬운 이름을 권장한다. 파일명은 고유 식별자가 아니며, 중복 판정의 정본은 url이다. 두 문서가 같은 canonical URL을 가리키면 생성하지 않는다.

## 실제 화면 구성 및 사용

`기술 자료.md`를 열면 요약 숫자, 월간 달력, 기술 분류별 칩, 검색창, 읽기 상태 필터, 글 목록을 **한 페이지에서** 이용한다.

- 달력 이전·다음 달로 이동하고 날짜를 선택하면 해당 수집일의 기술 글만 표시한다. 다시 선택하거나 '전체 날짜로 돌아가기'를 누르면 해제한다.
- 대표 및 보조 `categories` 어느 쪽으로든 **노션의 11개 원본 주제** 필터를 적용한다. 검색은 제목·요약·출처·분류·프로젝트를 포함한다.
- **적용 프로젝트 → PawCycle**을 선택하면 `projects`에 PawCycle이 포함된 기사만 표시한다. 주제(예: `설계·아키텍처`)와 프로젝트(PawCycle)를 동시에 선택해 교차 필터링할 수 있다.
- 신규 프로젝트는 글의 `projects`에 이름이 등장하면 자동으로 추가된다. 아직 노트가 없는 PawCycle도 기본 탐색 대상으로 유지한다.
- 목록은 10개 단위로 나누며, 수백 건을 이전하더라도 메인 페이지가 길어지지 않는다.
- 글 제목을 누르면 **대시보드를 유지한 채 새 Obsidian 탭**에서 해당 Markdown 상세 노트가 열린다. Dashboard 스크립트는 노트를 읽기만 하고 수정하지 않는다.
- `Dashboard/view.css`는 DataviewJS 뷰의 전용 스타일이며 Obsidian의 다크·라이트 테마 토큰을 따른다. `.obsidian` 설정은 수정하지 않는다.
- DataviewJS가 비활성화되었으면 해당 플러그인 설정의 **Enable JavaScript queries**를 켜야 한다. 화면 전체가 렌더링되는지는 실제 Obsidian에서 확인한다.
- 상세 글 템플릿은 이 폴더의 `기술 글 템플릿.md`를 복제해 사용한다. `collected`는 수집일(YYYY-MM-DD)을 직접 입력한다. 템플릿의 HTML 주석은 생성 규칙이며 읽기 모드에는 나타나지 않는다.

## 날짜와 태그를 활용한 탐색

- `날짜별`: `note.collected` 그룹, 최신 수집일 우선.
- `월별`: `collected.format("YYYY-MM")` 수식 그룹.
- `태그별`: 대표 주제 `note.topic` 그룹. 부 유형도 보려면 Obsidian 태그 패널에서 tech/계층 태그를 선택한다.
- 예: `설계·아키텍처` ↔ `tech/설계-아키텍처`, `동시성·분산` ↔ `tech/동시성-분산`, `DB·데이터` ↔ `tech/DB-데이터`.
- 상세 글은 원문 제목과 **한 줄 정리**, 그리고 본문 대주제 **핵심 내용 · 왜 읽을까** 두 개를 사용한다. 핵심 내용 안에서 배경·문제·설계·구현·검증 결과를 충분한 문단으로 설명하고, 왜 읽을까에는 구체적인 학습 가치와 해당되는 경우 프로젝트 활용 판단을 기록한다.
- 출처 링크는 별도 대주제 대신 하단의 **원문:** 표시로 간결하게 남긴다. 기존 글의 `## 원문` 절도 이전 형식으로 인정한다. 자동 저장기는 기존 노트의 사용자 메모를 수정하지 않는다.
- 기존 기사 본문·수집 메타데이터는 보존한다. 개별 글을 덮어쓰는 것은 자동 수집기의 권한이 아니다.

노션의 실제 데이터베이스 `데일리 기술 블로그` (`유형`, multi-select) 스키마를 2026-11-05에 재확인했으며, 아래 11개 기술 분류 이름은 원본과 동일하다. 프로젝트는 이 11개 목록에 추가하지 않고 독립적인 차원으로 유지한다.

### 분류와 태그 대응표

| 기술 분류 | Obsidian 계층형 태그 |
| --- | --- |
| DB·데이터 | `tech/DB-데이터` |
| 성능 | `tech/성능` |
| 설계·아키텍처 | `tech/설계-아키텍처` |
| 테스트 | `tech/테스트` |
| 장애·운영 | `tech/장애-운영` |
| 리팩터링 | `tech/리팩터링` |
| 동시성·분산 | `tech/동시성-분산` |
| 인프라·DevOps | `tech/인프라-DevOps` |
| AI·개발도구 | `tech/AI-개발도구` |
| 보안 | `tech/보안` |
| 개발문화·회고 | `tech/개발문화-회고` |

본문을 작성할 때는 `summary`에 목록용 핵심 문장, `topic`에는 첫 번째 `categories`와 동일한 대표 주제를 기록한다. 모든 categories에 해당하는 태그를 `tags`에 추가한다. 상세 글은 원문 제목을 본문 첫 H1에 표시해 파일명 대신 정확한 제목이 보이게 한다. 메인 화면은 Obsidian의 인라인 제목과 중복되지 않게 H1을 작성하지 않는다.

## 매일 저장 프로토콜 (스케줄러 전환 시 적용)

1. 원문을 열고 검증한다. 기존 Articles/의 URL을 먼저 읽고 canonical URL로 비교한다.
2. 기존 URL이면 **새 파일을 생성하지 않는다**. 사용자 메모와 상태를 보호한다.
3. 원격 main HEAD가 최신인지 확인한 후 daily-tech 브랜치를 이 HEAD와 맞춘다. 해당 브랜치에 미병합 변경이 있으면 덮어쓰지 않고 중단한다.
4. 새 글 3~5편을 **daily-tech 브랜치에만 추가**한다. 같은 URL이 있으면 제외하고, 기존 파일을 수정하거나 삭제하지 않는다.
5. GitHub Actions의 Daily Tech validation 성공을 기다린다. 이 결과는 반드시 **스테이징 커밋 SHA와 일치**해야 한다. 실패, 미실행, 아직 실행 중인 경우 main을 변경하지 않는다.
6. main HEAD가 스테이징 기준에서 변하지 않았는지 재확인한 뒤, force 없이 main을 staging HEAD로 Fast-forward한다. HEAD가 바뀌면 **다시 스테이징·검증**하고 자동 강제 병합하지 않는다.
7. 저장 후 main의 파일·URL·상태·커밋 SHA를 재조회해 검증한다. 실패했더라도 브리핑은 전달한다. 저장 실패는 성공으로 표시하지 않는다.

### 브랜치 결정

초기 설계·테스트는 daily-tech 브랜치에서 진행한다. 일일 작업마다 PR을 만들거나 장기 브랜치의 내용을 무조건 병합하지 않는다. 전환 후 자동 생성기는 daily-tech에서 검증한 신규 파일만 PR 없이 main으로 Fast-forward한다. GitHub Actions의 main push 검증은 사후 검사일 뿐이며, **daily-tech CI 검증과 SHA 대조가 쓰기 전 안전장치**다. 자동 스케줄러 연결은 아직 활성화하지 않았다.

### Obsidian Git의 동시성

기존 저장소는 여러 PC의 로컬 main과 15분 간격으로 동기화된다. 원격에서 생성한 커밋이 로컬 미커밋 변경과 충돌하면 백업 후 수동으로 해결한다. 스케줄러는 로컬 기기의 동기화 성공을 확인할 수 없다.

## 검사

- 설치: python -m pip install PyYAML==6.0.3
- 검증: python scripts/validate_daily_tech.py
- 테스트: python -m unittest scripts/test_daily_tech.py scripts/test_daily_tech_preflight.py -v
- 추가 전용 스테이징 검증: python scripts/preflight_daily_tech.py --base-ref origin/main (최신 main fetch 후 daily-tech에서 실행)

Python 검사는 메타데이터 형식, URL 중복, Properties 값, 파일명, 출처 본문 링크, Bases YAML의 최소 구조만 검증한다. Obsidian GUI의 실제 렌더링과 GitHub 쓰기 권한은 별도로 실기기 검증해야 한다.
