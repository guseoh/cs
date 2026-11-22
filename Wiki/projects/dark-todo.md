---
id: PRJ-DARK-TODO
type: project
project: dark-todo
status: active
created_at: 2026-11-03
updated_at: 2026-11-22
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://github.com/guseoh/dark-todo-planner/pull/141
  - https://github.com/guseoh/dark-todo-planner/actions/runs/41377386788
  - https://github.com/guseoh/dark-todo-planner/actions/runs/41352204010
  - https://github.com/guseoh/dark-todo-planner/blob/main/README.md
  - https://github.com/guseoh/dark-todo-planner/commit/10e4532
depends_on: []
supersedes: []
related_to: [DTD-0001, DTD-0002, DTD-0003, DTD-0004]
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
- [DTD-0004](../decisions/DTD-0004.md): add a Windows desktop app with Tauri 2 while retaining the existing HTTPS web application and backend.

## Constraints
- Preserve stored Todo data, old INBOX records, user-selected category/memo colors, keyboard usability and backup formats.
- Keep React, the existing HTTPS application, Cloudflare Workers/Hono/D1, authentication, API contracts and the IndexedDB offline queue; do not introduce a second database or duplicate Todo form.
- Keep the Edge PWA/web application available. The Tauri WebView has a separate user-data profile, so browser login/session state must not be assumed to transfer.
- Restrict Tauri remote-content IPC to the exact trusted production origin and only the native capabilities required by the desktop shell.
- Separate deployment pipeline success from real live user validation and backup recoverability.

## Open questions and next actions
- Implement the first Tauri 2 slice on a separate branch: main window loading the existing HTTPS app, system-tray open/hide/quit, close-to-hide, and global `Ctrl+Shift+K` to focus the main window and invoke the existing quick-add flow.
- Verify the native-to-React quick-add bridge, exact remote-origin capability scope, first-login behavior, shortcut conflicts, sleep/resume, and Windows packaging on Windows 11.
- Do not add auto-start, Windows notifications, auto-update, a second mini window, or local SQLite in the first slice; assess them separately after the core flow works.
- Recheck the previously listed backup, Today ordering, Calendar and feature-scope items; their current status has not been revalidated in this update.

## Evidence and verification limits
The prior 2026-11-03 snapshot was grounded in GitHub source files and CI job results, not direct production D1 queries or live browser interaction. The Tauri 2 direction was explicitly confirmed by the user on 2026-11-22 after sharing a Codex static-analysis report based on local `main` commit `10e4532`; that report was not independently reproduced during this Wiki update. This record captures an accepted direction, not implementation completion. No Tauri source change, Windows build/runtime test, authentication test, shortcut/tray test or production deployment is claimed.
