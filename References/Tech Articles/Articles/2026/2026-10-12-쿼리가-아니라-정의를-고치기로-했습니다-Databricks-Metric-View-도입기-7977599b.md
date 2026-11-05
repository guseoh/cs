---
type: tech-article
title: "쿼리가 아니라 정의를 고치기로 했습니다: Databricks Metric View 도입기"
aliases: []
summary: "대시보드와 분석 에이전트가 서로 다른 SQL로 같은 지표를 계산하면 숫자가 어긋난다. 정제된 데이터 위에 공통 지표 정의를 두고 가산성·집계 단위·캐시 전략을 명시해야 한다."
source: "데브시스터즈 DEVTECH"
published: 2026-09-18
collected: 2026-10-12
url: "https://tech.devsisters.com/posts/metric-view/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "설계·아키텍처"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# 쿼리가 아니라 정의를 고치기로 했습니다: Databricks Metric View 도입기

> [!abstract] 한 줄 정리
> 대시보드와 분석 에이전트가 서로 다른 SQL로 같은 지표를 계산하면 숫자가 어긋난다. 정제된 데이터 위에 공통 지표 정의를 두고 가산성·집계 단위·캐시 전략을 명시해야 한다.

> 데브시스터즈 DEVTECH · 2026-09-18

## 핵심 내용

- **문제:** 게임 승률과 유저 정제 기준이 대시보드·임시 분석·AI 에이전트마다 달라 지표가 불일치했고, 중첩 로그 정제도 조회마다 반복됐다.
- **구조:** Bronze는 원본, Silver는 정제·중복 제거, Gold는 고정 단위의 사전 집계, Semantic(Metric View)은 measure와 dimension의 단일 정의로 분리했다.
- **트레이드오프:** 플레이 수 같은 가산 지표는 사전 집계가 가능하지만 distinct 유저 수·분위수는 재합산하면 틀린다. 평균은 합과 건수를 별도 measure로 두고 나눠야 단위 변경에도 정확하다.
- **수치:** 가장 무거운 대시보드의 동일 파라미터 1회 cold 실행에서 compute 41% 감소, 스캔량 6.7배 감소. 분석 에이전트는 같은 질문 세트에서 토큰·비용 약 절반, 답변까지 턴 수 30% 감소했다.
- **주의점:** materialization이 항상 쓰이지는 않는다. 자주 쓰는 필터 차원이 캐시에 빠지면 비집계 경로로 돌아가고, dimension 변경 시 전 기간 캐시 재계산 비용이 생긴다.

## 왜 읽을까

정확한 데이터 집계는 SQL 문법만이 아니라 지표 정의와 재집계 가능성에 달려 있다는 걸 보여준다. 특히 일별 평균의 평균, 일별 고유 사용자 수의 합처럼 그럴듯하지만 잘못된 지표를 막는 설계 기준이 실용적이다.

**프로젝트에 적용 — FutMatch**

- [ ] 매칭 성공률·경기 충원 시간·취소율의 분자·분모와 제외 조건을 문서와 SQL 테스트로 단일화한다.
- [ ] 일별·월별 집계가 동일한 원본 기준으로 계산되는지 검증하고, 평균의 평균·distinct 합산 오류를 테스트한다.
- [ ] 대시보드와 AI 분석이 서로 다른 집계 정의를 만들지 않도록 공통 쿼리·뷰를 재사용한다.

---

**원문:** [쿼리가 아니라 정의를 고치기로 했습니다: Databricks Metric View 도입기](https://tech.devsisters.com/posts/metric-view/)
