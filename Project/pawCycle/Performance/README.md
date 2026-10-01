---
category: PawCycle
status: 진행중
tags:
  - Project
  - pawCycle
  - Performance
---

# PawCycle Performance Engineering 기록

이 디렉터리는 **PawCycle에서 실제로 수행한 성능 작업과 근거**만 기록한다.

일반 개념과 깊은 학습은 [[../../../Study/Performance/README|Study/Performance]]에서 분리한다. 여기서는 실제 환경, 실행 조건, 실패, correction, 수치, Before/After와 의사결정에 집중한다.

PawCycle 성능 단계의 목적은 큰 RPS 숫자를 만드는 것이 아니라 **대규모 데이터와 실제 요청 부하를 재현하고, 현재 단일 Backend 구조가 어떤 조건에서 왜 느려지는지 측정 가능한 근거로 설명한 뒤 가장 작은 개선을 동일 조건에서 다시 검증하는 것**이다.

상위 성능 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)이며, 현재 실제 I0 ↔ I10K 비교와 I10K 병목 분석은 [PERF-V7-008 Issue #320](https://github.com/guseoh/pawcycle-commerce/issues/320)에서 진행한다.

## 현재 상태 — 2026-10-01

현재 canonical PawCycle main과 I10K 실행 Source는 다음 SHA다.

~~~text
56378e4bc58e59bedf7efe200df8447633396abe
~~~

Catalog Core 10K Dataset:

~~~text
Dataset       catalog-core-10k-v1
Product       10,000
SKU           19,977
Inventory     19,977
seed          20260826
provenance    exact-source PASS
~~~

격리 구조는 다음을 유지한다.

~~~text
same app01
+ same OCI Managed MySQL DB System

Data isolation
- performance 전용 schema/account
- isolated Backend runtime
- loopback-only port
- Production Docker network 비가입

Resource isolation
- 아님
- Host / DB System resource는 Production과 공유
~~~

실제 Secret 값, DB endpoint, OCI resource identifier, SSH key 내용, raw Production DB row는 기록하지 않는다.

## I0 현재 비교 기준

과거 첫 I0 150 RPS 실행에서는 dropped iteration과 Hikari pending이 발생해 실패 경계로 기록된 적이 있다. 그 과정과 당시 판단은 [[09. I0 25-150 RPS Re-baseline과 첫 처리 용량 경계 구간]]에 Historical Evidence로 보존한다.

하지만 이후 lifecycle 진단이 포함된 동일 계열 재측정에서는 그 saturation이 재현되지 않았다. 따라서 현재 I10K와 비교할 I0 150 RPS 유효 기준은 다음이다.

| 항목 | I0 150 RPS |
| --- | ---: |
| actual RPS | 149.8833 |
| dropped | 0 |
| expected-status error | 0 |
| p50 | 106.47 ms |
| p95 | 371.35 ms |
| p99 | 712.29 ms |
| max | 941.22 ms |
| Hikari active max | 7 / 10 |
| Hikari pending max | 0 |
| Tomcat busy max | 5 |

따라서 “I0는 150 RPS에서 항상 Pool saturation이 난다”는 주장은 현재 유지하지 않는다. 과거 150 RPS saturation의 transient trigger는 `INCONCLUSIVE / DEFER`다.

## I10K 25 RPS 첫 실제 실행

I10K 첫 stage는 `25 → 50 → 100 → 150 RPS`의 stop-on-fail 계약으로 시작했다.

25 RPS는 정상 measurement 완료가 아니라 **warm-up 도중 실패**했다.

~~~text
30초 warm-up 예정
→ 약 15.9초 시점 Host evidence collector timeout
→ canonical runner가 k6 종료
→ 120초 measurement 미진입
~~~

따라서 정상 25 RPS stage의 actual throughput, p50/p95/p99/max를 만들어 기록하지 않는다.

현재 판정:

~~~text
I10K / 25 RPS       FAIL / ABORTED DURING WARM-UP
I10K / 50 RPS       BLOCKED
I10K / 100 RPS      BLOCKED
I10K / 150 RPS      BLOCKED
200 / 250 RPS       범위 제외
I10K 100K 확장      DEFER
~~~

## 실패 순간의 핵심 evidence

초기 상태:

~~~text
Hikari active/max = 0/10
pending           = 0
Tomcat busy       = 1
~~~

실패 직전 관측:

~~~text
Hikari active/max = 10/10
pending           = 113
Tomcat busy       = 124
Backend CPU       = 7.22%
iowait            = 0
swap              = 0
~~~

복구 뒤에는 Hikari active/pending이 0/0, idle 10, Tomcat busy 1로 돌아왔고 runtime restart/OOM은 없었다.

lifecycle 누적 delta에서도 List query와 Connection lease가 거의 같은 규모로 길어졌다.

~~~text
Count query              ≈ 90.997 ms
List query               ≈ 6,658.668 ms
Connection lease         ≈ 6,756.513 ms
Repository with conn     ≈ 6,749.953 ms
Row mapping              ≈ 0.064 ms
Post-repository hold     ≈ 4.897 ms
Matched acquire          ≈ 20,512.644 ms
~~~

이 값은 실패 drain과 safety probe가 포함된 누적 구간 평균이므로 정상 stage latency로 사용하지 않는다. 다만 **Connection을 얻은 뒤 대부분의 시간이 Product List Repository SQL에 묶여 있었다**는 계층 분리 근거로 사용한다.

## 현재 Root Mechanism

현재 가장 강한 흐름은 다음이다.

~~~text
I10K Dataset 확대
→ Product 목록 List SQL 장기 실행
→ Connection lease 약 6.76초
→ Hikari active 10/10
→ pending 증가
→ Connection acquire 대기
→ Tomcat busy 증가
→ 일부 30초 connection timeout
~~~

따라서 “Pool 10이 작다”는 결론을 먼저 내리지 않는다. Pool 확대, timeout 증가, Redis, Async, Queue, Scale-out은 현재 해결책에서 제외한다.

## Read-only MySQL 실행 계획 진단

성능 전용 schema/account에 접속한 뒤 session을 명시적으로 read-only로 설정하고 `SELECT`, `SHOW INDEX`, `INFORMATION_SCHEMA`, 일반 `EXPLAIN`만 사용했다.

`EXPLAIN ANALYZE`, `ANALYZE TABLE`, Histogram 생성, Index 생성, DB 설정 변경은 수행하지 않았다.

실제 Product 목록 기본 요청은 `page=0`, `size=20`, `sort=NEWEST`다.

현재 SQL 구조는 대략 다음 순서다.

~~~text
products / categories / brands
→ main image
→ skus
→ inventories
→ Product GROUP BY
→ temporary table
→ sort p.id DESC
→ LIMIT 20

+ representative SKU dependent subquery 4개
+ review dependent subquery 2개
~~~

실제 데이터:

~~~text
eligible Product = 10,000
Product-SKU joined rows = 19,977
~~~

반면 EXPLAIN은 SKU join 뒤 행을 약 108.44개로 추정했다. 실제 19,977과 비교하면 GROUP BY 직전 규모를 약 184배 작게 예상한 셈이다.

관련 Product/SKU 컬럼의 Histogram은 존재하지 않았다. 그러나 통계 오차만 고치는 것보다 먼저 **20개 결과를 위해 전체 19,977 join row를 집계하는 SQL 구조 자체**를 확인했다.

상세 해석은 [[10. I10K 25 RPS Warm-up 실패와 Product 목록 SQL 실행 계획 진단]]에 기록하고, 실제 `SHOW INDEX`, 값 분포 조회, 기존 `EXPLAIN FORMAT=TREE`, subquery 제거 계획, page-first 계획, `PRIMARY (reverse)` counterfactual, full page-first 계획 원문은 [[11. PERF-V7-008 MySQL 실행 계획 Evidence]]에 별도로 보존한다.

## 현재 최소 개선 결정

Read-only counterfactual EXPLAIN에서 Product page를 먼저 20개 선택한 뒤 SKU/Inventory를 붙이면 큰 집계 범위가 page 단위로 줄어드는 것을 확인했다.

따라서 첫 correction은 다음으로 제한한다.

~~~text
KEEP
- NEWEST / RECOMMENDED page-first

DEFER
- FORCE INDEX(PRIMARY)
- STRAIGHT_JOIN
- 신규 Product/SKU index
- Histogram / ANALYZE TABLE
- 대표 SKU subquery 통합
- PRICE / RATING / REVIEW_COUNT 정렬 재설계

현재 제외
- Hikari pool 확대
- timeout 증가
- Redis / Cache
- Async / Queue
- Multi-instance / Load Balancer
- Read Replica
~~~

`NEWEST`와 `RECOMMENDED`는 현재 모두 `p.id DESC` 순서라 Product page를 먼저 결정할 수 있다. 가격순·평점순·리뷰수순은 자식/집계 결과로 순위가 정해지므로 같은 page-first를 바로 적용하면 결과 의미가 바뀔 수 있어 이번 Delta에서 제외한다.

현재 Codex가 이 최소 repository correction을 구현·검증하는 단계다. 저장소 변경이 완료되더라도 그것만으로 실제 OCI 25 RPS 문제가 해결됐다고 주장하지 않는다.

## 다음 단계

~~~text
page-first repository correction
→ Backend regression / build
→ 독립 Review
→ 사용자 승인
→ exact corrected source로 OCI 재측정 준비
→ I10K 25 RPS 동일 조건 재측정
→ List query / Connection lease / Hikari / Tomcat 비교
→ 25 PASS일 때만 50 RPS 검토
~~~

Host evidence collector timeout의 정확한 failing call은 기존 evidence에 남아 있지 않아 별도 미확정 항목이다. SQL correction 뒤 collector가 정상화되는지 확인하고, 다시 timeout되면 collector 자체 경로를 별도로 진단한다.

## 근거 수준

~~~text
I10K Dataset 준비                     = 완료
I10K isolated runtime                  = 준비/실행 확인
I10K 25 RPS 정상 baseline              = 없음
I10K 25 RPS warm-up failure evidence   = 있음
Read-only SQL diagnosis                 = 완료
MySQL raw execution-plan evidence       = 보존 완료
page-first correction                   = 구현 진행 중
동일 조건 재측정                        = 미실행
전체 성능 단계 Production Verified      = 아님
~~~

## 문서

- [[01. Performance Engineering Timeline]]
- [[02. Observability Gate와 Same-host Calibration]]
- [[03. Performance Gate Troubleshooting]]
- [[04. Evidence Inventory와 다음 단계]]
- [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]]
- [[06. OCI Re-baseline Preflight 기록]]
- [[07. OCI Performance DB Provisioning과 재검증]]
- [[08. I0 Dataset Provenance와 Root-owned 경로 Drift]]
- [[09. I0 25-150 RPS Re-baseline과 첫 처리 용량 경계 구간]]
- [[10. I10K 25 RPS Warm-up 실패와 Product 목록 SQL 실행 계획 진단]]
- [[11. PERF-V7-008 MySQL 실행 계획 Evidence]]

## 학습 연결

- [[../../../Study/Performance/03. Observability와 계층별 병목 분리]]
- [[../../../Study/Performance/06. Tomcat HikariCP DB Queueing]]
- [[../../../Study/Performance/07. Latency Percentile과 Tail Latency]]
- [[../../../Study/Performance/09. Before After와 성능 실험의 인과관계]]
- [[../../../Study/Performance/10. 대규모 데이터 Volume Cardinality Distribution Skew]]
- [[../../../Study/Performance/12. 성능 문제 분석 플레이북]]
- [[../../../Study/Performance/13. 재현 가능한 성능 실험과 안전한 격리]]
- [[../../../Study/Performance/14. 단계적 부하 증가와 처리 용량 경계 판정]]
- [[../../../Study/Performance/15. MySQL 실행 계획과 카디널리티 추정, Page-first 조회]]

과거 AWS 성능 한계는 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]에 Historical Evidence로 별도 보존한다.
