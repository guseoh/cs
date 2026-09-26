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

2026-09-26 작업 시점 PawCycle canonical main:

~~~text
9d2db627486b2940a7c357aefe66ebe927c974af
~~~

현재 상위 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)다.

Catalog Core 10K repository preparation은 [Issue #303](https://github.com/guseoh/pawcycle-commerce/issues/303) / PR #304로 완료했다. live Production Catalog를 오염시키지 않고 I0와 I10K를 비교하기 위한 격리 실행 계약은 [PR #306](https://github.com/guseoh/pawcycle-commerce/pull/306)에서 구현했다. 이후 isolated Catalog stage evidence collector까지 [PR #308](https://github.com/guseoh/pawcycle-commerce/pull/308)에서 main에 반영됐다.

상세 설계와 repository contract는 [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]]에 정리한다. 실제 OCI 실행을 시작하면서 수행한 Preflight와 DB 접근 Troubleshooting은 [[06. OCI Re-baseline Preflight 기록]]에 분리해서 기록한다.

2026-09-26 현재:

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

performance DB account = 현재 조회에서 미발견
contract performance schema 2개 = 정확한 이름으로 재검증 필요
performance schema/account provisioning = 미실행
isolated Backend runtime = 미실행
I0 / I10K OCI 측정 = 미실행
Production Verified = 아님
~~~

이번 Preflight에서는 Secret-safe 입력만으로 충분하지 않고 실패 응답에서도 제출 값이 다시 노출될 수 있다는 운영 문제를 확인했다. 잘못된 credential update 가설은 OCI API에서 거부됐고 Cloud-side mutation은 발생하지 않았으며, 당시 제출 값은 폐기했다. 이후 변경 범위를 필요한 단일 속성으로 줄이고 오류 출력 경계를 보강한 뒤 rotation과 실제 MySQL 인증을 다시 검증했다. 실제 credential 값, endpoint, resource identifier, 전체 관리자 grant 원문은 기록하지 않는다.

또한 첫 performance schema 확인 SQL이 repository contract의 정확한 이름이 아니라 `core`가 빠진 다른 schema 이름을 조회한 사실을 재검토에서 발견했다. 따라서 해당 `Empty set`을 실제 contract schema 미존재 근거로 사용하지 않는다. 정확한 schema 이름으로 read-only 재검증한 뒤 provisioning으로 넘어간다.

격리 설계는 같은 OCI MySQL DB System을 사용하되 **별도 performance schema/account + 별도 loopback-only Backend runtime + Production network 비가입**으로 데이터를 분리한다. 이는 data isolation이며 resource isolation은 아니다.

문서:

- [[01. Performance Engineering Timeline]]
- [[02. Observability Gate와 Same-host Calibration]]
- [[03. Performance Gate Troubleshooting]]
- [[04. Evidence Inventory와 다음 단계]]
- [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]]
- [[06. OCI Re-baseline Preflight 기록]]

학습 연결:

- [[../../../Study/Performance/01. 성능 엔지니어링과 기준선]]
- [[../../../Study/Performance/03. Observability와 계층별 병목 분리]]
- [[../../../Study/Performance/08. Observer Effect와 Same-host Calibration]]
- [[../../../Study/Performance/10. 대규모 데이터 Volume Cardinality Distribution Skew]]
- [[../../../Study/Performance/12. 성능 문제 분석 플레이북]]
- [[../../../Study/Performance/13. 재현 가능한 성능 실험과 안전한 격리]]

과거 AWS 성능 한계는 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]에 Historical Evidence로 별도 보존한다.
