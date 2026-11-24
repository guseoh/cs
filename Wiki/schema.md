# Wiki 기록 스키마 — v1

UTF-8 Markdown과 Obsidian 호환 YAML frontmatter를 사용한다. 안정적인 ID, 작은 파일, 상대 Markdown 링크를 우선한다. 메타데이터는 기계 판독 가능하게 유지하고 본문으로 인과관계와 불확실성을 설명한다.

## 필수 메타데이터

```yaml
---
id: WIKI-0001
type: decision
project: llm-wiki
status: accepted
created_at: 2026-11-03
updated_at: 2026-11-03
evidence_level: user-confirmed
sources: []
depends_on: []
supersedes: []
related_to: []
---
```

- `id`: 전역 고유·불변 ID. 결정 파일은 `<PREFIX>-NNNN.md`, 프로젝트는 `PRJ-*`를 사용한다.
- `type`: `decision`, `project`, `knowledge`, `lesson`.
- `project`: 안정적인 소문자 식별자. 공통 지식은 `shared`를 사용한다.
- `status`: 결정은 `proposed`, `accepted`, `superseded`, `rejected`; 프로젝트는 `active`, `paused`, `archived`; 그 외는 `draft`, `published`.
- `created_at` / `updated_at`: ISO 날짜(`YYYY-MM-DD`), 생성일 이후 수정일을 사용한다.
- `evidence_level`: `source-verified`(출처 확인), `user-confirmed`(사용자 확정), `unverified`(추정·미확인).
- `sources`: 확인 가능한 URL 목록. 비어 있으면 본문에 근거와 한계를 설명한다.
- `depends_on`: 선행 기록 ID.
- `supersedes`: 이 결정이 대체하는 기존 결정 ID.
- `related_to`: 비방향 관련 기록 ID.
- 프로젝트의 선택 필드 `capture_mode`: `full`, `design-only`, `manual`. [기록 정책](capture-policy.md)과 일치해야 한다.

관계는 제목이 아닌 ID를 참조한다. 모든 ID는 기존 기록에 연결되어야 하며 related_to만으로 인과관계를 추정하지 않는다.

## 문서 작성 언어

신규·실질적으로 수정하는 Wiki 문서의 제목·본문·표 머리글·요약은 한국어를 기본으로 합니다. YAML 메타데이터, 식별자, 경로, URL 및 참조 ID는 그대로 보존합니다. 기존 영어 기록을 일괄 번역하여 이력을 변경하지 않습니다.

## 본문 계약

### 결정

```md
# 결정 요약
## 배경
## 결정
## 선택하지 않은 대안
## 결과와 제약
## 구현 및 검증
## 출처와 결정 경위
## 관련 기록
```

`accepted`는 선택 확정을 뜻한다. 구현·배포·실제 검증 성공은 별도의 근거로 기록한다.

### 프로젝트 현황

```md
# 프로젝트 이름
## 현재 상태 (기준일)
## 확정된 결정
## 제약 조건
## 미해결 질문과 다음 작업
## 근거와 검증 범위
```

프로젝트 현황은 최신 확인 상태를 담되 과거 결정을 덮어쓰지 않는다. 현재 상태를 모르면 미검증으로 표시한다.

### 지식 / 교훈

짧은 제목, 주장, 적용 조건, 근거, 한계와 관련 ID를 기록한다.

## 갱신 및 조회 규칙

1. 신규 기록 전 ID·제목·의미 중복을 확인한다.
2. 파일 하나에 독립 결정 하나를 기록한다. 대화 원문을 저장하지 않는다.
3. 관련 색인과 프로젝트 현황을 갱신한다.
4. 의미·관계 변경 시 updated_at을 갱신한다.
5. supersedes 관계를 따라 현재 결정의 유효성을 확인한다.
6. depends_on 순환과 끊긴 관계 ID를 금지한다.
7. 의미가 바뀐 확정 결정은 기존 근거를 덮어쓰지 않고 새 기록으로 남긴다.
