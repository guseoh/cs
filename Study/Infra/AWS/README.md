---
category: AWS
status: 완료
tags:
  - Infra
  - AWS
---

# AWS를 서비스 운영 관점에서 공부하는 순서

이 디렉터리는 AWS 서비스 이름을 암기하기 위한 요약집이 아니다. Backend 애플리케이션 한 개를 실제 Production에 배치한다고 가정하고, 요청이 네트워크를 지나 애플리케이션과 데이터베이스에 도달하는 과정, 배포와 복구가 안전하려면 필요한 경계, 장애가 어느 계층에서 보이는지를 연결해서 설명한다.

학습 순서는 다음과 같다.

1. [[01. AWS 전체 구조와 책임 경계]]에서 Region, Availability Zone, Shared Responsibility와 장애 범위를 잡는다.
2. [[02. IAM과 임시 자격 증명]]에서 사람, EC2, GitHub Actions가 AWS 권한을 얻는 방식을 구분한다.
3. [[03. VPC와 네트워크 흐름]]에서 CIDR, subnet, route, Internet Gateway, NAT, Security Group, NACL과 DNS를 하나의 패킷 흐름으로 연결한다.
4. [[04. EC2와 Docker workload 운영]]에서 ENI, IP, EBS, SSM과 container workload의 책임을 이해한다.
5. [[05. S3 기반 백업과 복구]]에서 object storage를 backup 저장소로 사용할 때 저장과 복원을 어떻게 함께 검증하는지 본다.
6. [[06. DNS와 Nginx와 HTTPS]]에서 사용자 요청이 TLS를 거쳐 Spring Boot에 도달하는 흐름을 정리한다.
7. [[07. RDS MySQL과 Managed Database]]에서 Single-AZ, Multi-AZ, read replica, backup, PITR, TLS와 metric을 연결한다.
8. [[08. CloudWatch와 계층별 관측성]]에서 AWS 리소스 지표와 애플리케이션 지표가 왜 서로 대체되지 않는지 배운다.
9. [[09. GitHub Actions에서 EC2까지의 배포]]에서 OIDC, IAM Role, SSM, GHCR, Compose, 배포 버전과 rollback을 하나의 제어 경로로 본다.
10. [[10. 비용과 가용성과 장애 대응]]에서 비용, 복구 목표, 고가용성의 범위를 전체 시스템 관점에서 판단한다.

각 문서는 AWS 공식 문서를 현재 동작의 기준으로 사용하고, 마지막에 PawCycle의 실제 사례를 연결한다. PawCycle의 프로젝트 사실은 외부 설명이 아니라 `guseoh/pawcycle-commerce`의 코드, Runbook, ADR, Issue, PR과 실행 보고서를 기준으로 한다.

> [AWS Shared Responsibility Model for Resiliency](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/shared-responsibility-model-for-resiliency.html)
> [AWS Regions and Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)

## AWS 개념과 PawCycle 기록을 함께 읽는 방법

일반 개념을 먼저 이해한 뒤 실제 프로젝트에서 어떤 판단으로 이어졌는지 확인하면 학습이 훨씬 잘 연결된다. 반대로 프로젝트 장애 기록을 먼저 읽다가 모르는 AWS 개념이 나오면 왼쪽의 학습 문서로 돌아오면 된다.

| AWS에서 공부할 주제 | 함께 볼 PawCycle 기록 | 연결해서 볼 질문 |
| --- | --- | --- |
| IAM / OIDC / SSM | [[03. PawCycle 배포 보안과 관측성]], [[06. SSM 배포 자동화 Troubleshooting]] | 장기 Access Key 없이 GitHub와 EC2에 어떻게 권한을 위임했고, 실제 실패는 어느 계층에서 났는가? |
| VPC / SG / EC2 | [[02. PawCycle 초기 AWS Production 아키텍처]] | 인터넷에 공개한 경계와 내부 통신 경계는 어떻게 나눴고, 단일 EC2가 어떤 장애 범위를 만들었는가? |
| S3 / Backup / Restore | [[05. PawCycle Backup과 Restore 운영]] | Backup 파일을 저장하는 것과 실제 복구 가능성을 검증하는 것은 어떻게 다른가? |
| RDS | [[04. Docker MySQL에서 RDS Single-AZ까지]], [[07. RDS Migration Troubleshooting]] | 왜 Docker MySQL에서 RDS로 옮겼고, 왜 Multi-AZ가 아니라 Single-AZ였는가? |
| CloudWatch / 관측성 | [[03. PawCycle 배포 보안과 관측성]], [[08. 250 RPS Production 장애 분석]] | RDS, JVM, Hikari, Container 지표를 어떻게 같이 보면서 잘못된 병목 가설을 버렸는가? |
| 비용 / HA / 복구 | [[09. PawCycle Architecture Decision과 Trade-off]], [[10. AWS 종료와 OCI 전환 재평가]] | 어떤 기술을 도입하지 않은 이유와 AWS를 장기 운영하지 않은 이유는 무엇이었는가? |

이 연결표는 정답 순서를 강제하기 위한 것이 아니다. AWS 개념과 실제 운영 근거를 왕복하면서 “왜 필요한가 → 어떻게 동작하는가 → PawCycle에서는 왜 이렇게 선택했는가”를 확인하기 위한 길잡이다.

## 역사 자료를 읽을 때의 상태 표현

Cloud 운영 문서는 계획과 실제 적용을 섞으면 위험하다. 이 문서 모음에서는 다음 상태를 구분한다.

| 상태 | 의미 |
| --- | --- |
| `Planned / Proposed` | 후보 구조나 결정 입력만 존재한다. |
| `Implemented` | 저장소 코드·설정·Runbook이 만들어졌다. |
| `Verified` | 저장소 또는 격리 환경 검증이 끝났다. |
| `Production Verified` | 실제 운영 적용 전후 증거가 있다. |
| `Not Verified` | 필요한 검증이 없거나 근거가 부족하다. |
| `Retired` | 과거에는 사용했지만 현재 활성 계약이 아니다. |

PawCycle AWS 구조는 `Production Verified`였던 시기가 있지만 현재는 `Retired`다. 이후 PawCycle은 OCI 기반 배포·운영 구조로 이동했지만, 이 AWS 학습 자료는 현재 OCI release나 `Production Verified` 범위를 판정하는 문서가 아니다. 현재 OCI 상태는 읽는 시점의 PawCycle 운영 Runbook·ADR·실행 근거를 별도로 확인하고, 이 디렉터리에서는 AWS 역사와 전환 과정만 다룬다. 전체 역사와 근거는 [[01. PawCycle AWS Engineering Timeline]]에서 확인한다.
