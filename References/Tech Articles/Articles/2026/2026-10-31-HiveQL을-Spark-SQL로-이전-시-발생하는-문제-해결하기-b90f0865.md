---
type: tech-article
title: "HiveQL을 Spark SQL로 이전 시 발생하는 문제 해결하기"
aliases: []
summary: "쿼리 실행 엔진을 교체할 때 SQL이 실행된다는 사실만으로 데이터 정합성을 보장할 수 없습니다. 결과 집합·중복·실행 비용을 함께 비교하고, 엔진별 함수·형 변환·쓰기 동작 차이를 재현해야 안전하게 이전할 수 있습니다."
source: "LINE Engineering"
published: 2023-08-23
collected: 2026-10-31
url: "https://engineering.linecorp.com/ko/blog/from-hiveql-to-sparksql-troubleshooting/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "리팩터링"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/리팩터링"
migration_origin: notion
---

# HiveQL을 Spark SQL로 이전 시 발생하는 문제 해결하기

> [!abstract] 한 줄 정리
> 쿼리 실행 엔진을 교체할 때 SQL이 실행된다는 사실만으로 데이터 정합성을 보장할 수 없습니다. 결과 집합·중복·실행 비용을 함께 비교하고, 엔진별 함수·형 변환·쓰기 동작 차이를 재현해야 안전하게 이전할 수 있습니다.

> LINE Engineering · 2023-08-23

## 핵심 내용

- **문제:** 10년 이상 유지한 ETL 코드 중 오픈챗 데이터 생산용 HiveQL 약 100개를 Spark SQL로 이전해야 했습니다. 여러 팀이 같은 방식으로 이전할 수 있도록 실행 인터페이스도 유지해야 했습니다. - **구조:** Airflow에서 자체 Spark Operator를 통해 클러스터 모드로 실행하고, 원격 Spark 로그를 Airflow 화면에서 확인하도록 연결했습니다. 엔진만 바꾸고 기존 전·후처리 코드를 재사용할 수 있게 했습니다. - **정합성:** 기존·신규 결과의 양방향 `EXCEPT` 차집합과 전체 건수를 비교했습니다. 다만 서로 다른 중복 분포가 동일한 집합과 건수를 가질 수 있어 이 검증만으로 모든 다중집합 차이를 보장하지는 않는다고 명시했습니다.

- **수치:** Spark 전환 후 쿼리 평균 실행 시간은 약 15% 단축됐고, 복잡한 쿼리에서는 `vCore-seconds`와 `mb-seconds`가 절반 이상 감소한 사례도 있었습니다. 실행 시간뿐 아니라 실제 자원 사용량도 비교했습니다. - **트러블슈팅:** Hive 임시 테이블을 Spark 임시 뷰·CTE 등으로 바꾸고, ANSI 정책상 허용되지 않는 묵시적 형 변환을 명시적 `CAST`로 수정했습니다. `get_json_object`의 중첩 JSON 처리와 `parse_url`의 URL/URI 구현 차이도 검토했습니다.

HiveQL에서 Spark SQL로 엔진을 바꾸면 쿼리가 문법적으로 유효하더라도 실제 결과와 실행 자원 사용량이 달라질 수 있다. 원문은 약 100개 HiveQL을 Airflow 기반 실행 경로로 옮기되 작업 인터페이스를 유지하고, 임시 테이블·형 변환·중첩 JSON·URL 함수의 구현 차이를 검증했다. 기존 SQL을 그대로 붙여 넣는 작업이 아니라 함수의 의미적 동등성을 확인하는 마이그레이션이다.

```sql
-- 개념 설명용 재구성: 양방향 집합 차집합
(SELECT * FROM legacy_result EXCEPT SELECT * FROM new_result)
UNION ALL
(SELECT * FROM new_result EXCEPT SELECT * FROM legacy_result);
```

양방향 `EXCEPT`와 전체 건수는 유용하지만 서로 다른 중복 분포가 동일한 집합과 건수를 만들 수 있다. 집계·결제처럼 중복이 중요한 경우 키별 빈도와 NULL·형 변환 처리까지 비교해야 한다. 실행 시간 약 15% 개선도 해당 쿼리 집합과 측정 환경의 결과다.

## 왜 읽을까

마이그레이션의 완료 기준을 '새 코드가 돌아간다'가 아니라 '결과가 같고 운영 비용도 수용 가능하다'로 정하는 방법을 배울 수 있습니다. 특히 SQL 엔진 간 호환성의 사각지대를 구체적인 재현 사례로 확인할 수 있어 데이터 정합성 검증 체크리스트를 만드는 데 유용합니다.

**프로젝트에 적용 — PawCycle**

- [ ] DB 스키마나 데이터 변환 로직을 변경할 때 변경 전후 행 수·핵심 키·집계값·중복 분포를 비교하는 검증 SQL을 준비합니다.
- [ ] 데이터 변환에 사용한 함수와 암묵적 타입 변환이 현재 MySQL 버전에서도 같은 의미인지 확인합니다.
- [ ] 운영 반영 전에 격리 환경에서 실행 시간과 데이터 결과를 모두 비교하고 복구 절차를 기록합니다.

---

**원문:** [HiveQL을 Spark SQL로 이전 시 발생하는 문제 해결하기](https://engineering.linecorp.com/ko/blog/from-hiveql-to-sparksql-troubleshooting/)
