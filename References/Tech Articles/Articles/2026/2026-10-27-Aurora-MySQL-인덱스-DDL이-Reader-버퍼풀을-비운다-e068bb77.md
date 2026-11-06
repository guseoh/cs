---
type: tech-article
title: "Aurora MySQL 인덱스 DDL이 Reader 버퍼풀을 비운다?"
aliases: []
summary: "Aurora MySQL에서 인덱스를 INVISIBLE로 바꾸는 메타데이터 중심 DDL이 예상과 달리 Reader의 테이블 캐시를 무효화했다. Writer 지표만 보면 놓치는 장애를 재현 실험과 버퍼풀 내부 상태로 입증한 사례다."
source: "당근 기술 블로그 · Eden(이든)"
published: 2026-09-17
collected: 2026-10-27
url: "https://medium.com/daangn/aurora-mysql-%EC%9D%B8%EB%8D%B1%EC%8A%A4-ddl%EC%9D%B4-reader-%EB%B2%84%ED%8D%BC%ED%92%80%EC%9D%84-%EB%B9%84%EC%9A%B4%EB%8B%A4-16c6328dea50"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/장애-운영"
migration_origin: notion
---

# Aurora MySQL 인덱스 DDL이 Reader 버퍼풀을 비운다?

> [!abstract] 한 줄 정리
> Aurora MySQL에서 인덱스를 INVISIBLE로 바꾸는 메타데이터 중심 DDL이 예상과 달리 Reader의 테이블 캐시를 무효화했다. Writer 지표만 보면 놓치는 장애를 재현 실험과 버퍼풀 내부 상태로 입증한 사례다.

> 당근 기술 블로그 · Eden(이든) · 2026-09-17

## 핵심 내용

사용하지 않는 인덱스를 삭제하기 전에 INVISIBLE로 바꾸는 것은 일반적으로 영향 범위를 줄이기 위한 점진적 절차다. 하지만 특정 Aurora MySQL 버전에서는 이 메타데이터 중심 DDL을 실행하자 Writer가 안정적인데 Reader 여러 대에서 CPU와 읽기 I/O가 급증했다. Writer 한 대의 지표만 관찰하면 장애를 놓칠 수 있는 사례다.

```mermaid
flowchart LR
 A[Writer: INDEX INVISIBLE DDL] --> B[캐시 무효화 메타데이터]
 B --> C[Reader 버퍼풀 IS_STALE 급증]
 C --> D[디스크 재읽기·ReadIOPS 증가]
 D --> E[Reader CPU·응답 지연 증가]
```

*원문에서 확인한 사실을 바탕으로 가로 방향으로 자체 재구성한 개념도다.*

원문은 Writer 1대·Reader 3대의 Aurora 3.10.x 환경에서 사용량이 거의 없는 인덱스 6개를 정리했다. INVISIBLE 변경 후 Reader의 `INNODB_BUFFER_PAGE`를 확인하자 버퍼풀의 전체 용량은 약 8GB로 유지됐지만, 해당 테이블의 PRIMARY 및 다른 인덱스 페이지 중 94~98%가 `IS_STALE`로 표시됐다. 메모리 페이지가 할당되어 있다는 사실과 실제 쿼리에 재사용할 수 있는 캐시라는 사실은 다르다.

```sql
-- 문제를 재현한 DDL 유형을 설명하는 예시
ALTER TABLE example_table ALTER INDEX old_index INVISIBLE;
```

인덱스를 바로 DROP하지 않고 관찰하는 전략도 **정확한 엔진 버전별 영향 테스트** 없이는 무조건 안전하다고 할 수 없다.

| 지표·조건 | 변경 전 | DDL 직후 | 해석 |
| --- | --- | --- | --- |
| Reader CPU | 약 30% | 50~60% | Reader 위주 성능 영향 |
| Reader ReadIOPS | 수백 수준 | 약 3.1K | 캐시 무효화 뒤 재읽기 증가 |
| 버퍼풀 총 페이지 | 약 8GB 규모 | 큰 변화 없음 | 할당량은 유효성의 증거가 아님 |
| 주요 페이지 IS_STALE | 별도 확인 필요 | 약 94~98% | 무효 상태 비율 급증 |
| Writer 상태 | 안정적 | 안정적 | Writer 지표만으로 문제 놓칠 수 있음 |

*원문에서 확인한 Aurora MySQL 3.10.x 환경의 회귀 현상이다. 모든 MySQL 또는 모든 Aurora 버전의 일반적 동작으로 확대 해석해서는 안 된다.*

팀은 별도 클러스터에서 INSTANT·INPLACE·COPY와 CREATE/DROP/RENAME INDEX 등 여러 DDL을 비교해 rebuild 없는 인덱스 변경에서도 비슷한 현상이 나타남을 재현했다. AWS는 3.08.0부터 유입된 Aurora 엔진 결함이라고 인정했고 원문 집필 당시 3.14 수정을 예고했다. 현재 엔진 버전과 실제 수정 반영 여부는 별도 확인해야 하며, 모든 MySQL 인스턴스에서 같은 현상이 나타난다는 일반화는 금물이다.

## 왜 읽을까

DDL의 논리적 의미만 보고 운영 영향이 없다고 판단하면 위험하다. Writer와 Reader를 분리해 관찰하고, 캐시 페이지 수와 실제 유효성을 구별하며, 공급사에 재현 가능한 증거를 제시하는 과정이 탁월하다.

특정 Aurora 버전의 결함이므로 일반 MySQL이나 모든 Aurora 버전에 같은 현상이 있다고 확대 해석해서는 안 된다.

**프로젝트에 적용 — PawCycle**

- [ ] 현재 Managed MySQL의 정확한 엔진 종류·버전과 읽기 복제본 유무를 확인한다.
- [ ] 인덱스 변경 전후 CPU, 읽기 I/O, 캐시 히트율, 느린 쿼리 지표를 기록하는 DDL 점검표를 만든다.
- [ ] 운영 DB에 바로 적용하지 않고 별도 테스트 DB에서 인덱스 변경·복구 경로와 잠금 영향을 검증한다.

---

**원문:** [Aurora MySQL 인덱스 DDL이 Reader 버퍼풀을 비운다?](https://medium.com/daangn/aurora-mysql-%EC%9D%B8%EB%8D%B1%EC%8A%A4-ddl%EC%9D%B4-reader-%EB%B2%84%ED%8D%BC%ED%92%80%EC%9D%84-%EB%B9%84%EC%9A%B4%EB%8B%A4-16c6328dea50)
