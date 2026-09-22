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
cd883cf6a954d7f82e7bf72af9254aa9e64e5493
~~~

현재 상위 작업은 [PERF-V7-002 Issue #302](https://github.com/guseoh/pawcycle-commerce/issues/302)다.

Catalog Core 10K repository preparation은 [Issue #303](https://github.com/guseoh/pawcycle-commerce/issues/303) / PR #304로 분리해 완료했다.

2026-09-22 현재:

~~~text
Production diagnostic = READY
Observability diagnostic = NORMAL
Prometheus backend target = up
same-host calibration = PASS
Performance Measurement Ready = PASS

deploy.lock recurrence prevention = MERGED (#301)
Catalog Core 10K repository preparation = MERGED (#304)
PERF-V7-001 = COMPLETE

10K dataset repository contract = READY
OCI dataset isolation boundary = 사용자 승인 대기
Production DB/schema mutation = 미실행
Production load / 10K Re-baseline = 미실행
~~~

PR #304는 Repository Validation과 correction 검증은 통과했지만, 최종 correction HEAD에 대한 별도 CodeRabbit review submission `commit_id`가 생성되지 않은 채 merge됐다. request/status만으로 review 완료를 주장하지 않는 최신 Harness 규칙을 다시 확인한 뒤 이 차이를 Issue #303과 PR #304에 process evidence gap으로 정정 기록했다.

다음 설계 후보는 live Catalog를 오염시키지 않기 위해 **같은 OCI MySQL DB System 안의 별도 performance schema/account + 별도 loopback-only Backend runtime**으로 격리하는 방식이다. 실제 DB/schema/user/runtime/load 실행은 아직 승인하지 않았다.

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
