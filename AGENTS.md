# Repository agent instructions

This is an Obsidian Vault synchronized through GitHub. The existing `Study/`, `Project/`, `Book/`, attachments, and Obsidian configuration are original materials. Do not restructure, delete, or bulk-rewrite them to manage the LLM Wiki.

## AI context retrieval

- For questions about prior decisions, current project context, rejected alternatives, or follow-up work, start at [Wiki/index.md](Wiki/index.md).
- Read only the relevant project snapshot and linked records, not the entire Vault.
- Cite the underlying records and their evidence. Do not treat proposed decisions as accepted, or accepted decisions as verified deployments.
- A repository file is not automatic model memory. Each AI client must have GitHub access and must retrieve the relevant files.

## Wiki writes

- Follow [Wiki/AGENTS.md](Wiki/AGENTS.md) and [Wiki/schema.md](Wiki/schema.md).
- Make durable updates only for confirmed decisions, verified state changes, or reusable lessons; do not copy full conversations.
- Preserve existing records and refer to replacements using `supersedes`.
- This repository is public. Never store private chats, credentials, tokens, personal data, or sensitive operational details.
- Respect the multi-device sync precautions in [.github/OBSIDIAN_SYNC.md](.github/OBSIDIAN_SYNC.md). Prefer a PR for reviewed Wiki changes; never force-push `main`.

## Cross-client AI handoff

- For ChatGPT, Work, or Codex decision capture, follow [Wiki/handoff.md](Wiki/handoff.md). Prefer a reviewed direct Wiki PR; a public owner-authored `[wiki]` Issue is a portable **candidate** route only.
- Never automatically publish private conversations. The assistant must determine whether the user confirmed a durable and publicly safe summary. Do not imply cross-client background capture.

## Daily Tech auto capture

- Daily technical article archiving uses `References/Tech Articles/README.md`, **not** the Wiki capture schema. Preserve handwritten Study, Project and Wiki notes.
- The user elected a small reusable staging branch called `daily-tech`; no daily PR. Add new public articles only in `References/Tech Articles/Articles/YYYY/`, validate the exact staging SHA with Daily Tech validation CI, and advance `main` only by non-force fast-forward after confirming that main has not moved.
- Refuse to overwrite existing notes, remove files, bypass a failing/unavailable CI check, auto-merge diverged histories, or publish secrets/private content. On conflicts, stop and report the blocker; do not silently fall back to writing directly on main.
- The Notion scheduler has not been switched; do not claim automatic Obsidian archiving is active until the scheduled task is explicitly updated and tested.
