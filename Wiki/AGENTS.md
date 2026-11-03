# AI operation rules for Wiki/

## Mission

Keep a compact, evidence-aware, queryable record of decisions, present project state, and reusable lessons. Optimize for reliable AI retrieval over human-facing exposition. `Study/` remains separate and is not rewritten or duplicated.

## Read order

1. `index.md` → relevant `projects/*.md` → specific `decisions/*.md`.
2. Use `id`, `project`, `type`, `status`, and the relationship fields to narrow retrieval. Fetch source refs only when needed.
3. State the status and provenance when reporting a conclusion. A decision being `accepted` does not prove its implementation was deployed.
4. Prefer authoritative current repository or CI/PR evidence for implementation state. Old chat summaries are not proof of current production.

## Capture rules

Capture only durable information:
- **Decision:** an explicit choice, its context, rejected alternatives, consequences, and the decision maker's confirmation.
- **Project snapshot:** most recently verified state, open questions, constraints, next actions, and links to evidence.
- **Lesson / Knowledge:** reusable finding with supporting evidence.
- **History:** concise event note; not a transcript.

Do not save brainstorming, unconfirmed suggestions, entire conversations, unsupported completion claims, duplicate summaries, credentials, private messages, or personal data. Because `guseoh/cs` is public, do not persist private conversation details; use a sanitized statement of the decision only if appropriate.

## Write protocol

1. Search for an existing matching `id` or meaning before creating a file.
2. Use [schema.md](schema.md). Choose `status: proposed` until explicitly accepted. Set `evidence_level` accurately; use `unverified` for assumptions.
3. Record source URLs (PR, issue, commit, documentation) when available. Never invent links, dates, approvals, tests, or deploy results.
4. When a decision changes, **append a new decision** with `supersedes: [OLD-ID]`; set the old status to `superseded` only after verifying the replacement was accepted. Preserve the prior rationale.
5. Update the relevant project snapshot, index, and monthly history in the same change.
6. Resolve all `depends_on`, `supersedes`, and `related_to` IDs; check broken Markdown links and consistency between frontmatter and narrative.
7. Prefer a GitHub PR and review before `main` for broad changes. Never force-push `main` or override a local Obsidian device's unsynced work.

## Source and sync boundaries

GitHub is the common source for agents with access, not an automatic cross-model memory feed. Explicit retrieval and writes are required per client. Obsidian Git on desktop/laptop syncs via `main`; consult [sync guidance](../.github/OBSIDIAN_SYNC.md) before merging or pulling. No vector DB, embedding service, graph DB, local server, or paid API is required for Phase 1.
