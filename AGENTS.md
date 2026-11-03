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
