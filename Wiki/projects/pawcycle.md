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
related_to: [PWC-0001, PWC-0002, PWC-0003, PWC-0004, PWC-0005, PWC-0006, PWC-0007, PWC-0008, PWC-0009, PWC-0010, PWC-0011, PWC-0012, PWC-0013]
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

## Historical decision backfill (source-only; 2026-11-03)
- 최신으로 조회한 GitHub main은 [540464a9b875](https://github.com/guseoh/pawcycle-commerce/commit/540464a9b875f7bc6bdda11ecf499efdea2e2d43)이다. [PR #500](https://github.com/guseoh/pawcycle-commerce/pull/500)의 Wiki Capture 연결이 병합됐다. 위의 `aa264ff`는 **초기 스냅샷 당시**의 조회 SHA이지 현재 main이 아니다.
- 소급 조사에서 제품·도메인 MVP1 [PWC-0003](../decisions/PWC-0003.md), MVP2 [PWC-0004](../decisions/PWC-0004.md), 주문 자동화 [PWC-0005](../decisions/PWC-0005.md), 당시 Subscription V2 runtime [PWC-0006](../decisions/PWC-0006.md), 세션 인증 [PWC-0007](../decisions/PWC-0007.md), 당시 Commerce runtime [PWC-0008](../decisions/PWC-0008.md)을 등록했다.
- [조사 인벤토리](../history/pawcycle-historical-decision-inventory-2026-11-03.md)는 당시 기각 대안·원본 상태와 보류 항목을 따로 관리한다. ARCH-007은 Proposed이고, 과거 ChatGPT 대화 원문은 충분히 확보되지 않았다.
- 이 추가 조사는 **GitHub source 및 PR 확인**만 수행했다. OCI live target, Backend-only 운영 E2E, Rollback, DB Restore를 새로 검증하지 않았다. 본 스냅샷의 기존 운영 관련 문구는 서로 상충할 수 있으므로 실제 현재 운영 사실로 단정해서는 안 된다.

## Historical decision backfill — PR/Issue/Code deepening (2026-11-03)
- [PWC-0009](../decisions/PWC-0009.md): Redis 상품 목록 cache의 stale refill 방지, 후속 v2 key, local/synthetic Read Scale KEEP 근거.
- [PWC-0010](../decisions/PWC-0010.md): 서버 후보/소유권 검증, AI opt-in, 호출 후 최신 구매 가능 상태 재검증 및 fallback.
- [PWC-0011](../decisions/PWC-0011.md) → [PWC-0013](../decisions/PWC-0013.md): 역사적 AWS RDS Single-AZ는 **실제 생성 보고가 있지만 migration rehearsal·cutover 완료 근거는 없음**. 장기 운영 방향은 OCI Always Free로 대체. 초기 서울 계획을 현재 OCI 운영 리전/리소스로 단정하지 않음.
- [PWC-0012](../decisions/PWC-0012.md): Phase 10 synthetic Subscription Burst에서는 scheduler tuning KEEP, bounded async DEFER, Kafka/Queue NOT SELECTED.
- [H03 조사 인벤토리](../history/pawcycle-historical-decision-inventory-2026-11-03.md): ARCH-007은 Proposed이며 현재 코드의 비관적 lock과 원안의 차이를 발견했으므로 최종 의도·승인 재확인이 필요.
- 근거 범위: ADR뿐 아니라 실제 GitHub Issue 본문/결과 댓글, 병합 PR, 현재 pinned main의 Java/테스트를 대조했다. **이번 조사에서 OCI live runtime, Redis Production, 외부 AI, AWS historical resource, workload를 직접 실행하거나 재검증하지 않았다.**

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
