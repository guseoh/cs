---
type: tech-article
title: "실시간 유효 광고 선정을 위한 Flink에서 Apache Paimon 도입기"
aliases: []
summary: "실시간 데이터 파이프라인은 엔진 하나를 바꾸는 문제가 아니라 변경 로그, compaction, 읽기·쓰기 비용, 스키마 진화와 exactly-once 조건을 함께 맞추는 설계 문제다."
source: "NAVER D2"
published: 2025-07-31
collected: 2026-09-13
url: "https://d2.naver.com/helloworld/2766731"
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

# 실시간 유효 광고 선정을 위한 Flink에서 Apache Paimon 도입기

> [!abstract] 한 줄 정리
> 실시간 데이터 파이프라인은 엔진 하나를 바꾸는 문제가 아니라 변경 로그, compaction, 읽기·쓰기 비용, 스키마 진화와 exactly-once 조건을 함께 맞추는 설계 문제다.

> NAVER D2 · 2025-07-31

## 핵심 내용

- **문제:** 기존 Spark 중심 구조보다 실시간 광고 유효성 판정과 집계를 더 빠르고 안정적으로 처리하면서, 조인·부분 업데이트·타임 트래블까지 지원할 저장 계층이 필요했다.
- **구조:** Kafka CDC를 Flink가 소비해 Paimon에 적재하고, 조인·반정규화·유효 광고 판정 결과를 Feature Store로 동기화한다. 일별 초기화가 필요한 데이터는 스트리밍 조인으로 반영한다.
- **트레이드오프:** Copy on Write는 쓰기 비용이 크지만 읽기가 빠르고, Merge on Read는 쓰기가 빠른 대신 읽기 시 병합 비용이 든다. changelog 전략과 compaction 방식도 성능에 직접 영향을 준다.
- **수치:** 성능 비교에서는 5억 건 UPSERT 데이터, parallelism 16, TaskManager당 4GB 메모리를 사용해 Paimon과 Iceberg의 읽기·쓰기 특성을 비교했다. dynamic bucket은 조건에 따라 파티션당 1억 레코드 기준 약 1GB의 추가 메모리를 사용할 수 있다.
- **결과:** Paimon의 부분 업데이트, rowkind, consumer-id, 자동 compaction·partition expiration 등을 활용해 실시간 처리와 운영 편의성을 확보했고, 실제 사용 중 발견한 Map 타입 스키마 진화 버그는 프로젝트에 기여해 1.1에서 수정됐다.

## 왜 읽을까

대규모 실시간 데이터 시스템에서 기능 목록보다 **쓰기 증폭, 읽기 비용, state, compaction, 변경 로그 보장**을 함께 봐야 한다는 점을 구체적으로 보여준다. 특히 벤치마크 조건과 운영 중 발견한 버그까지 같이 제시해 기술 도입의 현실적인 비용을 판단하기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 실시간 재고·상품 이벤트 처리 요구가 실제로 생기면 먼저 최신성 SLA와 허용 가능한 지연을 정의한다.
- [ ] 단순히 Kafka/Flink를 도입하기보다 update/delete 이력, 재처리, exactly-once 필요 여부를 먼저 구분한다.
- [ ] 저장 포맷이나 처리 엔진을 비교할 때 읽기·쓰기 성능뿐 아니라 compaction과 운영 관리 비용까지 측정 항목에 포함한다.

---

**원문:** [실시간 유효 광고 선정을 위한 Flink에서 Apache Paimon 도입기](https://d2.naver.com/helloworld/2766731)
