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

첫 OCI 성능 Gate인 [PERF-V7-001 Issue #300](https://github.com/guseoh/pawcycle-commerce/issues/300)은 2026-09-22 완료됐다.

2026-09-28 확인한 PawCycle canonical main:

~~~text
9d2db627486b2940a7c357aefe66ebe927c974af
~~~

현재 상위 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)다.

Catalog Core 10K repository preparation은 [Issue #303](https://github.com/guseoh/pawcycle-commerce/issues/303) / PR #304로 완료했다. live Production Catalog를 오염시키지 않고 I0와 I10K를 비교하기 위한 격리 실행 계약은 [PR #306](https://github.com/guseoh/pawcycle-commerce/pull/306)에서 구현했다. 이후 isolated Catalog stage evidence collector까지 [PR #308](https://github.com/guseoh/pawcycle-commerce/pull/308)에서 main에 반영됐다.

상세 repository contract는 [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]], 실제 OCI Preflight와 administrator 접근 Troubleshooting은 [[06. OCI Re-baseline Preflight 기록]], performance schema/account의 실제 provisioning과 재검증은 [[07. OCI Performance DB Provisioning과 재검증]], I0 dataset provenance와 host path ownership drift는 [[08. I0 Dataset Provenance와 Root-owned 경로 Drift]]에 기록한다.

2026-09-28 현재:

~~~text
Production diagnostic = READY
release coordination = stable
Observability diagnostic = NORMAL
Prometheus backend target = up
Clock Gate = PASS
OCI MySQL required metric availability = PASS
exact approved source = PASS

DB administrator identity recovery = PASS
administrator credential rotation = 수행됨
DB lifecycle after rotation = ACTIVE
administrator authentication = PASS
schema/user provisioning authority = CONFIRMED

pawcycle_perf_core_control = 준비됨 / empty / utf8mb4_0900_ai_ci
pawcycle_perf_core_10k = 준비됨 / empty / utf8mb4_0900_ai_ci
pawcycle_perf_catalog = 준비됨
performance account actual authentication = PASS
performance grant boundary = PASS
Production schema privilege = 없음
post-provision Runtime Gate = PASS

I0 dataset generation = PASS / 32 Product / 0 synthetic / 42 SKU
initial I0 provenance = FAIL-CLOSED / parent ownership drift
Production shared parent ownership change = 하지 않음
dedicated performance root = /opt/pawcycle-performance
I0 dataset provenance = PASS

isolated Backend runtime preflight = 미실행
I0 import/runtime/load = 미실행
I10K OCI 측정 = 미실행
전체 2-C Production Verified = 아님
~~~

이번 Actual Re-baseline 준비에서는 Secret-safe 입력만으로 충분하지 않고 실패 응답까지 Secret-safe해야 한다는 점, read-only SQL도 exact identity를 잘못 조회하면 부재 근거가 될 수 없다는 점, password 생성은 DBMS의 실제 policy를 따라야 한다는 점, 실패한 provisioning은 `IF NOT EXISTS`로 덮지 말고 부분 적용 상태를 read-only로 재구성해야 한다는 점을 확인했다.

또한 I0 dataset 생성 뒤 provenance validator가 `/opt/pawcycle`의 실제 ownership과 Runbook 권장 경로의 security contract가 맞지 않아 fail-closed하는 drift를 발견했다. Production 공용 parent를 `chown`하는 대신 root-owned sibling `/opt/pawcycle-performance`를 분리했고, exact source와 이미 생성된 I0 manifest/report를 secure tree로 옮겨 provenance 재생성을 통과시켰다. validator를 약화하거나 Production 공용 경로 ownership을 바꾸지 않은 것이 핵심이다.

performance account의 grant는 두 performance schema에만 제한됐고 실제 runtime secret file을 사용한 인증도 통과했다. schema/account mutation 뒤 Production READY / Observability NORMAL을 다시 확인했다. 실제 Secret 값, DB endpoint, resource identifier, raw Production DB row, 전체 administrator grant 원문은 기록하지 않는다.

격리 설계는 같은 OCI MySQL DB System을 사용하되 **별도 performance schema/account + 별도 loopback-only Backend runtime + Production network 비가입**으로 데이터를 분리한다. 이는 data isolation이며 resource isolation은 아니다.

다음 실제 Gate는 I0 runtime config를 root-owned secure tree에 준비하고 Production과 같은 Backend RepoDigest를 고정한 뒤 isolated runtime preflight를 통과시키는 것이다. actual import/runtime/load는 아직 시작하지 않았다.

문서:

- [[01. Performance Engineering Timeline]]
- [[02. Observability Gate와 Same-host Calibration]]
- [[03. Performance Gate Troubleshooting]]
- [[04. Evidence Inventory와 다음 단계]]
- [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]]
- [[06. OCI Re-baseline Preflight 기록]]
- [[07. OCI Performance DB Provisioning과 재검증]]
- [[08. I0 Dataset Provenance와 Root-owned 경로 Drift]]

학습 연결:

- [[../../../Study/Performance/01. 성능 엔지니어링과 기준선]]
- [[../../../Study/Performance/03. Observability와 계층별 병목 분리]]
- [[../../../Study/Performance/08. Observer Effect와 Same-host Calibration]]
- [[../../../Study/Performance/10. 대규모 데이터 Volume Cardinality Distribution Skew]]
- [[../../../Study/Performance/12. 성능 문제 분석 플레이북]]
- [[../../../Study/Performance/13. 재현 가능한 성능 실험과 안전한 격리]]

과거 AWS 성능 한계는 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]에 Historical Evidence로 별도 보존한다.
