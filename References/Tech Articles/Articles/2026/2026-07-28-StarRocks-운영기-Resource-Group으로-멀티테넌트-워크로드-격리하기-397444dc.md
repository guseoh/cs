---
type: tech-article
title: "StarRocks 운영기: Resource Group으로 멀티테넌트 워크로드 격리하기"
aliases: []
summary: "여러 워크로드가 같은 데이터 시스템을 공유하면 평균 성능보다 한 작업이 다른 작업을 방해하는 noisy-neighbor 문제를 먼저 관리해야 합니다."
source: "toss.tech"
published: 
collected: 2026-07-28
url: "https://toss.tech/article/operating-starrocks-1"
topic: "DB·데이터"
categories:
  - "DB·데이터"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
migration_origin: notion
---

# StarRocks 운영기: Resource Group으로 멀티테넌트 워크로드 격리하기

> [!abstract] 한 줄 정리
> 여러 워크로드가 같은 데이터 시스템을 공유하면 평균 성능보다 한 작업이 다른 작업을 방해하는 noisy-neighbor 문제를 먼저 관리해야 합니다.

> toss.tech

## 핵심 내용

StarRocks를 여러 사용자가 공유하면서 무거운 쿼리 하나가 다른 쿼리의 CPU와 실행 자원을 잠식하는 문제를 Resource Group으로 격리합니다. 워크로드별 CPU priority와 자원 한도를 조정해 멀티테넌트 환경의 예측 가능성을 높입니다.

멀티테넌트 분석 저장소에서 개별 쿼리가 정상적으로 실행된다고 해도 여러 팀이 동시에 요청하면 자원 경합으로 전체 SLA가 무너질 수 있다. StarRocks Resource Group은 CPU·메모리·동시 실행 정책을 작업 성격별로 구분해 무거운 배치 분석이 짧은 대화형 조회를 잠식하지 않도록 한다. 단순 인스턴스 증설보다 쿼리의 우선순위를 먼저 정의하는 접근이다.

| 워크로드 | 자원 정책을 다르게 보는 이유 |
| --- | --- |
| 대화형 조회 | 짧은 응답 지연·동시성 중요 |
| 대규모 배치 | 처리량과 실행 시간 중요 |
| 여러 팀 공용 쿼리 | 한 팀의 독점 방지 |
| 장애성 쿼리 | 메모리·CPU 사용 상한 필요 |

Resource Group만 만들고 쿼리의 실제 분류 규칙을 잘못 두면 격리가 무력화될 수 있다. 배치와 온라인 쿼리가 겹치는 조건에서 P95·쿼리 실패율·큐 대기를 측정해야 한다.

## 왜 읽을까

스케일 업보다 자원을 누구에게 어떻게 배분할지의 문제가 먼저일 수 있다는 점을 보여주는 운영 사례입니다.

**프로젝트에 적용**

**FutMatch** — 향후 비동기 작업·검색·통계 같은 서로 다른 workload가 생긴다면 동일 thread pool이나 DB connection을 무제한 공유하지 말고 중요도별 한도와 격리 필요성을 측정해볼 수 있습니다.

---

**원문:** [StarRocks 운영기: Resource Group으로 멀티테넌트 워크로드 격리하기](https://toss.tech/article/operating-starrocks-1)
