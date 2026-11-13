# LLM Wiki record schema — v1

Records are UTF-8 Markdown with Obsidian-compatible YAML frontmatter. Prefer **stable IDs**, small files, and relative Markdown links. Keep metadata machine-friendly; use narrative prose only to explain causality or uncertainty.

## Required frontmatter for records

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

- `id`: globally unique and immutable; decision files use `<PREFIX>-NNNN.md`. Project records may use `PRJ-*`.
- `type`: `decision`, `project`, `knowledge`, or `lesson`.
- `project`: stable, lowercase slug; use `shared` for cross-project knowledge.
- `status`: decisions use `proposed`, `accepted`, `superseded`, or `rejected`; project snapshots use `active`, `paused`, or `archived`. Other record types use `draft` or `published`.
- `created_at` / `updated_at`: ISO calendar date (`YYYY-MM-DD`), not assumed from deployment history.
- `evidence_level`: `source-verified` (linked and checked), `user-confirmed` (direct user statement, no independent source required), or `unverified` (inferred/pending).
- `sources`: list of verifiable URLs **when available**. Empty is allowed, but explain the origin and limitations in the body.
- `depends_on`: IDs of prerequisite records.
- `supersedes`: IDs of earlier decisions this accepted decision replaces.
- `related_to`: non-directional context links; use on both records where helpful.
- Optional project snapshot field `capture_mode`: `full`, `design-only`, or `manual`; its meaning is defined by [capture-policy.md](capture-policy.md). Do not infer automatic recording from mere project presence in the index.

Relations reference **IDs**, never raw titles. IDs in these three arrays must resolve to another existing record. A file path, Markdown link, or Obsidian wikilink can be included in the body for human navigation. Do not infer causation from `related_to`.

## 문서 작성 언어

새로 작성하는 Wiki 문서의 제목·소제목·표 머리글·본문·요약은 한국어로 작성한다. 기술 식별자(예: `SubscriptionSnapshot`, `current_snapshot_id`), 경로·URL, 참조용 ID, YAML 메타데이터 키와 고정 값은 원문을 보존한다. 아래 본문 템플릿은 한국어를 기준으로 하며, 기존 영어 기록의 일괄 번역을 요구하지 않는다.

## Body contracts

### Decision

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

A decision's `status: accepted` means a choice was confirmed; implementation and production verification are **separate facts**. Record them only with evidence.

### Project snapshot

```md
# 프로젝트 이름
## 현재 상태 (기준일)
## 확정된 결정
## 제약 조건
## 미해결 질문과 다음 작업
## 근거와 검증 범위
```

Project snapshots are mutable and summarize the current known state, but must not silently rewrite historical decisions. If the current state is unknown, say **unverified** instead of filling it from past chat.

### Knowledge / Lesson

Use a short title, claim, applicability, evidence, limitations, and related IDs. A lesson is about reproducible learning, not an unverified postmortem.

## Updating and retrieval conventions

1. Search existing IDs and titles before adding records.
2. One durable decision per file. Never insert verbatim chat logs.
3. Keep the `Wiki/index.md` entry and relevant project snapshot updated with new IDs.
4. Update `updated_at` when meaning or relationships change.
5. Trace `supersedes` chains when determining what is currently authoritative.
6. Keep `depends_on` acyclic and do not create dangling IDs.
7. Git history captures revisions, but a material change of **decision** needs a new record rather than rewriting accepted rationale.

This is a deliberately small Phase 1 schema. Full-text, vector, and graph indexes can later be generated from these Markdown records without changing the canonical source.
