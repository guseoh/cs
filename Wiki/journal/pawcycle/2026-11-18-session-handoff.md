# PawCycle 2~3단계 세션 인수인계 (2026-11-17~18) — 3단계 운영 적용 준비와 4단계 본 측정을 바로 이어가기

> 기록 키 `pawcycle-session-handoff-20261118`. 2026-11-17~18에 한 채팅 세션에서 2단계 장애 관측을 닫고 3단계 배포·보안 기반을 저장소 범위에서 끝낸 과정과 결과다. 다른 PC에서 **3단계 운영 적용 준비**와 **4단계 본 측정**을 바로 이어가도록 쓴 인수인계서이며, 계약·결정의 원본은 링크한 저장소 ADR·Runbook·PR이다. 병합과 CI 통과는 운영 검증이 아니다.

## 0. 바로 시작하기

- **기준 상태:** `main` [`f0767bcb`](https://github.com/guseoh/pawcycle-commerce/commit/f0767bcb382dca3eca55644aee8aacc3f656db46)(2026-11-18, #552 병합). Wiki는 guseoh/cs `main` `222f743c` 이후. GitHub의 branch·PR·CI·Production 상태는 이 문서로 추정하지 말고 시작할 때 다시 확인한다.
- **어느 쪽부터?** 운영 적용(5절)과 4단계 측정(6절)은 서로 독립이다. 측정 중 운영 변경을 겹치지 않도록 **하나씩** 한다. 어느 것을 먼저 할지는 사용자가 정한다.
- **새 PC 첫 확인(읽기 전용):**

  ```bash
  git clone https://github.com/guseoh/pawcycle-commerce.git && cd pawcycle-commerce
  git log --oneline -3        # f0767bcb 가 보여야 한다
  gh pr list --state open     # 열린 PR 확인
  docker version && python --version && k6 version
  ```

- **새 세션에 줄 시작 프롬프트 예시**
  - 운영 적용: `Wiki journal/pawcycle/2026-11-18-session-handoff.md 5절을 기준으로 3단계 운영 적용 준비를 이어가자. 먼저 1단계 사전 확인(읽기 전용)만 하고 결과를 보고해줘.`
  - 4단계: `Wiki journal/pawcycle/2026-11-18-session-handoff.md 6절을 기준으로 4단계 본 측정을 시작하자. 먼저 backend 연결 방식(없는 것 1·2번) 설계를 제안해줘. 저장소 변경은 승인 후에.`
- **먼저 읽을 곳:** 이 문서 → [Snapshot](../../projects/pawcycle.md) → 저장소 `docs/runbook/AUTH-005-session-redis.md`, `docs/runbook/OPS-OBS-001-production-observability.md`, `docs/adr/ARCH-016-production-alertmanager.md`, `infra/performance/synthetic-data/README.md`.

### 작업 규칙(저장소 AGENTS.md가 원본)

- main 직접 쓰기 금지, 작업 branch 사용. 저장소 변경과 실제 운영 실행을 분리한다. Secret·webhook URL·개인정보는 저장소·채팅·로그에 넣지 않는다. 사용자는 한국어 응답을 원하고, 작업을 끝낼 때마다 로드맵 기준 다음 작업 추천을 원한다.
- **PR 병합은 사용자가 PR별로 위임한 경우에만** 했다. "예외·병합 위임" = 그 PR 한정 CodeRabbit 예외 + CI·Codex 확인 후 병합이다. 병합은 `gh pr merge --squash --match-head-commit <HEAD>`로 HEAD를 고정했다. 위임은 다른 PR로 이어지지 않는다.
- **리뷰 사정:** CodeRabbit은 이 저장소에서 자동 리뷰하지 않는다(status `skipping`). 그래서 PR마다 사용자가 예외를 명시 승인하고 PR 본문 `## 리뷰 예외` 절에 남겼다(필수 CI, Codex P0·P1 해소, 독립 diff 검토는 예외 대상이 아님). Codex(chatgpt-codex-connector)는 PR을 열거나 Ready로 바꾸면 리뷰하지만 **수정 push 뒤에는 자동 재리뷰가 없었다**(#552·#553은 1시간 넘게 없음). 재리뷰는 PR 댓글 `@codex review`이며 사용자 결정이 필요하다.

## 1. 병합한 PR과 결과

| 영역 | PR | `main` | 핵심 결과 | 리뷰 지적과 처리 |
| --- | --- | --- | --- | --- |
| 2단계 리허설 보정 | [#544](https://github.com/guseoh/pawcycle-commerce/pull/544) | [`f1eeda5f`](https://github.com/guseoh/pawcycle-commerce/commit/f1eeda5fb1ac39b37e3a7bbd291cda6c2ceb7f87) | 장애 6종 로컬 리허설, 보정 5건(`keep_firing_for: 2m`, p95 요청량 하한, 회차 보정 정지 제외 등) | CodeRabbit Minor 2건 반영 |
| 2단계 critical | [#546](https://github.com/guseoh/pawcycle-commerce/pull/546) | [`a7d156f1`](https://github.com/guseoh/pawcycle-commerce/commit/a7d156f16387fd8be0b2ab49aa2c5d45de5892ba) | `PawCycleDbConnectionAcquireFailure`, MySQL 중단 2분 9초 뒤 critical | Codex P2: 억제 범위를 DB 대기 알림 하나로 축소 |
| 3단계 검색 | [#545](https://github.com/guseoh/pawcycle-commerce/pull/545) | [`2254827f`](https://github.com/guseoh/pawcycle-commerce/commit/2254827f178fb3669fdb876bcaa57bc60ff69849) | 검색 LIKE `ESCAPE '!'` | — |
| 4단계 준비 | [#547](https://github.com/guseoh/pawcycle-commerce/pull/547) | [`bce2100b`](https://github.com/guseoh/pawcycle-commerce/commit/bce2100b4721a0fbdf4a161e59774d19805cd828) | k6 판정 보완, 합성 데이터 생성기(1만만 검증) | Codex P2 3건 수정 |
| 3단계 세션 | [#550](https://github.com/guseoh/pawcycle-commerce/pull/550) | [`551c75ec`](https://github.com/guseoh/pawcycle-commerce/commit/551c75ecf218bd31dbcbb69e186571043ce18a3a) | Spring Session Redis 선택 설정(`PAWCYCLE_SESSION_STORE=memory` 또는 `redis`, 기본 memory) | — |
| 3단계 요청 제한 | [#549](https://github.com/guseoh/pawcycle-commerce/pull/549) | [`aa00421d`](https://github.com/guseoh/pawcycle-commerce/commit/aa00421d37eabf3cf9cf2d475d627e193b6ac760) | nginx 요청 제한 확장, query 없는 JSON access log, 로그인 계정 제한 | Codex P1: 이전 nginx 지문에서 새 지문으로 넘어갈 수 없는 교착 → `PREVIOUS_NGINX_CONTRACT_SHA256`을 baseline 검증에서만 허용. 시간 의존 429 테스트도 수정 |
| 2단계 종료 | [#551](https://github.com/guseoh/pawcycle-commerce/pull/551) | [`8b11b916`](https://github.com/guseoh/pawcycle-commerce/commit/8b11b9169bf400950487dc4c5e85a929f6509bee) | 실제 Discord 수신 검증 스크립트·Runbook | Codex P2: 단일 채널 선택 시 옛 warning webhook 파일 제거 |
| 3단계 운영 Redis | [#553](https://github.com/guseoh/pawcycle-commerce/pull/553) | [`23fc6607`](https://github.com/guseoh/pawcycle-commerce/commit/23fc660788dc7ed64a208868f5202fb0b4359ad5) | 운영 세션 Redis sibling project, 배포 도구의 읽기 전용 sibling 검사 | Codex P1: Redis 장애 중 `memory` 대상 rollback 차단 → rollback의 활성화 전 smoke에서만 sibling 검사 생략, 회귀 테스트 추가 |
| 3단계 운영 알림 | [#552](https://github.com/guseoh/pawcycle-commerce/pull/552) | [`f0767bcb`](https://github.com/guseoh/pawcycle-commerce/commit/f0767bcb382dca3eca55644aee8aacc3f656db46) | 운영 Alertmanager(ARCH-016), 운영 critical 4개 + Watchdog | Codex P2: webhook 교체가 file bind mount 때문에 반영되지 않음 → Runbook 교체 순서 수정 |

- #553 병합 뒤 #552에 `main`을 merge(rebase·force push 없음)해 `infra/production/validate-production-contracts.py` 충돌을 두 계약 검사(세션 Redis, 운영 알림)를 모두 유지하도록 해소했고 CI 재통과 후 병합했다.
- #552·#553의 수정 HEAD(`0af209da`, `801a9825`)는 **Codex 재리뷰 없이** 병합했다(사용자 결정). 수정 diff는 독립 검토했고, #553은 대상 `redis` 검사가 `validate_config`에 남아 있음을 코드로 확인했다.
- Wiki PR(guseoh/cs): #61 리허설, #62 설계 기록(Codex 세션 작성), #63 병렬 트랙·2단계 종료·3단계 R3·R4·R11, #64 3단계 완료.

## 2. 사용자 결정

| 결정 | 선택 | 근거 |
| --- | --- | --- |
| MySQL 중단 억제 | 즉시 풀리는 것만 억제(DB 대기 알림 하나) | #546 |
| 세션 저장소 | Spring Session **Redis**(JDBC·JWT 미선택), 운영 기본은 `memory` | AUTH-005 ADR |
| 요청 제한 | nginx `limit_req` 확장(IP 키) + 로그인 계정 단위는 앱 메모리. Redis 카운터 미선택 | SEC-EDGE-001 |
| 요청 제한 임계값 | csrf 30r/m burst 20, 검색 60/30, checkout 10/10, 결제 10/10, interaction 120/60, ai 30/30, 로그인 계정 15분 안 실패 10회 → 15분 잠금(추적 계정 최대 10,000) | #549 |
| 운영 배포 계약 확장 | 앱 release 계약을 넓히지 않고 **별도 sibling Compose project** | AUTH-005 Runbook, ARCH-016 |
| 운영 세션 Redis 사양 | 64MB, `noeviction`, AOF `everysec`, 128m / 0.25 CPU, 인증 없음(Docker-internal network만) | `infra/production-session-redis/compose.yaml` |
| 운영 관측 확장 | Alertmanager만 추가, Loki 보류 | ARCH-016 |
| Discord webhook | 사용자가 직접 URL 입력(저장소·채팅 비노출), 4건 수신 확인(2026-11-17 07:32~07:33 UTC) | #551 |
| 3단계 완료 기준 | **저장소 병합 + 로컬 검증**. 운영 적용은 #470에서 별도 | 이 문서 |
| #417 결제 실패 확정 / #548 재입고 이메일 | 설계 승인만, 구현 미착수. 실패 확정·예약 해제 실행은 별도 승인 | [PWC-0134](../../decisions/PWC-0134.md), [PWC-0135](../../decisions/PWC-0135.md) |

## 3. 알려진 한계·미검증

- MySQL 중단 한 번에 오는 메시지 수는 크게 줄지 않았다(작업 실패 warning이 critical보다 먼저 온다). 작업 실패 규칙의 창·`for` 결정과 재측정이 남았다.
- INTERNAL 외부 호출, 5xx 비율, 구독 자동화 실패 알림은 실행 리허설 없이 규칙 단위 테스트만 했다.
- 알림 임계값은 모두 잠정값이며 **4단계 기준선 이후** 확정한다(예: p95 알림의 요청량 하한 0.2 rps, `keep_firing_for` 2분은 2분 넘는 재시작의 거짓 resolved를 못 막는다).
- 운영 DB 커넥션 규칙은 로컬과 다르다. 운영 수집이 30초라 "대기 중" 상태를 놓칠 수 있어 "5분 안 시간 초과 2건 이상"으로 바꿨다. 실제 운영에서는 검증되지 않았다.
- `redis` 세션 모드의 로그아웃 응답은 쿠키 삭제 헤더가 두 개다. 운영 인증 smoke(OPS-017)를 `redis` 모드에서 실행해 본 적이 없다.
- Redis가 멈추면 세션 요청은 fail-closed이며 상태 코드가 전용 코드가 아니다(쿠키 있는 요청 500, 쿠키 없는 csrf 401). 503 같은 전용 응답은 인증 API 계약 변경이라 하지 않았다.
- 세션 Redis 전용 알림은 없다.
- 로컬 실측에서 유휴 뒤 첫 세션 요청이 Redis 연결 초기화 중 command timeout(1초)으로 500이었다 → 기동 시 연결을 미리 맺는 warm-up을 넣었다.

## 4. 이어서 할 일 한눈에 보기

| # | 작업 | 종류 | 승인·선행 | 결과물 |
| --- | --- | --- | --- | --- |
| A | 운영 사전 확인(읽기 전용) | 운영 읽기 | #470 승인 단위 | 메모리·컨테이너 ID·SHA 확인 기록 |
| B | 운영 Discord 채널·webhook 파일 | 사용자 작업 | 없음 | `/opt/pawcycle/runtime/observability/discord-webhook` |
| C | manual-pair release(nginx·compose 변경) | 운영 실행 | DB compatibility evidence, 별도 승인 | 적용 전후 증거 |
| D | 세션 Redis sibling 기동 | 운영 실행 | C와 별개, 별도 승인 | healthy, 포트 없음 |
| E | 운영 관측(Alertmanager) 적용·전달 확인 | 운영 실행 | B 선행, 별도 승인 | Watchdog, Discord 수신 |
| F | `redis` 전환(선택) | 저장소 PR + 운영 실행 | 사용자 결정·공지 | 1회 전원 로그아웃 |
| G | 4단계 backend 연결 방식 설계·구현 | 저장소 변경 | 설계 승인 | 전용 compose project |
| H | 1만 → 10만 → 100만 측정 | 로컬 측정 | G 선행, 규모·시간 결정 | 기준선 보고서 |
| I | 알림 임계값 조정, MySQL 중단 메시지 수 재측정 | 저장소 변경 | H 선행 | 임계값 근거 |

## 5. 3단계 운영 적용 준비 — 단계별 절차 (미실행·별도 승인)

경계: 모두 **실제 운영 실행**이다. 저장소 준비 승인은 운영 실행 승인이 아니다. [#470](https://github.com/guseoh/pawcycle-commerce/issues/470) 운영 트랙의 Gate를 따르고 단계마다 승인받는다. 순서는 제안이다. 대상은 OCI `app01` 단일 서버(Backend·Frontend·Nginx) + 별도 OCI Managed MySQL이며, 같은 호스트에 별도 Compose lifecycle(metrics-proxy, observability, 세션 Redis)을 둔다.

1. **사전 확인(읽기 전용).** 승인 merge SHA(`f0767bcb` 이상)의 object가 `/opt/pawcycle/source/repo`에서 fetch 가능한지(checkout·pull·reset 금지, `git fetch --prune origin main`만), `free -m`과 컨테이너 사용량(세션 Redis 128MiB, Alertmanager 64MiB가 6GB에 더해짐), Application 컨테이너 ID·`StartedAt` 기록. 이전 관측 적용 여부는 #470과 서버 상태로 확인한다(여기서 단정하지 않는다).
2. **운영 Discord 채널·webhook 파일(사용자 작업).** 운영 전용 채널을 새로 만들고(로컬 리허설 채널 재사용 금지) `/opt/pawcycle/runtime/observability/discord-webhook`을 소유자 `65534:65534`, mode `0400`, regular non-symlink로 둔다. 절차는 OPS-OBS-001 "운영 Discord 채널 준비(사용자 작업)"(`read -rs`로 입력, history에 안 남김). 이 파일이 없으면 이번 compose는 Prometheus·Grafana만 갱신해도 적용이 실패한다.
3. **manual-pair release.** #549(nginx)·#553(compose)·#552 변경은 운영 compose `compose_sha256`과 nginx 계약을 바꾼다. `--application-only`(CD 포함)는 compose 변경을 거부하므로 DB compatibility evidence가 있는 manual release가 필요하다. 세션 저장소 값이 `memory`라 동작은 같고, nginx 요청 제한·JSON 로그는 이 release로 처음 적용된다. 이전 nginx 지문 → 새 지문 전환은 baseline 검증·adopt에서만 허용되게 구현했다(실제 전환은 미검증이라 preflight 결과를 특히 확인한다). 복구는 OPS-OCI-CD-02.
4. **sibling 세션 Redis 기동(backend는 `memory` 유지).** AUTH-005 Runbook "운영 적용 절차" 1번. 승인 SHA의 `infra/production-session-redis`를 `git archive`로 read-only source(`0555/0444`, `.approved-sha`)로 꺼내 `docker compose --project-name pawcycle-production-session-redis ... up --detach --no-deps --wait --wait-timeout 60`.
   - 성공 기준: `healthy pawcycle-production-app`, host port 없음, `noeviction`, `appendonly yes`, Application 컨테이너 ID·`StartedAt` 불변.
   - **release가 진행 중일 때 sibling을 조작하지 않는다**(sibling fence가 실패해 복구 gate로 넘어간다).
5. **운영 관측 적용(Alertmanager 포함).** OPS-OBS-001 "Same-host 적용" 2번 블록 → "적용 후 알림 경로 확인"(Alertmanager 1개 발견, 규칙 5개, 1분 안 Watchdog 도착) → "운영 Discord 전달 확인"(`amtool`로 시험 알림 firing·resolved, 사용자가 Discord에서 `[운영] [CRITICAL]`·`[RESOLVED]` 각 1회 수신을 눈으로 확인, `alertmanager_notifications_total`{integration="discord"} +2, `failed_total` 불변). 로컬 `verify-discord-delivery.ps1`은 운영에 쓰지 않는다.
   - 운영 알림: critical 4개(`PawCycleBackendScrapeUnavailable`, `PawCycleDbConnectionAcquireFailure`, `PawCycleStuckProcessingPayment`, `PawCycleUnknownPaymentAging`) + Watchdog(Discord로 안 보냄). scrape 중단이 firing이면 나머지는 억제된다.
   - webhook 교체 순서: 새 webhook 작성 → 파일 교체 → Alertmanager 컨테이너 재생성 → 새 채널 수신 확인 → 기존 webhook 삭제(파일 bind mount라 재생성 없이는 반영되지 않는다).
6. **(선택, 별도 결정) `redis` 전환.** 활성화 PR(`infra/production/compose.yaml`의 `PAWCYCLE_SESSION_STORE`를 `redis`로 + `validate-production-contracts.py` 기본값 검사) → 공지(1회 전원 로그아웃) → preflight(sibling 검사) → activate → OPS-017 인증 smoke, `redis-cli DBSIZE`·`INFO memory` 확인(익명 사용자도 세션이 생기므로 64MB 상한을 다시 판단). 다음 release(backend 재생성) 뒤에도 로그인이 유지되면 R3를 Production Verified로 기록한다. rollback은 backend만 `memory` release로 되돌리며 Redis 장애 중에도 가능하다. backend가 `redis`인 채 sibling만 내리면 로그인이 실패한다.
7. **기록 규칙.** 각 단계 후 적용 전후 증거(컨테이너 ID·`StartedAt`, health, 메모리, 알림 도착)를 남기고, 실제 운영을 하지 않은 범위에 `Production Verified`를 쓰지 않는다. 결과는 이 Wiki에 Journal로 남긴다.

**중단 조건:** Application identity snapshot 불일치, `pawcycle-production-app` network 계약 불일치, host port 공개, webhook·Grafana 자격 파일 권한 불일치, image digest·platform 불일치. 중단하면 Application을 재시작·recreate하지 말고 새 세션에서 읽기 전용으로 부분 적용 여부를 확인한다(OPS-OBS-001 "Stop / rollback").

**열린 사용자 결정:** 운영 Redis 인증 도입 여부(현재 없음), 세션 Redis 알림을 트랙 D에서 다룰지, 외부 dead man's switch, `redis` 전환 시점과 공지, 운영 Discord 채널 구성.

## 6. 4단계 본 측정 — 시작 가이드 (제안)

목표: 10만·100만 규모 합성 데이터와 혼합 부하의 **성능 기준선**. 2단계 임계값 확정과 5단계(실측 병목 개선)가 이 기준선을 기다린다. 측정은 로컬 일회용 환경만 쓰며 Production·운영 DB·OCI에 연결하지 않는다(`run-production-capacity.sh`, catalog-isolated의 app01 경로는 별개다).

### 이미 있는 도구

- **합성 데이터:** `infra/performance/synthetic-data/perfgen.py`

  ```bash
  python infra/performance/synthetic-data/perfgen.py up --name pawcycle-perfgen-s4
  python infra/performance/synthetic-data/perfgen.py generate --name pawcycle-perfgen-s4 --scale 10k --seed 42
  python infra/performance/synthetic-data/perfgen.py check --name pawcycle-perfgen-s4
  python infra/performance/synthetic-data/perfgen.py fingerprint --name pawcycle-perfgen-s4
  python infra/performance/synthetic-data/perfgen.py down --name pawcycle-perfgen-s4
  ```

  대상은 `up`이 만든 일회용 MySQL 8.4.10(`pawcycle-perfgen-*`, 익명 volume, port 미공개, 기본 `--cpus 2 --memory 2g`)뿐이고 공유 `pawcycle-local-integration-*`와 운영 DB는 거부한다. 같은 seed → 같은 행. 불변식 `invariants.sql`은 read-only이며 쓰기 부하 뒤 `check --no-manifest`로 다시 실행할 수 있다.
- **규모 비율(N=1만/10만/100만):** members·addresses N, products N/10, SKU N/5, 주문·결제 N(PAID 85%·FAILED 10%·EXPIRED 5%), 주문줄 약 1.33N, 리뷰 약 0.47N, 구독 N/2(ACTIVE 80/PAUSED 10/CANCELED 10), 플랜 N/1000. `PAYMENT_PENDING`·`READY`와 기한이 된 구독 회차는 일부러 만들지 않았다(backend 스케줄러가 측정 중 쓰기 부하를 섞기 때문).
- **k6:** `infra/performance/k6`의 기준선·용량 스크립트와 `lib/verdict.js`(응답 계약 위반을 실패로 판정, 미완료 iteration 집계, 판정 실패 시 비0 종료), `run-baseline.sh`·`run-capacity.sh`·`phase8d-*`(burst·sustained·mixed-steady·bounded-write), 선행 측정 `infra/performance/phase9`·`phase10`, Runbook `PERF-PH8-001`~`003`·`PERF-V7-003`.
- **정상 기준선(2단계 로컬 리허설):** 읽기 부하 초당 약 2건 6분에서 p50 32ms, p95 151ms, 5xx 0, DB 커넥션 대기 0.
- **검증 명령:** `python infra/performance/synthetic-data/test_perfgen.py`(Docker 없이), `infra/performance/k6/validate-harness.ps1`, `infra/performance/k6/selftest/run-selftest.py`.

### 아직 없는 것 — 착수 전에 만들거나 결정

1. **backend 연결 방식:** 지금 `perfgen.py up`은 migration을 raw SQL로 적용해 `flyway_schema_history`가 없다. backend를 붙이려면 backend Flyway가 빈 DB에 먼저 schema를 만들게 한 뒤 `generate`를 실행해야 하고, 이를 위한 전용 compose project가 아직 없다.
2. **로그인 부하:** 합성 회원은 로그인할 수 없다(`synthetic-no-login`). 로그인·결제 부하에 쓸 회원과 비밀번호 처리 방식을 정해야 한다.
3. **정기배송 due cohort:** 모든 다음 배송일이 `--schedule-start`(기본 2030-01-01) 이후다. 정기배송 부하용 기한 도래 집단은 측정 설계에서 정한다.
4. **10만·100만 미실행:** 생성 소요 시간·disk 사용량은 측정 전이다. 1만은 약 50~85초(대부분 chunk마다의 `docker exec`)였다. 100만은 binlog 포함 수 GB일 수 있으니 새 PC의 disk 여유를 먼저 확인한다.
5. **혼합 부하 구성·측정 시간·성공 기준**이 정해지지 않았다.

### 제안 순서(승인 전)

1. 새 PC 준비: Docker, Python 3, k6, 저장소 최신 `main`, disk 여유. 위 검증 명령으로 도구가 동작하는지 확인.
2. backend 연결 방식(없는 것 1·2번)을 설계하고 작은 PR로 구현한다(저장소 변경, 로컬 일회용 환경만).
3. 1만 규모로 생성 → `check` → backend 기동 → 기준선 k6를 처음부터 끝까지 한 번 통과시킨다.
4. 10만 → 100만 순으로 키우며 규모별 p50/p95/p99, 5xx, Hikari 대기·시간 초과, GC, MySQL 쿼리 지표를 기록한다. 쓰기 부하 뒤 불변식을 다시 확인한다.
5. 기준선으로 2단계 알림 임계값(요청량 하한, `for`, 작업 실패 창, `keep_firing_for`, DB 대기 규칙)을 근거 있게 조정하고 MySQL 중단 메시지 수를 재측정한다.
6. 5단계 후보(실측 병목 개선)를 측정 근거와 함께 올린다.

**필요한 사용자 결정:** 데이터 규모 순서와 100만 생성 시간 한도, 혼합 부하 비율과 측정 시간, 로그인 부하 방식, 성공 기준.

## 7. 이 세션에서 얻은 작업 방식(재발 방지)

- **worktree 정리 "Permission denied":** 백그라운드 bash 작업이 남아 있거나 셸 cwd가 그 폴더 안에 있었다. 작업을 멈추고 상위 디렉터리로 이동한 뒤 제거한다.
- **커밋 identity:** 사용자 설정이 없는 새 clone(예: Wiki)은 repo-local config를 쓰지 말고 `git -c user.name=... -c user.email=... commit`을 쓴다. 커밋 제목은 72자 이하 한국어다.
- **PowerShell StrictMode:** `"$WaitSeconds초"`는 변수명으로 파싱돼 실패한다 → `${WaitSeconds}`. Webhook은 `Read-Host -AsSecureString`, 파일은 `icacls`로 사용자 전용, URL은 출력하지 않는다.
- **PR 본문:** `scripts/validate-pr-body-encoding.py --body-file`과 `validate-task-artifacts.py`로 검증한 뒤 `gh pr edit --body-file`. Python 문자열에 쓴 `\v` 같은 escape가 제어문자로 바뀐 사고가 있었다.
- **배포 계약을 넓히기 전에 sibling project로 가능한지 본다.** `oci-release.py`가 앱 서비스·volume 집합을 고정 검사하므로 앱 compose를 넓히면 release 계약과 rollback 경로를 건드린다.
- **운영 환경 파일에 새 키를 넣지 않는다.** baseline 해시와 `production_env.py`의 정확 키 집합 검사 때문에 기존 release 경로가 막힌다. 스위치는 리뷰된 compose 한 곳에 둔다.
- **시간창 알림을 inhibit에 넣으면** 복구 뒤 뒤늦게 울려 메시지 수가 줄지 않는다. 즉시 풀리는 알림만 억제한다.
- **GitHub API polling은 줄인다.** rate limit 경고가 한 번 있었다. 병합 직전에는 HEAD·CI를 다시 확인한다.

## 8. 다음 세션 체크리스트

- [ ] 최신 `main`, 이 문서, Snapshot 확인. 열린 PR·CI 재확인
- [ ] 운영 적용(5절)과 4단계(6절) 중 무엇을 먼저 할지 사용자가 결정
- [ ] 운영 적용: 5절 단계별로 승인 → 실행 → 증거 기록 → 결과를 Wiki에 기록
- [ ] 4단계: 6절의 결정 항목 확정 → backend 연결 PR → 1만 end-to-end → 10만 → 100만 → 임계값 조정
- [ ] 작업 종료마다 Wiki Journal(필요하면 Decision)을 기록하고 로드맵 기준 다음 작업을 추천
