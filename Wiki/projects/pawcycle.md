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
related_to: [PWC-0001, PWC-0002, PWC-0003, PWC-0004, PWC-0005, PWC-0006, PWC-0007, PWC-0008, PWC-0009, PWC-0010, PWC-0011, PWC-0012, PWC-0013, PWC-0014, PWC-0015, PWL-0001, PWL-0002, PWC-0016, PWC-0017, PWC-0018, PWC-0019, PWC-0020, PWC-0021, PWL-0003, PWL-0004, PWL-0005, PWL-0006, PWL-0007, PWC-0022, PWC-0023, PWC-0024, PWC-0025, PWC-0026, PWL-0008, PWC-0027, PWC-0028, PWC-0029, PWC-0030, PWC-0031, PWC-0032, PWC-0033, PWC-0034, PWC-0035, PWC-0036, PWC-0037, PWC-0038, PWL-0011, PWK-0001]
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
- 앞선 조회의 GitHub main은 [540464a9b875](https://github.com/guseoh/pawcycle-commerce/commit/540464a9b875f7bc6bdda11ecf499efdea2e2d43)였다. 이번 배치에서 조회한 main은 [caad5233269f](https://github.com/guseoh/pawcycle-commerce/commit/caad5233269f52ccd31f6e93e54c77a464766b36)이며 새 #501의 존재/병합 metadata만 확인했다. 운영 timer/알림 성공은 미확인이다. [PR #500](https://github.com/guseoh/pawcycle-commerce/pull/500)의 Wiki Capture 연결이 병합됐다. 위의 `aa264ff`는 **초기 스냅샷 당시**의 조회 SHA이지 현재 main이 아니다.
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

## Historical concurrency/Observability/performance evidence (2026-11-03)
- [PWC-0014](../decisions/PWC-0014.md): ARCH-007은 Proposed; 2026-10-08 Issue #356 승인과 PR #357은 실제 pessimistic row lock + `If-Match`·CAS·unique 실행 의미를 보존한다. PR #87(2026-08-02) 신규 구현에서 FOR UPDATE와 version CAS를 확인했으나 원래 Proposed 대비 별도 변경 승인 이유는 미확인.
- [PWC-0015](../decisions/PWC-0015.md): AWS 별도 관측 호스트의 역사적 자원 근거와 OCI same-host Lean을 구분한다. 운영 overhead·alert/recovery는 신규 검증하지 않았다.
- [PWL-0001](../lessons/PWL-0001.md): OCI Docker 29.8.0의 internal-network 구성에서 정적 publish와 runtime host listener가 달랐던 장애.
- [PWL-0002](../lessons/PWL-0002.md): Phase 9 JFR Duration 0s/ExecutionSample 0 및 aggregate 부재는 Java hotspot 근거가 아니다.
- 추가 근거는 GitHub PR·Issue·코드 및 기존 보고서이며 OCI live/MySQL/k6/JFR 재실행은 하지 않았다.

## Historical backfill — Payment → Checkout → Performance → Operations → Auth/AI/Time (2026-11-03)
- **Payment:** [PWC-0016](../decisions/PWC-0016.md), [PWL-0003](../lessons/PWL-0003.md). PR #450 query-only/error classification is Repository Verified/Merged, whereas NORMAL/PROCESSING finalization and active worker fencing remain unresolved in **Open Issue #417**. Fake Provider checks do not establish actual Toss/Production recovery.
- **Checkout/Inventory:** [PWL-0004](../lessons/PWL-0004.md) records MySQL missing-row gap deadlock and minimum replay-lock removal; [PWC-0017](../decisions/PWC-0017.md) records a separate necessary Inventory locking read plus CAS for shared SKU. These are not opposing universal lock rules.
- **Performance:** [PWL-0005](../lessons/PWL-0005.md) separates Hikari20 REJECT and CPU2.0 partial improvement; [PWL-0006](../lessons/PWL-0006.md) records invalid dropped/fixture/image runs and the bounded 20 RPS isolated NO_CHANGE. Redis/Scheduler decisions [PWC-0009](../decisions/PWC-0009.md) and [PWC-0012](../decisions/PWC-0012.md) are reused, not duplicated.
- **Historical operations:** [PWL-0007](../lessons/PWL-0007.md) records AWS Backend stop/start and misleading frontend page 200; [PWC-0018](../decisions/PWC-0018.md) records Discord/Slack delivery with scheduled/dedupe DEFER. [PWC-0015](../decisions/PWC-0015.md) now includes **historical** 2026-09-22 OCI same-host OFF/ON calibration evidence from #300; November live overhead is unverified.
- **Authentication/AI/Time:** [PWC-0019](../decisions/PWC-0019.md) records AuthenticationProvider ownership without changing Session/CSRF selection; [PWC-0020](../decisions/PWC-0020.md) records AI outside DB transaction and fingerprint guard; [PWC-0021](../decisions/PWC-0021.md) records approved legacy UTC reinterpretation.
- This Wiki change uses linked PawCycle GitHub evidence only. No new OCI/AWS/MySQL/Provider/k6/Production execution or source-repository changes.

## Historical follow-up — Cart version, JDBC/SQL, Catalog and OCI CD (2026-11-03)
- [PWC-0022](../decisions/PWC-0022.md): 2026-10-20 Payment reconciliation F01 implements Cart `version +1` exactly once for actual item mutation; it does **not** close unresolved F07 recovery [#417](https://github.com/guseoh/pawcycle-commerce/issues/417).
- [PWC-0023](../decisions/PWC-0023.md): Architecture V2 reached 2026-10-21 **repository-scoped** direct Runtime JdbcTemplate 0, isolated JDBC 9, 21 PersistenceAdapter KEEP and necessary Native SQL preservation. Earlier 2026-08 [PWC-0006](../decisions/PWC-0006.md)/[PWC-0008](../decisions/PWC-0008.md) explain historic design instead of today's class layout.
- [PWC-0024](../decisions/PWC-0024.md): Production Catalog startup seed was rejected in favor of explicit `validate/apply`; late-August Canonical Customer Catalog target added. PR/CI does not prove Production DB import happened.
- [PWC-0025](../decisions/PWC-0025.md): OCI Release Engine uses exact image/source/DB compatibility, protected approval/state/lock, bounded capacity and fail-closed restore semantics; actual DB Restore/rollback were not proven by this GitHub backfill.
- [PWC-0026](../decisions/PWC-0026.md): 2026-10-28~31 Host Pull CD evolved from OFF/policy to limited frontend-cosmetic and then service-level application-v1, with guarded main SHA, service build/digest/provenance and manual-only unsafe changes.
- [PWL-0008](../lessons/PWL-0008.md): **actual 2026-10-31 OCI first release attempt** hit CDHost inherited `paths` collision, stopping **before image pull and service replacement**. The corrected PR #491 was merged later that day. This report does not itself prove subsequent frontend-only/Backend-only E2E, live rollback or an enabled Timer.
- Operational status information earlier in this snapshot came from older README/ops documents and task-bound reports. The **latest 2026-11 live runtime/Timer state is unresolved by this GitHub-only reconstruction**; retain separately verified Work/Host receipts if available.

## Chronological source-audit progress (2026-11-03)

- [PawCycle #1–#501 original-source ledger](../history/pawcycle-source-ledger/README.md) is **fully inventoried, not fully audited**. As of this Wiki draft revision, **#1–#20 have individual detailed dispositions**, while #21–#501 remain uncompleted source-by-source; earlier PWC/PWL topic-level research is not double-counted.
- Initial collaboration/Obsidian-record correction #1–#3 is linked to [PWC-0028](../decisions/PWC-0028.md) and [PWL-0009](../lessons/PWL-0009.md). Product scope #4–#5 is linked to [PWC-0003](../decisions/PWC-0003.md). DOMAIN-001 (#7) links to [PWC-0033, PWC-0034, PWC-0035, PWC-0036, PWC-0037, PWC-0038, PWL-0011](../decisions/PWC-0033.md); Harness task-ID expansions #6/#8 link to PWC-0028; Discord/UTF-8 failures #9/#10 link to [PWL-0010](../lessons/PWL-0010.md).
- [WIKI-0003](../decisions/WIKI-0003.md) establishes that this is AI-facing, durable Project Memory with future task-end capture and traceable original evidence, **not automatic access to all AI sessions**.

## Full chronological backfill — first July approvals (2026-11-03)

The [all-500 source ledger](../history/pawcycle-source-ledger/README.md) shows why the early history must begin with PR #1: there was no separate Issue before #88. The previous PWC-0003–PWC-0026 are high-value historical highlights, not an exhaustive decision count.

- [PWC-0028](../decisions/PWC-0028.md): 2026-07-02 BOOTSTRAP-003/004 initial role branch names, commit/push after validation, user-only merge, Korean nominal commit titles, reports/handoff. Role branches are **historical**, not the current main-only + short task-branch operating rule; LICENSE/CODEOWNERS/CodeQL were not decided then.
- [PWC-0027](../decisions/PWC-0027.md): 2026-07-05 PS-003 four **Approved** UX product choices: public catalog/private subscription, safe GET after login/no POST replay, generated subscription detail after success, and no client-computed pre-create next order date.
- [PWC-0032](../decisions/PWC-0032.md): 2026-07-06 FOUNDATION-000 **Proposed** versions (Java 25, Boot 4.1, Gradle 9.1+, Node 24, Next 16, TypeScript 6, MySQL 8.4, Flyway/npm). PR merge did not accept every version.
- [PWC-0029](../decisions/PWC-0029.md): 2026-07-10 ARCH-006 user-approved **narrow** Backend/DB/Security scope; DR1–DR3 later resolved via AUTH-003. Other Proposed documents stayed Proposed.
- [PWC-0030](../decisions/PWC-0030.md): 2026-07-12 API-002 **seven** public Product API choices including alternatives. Its later MVP3 ACTIVE-SKU visibility update must be tracked at its own date.
- [PWC-0031](../decisions/PWC-0031.md): 2026-07-13 API-003 **eight** subscription API decisions. Crucially first MVP omitted `Idempotency-Key` and accepted duplicate POST risk; later V2 choices are a separate epoch.
- These are the **first detailed chronological approval examples**, not completion of #1–#100. Full PR diff, issue discussions, subsequent code and operating evidence remain to be traced for every item.

## Reverse engineering learning guide — Issue #456 migrated (2026-11-03)

- [PWK-0001](../knowledge/PWK-0001.md) is the user-confirmed, **ongoing learning playbook** for full-system Java/Spring/DB/ERD/process reverse engineering, feature-first study, flexible L1–L4 depth and a parallel read-only OCI operations track.
- [Original PawCycle Issue #456](https://github.com/guseoh/pawcycle-commerce/issues/456) preserves the source conversation and expectations. Moving the plan to Wiki does **not** mark any curriculum step complete, approve code changes, or verify live Production.
- The learner may start with Member Address CRUD; learning progress and source-backed follow-up outcomes should be recorded under the newer AI Wiki capture policy.

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


## Sequential source batch #11–#20 — 2026-11-03

[상세 원본 판정](../history/pawcycle-source-ledger/batch-011-020.md)과 [7월 연대기](../journal/pawcycle/2026-07.md)를 동기화했다. #11 Proposed UX → #13 PS-003 승인 → #14 반영은 PWC-0027에 통합했다. #12/#16 보조 AI 리뷰 운영은 [PWC-0034](../decisions/PWC-0034.md), #15/#17/#18/#19 Proposed ARCH/DATA/API/AUTH는 [PWC-0035](../decisions/PWC-0035.md)·[PWC-0036](../decisions/PWC-0036.md)·[PWC-0037](../decisions/PWC-0037.md)·[PWC-0038](../decisions/PWC-0038.md)에 분리했다. 이들 후보가 현재 Runtime 전체 승인 상태를 나타내지는 않는다.

#17 값 객체 재결정과 #19 소유자 복합 조회 표현은 본문/handoff 간 차이가 남는다([PWL-0011](../lessons/PWL-0011.md)). 원본 코드·운영은 수정하지 않았다. #20의 Gradle9.1+·제안형 제목·승인 전 우선 검토 correction은 PWC-0032에 보강했다. 전체 **501개 목록 / 20개 상세 완료 / 481개 미완료**, 다음은 **#21**이다. 의미 검증·운영 검증 미확인은 원본별 기록에 남겼다.

