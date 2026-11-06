---
type: tech-article
title: "MySQL online alter부터 CPU 100% 장애까지"
aliases: []
summary: "운영 중 스키마 변경을 안전하게 마쳤더라도 새 기능의 쿼리·캐시 접근 패턴이 실제 트래픽에서 DB CPU를 고갈시킬 수 있다. DDL 검증과 기능 배포 검증을 별도 위험으로 관리해야 한다."
source: "데브시스터즈 기술 블로그 · 황재영"
published: 2023-09-05
collected: 2026-10-23
url: "https://tech.devsisters.com/posts/cro-mysql-online-alter/"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "DB·데이터"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/DB-데이터"
migration_origin: notion
---

# MySQL online alter부터 CPU 100% 장애까지

> [!abstract] 한 줄 정리
> 운영 중 스키마 변경을 안전하게 마쳤더라도 새 기능의 쿼리·캐시 접근 패턴이 실제 트래픽에서 DB CPU를 고갈시킬 수 있다. DDL 검증과 기능 배포 검증을 별도 위험으로 관리해야 한다.

> 데브시스터즈 기술 블로그 · 황재영 · 2023-09-05


## 핵심 내용

쿠키런: 오븐브레이크의 '패키지 매출 랭킹'은 최근 N시간 동안 판매된 패키지의 판매량을 집계해야 했지만, 구매 내역 테이블에는 구매 시각이 없었다. 수년간의 구매 기록을 보유한 핵심 테이블을 일반적인 ALTER로 변경하면 잠금과 작업 시간이 문제가 될 수 있어, 운영 중 쓰기 요청을 계속 처리하는 온라인 스키마 변경 방법을 검토했다. 여기서 주의할 점은 **스키마를 안전하게 변경하는 것**과 **새 기능이 대량 데이터를 안전하게 조회하는 것**은 서로 다른 검증 과정이라는 사실이다.

원문에서 소개한 변경 요구를 학습용으로 단순화하면 구매 시점을 나타내는 컬럼과 인덱스 추가다. 먼저 `ALGORITHM=INPLACE, LOCK=NONE` 방식으로 복제 환경에서 시험했으나, 동일한 변경이 한 번은 `Duplicate entry` 오류를 내고 다음 실행에서는 성공했다. 간헐적인 실패 가능성이 있는 방식으로 운영 테이블을 변경하기 어렵다고 판단해 Inplace 계획을 폐기했다.

```sql
-- 원문 DDL의 핵심을 설명하기 위해 테이블명을 바꾼 예시
ALTER TABLE purchase_history
    ADD COLUMN purchase_dt DATETIME NOT NULL DEFAULT 0,
    ADD KEY purchase_dt (purchase_dt);
```

대안으로 선택한 `pt-online-schema-change`는 기존 테이블과 동일한 새 테이블을 만들고, 그쪽에 새 스키마를 적용한 뒤, 트리거로 기존 테이블의 변경을 복제하면서 데이터를 청크로 나누어 복사한다. 복사가 끝나면 검증 후 이름을 교체한다. 원문에서는 Staging 복제본 → Production 복제본 → Staging → Production 순서로 실행했고, dry-run은 트리거 생성·복사·테이블 교체까지 실행하지 않는 사전 확인이라는 점도 구분했다. 이미 트리거를 가진 테이블이나 호환되지 않는 변경에서는 별도 검토가 필요하다.

Production 복제본에서 청크 250은 CPU 약 45%를 유지한 반면 500은 초기에 약 80%까지 치솟았다. 운영 DB의 평상시 CPU는 약 20%였고 변경 작업 중 70%를 넘지 않겠다는 목표를 두었으므로 250을 선택했다. 아래는 원문에서 실제 관찰한 복제본 CPU 그래프로, 빠른 복사가 반드시 안전한 복사는 아님을 보여준다.

