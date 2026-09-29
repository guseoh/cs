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

PawCycle 성능 단계의 목적은 큰 숫자를 만드는 것이 아니라 **대규모 데이터와 대규모 트래픽을 재현하고, 현재 단일 Backend 구조가 어떤 조건에서 왜 느려지는지 측정 가능한 근거로 설명하는 것**이다.

첫 OCI 성능 Gate인 [PERF-V7-001 Issue #300](https://github.com/guseoh/pawcycle-commerce/issues/300)은 2026-09-22 완료됐다. 현재 상위 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)다.

2026-09-29 I0 Actual Re-baseline에 사용한 PawCycle canonical main:

~~~text
ad4e4ed703cc48aca53b46a31858d400a8096781
~~~

Catalog Core 10K repository preparation은 [Issue #303](https://github.com/guseoh/pawcycle-commerce/issues/303) / PR #304로 완료했다. live Production Catalog를 오염시키지 않고 I0와 I10K를 비교하기 위한 격리 실행 계약은 [PR #306](https://github.com/guseoh/pawcycle-commerce/pull/306), stage evidence collector는 [PR #308](https://github.com/guseoh/pawcycle-commerce/pull/308), 단계별 단일 RPS 실행과 사용자 승인 경계는 [Issue #312](https://github.com/guseoh/pawcycle-commerce/issues/312) / [PR #313](https://github.com/guseoh/pawcycle-commerce/pull/313)에서 main에 반영됐다.

상세 repository contract는 [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]], 실제 OCI Preflight와 administrator 접근 Troubleshooting은 [[06. OCI Re-baseline Preflight 기록]], performance schema/account의 실제 provisioning과 재검증은 [[07. OCI Performance DB Provisioning과 재검증]], I0 Dataset provenance와 host path ownership drift는 [[08. I0 Dataset Provenance와 Root-owned 경로 Drift]], 실제 25→150 RPS 측정과 첫 처리 용량 경계 구간은 [[09. I0 25-150 RPS Re-baseline과 첫 처리 용량 경계 구간]]에 기록한다.

## 현재 상태 — 2026-09-29

~~~text
Production diagnostic = READY
release coordination = stable
Observability diagnostic = NORMAL
Prometheus backend target = up
Clock Gate = PASS
OCI MySQL required metric availability = PASS
exact approved source = PASS

performance schema/account isolation = PASS
Production schema privilege = 없음
I0 dataset = PASS / Product 32 / SKU 42
I0 dataset provenance = PASS
isolated Backend runtime preflight = PASS
isolated Backend runtime = UP / loopback-only

I0 / 25 RPS  = PASS
I0 / 50 RPS  = PASS
I0 / 100 RPS = PASS + Watch
I0 / 150 RPS = FAIL

150 RPS:
actual 149.233 RPS
dropped 34
p50 66.98 ms
p95 1205.59 ms
p99 1893.77 ms
Hikari active max 10/10
Hikari pending max 32
Hikari acquire avg 5.806 ms

200 / 250 RPS = 중단
I10K OCI 측정 = 미실행
전체 Stage 2-C Production Verified = 아님
~~~

## 현재 해석

I0의 Product 32 Dataset에서는 100 RPS까지 정의한 hard threshold를 통과했다. 100 RPS에서는 Hikari full-pool / pending이 19개 관측 샘플 중 1개에서만 나타나 단발성 압박으로 분류했다.

150 RPS에서는 `dropped_iterations=34`로 canonical threshold가 깨졌고, p50은 거의 변하지 않았지만 p95가 약 1.2초, p99가 약 1.9초까지 비선형적으로 증가했다. 동시에 Hikari pending은 최대 32, acquire 평균은 100 RPS의 0.102ms에서 5.806ms로 크게 늘었다.

반면 Host CPU 평균은 약 13%, Container CPU 평균은 약 12%, Tomcat busy는 43/200, OCI MySQL CPU는 평균 약 44% / 최대 약 54%였다. 따라서 현재 가장 강한 후보는 CPU 포화가 아니라 **DB Connection 획득 경로의 Queueing**이다.

다만 “Pool 10이 작으니 20으로 늘린다”는 결론은 내리지 않았다. 과거 Phase 9에서 Hikari 10→20 확대가 처리량을 악화시킨 Historical Evidence가 있고, pending은 원인 자체가 아니라 SQL·Lock·Transaction·동시성 압박의 결과일 수 있기 때문이다.

현재 확인된 범위는 다음과 같다.

~~~text
검증된 안정 범위: 100 RPS까지
확인된 실패 범위: 150 RPS
실제 처리 용량 경계: 100~150 RPS 사이의 구간
Root Cause: 아직 미확정
가장 강한 후보: DB connection path / Hikari queueing
~~~

## 다음 작업

다음 작업은 더 큰 부하를 넣는 것이 아니다.

~~~text
150 RPS FAIL
→ SQL / Transaction / Connection hold read-only 진단
→ Query plan / Index / Lock / I/O 확인
→ 원인 가설 구체화
→ 가장 작은 개선
→ 동일 I0 / 150 RPS 재측정
→ Before / After 확인
→ 200 RPS 진행 여부 결정
~~~

I0의 동시성 한계를 충분히 이해하고 개선한 뒤 I10K Product 10,000 Dataset으로 같은 workload를 반복한다. 요청 부하와 Dataset 규모를 동시에 바꾸지 않고, 같은 Dataset에서는 부하만 올리고 같은 부하에서는 Dataset만 바꿔 원인을 분리한다.

격리 설계는 같은 OCI MySQL DB System을 사용하되 **별도 performance schema/account + 별도 loopback-only Backend runtime + Production network 비가입**으로 데이터를 분리한다. 이는 data isolation이며 resource isolation은 아니다. 따라서 OCI MySQL DB System 전체 Metric은 I0 workload만의 값으로 단정하지 않고 stage별 추세와 Application 내부 Metric을 함께 본다.

실제 Secret 값, DB endpoint, OCI resource identifier, SSH key 내용, raw Production DB row는 기록하지 않는다.

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

## 학습 연결

- [[../../../Study/Performance/01. 성능 엔지니어링과 기준선]]
- [[../../../Study/Performance/02. 부하 테스트와 Workload Modeling]]
- [[../../../Study/Performance/03. Observability와 계층별 병목 분리]]
- [[../../../Study/Performance/06. Tomcat HikariCP DB Queueing]]
- [[../../../Study/Performance/07. Latency Percentile과 Tail Latency]]
- [[../../../Study/Performance/09. Before After와 성능 실험의 인과관계]]
- [[../../../Study/Performance/10. 대규모 데이터 Volume Cardinality Distribution Skew]]
- [[../../../Study/Performance/12. 성능 문제 분석 플레이북]]
- [[../../../Study/Performance/13. 재현 가능한 성능 실험과 안전한 격리]]
- [[../../../Study/Performance/14. 단계적 부하 증가와 처리 용량 경계 판정]]

과거 AWS 성능 한계는 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]에 Historical Evidence로 별도 보존한다.
