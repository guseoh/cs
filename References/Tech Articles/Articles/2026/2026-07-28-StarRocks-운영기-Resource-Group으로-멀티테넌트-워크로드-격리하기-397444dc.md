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

## 왜 읽을까

스케일 업보다 자원을 누구에게 어떻게 배분할지의 문제가 먼저일 수 있다는 점을 보여주는 운영 사례입니다.

**프로젝트에 적용**

**FutMatch** — 향후 비동기 작업·검색·통계 같은 서로 다른 workload가 생긴다면 동일 thread pool이나 DB connection을 무제한 공유하지 말고 중요도별 한도와 격리 필요성을 측정해볼 수 있습니다.

---

**원문:** [StarRocks 운영기: Resource Group으로 멀티테넌트 워크로드 격리하기](https://toss.tech/article/operating-starrocks-1)
