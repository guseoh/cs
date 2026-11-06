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

광고 유효성 판정처럼 변경이 계속 발생하는 데이터를 실시간 Join하고 일부 필드만 업데이트하려면 정적 파일 단위의 저장소만으로 충분하지 않다. NAVER는 Kafka CDC를 Flink에서 받아 Paimon에 저장하면서 변경 로그·부분 업데이트·타임 트래블과 빠른 읽기/쓰기를 함께 제공하는 방식을 검토했다.

```mermaid
flowchart LR
 A[DB 변경·Kafka CDC] --> B[Flink 스트림 처리]
 B --> C[Paimon Key 기반 UPSERT]
 C --> D[Join·부분 업데이트·Compaction]
 D --> E[광고 Feature Store]
```

*원문 내용을 바탕으로 자체 재구성한 가로형 기술 흐름도다.*

Flink가 Kafka CDC를 읽어 Paimon의 Key 기반 테이블에 반영하고 광고 조건과 조인·반정규화한 결과를 Feature Store로 제공한다. Paimon은 Copy-on-Write와 Merge-on-Read의 비용 모델이 다르고 Changelog/Compaction 전략을 어떻게 정하느냐에 따라 실시간 조회 성능과 저장 비용이 달라진다. 자동 Compaction, Partition Expiration, Consumer ID를 이용해 운영을 단순화하지만 Dynamic Bucket 같은 기능은 메모리 상한이 크게 늘어날 수 있다.

| 저장 방식 | 장점 | 감수할 비용 |
| --- | --- | --- |
| Copy on Write | 읽기 최적화 | 잦은 쓰기 비용 |
| Merge on Read | 쓰기 효율 | 조회 시 병합 |
| Dynamic Bucket | 데이터 분산 | 추가 메모리·파티션 조정 |
| Changelog | 스트림 갱신 소비 | 순서·체크포인트·재처리 |

*5억 UPSERT·병렬도 16·TM 4GB 조건의 비교이므로 다른 워크로드에 수치를 그대로 일반화하지 않는다.*

원문 비교는 5억 건 UPSERT 데이터, 병렬도 16, TaskManager당 4GB 메모리라는 실험 조건으로 수행됐다. Dynamic Bucket은 파티션당 1억 레코드에서 조건에 따라 약 1GB 추가 메모리를 쓸 수 있다. 실제 Map 타입 Schema Evolution 버그를 발견해 Paimon 프로젝트에 기여하고 1.1에서 수정된 점도 초기 기술 선택 뒤의 지속 운영 비용을 보여준다.

## 왜 읽을까

대규모 실시간 데이터 시스템에서 기능 목록보다 **쓰기 증폭, 읽기 비용, state, compaction, 변경 로그 보장**을 함께 봐야 한다는 점을 구체적으로 보여준다. 특히 벤치마크 조건과 운영 중 발견한 버그까지 같이 제시해 기술 도입의 현실적인 비용을 판단하기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 실시간 재고·상품 이벤트 처리 요구가 실제로 생기면 먼저 최신성 SLA와 허용 가능한 지연을 정의한다.
- [ ] 단순히 Kafka/Flink를 도입하기보다 update/delete 이력, 재처리, exactly-once 필요 여부를 먼저 구분한다.
- [ ] 저장 포맷이나 처리 엔진을 비교할 때 읽기·쓰기 성능뿐 아니라 compaction과 운영 관리 비용까지 측정 항목에 포함한다.

---

**원문:** [실시간 유효 광고 선정을 위한 Flink에서 Apache Paimon 도입기](https://d2.naver.com/helloworld/2766731)