![pt-online-schema-change의 chunk-size 250과 500을 비교한 CPU 그래프](https://tech.devsisters.com/static/d91f020438b2e1dd34eaa76d0482f15b/c7d76/production_clone_cpu.png)

*그림 1. 청크가 커질수록 CPU 피크가 증가한 원문 복제본 실험 — [출처: 데브시스터즈 기술 블로그](https://tech.devsisters.com/posts/cro-mysql-online-alter/)*

DDL 적용은 성공했지만 신규 매출 랭킹 기능 배포 후 서버 재접속이 겹치면서 DB CPU가 100%에 도달했고 게임 접속·플레이가 불가능해졌다. 팀은 서비스 복구를 먼저 수행하기 위해 해당 기능을 비활성화했고, 이후 쿼리와 캐시 사용 패턴을 나누어 조사했다. 쿼리는 상품별 `product_id`와 기간 조건을 OR로 반복했고, 복합 인덱스 `(product_id, purchase_dt)`를 시험해도 약 10% 개선에 그쳐 인덱스 추가 비용 대비 효익이 부족하다고 판단했다. 여러 상품에 공통인 판매 시작 시각 조건을 묶고 의미 없는 '현재 시각 이하' 조건을 제거했지만, 쿼리 수정만으로는 근본적인 문제가 해결되지 않았다.

```sql
-- 원문 조건 단순화의 의도를 바탕으로 재구성한 조회
SELECT product_id, COUNT(*) AS sales
FROM purchase_history
WHERE product_id IN (:productA, :productB)
  AND purchase_dt > :salesStart
GROUP BY product_id;
```

실제 원인은 **서버별·게임 데이터 버전별로 독립된 캐시**에서 같은 매출 집계를 반복 조회한다는 점이었다. 분산 서버가 각자 캐시를 갖고 있고 기획 데이터 버전마다 집계 조건도 달라, 서버 수 × 버전 수만큼 DB 조회가 발생할 수 있었다. 특히 서버를 다시 띄운 직후에는 빈 캐시가 급증하며 동시 조회 부하가 더 커졌다. 적은 데이터와 소수 서버로 구성된 개발 환경에서는 이 현상을 발견하기 어려웠다.

![서버별로 게임 데이터 버전마다 독립 캐시를 가진 구조](https://tech.devsisters.com/static/5cff03b822ff16375f4ef2e45193cd65/63217/cache.jpg)

*그림 2. 원문의 기존 캐시 구조. 동일한 집계를 여러 서버와 버전에서 반복 계산할 가능성을 보여준다. — [출처: 데브시스터즈 기술 블로그](https://tech.devsisters.com/posts/cro-mysql-online-alter/)*

개선 이후에는 각 서비스 서버가 DB를 직접 조회하지 않고 공용 원격 저장소의 집계 값을 읽는다. 값이 없으면 빈 결과를 반환하고 큐에 계산 요청을 남긴다. 별도 스케줄러 서버가 주기적으로 요청을 수집해 필요한 집계를 수행하고 공용 저장소에 결과를 기록한다. 이렇게 동일 집계를 중앙에서 처리하게 하여 DB에 쏟아지는 중복 조회를 줄였다.

![신규 랭킹 기능 배포 직후 DB CPU가 100퍼센트에 도달한 모습](https://tech.devsisters.com/static/878bc64211d7cba3a45c3127fbe25a39/42cbc/cpu_2.png)

*그림 3. DDL 성공과 별개로 신규 기능 배포 후 발생한 CPU 100% 장애 — [출처: 데브시스터즈 기술 블로그](https://tech.devsisters.com/posts/cro-mysql-online-alter/)*

![공용 캐시·스케줄러 적용 후 CPU가 안정적으로 유지된 모습](https://tech.devsisters.com/static/9feb4605357b49daf256c2c6502e7b/42cbc/cpu_3.png)

*그림 4. 쿼리 및 캐시 패턴 개선 후, 스케줄러 실행에 따른 작은 피크만 남은 상태 — [출처: 데브시스터즈 기술 블로그](https://tech.devsisters.com/posts/cro-mysql-online-alter/)*

| 비교 항목 | 실제 관찰 | 판단 |
| --- | --- | --- |
| Inplace DDL | 복제 DB에서 간헐적 중복 키 오류 | 직접 적용 보류 |
| pt-online-schema-change | 청크 250: CPU 약 45%, 500: 초기 약 80% | 청크 250 채택 |
| 복합 인덱스 | 약 10% 조회 개선 | 비용 대비 효익 부족 |
| 쿼리 조건 정리 | 공통 시작 시각과 불필요한 조건 정리 | 근본 병목은 별도 |
| 공용 캐시와 스케줄러 | 중복 집계 통합 | 기능 재활성화 후 CPU 안정 |

따라서 이 글의 장애는 '온라인 DDL을 했으니 CPU가 100%가 됐다'는 사건이 아니다. **DDL은 안전하게 완료됐고, 신규 조회 기능을 분산 캐시가 증폭시키면서 별도의 장애가 발생했다.** 스키마 변경과 신규 기능의 배포 전 성능 시험, 장애 시 신속한 기능 비활성화 경로를 각각 검증해야 한다.

## 왜 읽을까

온라인 DDL의 성공과 서비스 기능의 성능 안전성은 별개라는 점을 보여주는 장애 회고다. 복제 환경에서 청크 크기를 측정하고, 배포 뒤 장애를 일으킨 쿼리와 캐시 접근 패턴까지 재검토하는 실제 의사결정을 배울 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 운영 스키마 변경을 연습할 때 복제·백업과 롤백 경로를 준비하고 데이터 크기별 잠금·CPU·소요 시간을 측정한다.
- [ ] 신규 조회 기능을 배포하기 전 예상 호출 빈도와 캐시 갱신·미스 패턴을 부하 테스트로 검증한다.
- [ ] 비상시 기능을 중단할 수 있는 설정과 복구 절차를 배포 체크리스트에 포함한다.

---

**원문:** [MySQL online alter부터 CPU 100% 장애까지](https://tech.devsisters.com/posts/cro-mysql-online-alter/)
