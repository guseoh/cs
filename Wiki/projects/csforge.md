---
id: PRJ-CSFORGE
type: project
project: csforge
status: active
created_at: 2026-11-03
updated_at: 2026-11-03
evidence_level: source-verified
capture_mode: full
sources:
  - https://github.com/guseoh/csforge/pull/293
  - https://github.com/guseoh/csforge/pull/295
  - https://github.com/guseoh/csforge/pull/288
  - https://github.com/guseoh/csforge/blob/main/.github/workflows/content-sync.yml
depends_on: []
supersedes: []
related_to: [CSF-0001, CSF-0002]
---
# CSForge — source-verified project snapshot

## Current state (checked 2026-11-03)
- Observed default branch main commit: [5f7f55935f6f](https://github.com/guseoh/csforge/commit/5f7f55935f6f3debc259cfc82327aac9a70bdec5) (2026-10-31).
- Java G3 editorial diagrams: [PR #293](https://github.com/guseoh/csforge/pull/293) merged into main on 2026-10-31.
- Follow-up Java G3 P2 quality polish: [PR #295](https://github.com/guseoh/csforge/pull/295) remains **OPEN/unmerged**, even though isolated Chromium QA and PR validation passed for head 997393f.
- Cross-area Topic/Concept/Question guarded canonical sync implementation: [PR #288](https://github.com/guseoh/csforge/pull/288) merged; actual runtime sync is gated by role and repository variables in the content-sync workflow.
- Source evidence does not prove current production canonical DB alignment, active sync flags, Vercel deployment SHA, authenticated Reader usage or latest production data state.

## Accepted decisions
- [CSF-0001](../decisions/CSF-0001.md): protected canonical content sync.
- [CSF-0002](../decisions/CSF-0002.md): semantically appropriate Java editorial visualization.

## Constraints
- Preserve personal learning progress and history-bearing question semantics.
- Do not treat merged code, green CI, and live data synchronization as equivalent.
- PR #295 excludes Reader typography issue #294; it requires separate resolution.

## Open questions and next actions
- Review PR #295; actual authenticated Reader/PWA checks remain unverified by its PR description.
- Inspect current production content-sync runs and data audit before claiming alignment.
- Confirm live backend/frontend revisions when a production-specific question arises.

## Evidence and verification limits
GitHub source, PR statuses and QA workflows checked 2026-11-03. No authenticated browser, production database, or cloud-control-plane access in this pass.
