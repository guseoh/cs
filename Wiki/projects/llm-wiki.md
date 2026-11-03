---
id: PRJ-LLM-WIKI
type: project
project: llm-wiki
status: active
created_at: 2026-11-03
updated_at: 2026-11-03
evidence_level: source-verified
sources:
  - https://github.com/guseoh/cs
  - https://github.com/guseoh/cs/pull/10
depends_on: []
supersedes: []
related_to: [WIKI-0001, WIKI-0002]
---

# LLM Wiki — project snapshot

## Current state (checked 2026-11-03)

- Phase 1: Markdown-first AI knowledge/decision records, ID relationships, index and read/write safeguards are prepared on the branch behind [PR #10](https://github.com/guseoh/cs/pull/10), NOT yet merged to main.
- Added evidence-based source snapshots for CSForge, Dark Todo and PawCycle plus initial decisions with links to actual merged PRs, code and CI.
- Added a no-LLM GitHub merged-PR intake script and record validator. The scheduled/manual GitHub Actions workflow **becomes available only after merge to main**, and daily intake remains disabled until WIKI_INGEST_ENABLED=true.
- The candidate inbox is a review queue. Automatic promotion of candidate PRs to accepted decisions, and automatic reading of ChatGPT/Work/Codex private conversations, are NOT provided.
- Existing Study/, Project/, Obsidian settings and repository content outside new Wiki files and tools are unchanged.

## Accepted decisions

- [WIKI-0001](../decisions/WIKI-0001.md): keep Wiki distinct from Study.
- [WIKI-0002](../decisions/WIKI-0002.md): existing public GitHub repository is the shared Markdown source without a new server.

## Constraints

- Public GitHub repository: no private transcripts, credentials, sensitive operational details or personal records.
- CI green is not proof of live runtime correctness or latest production data.
- Preserve multi-device Git sync precautions and do not force-push or overwrite divergent local Vault edits.
- Promote new decisions only after verification and human review.

## Open questions and next actions

- Complete and review PR #10, merge only after accepted review/CI and check local Obsidian sync separately.
- If desired, enable WIKI_INGEST_ENABLED in the cs repository and confirm workflow-created pull-request permissions.
- Inspect first candidate inbox PR and promote only durable, verified facts into canonical records.
- Upgrade search infrastructure only when basic Markdown/ID retrieval no longer suffices.

## Evidence and verification limits

GitHub repository and PR evidence checked on 2026-11-03. No assertion that the workflow was enabled, ran, or performed automatic writes to main; no local device inspection.
