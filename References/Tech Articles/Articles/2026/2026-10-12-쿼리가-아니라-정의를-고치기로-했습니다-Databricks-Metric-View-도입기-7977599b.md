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

게임 데이터 분석에서 '승률'이나 '사용자 수'라는 같은 용어를 대시보드·SQL·AI 에이전트가 서로 다르게 계산한다면 결과가 일치할 수 없다. 데브시스터즈는 SQL 문장마다 지표 정의를 고치기보다 원본 데이터 정제와 고정 집계, 최종 지표의 의미를 별도 계층으로 관리했다.

Bronze에는 원본 로그, Silver에는 중복 제거·봇/유저 정제, Gold에는 합산 가능한 단위의 집계, Metric View에는 공통 measure·dimension을 정의했다. 플레이 수처럼 가산되는 값은 시간 단위에서 다시 합쳐도 되지만, distinct 사용자 수나 분위수는 하위 단위의 값을 단순 합산하면 잘못된다. 평균도 각 그룹의 평균을 다시 평균내기보다 합계와 건수를 분리한 뒤 최종 단위에서 나누어야 한다.

```sql
-- 평균을 다시 평균내는 오류를 피하는 개념 예시
SELECT SUM(score_sum) / NULLIF(SUM(score_count), 0) AS weighted_avg
FROM gold_daily_scores
WHERE game_mode = :mode;
```

하위 집계의 평균을 그대로 AVG하는 것은 그룹별 표본 수가 다르면 잘못된 결과가 된다.

| 계층 | 책임 | 주의점 |
| --- | --- | --- |
| Bronze | 원본 보존 | 입력의 중복·오류 포함 가능 |
| Silver | 데이터 정제 | 봇/테스트 사용자 제외 규칙 통일 |
| Gold | 재사용 가능한 사전 집계 | distinct·분위수 단순 합계 금지 |
| Metric View | 지표 정의와 차원 | materialization 필터 조건·재계산 비용 |

최대 부하 대시보드의 동일 조건 cold 실행에서 compute 41%, 스캔량 6.7배를 줄였고, 분석 에이전트는 같은 질문 세트에서 토큰·비용을 약 절반, 답변까지 걸리는 턴 수를 30% 줄였다고 보고했다. 다만 materialization이 항상 사용되는 것은 아니고 자주 필터링하는 dimension이 캐시에 포함되지 않으면 원시 데이터 경로로 돌아갈 수 있다. dimension 변경 때 전체 기간을 다시 계산하는 비용도 있다.

## 왜 읽을까

정확한 데이터 집계는 SQL 문법만이 아니라 지표 정의와 재집계 가능성에 달려 있다는 걸 보여준다. 특히 일별 평균의 평균, 일별 고유 사용자 수의 합처럼 그럴듯하지만 잘못된 지표를 막는 설계 기준이 실용적이다.

**프로젝트에 적용 — FutMatch**

- [ ] 매칭 성공률·경기 충원 시간·취소율의 분자·분모와 제외 조건을 문서와 SQL 테스트로 단일화한다.
- [ ] 일별·월별 집계가 동일한 원본 기준으로 계산되는지 검증하고, 평균의 평균·distinct 합산 오류를 테스트한다.
- [ ] 대시보드와 AI 분석이 서로 다른 집계 정의를 만들지 않도록 공통 쿼리·뷰를 재사용한다.

---

**원문:** [쿼리가 아니라 정의를 고치기로 했습니다: Databricks Metric View 도입기](https://tech.devsisters.com/posts/metric-view/)
