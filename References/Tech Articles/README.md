# 기술 자료 아카이브 운영 규칙

## 원칙

이 폴더는 Notion 데이터베이스의 모사본이 아니다. Obsidian Bases로 검색·상태 관리하고, 기존 학습 노트와 Wikilink로 연결할 수 있는 Markdown 원문 요약 아카이브다.

- 자동 생성할 수 있는 곳: References/Tech Articles/Articles/YYYY/의 새 Markdown 파일.
- 템플릿: Templates/Tech Article.md (수동 작성 때 Templater 명령으로 삽입).
- 대시보드: 기술 자료.md, 데이터 뷰: 기술 자료.base.
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
| source | 발행 블로그·조직 |
| published | 원문 발행일. 찾지 못했으면 비워 두고 본문에 미확인 표시 |
| collected | Asia/Seoul 기준 수집일 |
| url | 추적 파라미터와 fragment를 제거한 canonical 원문 URL |
| categories | 기존 11개 주제 중 주 유형 1개, 실제로 필요한 경우 보조 유형 1개 |
| projects | 프로젝트 적용 후보. 억지로 연결하지 않으며 빈 목록 가능 |
| status | inbox, reading, reviewed, archived 중 하나 |
| tags | tech-article 포함 |

파일명은 YYYY-MM-DD-짧은-주제.md 형태의 읽기 쉬운 이름을 권장한다. 파일명은 고유 식별자가 아니며, 중복 판정의 정본은 url이다. 두 문서가 같은 canonical URL을 가리키면 생성하지 않는다.

## 매일 저장 프로토콜 (스케줄러 전환 시 적용)

1. 원문을 열고 검증한다. 기존 Articles/의 URL을 먼저 읽고 canonical URL로 비교한다.
2. 기존 URL이면 **새 파일을 생성하지 않는다**. 사용자 메모와 상태를 보호한다.
3. 새 글 3~5편의 Markdown을 생성하고 로컬과 동일한 검증 스크립트 및 단위 테스트를 통과시킨다.
4. 원격 main HEAD를 다시 조회한 후 다른 파일의 변경을 보존한 **추가 전용 커밋**으로 반영한다. HEAD가 바뀌었으면 최신 트리로 새로 검증하고 충돌 시 쓰기를 중단한다. Force push는 금지한다.
5. 저장 후 파일·URL·상태를 재조회해 생성 건수를 확인한다. 실패했더라도 브리핑 메시지는 전달한다.

### 브랜치 결정

초기 설계·테스트는 daily-tech 브랜치에서 진행한다. 일일 작업마다 PR을 만들거나 장기 브랜치의 내용을 무조건 병합하지 않는다. 전환 후 자동 생성기는 main에 신규 파일만 직접 추가한다. GitHub Actions의 push 검증은 사후 검증이므로 **쓰기 전 검증을 대체하지 못한다**. 자동 쓰기 기능은 아직 활성화하지 않았다.

### Obsidian Git의 동시성

기존 저장소는 여러 PC의 로컬 main과 15분 간격으로 동기화된다. 원격에서 생성한 커밋이 로컬 미커밋 변경과 충돌하면 백업 후 수동으로 해결한다. 스케줄러는 로컬 기기의 동기화 성공을 확인할 수 없다.

## 검사

- 설치: python -m pip install PyYAML==6.0.3
- 검증: python scripts/validate_daily_tech.py
- 테스트: python -m unittest scripts/test_daily_tech.py -v

Python 검사는 메타데이터 형식, URL 중복, Properties 값, 파일명, 출처 본문 링크, Bases YAML의 최소 구조만 검증한다. Obsidian GUI의 실제 렌더링과 GitHub 쓰기 권한은 별도로 실기기 검증해야 한다.
