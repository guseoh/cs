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

현재 canonical main:

~~~text
7d2cf59c77fb0ed3d112aed62fe0830251d5e5e3
~~~

현재 상위 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)다.

Catalog Core 10K repository preparation은 [Issue #303](https://github.com/guseoh/pawcycle-commerce/issues/303) / PR #304로 분리해 완료했다.

그 다음 live Production Catalog를 오염시키지 않고 I0와 I10K를 비교하기 위한 격리 실행 계약을 [PR #306](https://github.com/guseoh/pawcycle-commerce/pull/306)에서 구현했고, 2026-09-23 squash merge했다. 상세 설계와 correction 과정은 [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]]에 정리한다.

2026-09-23 현재:

~~~text
Production diagnostic = READY
Observability diagnostic = NORMAL
Prometheus backend target = up
same-host calibration = PASS
Performance Measurement Ready = PASS

deploy.lock recurrence prevention = MERGED (#301)
Catalog Core 10K repository preparation = MERGED (#304)
PERF-V7-001 = COMPLETE

10K dataset repository contract = MERGED (#304)
isolated Catalog runtime/import/k6 repository contract = MERGED (#306)
repository validation = VERIFIED

performance schema/account = 미생성
isolated Backend runtime = 미실행
I0 / I10K OCI 측정 = 미실행
Production Verified = 아님
~~~

PR #304는 Repository Validation과 correction 검증은 통과했지만, 최종 correction HEAD에 대한 별도 CodeRabbit review submission `commit_id`가 생성되지 않은 채 merge됐다. request/status만으로 review 완료를 주장하지 않는 최신 Harness 규칙을 다시 확인한 뒤 이 차이를 Issue #303과 PR #304에 process evidence gap으로 정정 기록했다.

격리 설계는 이제 저장소 계약으로 구현·병합됐다. 같은 OCI MySQL DB System을 사용하되 **별도 performance schema/account + 별도 loopback-only Backend runtime + Production network 비가입**으로 데이터를 분리한다. 다만 실제 schema/account 생성, dataset import, isolated runtime 실행, SSH tunnel, k6 load는 여전히 별도 고위험 승인 대상이다.

PR #306의 최신 HEAD에 대한 CodeRabbit review submission 객체는 생성되지 않았지만, manual review 요청 완료 응답, CodeRabbit success, unresolved thread 0, 최신 HEAD CI 전체 성공과 독립 검토를 근거로 사용자가 **이번 PR에 한해 review evidence 예외를 명시 승인**했다. 이는 향후 PR의 일반 review 규칙을 완화한 것이 아니다.

문서:

- [[01. Performance Engineering Timeline]]
- [[02. Observability Gate와 Same-host Calibration]]
- [[03. Performance Gate Troubleshooting]]
- [[04. Evidence Inventory와 다음 단계]]
- [[05. Isolated Catalog Runtime과 10K Scale 실행 계약]]

학습 연결:

- [[../../../Study/Performance/01. 성능 엔지니어링과 기준선]]
- [[../../../Study/Performance/03. Observability와 계층별 병목 분리]]
- [[../../../Study/Performance/08. Observer Effect와 Same-host Calibration]]
- [[../../../Study/Performance/10. 대규모 데이터 Volume Cardinality Distribution Skew]]
- [[../../../Study/Performance/12. 성능 문제 분석 플레이북]]

과거 AWS 성능 한계는 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]에 Historical Evidence로 별도 보존한다.
