# PawCycle 역사적 결정 인벤토리 — 선별 기록과 전수 소급 연결 (2026-11-03)

> 이 인벤토리는 **조사·등록 상태 관리** 문서이며, 현재 Production 사실이나 승인된 ADR 자체가 아니다. 근거는 2026-11-03에 읽은 `pawcycle-commerce` main `540464a9b875f7bc6bdda11ecf499efdea2e2d43`과 공개 PR·Wiki다. 과거 ChatGPT 대화의 일부 결정 단서를 확인했으나 원문 전체는 확보하지 못했다. 누락된 이유는 GitHub Issue 본문·작업 결과 댓글, 병합 PR, 최신 코드·테스트로 역추적한다. 명시적 대화 결론과 저장소 근거를 구별하고 기각 대안을 임의로 채우지 않는다.

## 분류 기준

- **등록:** 사용자/제품 계약/Accepted ADR과 병합 PR 등으로 선택 근거를 독립 확인했고 Wiki Decision을 작성했다.
- **추가 조사:** 승인·구현·후속 변경 중 한 경계 이상이 더 필요하다.
- **보류:** 원본이 Proposed이거나 논의의 최종 선택 근거가 없어 accepted로 등록할 수 없다.
- **기존 기록:** 같은 의미의 Wiki Decision이 있으므로 중복 생성하지 않는다.
- **과거 결정 시점:** 문서에 근거가 있는 날짜만 표기한다. PR 병합일은 결정일 대신 사용하지 않는다.

