---
id: PRJ-PAWCYCLE
type: project
project: pawcycle
status: active
created_at: 2026-11-03
updated_at: 2026-11-03
evidence_level: source-verified
capture_mode: full
sources:
  - https://github.com/guseoh/pawcycle-commerce/pull/496
  - https://github.com/guseoh/pawcycle-commerce/blob/main/README.md
  - https://github.com/guseoh/pawcycle-commerce/blob/main/docs/architecture/production-operations-overview.md
  - https://github.com/guseoh/pawcycle-commerce/actions/runs/41583493924
depends_on: []
supersedes: []
related_to: [PWC-0001, PWC-0002]
---
# PawCycle Commerce — source-verified project snapshot

## Current state (checked 2026-11-03)
- Observed main commit: [aa264ff996e0](https://github.com/guseoh/pawcycle-commerce/commit/aa264ff996e0167815f9138264fded36128882f7) (2026-11-03).
- [PR #496](https://github.com/guseoh/pawcycle-commerce/pull/496) merged a guarded OCI A1 provisioning worker. **Actual OCI tenant preflight, worker Host installation/activation, live instance launch and app/DB deployment were out of scope.**
- [Main Repository Validation](https://github.com/guseoh/pawcycle-commerce/actions/runs/41583493924) and [image publish](https://github.com/guseoh/pawcycle-commerce/actions/runs/41583493907) workflows succeeded. Neither proves a running production deployment.
- Source discrepancy requiring reconciliation: [README](https://github.com/guseoh/pawcycle-commerce/blob/main/README.md) says Production deployment target **none**, while [operations overview](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/architecture/production-operations-overview.md) identifies **OCI app01**, with limited 2026-10-25 healthy observations. Current live target/health is **unresolved**, not silently inferred.
- Host Pull CD, automated application deployment and zero-downtime deployment are marked DEFER/OFF in the current operations overview.

## Accepted decisions
- [PWC-0001](../decisions/PWC-0001.md): CD activation requires independent runtime approval and recovery evidence.
- [PWC-0002](../decisions/PWC-0002.md): bounded, guard-railed OCI A1 acquisition plan.

## Constraints
- Never claim cloud readiness, current billing eligibility, recovery or production activation merely from source or CI.
- Never execute OCI/paid resource mutations from Wiki tooling.
- Expiry and uncertain-launch gates in PR #496 must be respected before any operational activation.

## Open questions and next actions
- Reconcile current target docs with fresh OCI control-plane and app health evidence.
- Confirm approved execution Host and Always Free account eligibility for A1 acquisition; neither was verified here.
- Keep automation off until independent operational approval and tests.

## Evidence and verification limits
GitHub PRs, README, ops documentation and CI status only. No OCI console, account billing, live VM capacity or production E2E verification.
