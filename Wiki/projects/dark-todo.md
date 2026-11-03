---
id: PRJ-DARK-TODO
type: project
project: dark-todo
status: active
created_at: 2026-11-03
updated_at: 2026-11-03
evidence_level: source-verified
sources:
  - https://github.com/guseoh/dark-todo-planner/pull/141
  - https://github.com/guseoh/dark-todo-planner/actions/runs/41377386788
  - https://github.com/guseoh/dark-todo-planner/actions/runs/41352204010
  - https://github.com/guseoh/dark-todo-planner/blob/main/README.md
depends_on: []
supersedes: []
related_to: [DTD-0001, DTD-0002, DTD-0003]
---
# Dark Todo Planner — source-verified project snapshot

## Current state (checked 2026-11-03)
- Observed default branch main commit: [548bb7eec0b1](https://github.com/guseoh/dark-todo-planner/commit/548bb7eec0b14a95a149561101e00f78cc52d83d), merged from PR #141 on 2026-11-02.
- Current README declares React/Vite + Hono/Cloudflare Workers + D1 and the production Workers URL.
- Latest PR #141 provides Today menu dismissal on outside click/Escape, persistent drag ordering across category filters, and a denser Calendar day rail.
- [Main CI run 41377386788](https://github.com/guseoh/dark-todo-planner/actions/runs/41377386788) reports successful test/build/audit, local Worker/D1 Chromium smoke and **Deploy production** job. Independent live authenticated browser/data validation was not performed here.
- [Encrypted D1 backup run 41352204010](https://github.com/guseoh/dark-todo-planner/actions/runs/41352204010) **FAILED** on 2026-11-02 KST; no root-cause or recovery proof obtained. Do not claim healthy backups based on the README.
- [docs/feature-scope.md](https://github.com/guseoh/dark-todo-planner/blob/main/docs/feature-scope.md) has stale statements about Inbox navigation. Later PR #125 and current README supersede those UI statements.

## Accepted decisions
- [DTD-0001](../decisions/DTD-0001.md): content-first neutral UI.
- [DTD-0002](../decisions/DTD-0002.md): retire Inbox UI, retain existing INBOX data.
- [DTD-0003](../decisions/DTD-0003.md): persist Today ordering and simplify Calendar date detail.

## Constraints
- Preserve stored Todo data, old INBOX records, user-selected category/memo colors, keyboard usability and backup formats.
- Separate deployment pipeline success from real live user validation and backup recoverability.

## Open questions and next actions
- Inspect failure reason and rerun encrypted D1 backup; independently confirm a restorable artifact.
- Verify real Today drag persistence and Calendar interactions after deployment.
- Refresh outdated feature-scope documentation.

## Evidence and verification limits
Verified via GitHub source files and CI job results, not direct production D1 queries or live browser interaction.
