---
type: tech-article
title: "Kafka Connect로 DB 데이터 쉽게 연동하기"
aliases: []
summary: "Kafka Connect JDBC Source로 DB 동기화를 쉽게 만들 수 있지만, 폴링 기반 CDC의 오프셋과 트랜잭션 타이밍 때문에 삭제·갱신·지연 커밋 데이터가 누락될 수 있으므로 데이터 특성에 맞는 방식 선택이 중요하다는 글이다."
source: "컬리 기술 블로그"
published: 2025-03-04
collected: 2026-09-12
url: "https://helloworld.kurly.com/blog/kafka-connect-pipeline/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "동시성·분산"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/동시성-분산"
migration_origin: notion
---

# Kafka Connect로 DB 데이터 쉽게 연동하기

> [!abstract] 한 줄 정리
> Kafka Connect JDBC Source로 DB 동기화를 쉽게 만들 수 있지만, 폴링 기반 CDC의 오프셋과 트랜잭션 타이밍 때문에 삭제·갱신·지연 커밋 데이터가 누락될 수 있으므로 데이터 특성에 맞는 방식 선택이 중요하다는 글이다.

> 컬리 기술 블로그 · 2025-03-04

## 핵심 내용

- **구조:** 컬리는 MySQL·Oracle·PostgreSQL 등 여러 DB의 데이터를 Kafka를 거쳐 통합 플랫폼으로 옮길 때 Kafka Connect의 JDBC Source Connector를 활용한다. JSON 설정만으로 반복적인 파이프라인을 만들 수 있다는 운영상 장점이 있다.
- **트레이드오프:** 로그 기반 CDC는 지연이 짧고 변경을 충실하게 포착하지만 로그 접근 권한과 DB별 설정·운영 복잡도가 크다. JDBC의 쿼리 기반 CDC는 구축이 간단하고 이식성이 좋지만 폴링 지연과 변경 누락 가능성을 감수해야 한다.
- **주의점:** Incrementing 모드는 이미 처리한 PK의 UPDATE를 감지하지 못하고, 쿼리 기반 방식 자체는 삭제된 행이나 한 폴링 주기 안에서 발생했다가 사라진 중간 변경을 복원할 수 없다.
- **문제:** 긴 트랜잭션 때문에 더 이른 timestamp의 행이 늦게 커밋되면, 뒤에 커밋된 최신 timestamp가 먼저 오프셋을 전진시켜 늦게 완료된 행이 영구적으로 조회 범위 밖으로 밀려날 수 있다.
- **접근:** `timestamp.delay.interval.ms`로 조회 상한을 현재 시각보다 뒤로 미뤄 늦은 커밋을 기다릴 수 있지만, 값을 크게 할수록 누락 가능성은 줄고 데이터 반영 지연은 커지므로 트랜잭션 특성에 맞춰 조정해야 한다.

## 왜 읽을까

"Kafka Connect를 쓰면 CDC가 된다"는 수준을 넘어, 어떤 변경을 절대로 놓치면 안 되는지에 따라 로그 기반과 쿼리 기반 CDC의 적합성이 달라진다는 점을 구체적인 타임라인 예제로 이해할 수 있다.

특히 오프셋이 단순 진행 숫자가 아니라 데이터 누락 여부를 결정하는 상태라는 점, 그리고 정합성과 지연이 서로 트레이드오프라는 점이 실무적으로 중요하다.

**프로젝트에 적용 — PawCycle**

- [ ] 향후 외부 상품·재고·파트너 데이터를 연동할 일이 생기면 먼저 INSERT만 필요한지 UPDATE/DELETE 이력까지 필요한지 계약을 정의한다.
- [ ] 쿼리 기반 CDC를 선택한다면 긴 트랜잭션과 out-of-order commit을 재현하는 테스트를 만든다.
- [ ] 데이터 누락이 허용되지 않는 영역이라면 구현 편의성만으로 JDBC polling을 선택하지 않고 로그 기반 CDC 또는 다른 동기화 방식을 비교한다.

---

**원문:** [Kafka Connect로 DB 데이터 쉽게 연동하기](https://helloworld.kurly.com/blog/kafka-connect-pipeline/)