| ID | 우선 | 주제 / 주요 원본 | 확인된 과거 시점 | 문서가 보여주는 선택·대안 | 대화 원문 | 현재 판정 및 등록 |
| --- | --- | --- | --- | --- | --- | --- |
| H01 | P1 | [PS-001](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/product/PS-001-first-mvp-domain-scope.md), PS-002, ARCH-001 | 확정일 미확인 | 단일 SKU 생성·조회 수직 범위, 일반 구매·결제·배송 후속; ARCH-001은 Proposed | 미확보 | [PWC-0003](../decisions/PWC-0003.md) — 제품 승인만 등록 |
| H02 | P1 | [PS-004](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/product/PS-004-second-mvp-requirements.md), DOMAIN-002 | 확정일 미확인 | Pet·PlanVersion·snapshot 및 pending 도입; 최초 MVP는 역사적으로 보존 | 미확보 | [PWC-0004](../decisions/PWC-0004.md) — 승인 제품·도메인만 등록 |
| H03 | P1 | ARCH-007 Proposed, [PR #87](https://github.com/guseoh/pawcycle-commerce/pull/87), [Issue #356](https://github.com/guseoh/pawcycle-commerce/issues/356), [PR #357](https://github.com/guseoh/pawcycle-commerce/pull/357), 현재 코드 | 08-02 Proposed·최초 확인 구현 PR #87 병합, 10-08 T09 승인·병합 | PR #87에 이미 `FOR UPDATE`와 version CAS 공존. **초안에서 변경한 별도 승인 이유 미확보** | 일부 대화 맥락 + 코드 patch 확인 | [PWC-0014](../decisions/PWC-0014.md) — 08-02 구현·10월 보존 결정 확인, ARCH-007 Proposed 유지 |
| H04 | P1 | [PS-005](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/product/PS-005-subscription-automation-requirements.md), ARCH-008, [PR #121](https://github.com/guseoh/pawcycle-commerce/pull/121) | 2026-08-10 승인; 08-11 PR 병합 | Schedule별 REQUIRES_NEW + row lock + unique, 배치 전체 TX·분산락·DLQ 보류 | 미확보 | [PWC-0005](../decisions/PWC-0005.md) 등록 |
| H05 | P1 | [ARCH-011](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-011-subscription-v2-runtime-structure.md), [PR #141](https://github.com/guseoh/pawcycle-commerce/pull/141) | 2026-08-14 PR 병합 | V2 JDBC store는 SQL, application은 유스케이스·TX 소유; 이후 전환은 별개 | 미확보 | [PWC-0006](../decisions/PWC-0006.md) 역사 기록 |
| H06 | P1 | [ARCH-009](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-009-commerce-runtime-refactoring.md), [PR #139](https://github.com/guseoh/pawcycle-commerce/pull/139) | 2026-08-13 PR 병합 | Commerce 책임 분리/JPA validate/Lock·CAS SQL 유지; API·V1–V19 불변 | 미확보 | [PWC-0008](../decisions/PWC-0008.md) 역사 기록 |
| H07 | P2 | [AUTH-003](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/AUTH-003-session-authentication-approved-inputs.md), [PR #34](https://github.com/guseoh/pawcycle-commerce/pull/34) | 2026-07-10 승인; 07-12 PR 병합 | Session·CSRF·credential 계약. AUTH-002는 Proposal | 미확보 | [PWC-0007](../decisions/PWC-0007.md) 등록 |
| H08 | P2 | [ARCH-010](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-010-authentication-provider-ownership.md), [PR #140](https://github.com/guseoh/pawcycle-commerce/pull/140) | 2026-08-13 PR 병합 | AuthenticationProvider가 BCrypt 및 principal 생성 책임 소유 | 미확보 | 추가 조사 — 후속 Batch |
| H09 | P1 | [ARCH-013](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-013-rds-single-az.md), [PR #154](https://github.com/guseoh/pawcycle-commerce/pull/154), [Issue #157](https://github.com/guseoh/pawcycle-commerce/issues/157), [#158](https://github.com/guseoh/pawcycle-commerce/issues/158) | 2026-08-18 승인·RDS 생성 보고, 10-23 rehearsal 타깃 폐기 | Docker MySQL 대비 RDS Single-AZ 비용/백업/Failure Domain; **RDS 생성 보고 확인, cutover/restore 실증 아님** | PR·Issue·댓글로 보강 | [PWC-0011](../decisions/PWC-0011.md) — Historical, 이후 OCI 전환으로 superseded |
| H10 | P1 | [Issue #276](https://github.com/guseoh/pawcycle-commerce/issues/276), [PR #277](https://github.com/guseoh/pawcycle-commerce/pull/277), 운영 개요 | 2026-09-04 운영 방향 전환(초기 서울 후보); 이후 운영 상태 별도 검증 | 비용 통제로 AWS 종료·OCI Always Free/ARM64/Managed MySQL 방향; **#277 Closed/Unmerged는 완료 근거 아님** | 과거 프로젝트 대화 일부 및 Issue 직접 확인 | [PWC-0013](../decisions/PWC-0013.md) — AWS 목표 대체 결정. 최신 live OCI topology는 별도 미검증 |
| H11 | P2 | [ARCH-014](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-014-product-list-redis-cache.md), [PR #203](https://github.com/guseoh/pawcycle-commerce/pull/203), [#219](https://github.com/guseoh/pawcycle-commerce/pull/219), [Issue #216](https://github.com/guseoh/pawcycle-commerce/issues/216), 현재 ProductListCache/Tests | 2026-08-23 승인; 08-24 Phase 10 KEEP | generation Lua + afterCommit으로 refill race 방지; v1→v2 변경 및 실측 개선 범위 확인 | ADR·PR·Issue·코드로 보강 | [PWC-0009](../decisions/PWC-0009.md) 등록 — local synthetic evidence, Production 아님 |
| H12 | P2 | [ARCH-015](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-015-ai-product-recommendation-boundary.md), [PR #219](https://github.com/guseoh/pawcycle-commerce/pull/219), 현재 RecommendationService/AiConfiguration/Tests | 2026-08-24 PR 병합 | 서버 후보·소유권·사후 재검증·fallback, AI opt-in, 개인정보·의료 필터 | ADR·PR·코드로 보강 | [PWC-0010](../decisions/PWC-0010.md) 등록 — 외부 AI/Production 활성화 미검증 |
| H13 | P2 | ARCH-012, [PR #287](https://github.com/guseoh/pawcycle-commerce/pull/287), [PR #293](https://github.com/guseoh/pawcycle-commerce/pull/293) | 09-09/11 병합 | AWS separate-host vs OCI same-host Lean·network correction | GitHub·ADR 보강 | [PWC-0015](../decisions/PWC-0015.md) 등록, Issue #300 당시 calibration PASS 확인; 현재 live overhead 미검증 |
| H14 | P2 Lesson | [PR #293](https://github.com/guseoh/pawcycle-commerce/pull/293), ARCH-012 | 2026-09-11 | internal Docker network에서 설정과 달리 runtime ports null·localhost refused | 실제 장애 근거 | [PWL-0001](../lessons/PWL-0001.md) 등록 |
| H15 | P2 Lesson | [PERF-PH9-014](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/performance/PERF-PH9-014-phase9-conclusion.md) | Phase 9 종료(실험일 별도 확인) | JFR Duration 0s, sample 0, aggregate 부재 → hotspot NO CHANGE | 기존 실험 보고서 | [PWL-0002](../lessons/PWL-0002.md) 등록 |
| H16 | P2 | [Issue #202](https://github.com/guseoh/pawcycle-commerce/issues/202), [#216](https://github.com/guseoh/pawcycle-commerce/issues/216), [PR #215](https://github.com/guseoh/pawcycle-commerce/pull/215), [#217](https://github.com/guseoh/pawcycle-commerce/pull/217) | 2026-08-24 Phase 10 종료 판정 | Scheduler tuning KEEP, bounded worker/async DEFER, Queue/Kafka/Outbox/DLQ NOT SELECTED. 영구 REJECT 아님 | PR·Issue·실험 결론으로 보강 | [PWC-0012](../decisions/PWC-0012.md) 등록 — 재검토 트리거 기록 |
| H17 | P3 | [PWC-0001](../decisions/PWC-0001.md) / [PWC-0002](../decisions/PWC-0002.md), [PR #500](https://github.com/guseoh/pawcycle-commerce/pull/500) | 2026-11-03 기존 기록·PR 병합 | Production activation과 저장소 준비 구분, OCI A1 guarded worker, Wiki Capture gate | 이번 세션에서 사용자 승인 확인 | 기존 Decision 중복 없음. PR #500은 Journal/운영 규칙 참고, 별도 결정 생성 보류 |
| H18 | P1 | [Payment #417](https://github.com/guseoh/pawcycle-commerce/issues/417), [PR #450](https://github.com/guseoh/pawcycle-commerce/pull/450) | 2026-10-22 policy; 10-23 merge | query-only first, auto reconfirm forbidden, Phase 2 unresolved | Issue/PR/code | [PWC-0016](../decisions/PWC-0016.md), [PWL-0003](../lessons/PWL-0003.md) |
| H19 | P1 | [Checkout deadlock #331](https://github.com/guseoh/pawcycle-commerce/issues/331) | 2026-10-06 | missing-row supremum gap and insert-intention; replay lock removed only | MySQL/PR report | [PWL-0004](../lessons/PWL-0004.md) |
| H20 | P1 | [Shared-SKU #335](https://github.com/guseoh/pawcycle-commerce/issues/335), [PR #336](https://github.com/guseoh/pawcycle-commerce/pull/336) | 2026-10-06 | Inventory locking read + CAS KEEP, valid 10 RPS After; upper limit unknown | report and code | [PWC-0017](../decisions/PWC-0017.md) |
| H21 | P1 | [Hikari/CPU #191](https://github.com/guseoh/pawcycle-commerce/issues/191), [#193](https://github.com/guseoh/pawcycle-commerce/issues/193) | 2026-08-23 | Hikari20 REJECT, CPU2 partial, no proven Java hotspot | issues | [PWL-0005](../lessons/PWL-0005.md) |
| H22 | P1 | [Checkout evidence #331](https://github.com/guseoh/pawcycle-commerce/issues/331), [#333](https://github.com/guseoh/pawcycle-commerce/issues/333), [#335](https://github.com/guseoh/pawcycle-commerce/issues/335) | 2026-10-06 | invalid dropped/fixture/image runs; isolated 20 RPS NO_CHANGE | reports | [PWL-0006](../lessons/PWL-0006.md) |
| H23 | P2 | [AWS Backend incident #146](https://github.com/guseoh/pawcycle-commerce/issues/146) | 2026-08-14 | Prometheus up/down/up, frontend 200 misleading, precise MTTR unknown | operational comment | [PWL-0007](../lessons/PWL-0007.md) |
| H24 | P2 | [AWS alert #151](https://github.com/guseoh/pawcycle-commerce/issues/151) | 2026-08-15 | actual delivery verified, scheduled/dedupe deferred | operational comment | [PWC-0018](../decisions/PWC-0018.md) |
| H25 | P2 | [OCI calibration #300](https://github.com/guseoh/pawcycle-commerce/issues/300) | 2026-09-22 | historical OFF/ON PASS and same-host KEEP; current state unverified | completion comment | existing [PWC-0015](../decisions/PWC-0015.md) enriched |
| H26 | P2 | [Authentication PR #140](https://github.com/guseoh/pawcycle-commerce/pull/140), ARCH-010 | 2026-08-13 | Provider owns BCrypt/Principal, Session contract unchanged | Accepted ADR/code | [PWC-0019](../decisions/PWC-0019.md) |
| H27 | P1 | [AI transaction #437](https://github.com/guseoh/pawcycle-commerce/issues/437), [PR #440](https://github.com/guseoh/pawcycle-commerce/pull/440) | 2026-10-21 | AI outside transaction, stale summary overwrite guarded | PR/MySQL test | [PWC-0020](../decisions/PWC-0020.md) |
| H28 | P1 | [UTC/legacy #448](https://github.com/guseoh/pawcycle-commerce/issues/448), [PR #451](https://github.com/guseoh/pawcycle-commerce/pull/451) | 2026-10-22 policy, 10-23 merge | accept legacy reinterpretation, no raw data repair | policy/PR/code | [PWC-0021](../decisions/PWC-0021.md) |
| H29 | P1 | [F01 Payment Cart version #414](https://github.com/guseoh/pawcycle-commerce/issues/414), [PR #415](https://github.com/guseoh/pawcycle-commerce/pull/415) | 2026-10-20 | Item change -> Cart version +1 once, no-op version unchanged, F07 independently Open | MySQL/code/Issue final | [PWC-0022](../decisions/PWC-0022.md) |
| H30 | P1 | [Architecture V2 #339](https://github.com/guseoh/pawcycle-commerce/issues/339), [PR #382](https://github.com/guseoh/pawcycle-commerce/pull/382), [#438](https://github.com/guseoh/pawcycle-commerce/pull/438) | 2026-10-08 approved; 10-21 closure | Runtime direct JdbcTemplate 0; Native KEEP; 21 Adapter KEEP; isolated 9 | Final issue comments and code | [PWC-0023](../decisions/PWC-0023.md) |
| H31 | P2 | [One-shot Catalog #231](https://github.com/guseoh/pawcycle-commerce/issues/231), [PR #232](https://github.com/guseoh/pawcycle-commerce/pull/232), [#259–261](https://github.com/guseoh/pawcycle-commerce/pull/261) | 2026-08-26~30 | No Production startup seed, validate/approved apply, canonical customer target, no runtime apply claim | PR/CLI/runbook | [PWC-0024](../decisions/PWC-0024.md) |
| H32 | P1 | [OCI Release #471](https://github.com/guseoh/pawcycle-commerce/issues/471), [PR #472](https://github.com/guseoh/pawcycle-commerce/pull/472), [#475](https://github.com/guseoh/pawcycle-commerce/pull/475) | 2026-10-28 | Exact SHA/digest/source, protected state/lock, DB compatibility and capacity; unknown rollback fail-closed | PR/Runbook/source | [PWC-0025](../decisions/PWC-0025.md) |
| H33 | P1 | [Host Pull CD #473](https://github.com/guseoh/pawcycle-commerce/issues/473), [#474](https://github.com/guseoh/pawcycle-commerce/pull/474), [#486](https://github.com/guseoh/pawcycle-commerce/pull/486), [#490](https://github.com/guseoh/pawcycle-commerce/pull/490) | 2026-10-28~31 | OFF then restricted frontend cosmetic then application-v1 service-scoped; unsafe changes manual | PR/Controller code | [PWC-0026](../decisions/PWC-0026.md) |
| H34 | P1 Lesson | [OCI first transition failure #491](https://github.com/guseoh/pawcycle-commerce/pull/491), [report](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/reports/OPS-OCI-CD-011/README.md) | 2026-10-31 | Inherited paths method collision -> TypeError before service mutation; bounded correction | Actual ops report/PR code | [PWL-0008](../lessons/PWL-0008.md) |
| H35 | P1 | [BOOTSTRAP #1](https://github.com/guseoh/pawcycle-commerce/pull/1), [#3](https://github.com/guseoh/pawcycle-commerce/pull/3) | 2026-07-02 | 역할 브랜치·승인/검증 Harness, LICENSE/CODEOWNERS 당시 미결정 | PR body/report | [PWC-0028](../decisions/PWC-0028.md) |
| H36 | P1 | [PS-003 PR #13](https://github.com/guseoh/pawcycle-commerce/pull/13) | 2026-07-05 | 공개 탐색/안전한 로그인 GET/상세 이동/생성 전 날짜 미표시 4항 승인 | 승인 Product 문서 | [PWC-0027](../decisions/PWC-0027.md) |
| H37 | P1 | [FOUNDATION-000 PR #20](https://github.com/guseoh/pawcycle-commerce/pull/20) | 2026-07-06 | Java25·Boot4.1·Gradle9.1·Next16 등 추천은 Proposed; 일부만 ARCH-006 승인 | Proposed 원본 | [PWC-0032](../decisions/PWC-0032.md) |
| H38 | P1 | [ARCH-006 PR #29](https://github.com/guseoh/pawcycle-commerce/pull/29), [AUTH-003 #31](https://github.com/guseoh/pawcycle-commerce/pull/31) | 2026-07-10 | 공개 상품 2 API/세션·CSRF/3테이블/Flyway V1 등 제한 승인, Proposal 전체 승인 아님 | Approved Inputs 문서 | [PWC-0029](../decisions/PWC-0029.md) |
| H39 | P1 | [API-002 PR #35](https://github.com/guseoh/pawcycle-commerce/pull/35) | 2026-07-12 | 공개 Product API D1~D7 승인/대안, 후속 MVP3 ACTIVE SKU 별도 | Approved API 계약 | [PWC-0030](../decisions/PWC-0030.md) |
| H40 | P1 | [API-003 PR #39](https://github.com/guseoh/pawcycle-commerce/pull/39) | 2026-07-13 | 구독 API D1~D8 승인, 당시 Idempotency-Key 미도입 및 중복 POST 위험 수용 | Approved API 계약 | [PWC-0031](../decisions/PWC-0031.md) |

## GitHub·코드 역추적 메모 (2026-11-03)

이번 배치는 대화 원문이 누락된 주제에 대해 추측 대신 **Issue 승인/결과 댓글 → PR 실제 병합 범위 → 최신 main 코드/테스트 → 과거 ADR**를 교차 확인했다. 현재 코드가 당시 채택 이유를 곧바로 증명하는 것은 아니며, 변경 전후의 잠금·트랜잭션 정책은 별도 승인 근거가 필요하다.

- **H03 Subscription:** [PR #85](https://github.com/guseoh/pawcycle-commerce/pull/85)는 API-004·DATA-003·ARCH-007의 *Proposed 문서* 작업이다. [SubscriptionController](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/subscription/api/SubscriptionController.java)는 If-Match 형식·ETag·Idempotency-Replayed를 처리하고, [SubscriptionCommandApplicationService](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/subscription/application/SubscriptionCommandApplicationService.java)는 트랜잭션, idempotency replay 우선 분기와 version 증가를 확인한다. [SubscriptionAggregateQueryPersistence](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/subscription/persistence/SubscriptionAggregateQueryPersistence.java)는 `LockModeType.PESSIMISTIC_WRITE`로 소유 구독을 잠근다. 원안의 **'비관적 잠금 미도입'과 현재 구현은 일치하지 않으므로**, 재설계 의도/사용자 최종 승인을 단정하지 않고 후속 PR 탐색 대상으로 남긴다. [SubscriptionCommandIntegrationTests](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/test/java/com/pawcycle/backend/subscription/SubscriptionCommandIntegrationTests.java)도 실제 실행 재검증 전까지 저장소 테스트 존재 근거로만 사용한다.
- **H09 RDS:** [Issue #157 실제 작업 결과 댓글](https://github.com/guseoh/pawcycle-commerce/issues/157)은 private RDS를 생성하고 상태·보안·백업 보존 설정을 확인했다고 보고했다. [Issue #158 후속 마감 댓글](https://github.com/guseoh/pawcycle-commerce/issues/158)은 **migration rehearsal import/schema/Flyway 검증이 수행됐다는 증거가 없고 타깃을 폐기**했다고 명시한다. Issue closed 상태만으로 rehearsal 완료로 해석하지 않는다.
- **H11 Redis:** [ProductListCache.java](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/catalog/product/application/ProductListCache.java)의 Lua generation compare/invalidate, [ProductListCacheInvalidator.java](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/catalog/product/application/ProductListCacheInvalidator.java)의 afterCommit, [ProductListCacheTests.java](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/test/java/com/pawcycle/backend/catalog/product/application/ProductListCacheTests.java)의 stale refill·DB fallback 테스트를 확인했다. [#216](https://github.com/guseoh/pawcycle-commerce/issues/216)의 수치는 격리 실험, ProductListCache 기본값은 disabled다.
- **H12 AI:** [RecommendationService.java](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/recommendation/application/RecommendationService.java)의 Pet 소유권/후보/재검증/fallback, [RecommendationAiConfiguration.java](https://github.com/guseoh/pawcycle-commerce/blob/540464a9b875f7bc6bdda11ecf499efdea2e2d43/backend/src/main/java/com/pawcycle/backend/recommendation/infrastructure/ai/RecommendationAiConfiguration.java)의 opt-in model 구성과 [PR #219](https://github.com/guseoh/pawcycle-commerce/pull/219)의 Backend/MySQL CI 보고를 확인했다. 실제 OpenAI API 호출·비용은 미실행/미확인이다.
- **H16 Scale:** [Issue #216](https://github.com/guseoh/pawcycle-commerce/issues/216), [PR #217](https://github.com/guseoh/pawcycle-commerce/pull/217)은 `Queue/Kafka/Outbox/DLQ NOT SELECTED`를 당시 synthetic 10k 결론으로 확정했다. '영구 불필요'나 Production 성능 한계의 증거가 아니다.

## 후속 근거 확인 (2026-11-03)

- [Issue #356](https://github.com/guseoh/pawcycle-commerce/issues/356)와 [PR #357](https://github.com/guseoh/pawcycle-commerce/pull/357)은 초기 ARCH-007의 비관적 잠금 미도입 *제안*과 실제 코드의 lock 사용을 분리해 보여준다. [PR #87](https://github.com/guseoh/pawcycle-commerce/pull/87)의 신규 V2SubscriptionService patch는 `lockedOwnedSubscription ... FOR UPDATE` 및 조건부 version UPDATE를 보여주는 **초기 구현 근거**다. T09의 승인 범위는 기존 lock/CAS/replay 계약 보존이며, ARCH-007 Proposed와 달리 채택한 **별도 설계 승인 이유**는 미확인이다.
- [ARCH-012](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-012-production-observability-boundary.md)와 PR #287/#293은 AWS 별도 Host, OCI same-host 설계, OCI 실제 network 장애·correction을 시간 순으로 분리한다.
- [PERF-PH9-014](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/performance/PERF-PH9-014-phase9-conclusion.md)는 CPU pressure와 특정 Java hotspot 증거를 구분했고 잘못 종료된 JFR은 성능 원인으로 사용하지 않았다.

## 주요 검증 제한

1. **과거 대화 근거:** 개인화된 과거 대화 검색에서 정확한 원문·의사결정 시점은 확보되지 않았다. 이번 Batch에는 대화에서만 확인 가능한 대안·기각 이유를 단정하지 않았다.
2. **문서 상태:** ARCH-001과 ARCH-007은 원본상 Proposed이며, PS-004/DOMAIN-002의 Approved/Accepted 사실로 ARCH-007 전체를 승인으로 격상하지 않는다.
3. **역사 vs 현재:** ARCH-011 및 ARCH-009의 당시 소스 구조는 후속 대규모 Backend 리팩터링으로 달라질 수 있다. 이를 현재 클래스/트랜잭션 구조로 무검증 재진술하지 않는다.
4. **운영·성능:** 합쳐진 PR/CI와 실제 AWS·OCI/Production 적용·성능·복구 실행 증거는 구별한다. 오래된 운영 스냅샷과 현재 문서 사이의 차이는 후속 운영 검증 항목이다.
5. **일자:** Wiki의 `created_at`은 모두 소급 기록 생성일이고, 위 표의 명시된 과거 날짜는 각 원본의 승인/PR 시점이다.

## 후속 Batch 순서

이번 배치에서는 [PWC-0014](../decisions/PWC-0014.md), [PWC-0015](../decisions/PWC-0015.md), [PWL-0001](../lessons/PWL-0001.md), [PWL-0002](../lessons/PWL-0002.md)를 등록했다. Subscription 비관적 잠금의 최초 확인 구현 PR은 #87로 특정했지만, ARCH-007 Proposed 초안과 달라진 **별도 승인 이유**는 보류한다. H08 및 Checkout/Payment 후속 기록은 [PWC-0016](../decisions/PWC-0016.md)–[PWC-0022](../decisions/PWC-0022.md)로 등록했다. 남은 검증은 현재 OCI live 배포·회복 증거와 승인 사유 불명 항목이다. Production 실검증과 구분한다.


## Payment부터 데이터 호환성까지 후속 조사 판정 (2026-11-03)

- **Payment:** #414 closed means F01 version fixed and F07 characterized, not recovered. #417 remains Open and #450 only completed query-only Phase 1.
- **Checkout/Inventory:** Removing the unnecessary replay lookup lock and adding a necessary Inventory read lock are two distinct MySQL consistency choices. Neither generalizes to all row locks.
- **Performance:** Hikari20 was rejected under an earlier local envelope; invalid dropped/fixture/source-image results remain invalid. New 5–20 RPS isolated ladder identifies a lower stable capacity bound, not a maximum or the old failure root cause.
- **Operations:** #146/#151 are AWS historical Production execution; #300 is OCI historical calibration completion evidence. This Wiki exercise did not read the current OCI tenant, execute rollback, or restore the Production database.
- **Auth/AI/Time:** Provider-owned credential verification preserves approved Session/CSRF; AI invocation no-Tx and stale cache guard were repository tested; the user accepted changed historical HTTP timestamps without asserting legacy Instant restoration. No new Cloud/Production execution.
- Existing Redis [PWC-0009](../decisions/PWC-0009.md), Scheduler [PWC-0012](../decisions/PWC-0012.md), AWS RDS [PWC-0011](../decisions/PWC-0011.md) remain canonical and are not duplicated.


## 2026-11-03 — 후속 역사 결정 및 실패 운용 심화

- R1-01 F01 Cart version은 MySQL/PR 병합으로 repository-safe하게 교정됐지만 F07 Payment PROCESSING 복구 Issue #417은 여전히 OPEN이다.
- Architecture V2의 10월 사용자 승인 사항은 일반 Runtime 직접 `JdbcTemplate=0`이다. Native `FOR UPDATE`/CAS/미존재행/INSERT SELECT 등은 검증된 의미를 보존한다. 단순 'JPA로 모든 SQL 전환'이나 'Adapter 최소화'가 아니다. 21 Adapter KEEP과 isolated JDBC owner 9는 10월 21일 Repository Closure 근거다.
- Production Catalog import는 명시 one-shot 확인과 단일 트랜잭션/멱등성을 확보하는 저장소 선택이다. 실제 Production product count 또는 운영 DB 데이터 반영 수는 별도 당시 실행증거 없이는 확정하지 않는다.
- OCI Repository Release/Host Pull Controller는 exact main SHA/digest/DB/runtime/용량/락을 fail-closed로 검증한다. 2026-10-31 최초 실제 적용 시도에서 `CDHost.paths` 이름 충돌로 image pull/recreate 이전 STOP한 **운영 실패**를 확인했고 PR #491로 수정했다. 이 실패가 이후 실제 운영 자동배포 E2E 성공 또는 rollback/DB restore를 입증하지 않는다. 실환경은 최신 Host/Work receipt로 재검증해야 한다.
- 기존 [PWC-0001](../decisions/PWC-0001.md)의 'Repository ready ≠ Production activation' 원칙과 일치하며, 초기 Source-only 오래된 OFF 문구를 최신 live 상태로 단정하지 않는다. [PWC-0006](../decisions/PWC-0006.md)/[PWC-0008](../decisions/PWC-0008.md) 8월 구조는 당시의 선택이다.

## 범위 변경: 선별 조사 → 최초 PR #1부터 전수 소급 (2026-11-03)

이전 H01–H34는 **선별된 주요 결정·실패 사례**이며 프로젝트 전체 결정의 완전성 근거가 아니다. [전수 조사대장](pawcycle-source-ledger/README.md)에 2026-07-02 최초 PR #1부터 GitHub 공통 번호 #500까지 367 PR/133 Issue의 번호·생성일·병합/종료 상태·제목을 수집했다. 최초 별도 Issue가 #88이므로 초기 구현과 승인·제안은 대부분 PR body 및 변경된 권위 문서에 존재한다. 목록 작성 당시 전체가 상세 심사 대기였고, 최신 처리 범위는 아래 순차 배치와 대장을 따른다. 이미 작성된 결정은 원본을 재확인할 때 연결하고, 나머지는 승인 판단·대안·검증을 새로 추출한다. 모든 source가 독립 Decision인 것은 아니지만 모든 source의 **검토 결과**는 남긴다.

## 2026-07 최초 승인 원본의 Decision backfill 시작

[PWC-0027](../decisions/PWC-0027.md)–[PWC-0032](../decisions/PWC-0032.md)에 실제 원본이 명시하는 UX 네 가지, Product API 일곱 가지, Subscription API 여덟 가지, 좁은 Backend 승인, Harness 최초 결정과 FOUNDATION-000 기술 버전 **Proposed 후보**를 각각 보존했다. 승인 문서와 병합 PR은 구분하며, 이후 버전의 실제 런타임 의미를 당시 정책으로 소급하지 않는다. 이 6개 기록의 존재만으로 #1–#100의 전체 diff/comments 검토가 완료된 것은 아니다. [500-source 대장](pawcycle-source-ledger/README.md)은 metadata census이고 모든 원본의 심사와 Decision 추출은 계속 미완료다.


## 번호순 상세 배치 #11–#20 (2026-11-03)

[배치](pawcycle-source-ledger/batch-011-020.md)에서 모든 원본의 처리·근거를 남겼다. 신규 PWC-0034는 한국어/보조 AI 리뷰 운영(accepted), PWC-0035~0038은 ARCH-001/DATA-001/API-001/AUTH-001(proposed), PWL-0011은 리뷰 반영 후 남은 본문/handoff 의미 불일치다. 기존 PWC-0027/0028/0032는 원본의 선행 제안·후속 correction으로 보강하며 중복 ID를 만들지 않았다. 새 #501은 metadata만 추가했으며 상세 완료는 **#1~#20 20건**, 미완료 **#21~#501 481건**이다. [진행 상태](pawcycle-source-ledger/progress.json)에서 다음 번호를 확인한다.

## 번호순 상세 배치 #21–#30 (2026-11-03)

[배치 근거](pawcycle-source-ledger/batch-021-030.md)와 [기계 재개점](pawcycle-source-ledger/progress.json)을 갱신했다. PWC-0039는 Backend 전제·대안 계획 체인, PWC-0040은 AUTH-002 DR1~DR3 제안, PWL-0012는 실행 환경/CI 한계다. 기존 승인 PWC-0029의 2공개API+최소세션/3테이블과 구별하며 source29의 SKU 표시 가격을 제외한 것처럼 읽힐 수 있는 과거 요약도 결제 가격 정책 확장 제외로 정밀화했다. 현재 상세 완료 **30**, 미완료 **471**, 다음 **#31**이다.

## 2026-11-04 번호순 상세 배치 #31–#40

[상세 판정](pawcycle-source-ledger/batch-031-040.md)과 [source manifest](pawcycle-source-ledger/batch-031-040.sources.json)를 추가했다. 기존 PWC-0007/0030/0031은 승인→실제 구현/QA로 보강하고, PWC-0041~0043과 PWL-0013~0015를 등록했다. 원본별 112개 파일·공개 review·commit·최종 head CI metadata를 대조했지만 과거 앱/DB/전송을 재실행하지 않았다. 현재 **40개 완료 / 461개 미완료**, 다음은 **#41**이다. 인증 QA 조건부 판정·수정 후 Discord 수신은 미확인 후속으로 남는다.

## 번호순 전수 조사 #41~#50 — 2026-11-04

구독 V1 구현의 도메인/DB 날짜 경계, Frontend CSRF·비동기 인증 경쟁, local-only fixture와 쿠키·readiness 교정, 첫 MVP의 조건부 완료와 후속 접근성 QA, 성능 측정 후보→범위 승인·세부 차단을 복원했다. [배치 근거](pawcycle-source-ledger/batch-041-050.md). 신규 PWC-0044, PWC-0045, PWC-0046, PWC-0047, PWL-0016, PWL-0017, PWL-0018; 누적 50/501, 다음 #51.

## 번호순 전수 조사 #51~#60 — 2026-11-04

성능 세부 승인→순서 이탈 부분 관측→전체 재승인→native stderr/배열 SelfTest 실패→기준선 미확보 종료를 복원하고, 위험 기반 Lean Harness·AWS 준비·동일 SHA release·HTTPS의 준비/운영 경계를 연결했다. [배치 근거](pawcycle-source-ledger/batch-051-060.md). 신규 PWC-0048, PWC-0049, PWC-0050, PWC-0051, PWL-0019; 누적 60/501, 다음 #61.

## 번호순 전수 조사 #61~#70 — 2026-11-04

HTTPS 실제 발급·갱신/재부팅, S3 격리 복원과 유지보수 예외, 자동 cleanup·IAM gate의 검증 한계, 기능 차이 없는 release rollback, EC2 SNS 수동 알림, 인증 smoke·one-shot 회원 준비와 사전 gate 잔여 지적을 복원했다. [배치 근거](pawcycle-source-ledger/batch-061-070.md). 신규 PWC-0052, PWC-0053, PWC-0054, PWL-0020, PWL-0021; 누적 70/501, 다음 #71.

## 번호순 전수 조사 #71~#80 — 2026-11-04

운영 회원 wrapper·실제 회원/세션 증거, Application/Control SHA 분리와 rollback 호환성 교정, candidate DB restore 준비, 운영 안전성 판정 철회·보류와 실제 Control 왕복 검증을 시간순으로 연결했다. [배치 근거](pawcycle-source-ledger/batch-071-080.md). 신규 PWC-0055, PWC-0056, PWL-0022; 누적 80/501, 다음 #81.

## 번호순 전수 조사 #81~#90 — 2026-11-04

최소운영기준선7항목 Verified의 한계, code/metadata CI 분리·비소급 Lean 전환, MVP2 제품/legacy 정책과 Proposed 기술계약→구현 Delta, 멱등 current-read·reconciliation correction, 운영활성화 후속 Issue와 로컬volume 인증복구를 기록했다. [배치 근거](pawcycle-source-ledger/batch-081-090.md). 신규 PWC-0057, PWC-0058, PWC-0059, PWL-0023, PWL-0024; 누적 90/501, 다음 #91.

## 번호순 전수 조사 #91~#100 — 2026-11-04

AI 도구 Before 자료의 한계→Connector 대조군 재정의→읽기 capability 계약→외부 측정도구→Codex 실험군을 연결하고, 우발 Issue4개는 독립 정책 없는 사고로 판정했다. cache/중복·schema drift·권한강제 아님·모델 미수집을 보존했다. [배치 근거](pawcycle-source-ledger/batch-091-100.md). 신규 PWC-0060, PWC-0061, PWL-0025; 누적 100/501, 다음 #101.

## 번호순 전수 조사 #101~#110 — 2026-11-04

실측 기반 N+1 batch 조회, 구독별 reconciliation transaction 격리, 30일 멱등 보관·복구 호환 cleanup과 local 관측성 착수 경계를 복원했다. 병합 후 리뷰와 무효 검증을 구별했다. [배치 근거](pawcycle-source-ledger/batch-101-110.md). 신규 PWC-0062, PWC-0063, PWC-0064, PWL-0026, PWL-0027; 누적 110/501, 다음 #111.

## 번호순 전수 조사 #111~#120 — 2026-11-04

local metric·scrape 비용 수용, disposable 장애 격리, Prometheus 후보 감지와 Discord 수동 수신을 단계별로 복원했다. [배치 근거](pawcycle-source-ledger/batch-111-120.md). 신규 PWC-0065, PWC-0066, PWL-0028; 누적 120/501, 다음 #121.
