---
id: PRJ-PAWCYCLE
type: project
project: pawcycle
status: active
created_at: 2026-11-03
updated_at: 2026-11-04
evidence_level: source-verified
capture_mode: full
sources:
  - https://github.com/guseoh/pawcycle-commerce/pull/496
  - https://github.com/guseoh/pawcycle-commerce/pull/502
  - https://github.com/guseoh/pawcycle-commerce/issues/399
  - https://github.com/guseoh/pawcycle-commerce/blob/main/README.md
  - https://github.com/guseoh/pawcycle-commerce/blob/main/docs/architecture/production-operations-overview.md
  - https://github.com/guseoh/pawcycle-commerce/actions/runs/41583493924
depends_on: []
supersedes: []
related_to: [PWC-0001, PWC-0002, PWC-0900, PWC-0901]
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

## A1 capacity monitoring checkpoint (source review 2026-11-04)
- **Accepted operations boundary:** [PWC-0900](../decisions/PWC-0900.md) records the 2026-11-03 report-only / Discord + Issue notification / manual A1 creation choice. The guarded worker in PR #496 is not evidence that the Auto Provisioner was activated or preflight passed; its reported Preflight is `NOT_RUN`. Always Free, no PAYG or Terraform-based scheduler transition is selected for this near-term fix.
- **Observed scheduling defect:** [main A1 Capacity Watch](https://github.com/guseoh/pawcycle-commerce/blob/caad5233269f52ccd31f6e93e54c77a464766b36/.github/workflows/oci-a1-capacity-watch.yml) requests five-minute GitHub schedules, but successful [05:34 KST](https://github.com/guseoh/pawcycle-commerce/actions/runs/41713766858) and [09:53 KST](https://github.com/guseoh/pawcycle-commerce/actions/runs/41750176513) checks on 2026-11-04 had an approximately 4h19m gap. Both reported `OUT_OF_HOST_CAPACITY`; no 5-minute operational coverage is proven. [Health Issue #399](https://github.com/guseoh/pawcycle-commerce/issues/399) documents stale checks. These are time-scoped observations, not current live OCI status.
- **Repository-only proposed transition:** [PR #502](https://github.com/guseoh/pawcycle-commerce/pull/502) is Draft/unmerged at HEAD `3f6bd04d0520dfc4431134faaa538e13bc445ce2`: Cloudflare Cron `*/5` calls existing GitHub `workflow_dispatch(check)`, worker starts `ENABLED=false`. Its offline/CI evidence does not prove Cloudflare Cron execution, OCI polling continuity, or Discord delivery.
- **Open redesign:** [PWC-0901](../decisions/PWC-0901.md) is **proposed**, not accepted. It separates schedule trigger, completed OCI check, availability notification and independent missing-heartbeat alert; Heartchecks.io or any other external monitor, alert threshold and 24h acceptance criteria require an explicit design decision and then operational approval.

## A1-specific next actions (not yet executed here)
1. Independently review PR #502 against the proposed failure-detection and real-completion contracts before corrective implementation.
2. Decide whether to use independent external heartbeat and which service/alert channel, including permissions and free-tier risks.
3. After explicit Cloud/Secret/live-check approval, validate actual five-minute coverage and alert delivery before cutting over the GitHub schedule. No production or cloud operation was performed by this Wiki update.
