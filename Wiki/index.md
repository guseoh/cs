# LLM Wiki — AI entry point

This directory holds **retrievable context for AI tools**, not a duplicate of the existing `Study/` notes. GitHub `guseoh/cs` is the shared Markdown repository; Obsidian renders the same files after Git synchronization.

## Retrieval protocol

1. Identify the project or topic from the question.
2. Read the relevant `projects/` snapshot to establish **current state**, checking its verification timestamp and evidence.
3. Follow the IDs in `decisions/` for **why a choice was made**, alternatives, and constraints. Treat `proposed` and `superseded` records according to their status.
4. If a decision depends on another decision, traverse `depends_on`; if changed, follow `supersedes`. Consult source URLs for high-stakes or time-sensitive claims.
5. Answer with file paths/IDs and evidence, explicitly marking unknown or unverified claims. Do not load the whole vault by default.

## Project index

| Project | Snapshot | Notes |
| --- | --- | --- |
| LLM Wiki itself | [PRJ-LLM-WIKI](projects/llm-wiki.md) | Phase 1 structure, rules, next steps |

Project snapshots for other repositories should be added **after their current state is checked**, rather than guessing from old conversations.

## Decision index

| ID | State | Decision | Project |
| --- | --- | --- | --- |
| [WIKI-0001](decisions/WIKI-0001.md) | accepted | Separate the AI Wiki from existing study notes | llm-wiki |
| [WIKI-0002](decisions/WIKI-0002.md) | accepted | GitHub Markdown is the shared Wiki source | llm-wiki |

## Recording and maintenance

- [Wiki/AGENTS.md](AGENTS.md): AI read/write safeguards and update workflow
- [Wiki/schema.md](schema.md): field and relation contract
- [2026-11 history](history/2026-11.md): chronological Wiki changes

Use stable Markdown links for navigation. Relations in YAML store **record IDs**, not guessed filenames; resolve these IDs via the index or the `id` frontmatter property. New entries must be linked from the appropriate index or project snapshot.

## Coverage limits

No comprehensive archive of historical ChatGPT/Codex/Work conversations has been imported. An empty search result here does **not** prove a past decision never occurred. References to a conversation without a durable URL are labelled `user-confirmed`, not independently verifiable evidence.
