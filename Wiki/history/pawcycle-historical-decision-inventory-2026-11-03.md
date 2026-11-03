# PawCycle 역사적 결정 인벤토리 — Phase 1 (2026-11-03)

> 이 인벤토리는 **조사·등록 상태 관리** 문서이며, 현재 Production 사실이나 승인된 ADR 자체가 아니다. 근거는 2026-11-03에 읽은 `pawcycle-commerce` main `540464a9b875f7bc6bdda11ecf499efdea2e2d43`과 공개 PR·Wiki다. 과거 ChatGPT 대화 원문 전체는 확보하지 못했으므로 기각 대안이 원본에 없는 경우 임의로 채우지 않는다.

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
| H03 | P1 | [ARCH-007](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-007-second-mvp-subscription-consistency.md), API-004, DATA-003 | 2026-08-02 제안일 | 낙관적 version/If-Match, idempotency scope unique, DB 제약; 비관적·Redis 락과 조회 시 catch-up 기각 | 미확보 | **보류:** 원본 Proposed, 후속 승인·현재 구현 세부 검증 필요 |
| H04 | P1 | [PS-005](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/product/PS-005-subscription-automation-requirements.md), ARCH-008, [PR #121](https://github.com/guseoh/pawcycle-commerce/pull/121) | 2026-08-10 승인; 08-11 PR 병합 | Schedule별 REQUIRES_NEW + row lock + unique, 배치 전체 TX·분산락·DLQ 보류 | 미확보 | [PWC-0005](../decisions/PWC-0005.md) 등록 |
| H05 | P1 | [ARCH-011](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-011-subscription-v2-runtime-structure.md), [PR #141](https://github.com/guseoh/pawcycle-commerce/pull/141) | 2026-08-14 PR 병합 | V2 JDBC store는 SQL, application은 유스케이스·TX 소유; 이후 전환은 별개 | 미확보 | [PWC-0006](../decisions/PWC-0006.md) 역사 기록 |
| H06 | P1 | [ARCH-009](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-009-commerce-runtime-refactoring.md), [PR #139](https://github.com/guseoh/pawcycle-commerce/pull/139) | 2026-08-13 PR 병합 | Commerce 책임 분리/JPA validate/Lock·CAS SQL 유지; API·V1–V19 불변 | 미확보 | [PWC-0008](../decisions/PWC-0008.md) 역사 기록 |
| H07 | P2 | [AUTH-003](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/AUTH-003-session-authentication-approved-inputs.md), [PR #34](https://github.com/guseoh/pawcycle-commerce/pull/34) | 2026-07-10 승인; 07-12 PR 병합 | Session·CSRF·credential 계약. AUTH-002는 Proposal | 미확보 | [PWC-0007](../decisions/PWC-0007.md) 등록 |
| H08 | P2 | [ARCH-010](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-010-authentication-provider-ownership.md), [PR #140](https://github.com/guseoh/pawcycle-commerce/pull/140) | 2026-08-13 PR 병합 | AuthenticationProvider가 BCrypt 및 principal 생성 책임 소유 | 미확보 | 추가 조사 — 후속 Batch |
| H09 | P1 | [ARCH-013](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-013-rds-single-az.md), [PR #154](https://github.com/guseoh/pawcycle-commerce/pull/154) | 2026-08-18 저장소 준비 승인·병합 | 당시 AWS RDS Single-AZ 준비, Multi-AZ 비용 대비 제한된 종단 HA; 운영 RDS 적용 증거 아님 | 미확보 | 추가 조사 — Historical AWS Decision |
| H10 | P1 | [PR #277](https://github.com/guseoh/pawcycle-commerce/pull/277), [운영 개요](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/architecture/production-operations-overview.md) | PR #277 미병합 종료(정확한 결정일 별도 조사) | AWS→OCI 전환, 무료 장기 운영 제약. #277 단독을 완료 근거로 사용 불가 | 일부 프로젝트 대화 요약만 확인 | 추가 조사 — 후속 대체 PR·시점 검증 |
| H11 | P2 | [ARCH-014](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-014-product-list-redis-cache.md), [PR #203](https://github.com/guseoh/pawcycle-commerce/pull/203) | 2026-08-23 승인·병합 | generation+conditional set으로 stale refill race 방지, TTL-only/delete-only 기각 | 미확보 | 추가 조사 — 다음 Cache Batch |
| H12 | P2 | [ARCH-015](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-015-ai-product-recommendation-boundary.md), [PR #219](https://github.com/guseoh/pawcycle-commerce/pull/219) | 2026-08-24 PR 병합 | 서버 후보·재검증·fallback 책임, AI는 순서·이유만; 추천 Redis/Queue/RAG 제외 | 미확보 | 추가 조사 — AI/Security Batch |
| H13 | P2 | [ARCH-012](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/adr/ARCH-012-production-observability-boundary.md), [PR #287](https://github.com/guseoh/pawcycle-commerce/pull/287) | 2026-09-09 PR 병합 | AWS 별도 모니터링 Host와 OCI same-host Lean 선택을 시대별로 구분 | 일부 과거 프로젝트 대화 요약만 확인 | 추가 조사 — Infrastructure Batch |
| H14 | P2 Lesson | [PR #293](https://github.com/guseoh/pawcycle-commerce/pull/293), ARCH-012 | 2026-09-11 확인·병합 | internal Docker network로 loopback publish가 실패; bridge 경계 보정 | 미확보 | 추가 조사 — 검증 범위와 재발 조건 |
| H15 | P2 | [PERF-PH9-014](https://github.com/guseoh/pawcycle-commerce/blob/main/docs/performance/PERF-PH9-014-phase9-conclusion.md), 성능 보고서 | 개별 실험 보고서별 확인 필요 | 수치·Dataset·환경 비교 후 SQL/JPA/Pool/Redis 판단 | 미확보 | 추가 조사 — Lesson으로 선별 |
| H16 | P2 | Kafka/Queue 도입 또는 보류, Subscription 및 Performance 문서 | 별도 확정일 미확인 | ARCH-008에서는 Kafka를 미도입; 프로젝트 전체 Kafka 영구 REJECT는 확인되지 않음 | 미확보 | **보류:** 독립 결정 여부와 재검토 트리거 확인 |
| H17 | P3 | [PWC-0001](../decisions/PWC-0001.md) / [PWC-0002](../decisions/PWC-0002.md), [PR #500](https://github.com/guseoh/pawcycle-commerce/pull/500) | 2026-11-03 기존 기록·PR 병합 | Production activation과 저장소 준비 구분, OCI A1 guarded worker, Wiki Capture gate | 이번 세션에서 사용자 승인 확인 | 기존 Decision 중복 없음. PR #500은 Journal/운영 규칙 참고, 별도 결정 생성 보류 |

## 주요 검증 제한

1. **과거 대화 근거:** 개인화된 과거 대화 검색에서 정확한 원문·의사결정 시점은 확보되지 않았다. 이번 Batch에는 대화에서만 확인 가능한 대안·기각 이유를 단정하지 않았다.
2. **문서 상태:** ARCH-001과 ARCH-007은 원본상 Proposed이며, PS-004/DOMAIN-002의 Approved/Accepted 사실로 ARCH-007 전체를 승인으로 격상하지 않는다.
3. **역사 vs 현재:** ARCH-011 및 ARCH-009의 당시 소스 구조는 후속 대규모 Backend 리팩터링으로 달라질 수 있다. 이를 현재 클래스/트랜잭션 구조로 무검증 재진술하지 않는다.
4. **운영·성능:** 합쳐진 PR/CI와 실제 AWS·OCI/Production 적용·성능·복구 실행 증거는 구별한다. 오래된 운영 스냅샷과 현재 문서 사이의 차이는 후속 운영 검증 항목이다.
5. **일자:** Wiki의 `created_at`은 모두 소급 기록 생성일이고, 위 표의 명시된 과거 날짜는 각 원본의 승인/PR 시점이다.

## 후속 Batch 순서

다음으로 ARCH-007 후속 승인·코드 경계 확인, AWS RDS/OCI·Observability 역사 비교, Redis 캐시·AI 추천의 성능/보안 효과 근거 검증, 실측 기반 Lesson을 진행한다. 근거가 없는 항목은 계속 보류한다.