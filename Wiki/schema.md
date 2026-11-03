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

Relations reference **IDs**, never raw titles. IDs in these three arrays must resolve to another existing record. A file path, Markdown link, or Obsidian wikilink can be included in the body for human navigation. Do not infer causation from `related_to`.

## Body contracts

### Decision

```md
# Decision summary
## Context
## Decision
## Rejected alternatives
## Consequences and constraints
## Implementation/verification
## Provenance
## Related records
```

A decision's `status: accepted` means a choice was confirmed; implementation and production verification are **separate facts**. Record them only with evidence.

### Project snapshot

```md
# Project name
## Current state (as of date)
## Accepted decisions
## Constraints
## Open questions and next actions
## Evidence and verification limits
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
