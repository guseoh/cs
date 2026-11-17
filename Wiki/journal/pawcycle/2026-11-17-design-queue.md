# 결제 실패 복구와 SKU 재입고 알림 설계

> 초기 제안 원문이다. 이후 [결제 실패 복구](../../decisions/PWC-0134.md)와 [이메일 재입고 알림](../../decisions/PWC-0135.md)이 승인됐다. 재입고 발송 채널과 발송 트랜잭션은 이메일 결정 기록을 따른다.

두 설계안의 상태는 `proposed`입니다. 원격 `main`은 인수인계서와 같은 `f1eeda5fb1ac39b37e3a7bbd291cda6c2ceb7f87`입니다. 해당 리비전의 코드·문서·테스트 소스를 검토했습니다. 테스트 실행과 저장소 변경은 이번 작업 범위에서 제외했습니다. [기준 커밋](https://github.com/guseoh/pawcycle-commerce/commit/f1eeda5fb1ac39b37e3a7bbd291cda6c2ceb7f87)

## 설계 1 — #417 고립 결제 실패 확정과 예약 해제

### 1. 문제와 현재 상태

일반 결제는 `READY → PROCESSING`을 커밋한 뒤 트랜잭션 밖에서 결제사를 호출합니다. 호출 전 중단이나 호출 후 로컬 확정 실패로 `PROCESSING`과 주문의 재고 예약이 남을 수 있습니다. 기존 관리자 대사와 Checkout 만료는 이 상태를 처리하지 않습니다. #532의 단발 명령은 동일 결제의 `DONE`만 성공 확정하며, `ABORTED`·`EXPIRED`에는 `STOPPED_PROVIDER_FAILED`를 반환합니다. [#417 본문](https://github.com/guseoh/pawcycle-commerce/issues/417) · [성공 복구 Runbook](https://github.com/guseoh/pawcycle-commerce/blob/f1eeda5f/docs/runbook/PAYMENT-RECOVERY-001-processing-success.md)

2026-10-22 승인 정책은 관리자가 선택한 한 건을 읽기 전용으로 조회하고, 로컬 확정에 작업자 배제와 잠금·재검증을 요구합니다. #532 본문에는 **성공 확정에 한해** 작업 중지 확인을 Runbook 권고로 둔 후속 승인이 기록돼 있습니다. 현재 성공 명령의 동작은 이 범위와 일치합니다. 실패 확정에는 작업자 배제를 필수 조건으로 적용하는 안을 제안합니다. Phase 1 조회 코드도 HTTP 오류와 미발견을 `UNKNOWN`으로 처리해 승인 정책과 일치합니다. [승인 댓글](https://github.com/guseoh/pawcycle-commerce/issues/417#issuecomment-6333149778) · [#532](https://github.com/guseoh/pawcycle-commerce/pull/532) · [Wiki PWC-0016](https://github.com/guseoh/cs/blob/main/Wiki/decisions/PWC-0016.md)

### 2. 대안

| 대안 | 트레이드오프 |
|---|---|
| **별도 실패 확정 명령 — 권장** | 실행자가 예약 해제를 명시적으로 선택합니다. 실패 전용 시작 조건과 감사 기록을 둘 수 있습니다. 단발 실행 설정과 진입 경로가 하나 늘어납니다. |
| 성공 명령에 명시적 실패 모드 추가 | 설정과 실행 코드를 더 많이 재사용합니다. 모드 선택, 안전 조건, 종료 코드가 한 명령에 모여 기존 성공 명령의 회귀 범위가 커집니다. |
| 모든 결제 작업자가 참여하는 DB 소유권·펜싱 도입 | 서비스 중단 없이 작업자를 제어하는 방향입니다. 정상 결제 경로와 스키마가 바뀌며, 이미 전송한 외부 요청에는 별도의 종료 근거가 여전히 필요합니다. |

### 3. 권장안

**관리자가 한 건을 선택하고, 작업자 배제 근거가 있을 때만 별도 실패 확정 명령을 실행합니다.** 해당 결제를 처리할 수 있는 모든 인스턴스에서 신규 요청 유입을 차단하고, 이미 시작된 작업이 끝났음을 확인한 상태를 최종 트랜잭션까지 유지합니다. 이 근거를 확인할 수 없으면 읽기 전용 조회까지만 허용합니다. 단발 명령에서 스케줄러를 끄는 설정은 그 프로세스에만 적용됩니다. 경과 시간이나 lease 만료도 외부 작업 종료의 근거로 사용하지 않습니다.

사전 판정에는 `NORMAL/PROCESSING`, 주문 `PAYMENT_PENDING`, `expires_at` 이후 10분 이상 경과를 적용할 것을 제안합니다. `providerOrderId`·`paymentKey`·금액이 모두 있어야 합니다. 해당 결제의 `RESERVE`가 주문의 SKU별 수량과 정확히 일치하고 `DEDUCT`·`RELEASE` 및 같은 주문의 성공 결제가 없어야 합니다. 예약은 이동 건수와 함께 **SKU와 수량**까지 대조합니다.

결제사 GET은 DB 트랜잭션 밖에서 수행합니다. 조회는 결과를 반환하고, 로컬 확정 명령이 그 결과를 별도로 검증해 적용합니다.

| 결제사 관측 | 실패 확정 명령의 동작 |
|---|---|
| 주문 ID·키·금액이 모두 일치하는 `ABORTED` 또는 `EXPIRED` | 로컬 재검증을 거쳐 실패 확정 후보로 처리 |
| 동일 결제의 `DONE` | 중단하고 기존 성공 복구 절차 안내 |
| 미발견, 조회 불가, HTTP 오류, 타임아웃, 불일치, `UNKNOWN`, 진행 중, 취소·부분 취소 | 중단하고 `PROCESSING`과 예약을 보존 |

현재 Toss 조회 어댑터는 성공적인 조회 응답에서 세 식별 정보를 대조한 후 `ABORTED`·`EXPIRED`를 `FAILED`로 분류합니다. 새 명령은 분류값과 원 상태를 함께 검사하고, 조회에 사용한 식별 정보가 쓰기 트랜잭션의 대상과 동일한지 확인합니다. [Toss Payment 상태 및 조회 계약](https://docs.tosspayments.com/reference)

최종 트랜잭션은 **결제 행 잠금 → 재고 → 주문 → 쿠폰** 순서를 따릅니다. 결제 잠금 후 신원·상태·시한·예약 근거를 다시 확인하고, SKU별로 `RELEASE`를 한 번씩 적용합니다. 이어 결제를 `FAILED`로 바꾸고 결제사의 `ABORTED` 또는 `EXPIRED`를 `provider_status`에 보존합니다. 주문은 `PAYMENT_PENDING → PAYMENT_FAILED` 조건부 갱신으로 보호하며, 불일치하면 앞선 재고 해제까지 롤백합니다. 이 주문에 묶인 `RESERVED` 쿠폰은 `AVAILABLE`로 복원합니다. 장바구니와 그 버전을 보존하며, **고객 알림은 첫 범위에서 생략**하는 안을 권장합니다. 현재 일반 결제 실패 경로도 이 재고·주문·쿠폰 처리를 하고 고객 알림은 생성하지 않습니다.

같은 트랜잭션의 마지막에 관리자 감사 행을 남깁니다. 관리자 ID, 결제 ID, 확정 분류, 안전한 조사 참조값을 기록하고 키·원시 결제사 응답은 제외합니다. 중단과 거부 결과는 업무 이벤트로 남깁니다. 결제가 조회 중 변경됐으면 `CHANGED_DURING_QUERY`로 중단합니다. 같은 명령이 겹치면 첫 커밋만 효과를 적용하고, 후행 실행은 실패 상태와 해당 복구 감사 행을 확인해 이미 완료된 결과를 반환합니다.

**커밋 ACK 유실** 시에는 새 연결로 쓰기 DB에서 결제·주문·예약 원장·감사 행을 함께 조회합니다. 실패 확정 근거가 일치하면 완료로 판정합니다. `PROCESSING`과 예약이 남아 있으면 작업자 배제와 새 결제사 조회를 거쳐 재시도할 수 있습니다. 근거가 엇갈리거나 DB를 읽을 수 없으면 결과 미확정으로 중단합니다. 이 과정에서 결제 승인·취소 요청을 보내지 않습니다.

### 4. 결정 필요

- 실패 확정에도 `expires_at + 10분`을 적용할지, 작업자 배제를 누가 어떤 근거로 확인할지. 전 인스턴스 배제를 입증할 수 없는 경우에는 쓰기를 보류하는 안을 권장합니다.
- `ABORTED`·`EXPIRED`에 동일한 로컬 실패·예약 해제·쿠폰 복원 정책을 적용하고, 첫 범위의 고객 알림을 생략할지.
- 별도 단발 명령과 성공 감사 기록을 승인할지. 실제 Toss 조회와 운영 DB 접근·변경은 각각 별도 실행 승인 대상입니다.

### 5. 검증과 변경 범위

- 일회용 MySQL과 가짜 결제사 HTTP 서버에서 두 실패 상태의 전체 효과, `DONE`·HTTP 오류·미발견·불일치의 무변경, 승인·취소 호출 0회를 검증합니다.
- 래치와 독립 DB 연결로 조회 중 정상 확정, 작업자 배제 실패, 동일 결제의 동시 실행, 다중 SKU 경합을 재현합니다. 재고·쿠폰·감사 저장 단계의 롤백과 **커밋 전 실패 / 커밋 성공 후 ACK 유실**을 각각 검증합니다. 회귀 범위는 #532 성공 명령, `NORMAL/UNKNOWN` 대사, Checkout 만료입니다.
- 예상 변경은 Back­end의 결제 유지보수 진입점·조회/확정 서비스·감사 기록, 관련 테스트와 Runbook입니다. 기존 상태·재고 원장·감사 스키마를 사용하는 안이므로 **Flyway migration과 공개 HTTP API 변경은 필요 없습니다.** 단발 명령의 설정과 결과 코드는 새 운영 계약입니다.
- 확인한 근거 파일은 `commerce/payment/application/{ProcessingPaymentRecoveryService,PaymentApplicationService,PaymentReconciliationService}.java`, `commerce/payment/maintenance/ProcessingPaymentRecoveryCommand.java`, `commerce/payment/persistence/PaymentReconciliationPersistenceAdapter.java`, `commerce/payment/infrastructure/toss/TossTestPaymentAdapter.java`, `ProcessingPaymentRecovery{Integration,Command,Wiring}Tests.java`, `V14__add_common_order_payment_and_billing.sql`, `docs/domain/state-machines.md`입니다. Java 경로는 `backend/src/main/java/com/pawcycle/backend` 기준입니다.

### 6. 남은 위험

첫 안은 운영자가 입증하는 작업자 배제에 의존합니다. DB 잠금은 로컬 쓰기를 직렬화하며, 이미 전송된 결제사 요청을 제어할 수 없습니다. 실제 Toss에서 두 최종 상태와 응답 필드가 예상대로 관측되는지는 미검증입니다. 미발견·식별 정보 누락·예약 원장 불일치 건은 수동 조사 대상으로 남습니다.

## 설계 2 — SKU 재입고 알림

### 1. 문제와 현재 상태

제품 범위 문서는 재입고 알림을 **미구현이며 도입 여부를 별도로 결정할 기능**으로 명시합니다. 제품 후보로 설계하는 것과 충돌하지 않습니다. 기존 `commerce/returning`의 재입고는 반품에 따른 재고 복원입니다. 구매 가능 여부는 공개 상품(`PUBLIC`), 활성 SKU(`ACTIVE`), `available_quantity`를 기준으로 서버가 판정합니다. 색상·용량 등 옵션이 다른 SKU는 각각 신청 대상으로 봅니다. [현재 제품 범위](https://github.com/guseoh/pawcycle-commerce/blob/f1eeda5f/docs/product/current-scope.md) · [도메인 규칙](https://github.com/guseoh/pawcycle-commerce/blob/f1eeda5f/docs/domain/rules.md)

`ORDER_PAID`는 결제 성공 트랜잭션 안에서, `SUBSCRIPTION_DELIVERY_REMINDER`는 주기 작업에서 `NotificationService`를 호출합니다. 둘 다 `notifications`에 앱 내 알림을 저장합니다. `(member_id, type, reference_type, reference_id)` 유일 제약과 중복 삽입 무효화로 같은 이벤트가 반복 저장되는 것을 막습니다. `/api/notifications`가 로그인 회원의 알림 목록과 읽음 처리를 제공합니다. [기존 알림 API 계약](https://github.com/guseoh/pawcycle-commerce/blob/f1eeda5f/docs/api/API-012-mvp4-final-product-backend-api.md)

### 2. 대안

| 대안 | 트레이드오프 |
|---|---|
| **대기 신청과 현재 구매 가능 재고를 주기적으로 대조 — 권장** | 입고·조정·예약 해제·취소·반품 등 모든 재고 증가 경로를 한 조회로 포괄합니다. 재고 쓰기 경로에 알림 비용을 추가하지 않습니다. 관측 사이에 다시 품절된 재고는 놓칠 수 있습니다. |
| 재고가 `0 → 양수`가 될 때 같은 트랜잭션에서 이벤트를 저장하고 후속 처리 | 짧은 재입고도 기록할 수 있습니다. 모든 증가 경로와 이벤트 소비·재처리 계약을 보호해야 하고, 발송 직전 품절 여부는 여전히 확인해야 합니다. |

### 3. 권장안

**로그인 회원이 품절된 공개·활성 SKU에 신청하고, 신청 회차마다 앱 내 알림을 한 번 받습니다.** 신청 시 서버가 `available_quantity = 0`을 확인합니다. 이후 주기 작업이 같은 SKU에서 `available_quantity > 0`과 판매 가능 상태를 함께 확인하면 발송합니다. 발송이나 해제 후에는 해당 SKU가 다시 품절일 때 새 회차를 신청할 수 있습니다. 알림은 재고를 예약하지 않습니다.

- **데이터.** 신청 회차마다 `restock_subscriptions` 한 행을 저장합니다. 신청 ID, 회원·SKU, 회원별 요청 키, `PENDING / CANCELED / NOTIFIED`, 상태별 시각을 둡니다. `(member_id, request_key)`를 유일하게 하고, `PENDING`일 때만 값이 있는 생성 컬럼을 써서 회원·SKU당 대기 신청 하나를 DB에서 강제합니다. 발송 이력은 `NOTIFIED` 신청과 기존 `notifications` 행으로 남깁니다. 알림은 `SKU_RESTOCKED / RESTOCK_SUBSCRIPTION / 신청 ID`로 식별하므로 같은 SKU의 다음 신청 회차를 별도로 알릴 수 있습니다.
- **트랜잭션과 멱등성.** 후보 조회 후 신청 한 건씩 짧은 트랜잭션에서 판매 상태·재고와 잠근 신청의 `PENDING`을 다시 확인합니다. 알림 삽입과 `NOTIFIED` 전환을 함께 커밋합니다. 해제도 같은 신청 행에서 `PENDING → CANCELED`를 적용합니다. 해제가 먼저 커밋되면 발송하지 않고, 발송이 먼저 커밋되면 이미 저장된 알림은 보존합니다. 반복 해제는 같은 신청에만 적용됩니다. 두 작업자와 커밋 응답 유실 이후의 재실행도 상태와 유일 키로 중복을 막습니다.
- **처리량과 스케줄러.** 인덱스를 이용해 발송 가능한 대기 신청을 ID 순으로 제한 조회합니다. 실행당 처리 건수와 시간에 상한을 두고 다음 실행에서 이어갑니다. 같은 SKU의 신청이 몰려도 회원 전체를 한 트랜잭션에 묶지 않습니다. 한 건 실패는 나머지 건에서 격리하고, 지속 실패 건은 재시도 간격을 두어 뒤쪽 신청의 진행을 보장합니다. §6의 기본 DB 업무 스레드에서 `ScheduledJobRunner`를 사용하되, 만료·구독 작업 지연과 Checkout의 SKU 잠금 대기를 측정한 뒤 배치 크기와 주기를 정합니다. 여러 인스턴스가 동시에 실행돼도 DB에서 1회를 보장합니다. [현재 스케줄러 배치](https://github.com/guseoh/pawcycle-commerce/blob/f1eeda5f/docs/domain/state-machines.md#6-스케줄러-목록)
- **API 초안.** `PUT /api/restock-alerts/{requestId}`에 `skuId`를 받아 신청합니다. 최초 생성은 `201`, 같은 키·같은 SKU는 기존 신청을 반환하고, 키를 다른 SKU에 재사용하거나 이미 다른 대기 신청이 있으면 `409`를 반환합니다. `GET /api/restock-alerts?skuId=…`로 본인의 대기 상태를 읽고, `DELETE /api/restock-alerts/{requestId}`로 그 회차를 해제합니다. 회원은 세션에서 결정하며 쓰기에는 기존 CSRF 보호를 적용합니다. 알림 목록에는 새 타입과 상품·SKU 링크에 필요한 필드를 추가합니다.
- **관측.** 커밋된 발송 수, 처리 실패 수, 발송 가능한 대기 건수와 최장 대기 시간을 기록합니다. 아직 품절인 대기 신청은 발송 적체와 별도로 집계합니다. 업무 이벤트는 신청·해제·발송·실패를 기록하며, 신청·SKU 식별자는 조사 로그에서만 사용합니다.

### 4. 결정 필요

- 로그인 회원·공개 활성 SKU·앱 내 채널·신청 회차당 한 번을 첫 제품 범위로 승인할지.
- `0 → 양수`가 주기 사이에 끝나면 알림을 생략해도 되는지. 상품 비공개나 SKU 비활성화 시에는 신청을 보존하고, 다시 판매 가능해졌을 때 재평가하는 안을 제안합니다.
- 허용할 발송 지연, 회원별 대기 신청 상한, 만료와 신청 이력 보존 기간. 보존 기간은 같은 요청 키를 안전하게 재처리할 수 있는 기간과 함께 정해야 합니다.

### 5. 검증과 변경 범위

- Wiki의 판정 기준인 **발송·해제·중복 방지**를 인수 조건으로 삼습니다. 품절 신청 후 구매 가능해지면 1회 노출, 해제가 먼저 커밋되면 0회, 동시 신청과 스케줄러 중복 실행에서도 대기 신청·알림 각각 1건을 검증합니다. 재품절 후 새 신청, 발송 직전 품절, 비공개·비활성, 타 회원 접근, 알림 삽입 후 롤백·재시도, 기존 주문·배송 알림 회귀도 포함합니다.
- 일회용 MySQL에서 인기 SKU에 신청이 집중되는 상황을 측정해 처리량, 최장 대기, 재고 잠금 대기, 결제 만료 작업 지연을 확인합니다. Backend·Frontend 계약 테스트로 신청·해제와 알림의 상품 상세 이동을 검증합니다. [Wiki 제품 후보와 판정 기준](https://github.com/guseoh/cs/blob/main/Wiki/journal/pawcycle/2026-11.md#2026-11-14-pawcycle-고도화-설계-구체화)
- **Flyway migration이 필요합니다.** 신청 테이블·유일 제약·후보 조회 인덱스를 추가하고 `notifications.type`의 `CHECK`를 확장합니다. **HTTP API 계약도 추가됩니다.** 신청·조회·해제, 기존 알림 응답의 새 타입과 링크 정보, 상품 상세와 알림 화면이 변경 범위입니다.
- 확인한 근거 파일은 `docs/product/current-scope.md`, `docs/domain/{rules,state-machines}.md`, `commerce/inventory/application/InventoryService.java`, `catalog/product/persistence/ProductDiscoveryQueryRepository.java`, `commerce/checkout/persistence/CheckoutPersistenceAdapter.java`, `commerce/notification/{application/NotificationService,persistence/NotificationPersistenceAdapter,api/NotificationController}.java`, `subscription/automation/{SubscriptionDeliveryReminderProcessor,SubscriptionDeliveryReminderTrigger,SchedulingConfiguration}.java`, `V17__add_commerce_operations.sql`, `V27__add_review_summary_and_delivery_reminder.sql`, `frontend/src/lib/notification-routing.ts`입니다.

### 6. 남은 위험

재고는 알림 커밋이나 고객 확인 직후 소진될 수 있습니다. 주기 조회의 지연과 인기 SKU의 재고 잠금 경합은 실제 데이터 분포에 영향을 받으므로 목표 발송 지연을 정한 뒤 측정해야 합니다. 기존 알림 목록은 회원별 전체 목록을 반환하므로 장기 보존량은 운영 규모에서 확인할 항목입니다.
