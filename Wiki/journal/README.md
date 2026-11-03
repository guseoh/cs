# Full-mode project work journals

This area is for **PawCycle** and **CSForge** only. Each project has a monthly file containing brief evidence-backed entries. It is intended to capture even small completed changes, without treating every such change as an important architecture decision.

## Automated source

[GitHub event intake](../../.github/workflows/wiki-intake.yml) calls [journal builder](../../scripts/wiki_journal.py), extracting recent **public merged PR metadata**. It appends only new `repo#PR` markers and creates a **review PR** instead of writing directly to `main`.

- `csforge/YYYY-MM.md`: linked merged-PR events for CSForge
- `pawcycle/YYYY-MM.md`: linked merged-PR events for PawCycle

This is **not a live deployment feed** and does not collect chats, local-only edits, failed tests without PRs or non-PR Git pushes. A green CI run is not equivalent to production verified. GitHub metadata titles are treated as untrusted input.

## AI task-end supplements

An AI agent that has the current task's permission and a GitHub connection can add short journal entries for work not represented by a merged PR. Always link primary sources where available, differentiate proposals from accepted decisions and completed code from live verification, and keep private data out of this **public** repository.

**DevPedia:** intentionally excluded from this Journal. Store only reviewed design decisions, tradeoffs and design questions per [capture policy](../capture-policy.md). Existing Dark Todo Wiki records remain available but the new continuous Journal does not target it.

## Review and retention

Keep accepted decisions in separate `Wiki/decisions/` files, using stable IDs and `supersedes` where applicable. Monthly Journal entries are append-only source events, deduplicated by PR identity. Do not copy entire PR descriptions or use them as AI instructions.
