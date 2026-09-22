---
category: PawCycle
status: 진행중
tags:
  - Project
  - pawCycle
  - Performance
---

# PawCycle Performance Engineering 기록

이 디렉터리는 PawCycle Commerce의 성능 단계를 단순한 부하 테스트 결과가 아니라 **측정 환경 준비 → 관측 가능성 검증 → 실패 원인 분리 → 동일 조건 비교 → 최소 개선 → 재측정 → 기술·아키텍처 판단**의 흐름으로 기록한다.

AWS에서 수행했던 200 RPS known-good / 250 RPS first-failure 결과는 역사적 근거로 보존하지만, 현재 OCI 환경의 기준선으로 그대로 재사용하지 않는다. 현재 성능 단계는 OCI Production, 최신 승인 main, 새 Scale Dataset을 기준으로 다시 시작한다.

이 문서는 PawCycle 저장소의 Runbook·Issue·Report를 대체하는 canonical 문서가 아니다. 실제 실행 상태와 승인 근거는 guseoh/pawcycle-commerce의 코드·Issue·PR·Runbook을 우선하고, 이 디렉터리는 그 과정을 장기 학습과 포트폴리오 관점에서 재구성한다.

현재 첫 Gate는 [PERF-V7-001 Issue #300](https://github.com/guseoh/pawcycle-commerce/issues/300)이다. 2026-09-22 기준으로 Observability same-host overhead calibration과 runtime 측면의 Performance Measurement Ready 조건은 PASS했지만, Issue 전체는 아직 진행 중이다.

문서 순서는 다음과 같다.

- [[01. Performance Engineering Timeline]]: AWS historical evidence에서 OCI Re-baseline 진입까지의 사건 흐름
- [[02. Observability Gate와 Same-host Calibration]]: 왜 부하보다 Observability를 먼저 검증했고, OFF/ON 비교로 무엇을 판단했는지
- [[03. Performance Gate Troubleshooting]]: deploy.lock mode drift, source provenance, SSH shell 종료 오판을 어떻게 좁혔는지
- [[04. Evidence Inventory와 다음 단계]]: 현재 근거 수준, 미완료 항목, Scale Dataset과 Re-baseline으로 넘길 조건

관련 과거 AWS 성능 한계 분석은 [[../AWS/08. 250 RPS Production 장애 분석|250 RPS Production 장애 분석]]을 참고한다.
