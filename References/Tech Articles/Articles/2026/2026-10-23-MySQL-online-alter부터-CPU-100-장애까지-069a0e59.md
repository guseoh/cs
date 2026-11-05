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

- **문제:** 구매 시점 컬럼과 인덱스를 추가해야 했지만 구매 테이블은 서비스 핵심 경로였고 일반 ALTER의 잠금·작업 시간을 감당하기 어려웠다.
- **접근:** Inplace ALTER가 복제 DB 테스트에서 간헐적인 Duplicate entry 오류를 보여 포기했다. Percona `pt-online-schema-change`의 신규 테이블·트리거·청크 복사·체크섬·테이블 교체 방식으로 전환했다.
- **수치:** 운영 복제본에서 청크 250은 CPU 약 45%로 안정적이었고 청크 500은 초기에 약 80%까지 상승했다. 운영 DB의 평소 CPU 약 20%와 작업 중 70% 이하 목표를 고려해 청크 250을 선택했다.
- **장애:** 스키마 변경은 성공했지만 신규 매출 랭킹 기능 배포 후 DB CPU가 100%에 도달해 게임 접속에 문제가 생겼다. 기능을 비활성화해 복구한 뒤 쿼리와 캐시 사용 패턴을 원인으로 분석했다.
- **트레이드오프:** `(product_id, purchase_dt)` 복합 인덱스는 복제 DB 실험에서 약 10% 개선에 그쳐 추가 비용 대비 이득이 작다고 판단해 채택하지 않았다.

## 왜 읽을까

온라인 DDL의 성공과 서비스 기능의 성능 안전성은 별개라는 점을 보여주는 장애 회고다. 복제 환경에서 청크 크기를 측정하고, 배포 뒤 장애를 일으킨 쿼리와 캐시 접근 패턴까지 재검토하는 실제 의사결정을 배울 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 운영 스키마 변경을 연습할 때 복제·백업과 롤백 경로를 준비하고 데이터 크기별 잠금·CPU·소요 시간을 측정한다.
- [ ] 신규 조회 기능을 배포하기 전 예상 호출 빈도와 캐시 갱신·미스 패턴을 부하 테스트로 검증한다.
- [ ] 비상시 기능을 중단할 수 있는 설정과 복구 절차를 배포 체크리스트에 포함한다.

---

**원문:** [MySQL online alter부터 CPU 100% 장애까지](https://tech.devsisters.com/posts/cro-mysql-online-alter/)
