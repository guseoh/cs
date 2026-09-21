---
category: PawCycle
status: 완료
tags:
  - Project
  - pawCycle
  - AWS
---

# PawCycle AWS 운영 기록

이 디렉터리는 PawCycle Commerce가 AWS를 선택하고, 단일 EC2 Production을 만들고, 배포·HTTPS·backup·관측을 운영한 뒤 Docker MySQL에서 RDS Single-AZ로 전환하고 성능 한계를 측정했던 과정을 재구성한다. 과거를 현재 설계처럼 쓰지 않고, 계획·저장소 준비·실제 운영 검증·철거 상태를 구분한다.

이 문서 세트에서 확정하는 현재 상태는 AWS에 한정한다. AWS Production은 2026년 7~8월 실제 운영됐고 이후 resource와 AWS 전용 실행 계약이 종료되어 `Retired` 상태다. 그 뒤 PawCycle은 OCI 기반 배포·운영 구조로 이동했으며, 후속 Runbook과 ADR에는 OCI Production host·Managed MySQL·HTTPS·관측성의 실제 운영 근거가 남아 있다.

다만 이 디렉터리는 현재 OCI release, CD 상태나 `Production Verified` 범위를 판정하는 Canonical 문서가 아니다. PR #277과 PR #284가 보여 주는 repository readiness와 “활성 target 없음”은 2026년 9월 초의 역사적 단계로만 읽고, 현재 OCI의 세부 상태는 해당 시점의 PawCycle 운영 Runbook·ADR·실행 보고서를 별도로 확인한다.

문서 순서는 다음과 같다.

- [[01. PawCycle AWS Engineering Timeline]]: 전체 사건과 상태
- [[02. PawCycle 초기 AWS Production 아키텍처]]: EC2·Docker Compose·Nginx·MySQL 구조
- [[03. PawCycle 배포 보안과 관측성]]: Secret, GHCR, OIDC, SSM, HTTPS, CloudWatch와 Prometheus
- [[04. Docker MySQL에서 RDS Single-AZ까지]]: 필요성, 설계, rehearsal과 cutover 근거
- [[05. PawCycle Backup과 Restore 운영]]: S3 logical backup, isolated restore와 미검증 경계
- [[06. SSM 배포 자동화 Troubleshooting]]: v1~v6 실패와 Git ownership 원인
- [[07. RDS Migration Troubleshooting]]: CRLF, quoting, same-SHA, 잘못된 DB target과 stdin
- [[08. 250 RPS Production 장애 분석]]: Application OOM과 RDS 병목 가설 배제
- [[09. PawCycle Architecture Decision과 Trade-off]]: EC2, Compose, Single-AZ, HA와 미도입 선택
- [[10. AWS 종료와 OCI 전환 재평가]]: 비용 결정과 현재 시점 비교
- [[11. AWS Evidence Inventory와 미확인 사항]]: Issue·PR·ADR·Report·commit 근거 지도

AWS 개념 자체는 [[Study/Infra/AWS/README|AWS를 서비스 운영 관점에서 공부하는 순서]]에서 설명한다. 여기서는 PawCycle에서 실제로 무엇을 했고 왜 그렇게 판단했는지에 집중한다.
