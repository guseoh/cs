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
b669c5a8e0a5d5bf61a20331216003a2a404cb85
~~~

다음 상위 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)이며, 그 안의 Catalog Core 10K repository-preparation 세부 작업은 [Issue #303](https://github.com/guseoh/pawcycle-commerce/issues/303) / PR #304로 분리돼 있다.

2026-09-22 현재:

~~~text
Production diagnostic = READY
Observability diagnostic = NORMAL
Prometheus backend target = up
latest SHA runtime provenance = PASS
same-host calibration = PASS
runtime 측면 Performance Measurement Ready = PASS

deploy.lock recurrence prevention = MERGED (#301)
PERF-V7-001 = COMPLETE

Production workload baseline = 아직 미실행
10K Production import/load = 아직 미실행
~~~

문서:

- [[01. Performance Engineering Timeline]]
- [[02. Observability Gate와 Same-host Calibration]]
- [[03. Performance Gate Troubleshooting]]
- [[04. Evidence Inventory와 다음 단계]]

학습 연결:

- [[../../../Study/Performance/01. 성능 엔지니어링과 기준선]]
- [[../../../Study/Performance/03. Observability와 계층별 병목 분리]]
- [[../../../Study/Performance/08. Observer Effect와 Same-host Calibration]]
- [[../../../Study/Performance/10. 대규모 데이터 Volume Cardinality Distribution Skew]]
- [[../../../Study/Performance/12. 성능 문제 분석 플레이북]]

과거 AWS 성능 한계는 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]에 Historical Evidence로 별도 보존한다.
