# AI Wiki evidence intake

This directory is a review queue, **not** canonical AI memory. The scheduled/manual workflow collects public GitHub merged PR metadata from CSForge and PawCycle. It stores a deterministic rolling list of up to 12 recently merged PRs per project. Titles are untrusted source data, not prompts or decisions.

## Operating procedure

1. Read [merged PR candidates](merged-pr-candidates.md) once the scheduled action has generated the file. Do not infer running production or business correctness from merged PR titles.
2. Cross-check the linked PR body, merge status, exact main commit, CI, runtime evidence, and current project snapshot.
3. If a durable decision is confirmed, create a unique record in [decisions](../decisions/WIKI-0001.md) using [schema](../schema.md), and update [index](../index.md), project snapshot and monthly history together.
4. If evidence is inconclusive or the source conflicts, append an open question to the snapshot instead of falsely claiming a verified result.
5. Use a review PR. No source-intake job auto-accepts decisions, auto-merges PRs or writes to unrelated repositories.

## Automation

- [Wiki PR intake workflow](../../.github/workflows/wiki-intake.yml): daily at 23:17 UTC / 08:17 KST **only if** the repository variable WIKI_INGEST_ENABLED is set to true; manual workflow_dispatch is also available after the workflow is on main.
- [Wiki verification workflow](../../.github/workflows/wiki-validation.yml) validates metadata, graph links and source queue tests for relevant PRs.
- Intake creates a **separate review PR** when the generated merged-PR list differs; if a prior intake PR is open, the next scheduled run skips rather than creating duplicates.
- GitHub Actions may require repository settings to allow workflow-created PRs. If permission is disabled, the workflow will fail safely and no main changes are made.
- This does not read ChatGPT, Work or Codex conversations. Those tools must write user-confirmed decisions explicitly through their authorized GitHub access. Never publish private session transcripts to this public repo.

## Full-mode PR journals

The same scheduled workflow also runs [wiki_journal.py](../../scripts/wiki_journal.py) to stage **append-only**, ID-deduplicated monthly Journal evidence for CSForge and PawCycle. DevPedia is design-only and excluded from automatic PR history ingestion. Existing Dark Todo Wiki records are retained but no longer included in this new ongoing capture policy. See [capture-policy.md](../capture-policy.md).

## AI conversation handoff candidates

The [cross-client handoff contract](../handoff.md) allows ChatGPT, Work and Codex to submit **explicitly owner-confirmed, public-safe summaries** rather than private chat transcripts. The [GitHub Issue workflow](../../.github/workflows/wiki-handoff.yml) converts owner-authored `[wiki]` Issues into `handoffs/issue-N.md` review candidates, but never canonical decisions. Independently verify and promote via a separate reviewed PR.
