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
depends_on: []
supersedes: []
related_to: [WIKI-0001, WIKI-0002]
---

# LLM Wiki — project snapshot

## Current state (2026-11-03)

- Phase 1: Markdown-first AI context index, evidence-aware records, and explicit ID relations are being introduced on a review branch.
- Canonical repository: [guseoh/cs](https://github.com/guseoh/cs); `Study/` and `Project/` already exist and are not modified in this phase.
- This snapshot records the Wiki setup itself, **not** the live state of CSForge, Dark Todo, or PawCycle.
- Other AI clients require an accessible GitHub connection and an explicit read/write workflow; no automatic cross-session memory or capture is implied.

## Accepted decisions

- [WIKI-0001](../decisions/WIKI-0001.md): keep `Wiki/` separate from study notes.
- [WIKI-0002](../decisions/WIKI-0002.md): use the existing GitHub repository as shared Markdown source, without a new server.

## Constraints

- Do not rewrite existing study materials or the Obsidian configuration.
- Do not commit private conversation transcripts, credentials, or secrets to this public repository.
- Distinguish chosen design from completed/verified implementation.
- Keep git-sync and multi-device safety rules intact.

## Open questions and next actions

- Review and merge Phase 1 only when ready; then verify Obsidian Git synchronization on devices.
- Add one project snapshot at a time based on **currently checked** repository state and links to existing PRs/commits.
- Add meaningful decision and lesson records only when evidence and consent are clear.
- Consider semantic search or knowledge-graph tooling later if direct retrieval proves insufficient.

## Evidence and verification limits

Repository layout and visibility were checked through GitHub on 2026-11-03. The user's local devices, outstanding offline changes, and actual Obsidian synchronization were not inspected. A new Wiki file on GitHub is not proof it is already present on either device.
