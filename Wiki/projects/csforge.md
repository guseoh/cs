---
id: PRJ-CSFORGE
type: project
project: csforge
status: active
created_at: 2026-11-03
updated_at: 2026-11-08
evidence_level: source-verified
capture_mode: full
sources:
  - https://github.com/guseoh/agent-skills/pull/3
  - https://github.com/guseoh/csforge/pull/293
  - https://github.com/guseoh/csforge/pull/295
  - https://github.com/guseoh/csforge/pull/288
  - https://github.com/guseoh/csforge/blob/main/.github/workflows/content-sync.yml
depends_on: []
supersedes: []
related_to: [CSF-0001, CSF-0002, CSF-0003]
---
# CSForge — source-verified project snapshot

## Current state (latest merge checks 2026-11-08; earlier entries noted separately)
- Latest verified main: [5a675754](https://github.com/guseoh/csforge/commit/5a6757545a0ee16b845c5a83924e4b1b9e7840e9) (squash merge of pilot PR #297 on 2026-11-08). Previously observed main 5f7f5593 was 2026-10-31.
- Java G3 editorial diagrams: [PR #293](https://github.com/guseoh/csforge/pull/293) merged into main on 2026-10-31.
- Follow-up Java G3 P2 quality polish: [PR #295](https://github.com/guseoh/csforge/pull/295) remains **OPEN/unmerged**, even though isolated Chromium QA and PR validation passed for head 997393f.
- Cross-area Topic/Concept/Question guarded canonical sync implementation: [PR #288](https://github.com/guseoh/csforge/pull/288) merged; actual runtime sync is gated by role and repository variables in the content-sync workflow.
- Source evidence does not prove current production canonical DB alignment, active sync flags, Vercel deployment SHA, authenticated Reader usage or latest production data state.

## Accepted decisions
- [CSF-0003](../decisions/CSF-0003.md): user-approved textbook-style SVG-first visualization approach and three pilot quality gates, separate from Reader deployment.
- [CSF-0001](../decisions/CSF-0001.md): protected canonical content sync.
- [CSF-0002](../decisions/CSF-0002.md): semantically appropriate Java editorial visualization.

## Constraints
- Preserve personal learning progress and history-bearing question semantics.
- Do not treat merged code, green CI, and live data synchronization as equivalent.
- PR #295 excludes Reader typography issue #294; it requires separate resolution.

## Open questions and next actions
- [agent-skills PR #3](https://github.com/guseoh/agent-skills/pull/3) merged after explicit security hardening and [final Skill validation #42448379475](https://github.com/guseoh/agent-skills/actions/runs/42448379475). ChatGPT plugin installation/usage and separate plugin SVG fixture browser QA remain **unverified**.
- [CSForge PR #297](https://github.com/guseoh/csforge/pull/297) merged into main as [5a675754](https://github.com/guseoh/csforge/commit/5a6757545a0ee16b845c5a83924e4b1b9e7840e9). The user confirmed the Heap preview's design direction; Java/TCP before/after views and the standalone three-example preview were added. Final branch [Chromium QA #42447737670](https://github.com/guseoh/csforge/actions/runs/42447737670) and Repository Validation passed. **Actual Reader integration/deployment and user acceptance of the final Java revision remain pending.**
- Review PR #295; actual authenticated Reader/PWA checks remain unverified by its PR description.
- Inspect current production content-sync runs and data audit before claiming alignment.
- Confirm live backend/frontend revisions when a production-specific question arises.

- Final design-pilot evidence: [CSForge Java coordinate-fix QA #42447737670](https://github.com/guseoh/csforge/actions/runs/42447737670) and [agent-skills security/skill QA #42448379475](https://github.com/guseoh/agent-skills/actions/runs/42448379475) passed. Both implementation PRs are merged; plugin installation, visual acceptance beyond approved Heap direction, and Reader integration remain outside completed checks.

## Evidence and verification limits
GitHub PR HEAD/main and verification workflows for #297 and agent-skills #3 rechecked 2026-11-08; older project context remains sourced to 2026-11-03. No authenticated production browser, production database, or cloud-control-plane validation was conducted for this change.
