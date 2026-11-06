---
type: tech-article
title: "Ansible과 Rundeck을 활용한 서버 작업 자동화 및 권한 제어"
aliases: []
summary: "운영 자동화의 핵심은 모든 명령을 무인 실행하는 것이 아니라, 반복 작업을 표준화하고 실행 대상·권한·이력을 통제해 사람의 실수와 직접 접속 위험을 줄이는 데 있다."
source: "LY Corporation Tech Blog · 유재훈, 서동규"
published: 2023-10-06
collected: 2026-10-26
url: "https://techblog.lycorp.co.jp/ko/improve-operation-environment-with-rundeck"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
  - "보안"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
  - "tech/보안"
migration_origin: notion
---

# Ansible과 Rundeck을 활용한 서버 작업 자동화 및 권한 제어

> [!abstract] 한 줄 정리
> 운영 자동화의 핵심은 모든 명령을 무인 실행하는 것이 아니라, 반복 작업을 표준화하고 실행 대상·권한·이력을 통제해 사람의 실수와 직접 접속 위험을 줄이는 데 있다.

> LY Corporation Tech Blog · 유재훈, 서동규 · 2023-10-06

## 핵심 내용

서버 운영 자동화에서 중요한 것은 원격 명령을 빠르게 실행하는 것뿐 아니라 누가 어느 서버를 대상으로 어떤 작업을 할 수 있는지를 통제하는 일이다. LINE Pay는 수천 대 서버와 다수의 하위 도메인을 관리하며 사람의 직접 접속·반복 조회·설정 수정의 위험을 줄이려 Ansible과 Rundeck의 역할을 나누었다.

![Rundeck의 역할별 ACL 정책을 관리하는 화면](https://vos.line-scdn.net/landpress-content-v2-vcfc68aynwenkh3bno0ixfx8/1700038037090.png?updatedAt=1700038038000)

*그림 1. Rundeck에 저장된 ACL 정책과 새 권한 정책 생성 기능을 보여주는 원문 화면 — [출처: 원문 기술 블로그](https://techblog.lycorp.co.jp/ko/improve-operation-environment-with-rundeck)*

Ansible은 Playbook으로 서버 작업과 구성 규칙을 코드화하고, Rundeck은 실행 UI·스케줄·작업 이력·ACL을 관리했다. 서버 목록은 고정 hosts.ini만으로 관리하는 대신 서비스·팀·태그와 연결된 동적 인벤토리에서 가져와 권한과 대상 정보를 최신 상태로 유지했다. 읽기 전용 조회와 서버 변경 명령의 위험 수준이 다르므로 프로젝트·작업별 역할에 따라 접근을 구분한다.

```yaml
# 원문 운영 방식을 바탕으로 자체 재구성한 인벤토리 메타데이터 예
service: payment
team: sre
environment: production
tags: [payment, batch]
```

원본 도구의 실제 ACL 스키마와 혼동해서는 안 되며, 이 예시는 동적 대상 선정에 필요한 속성을 보여준다.

| 작업 유형(9개월 관찰) | 실행 건수 | 권한 설계상 참고 |
| --- | ---: | --- |
| 시스템·파일 조회 | 989 | 읽기 전용 작업을 넓게 허용할 여지 |
| 네트워크 조회 | 428 | 네트워크 접근 대상 통제 |
| 설정 갱신 | 93 | 별도 승인·롤백 필요 |
| 설치 | 56 | 변경 이력 및 영향 범위 확인 |
| 인증서 교체 | 51 | 만료·비밀값 노출 방지 |

*원문은 약 9개월간 총 1,600여 건의 운영 작업 자동화를 보고한다.*

원문은 조회 작업이 대다수인 9개월 동안 1,600여 건의 자동화 사례를 제시했다. 설치·인증서 교체·설정 갱신은 실행자·승인자·롤백과 Secret 노출을 별도로 검토해야 한다. 예측하기 어려운 임의 원격 명령은 Super Admin에게만 허용했고, 변경은 개발·운영 측 리뷰를 거쳤다. 자동화의 결과뿐 아니라 실행 시점·대상·이유를 추적할 수 있어야 한다.

## 왜 읽을까

자동화 범위를 선정할 때 작업 빈도와 위험을 먼저 평가하고, 모든 자동화를 동일한 권한으로 실행하지 않는다는 점이 실무적이다. Git 이력과 역할 기반 접근 제어가 운영 변경의 책임 소재를 어떻게 명확하게 하는지도 배울 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] OCI 운영에서 반복되는 상태 조회·로그 확인·배포 점검을 읽기 전용 스크립트로 먼저 표준화한다.
- [ ] 설정 변경과 재시작 같은 쓰기 작업은 별도 승인·권한·롤백 절차로 분리한다.
- [ ] 작업 시각·실행자·대상·결과를 기록하고 Secret이 로그에 노출되지 않는지 점검한다.

---

**원문:** [Ansible과 Rundeck을 활용한 서버 작업 자동화 및 권한 제어](https://techblog.lycorp.co.jp/ko/improve-operation-environment-with-rundeck)
