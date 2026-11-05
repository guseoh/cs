---
type: tech-article
title: "Spring Batch 애플리케이션 성능 향상을 위한 주요 팁"
aliases: []
summary: "배치 성능은 프레임워크를 바꾸기보다 반복되는 네트워크·DB I/O 횟수를 먼저 줄이는 것만으로도 큰 폭으로 개선될 수 있으며, 병렬화는 그 다음 수단이어야 한다."
source: "카카오페이 기술 블로그"
published: 2023-09-05
collected: 2026-09-10
url: "https://tech.kakaopay.com/post/spring-batch-performance/"
topic: "성능"
categories:
  - "성능"
  - "DB·데이터"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
  - "tech/DB-데이터"
migration_origin: notion
---

# Spring Batch 애플리케이션 성능 향상을 위한 주요 팁

> [!abstract] 한 줄 정리
> 배치 성능은 프레임워크를 바꾸기보다 반복되는 네트워크·DB I/O 횟수를 먼저 줄이는 것만으로도 큰 폭으로 개선될 수 있으며, 병렬화는 그 다음 수단이어야 한다.

> 카카오페이 기술 블로그 · 2023-09-05

## 핵심 내용

- **문제:** 호출당 약 150ms인 API를 5만 건 이상 순차 처리하면서 전체 배치가 1시간을 넘겼고, chunk 안에서도 네트워크 대기와 JPA 개별 update가 반복됐다.
- **접근:** 단건 I/O를 수행하던 Processor 역할을 줄이고 Writer에서 묶어서 처리하며, 불필요한 영속성 컨텍스트 비용을 피하기 위해 Projection을 활용했다.
- **수치:** 같은 값으로 갱신 가능한 데이터는 조건별 `IN` update로 묶어 최대 약 1,000번의 DB I/O를 3번 수준으로 줄였고, 10개 병렬 rail에서 API 구간은 약 10배에 가까운 향상을 보였다. 5,000건 이상 DB 갱신 실험에서는 90% 이상 개선된 결과도 제시한다.
- **구조:** 동일 값 갱신은 grouped `IN` update, 행마다 값이 다르면 JDBC/Exposed batch update처럼 상황에 맞는 bulk I/O 방식을 사용한다.
- **트레이드오프:** chunk를 과하게 키우면 connection과 transaction을 오래 점유하고 MySQL packet 제한에도 영향을 받을 수 있으며, 병렬화는 테스트·디버깅·장애 분석 비용을 높이므로 측정 뒤 도입해야 한다.

## 왜 읽을까

Spring Batch 튜닝을 곧바로 partitioning이나 멀티스레드로 연결하지 않고, 먼저 어디서 I/O가 반복되는지 계산하고 단순한 bulk 처리로 줄이는 접근이 좋다. 성능 개선에서 구조적 복잡도를 늘리기 전에 가장 싼 병목부터 제거하는 기준을 배울 수 있다.

**프로젝트에 적용 — DevPedia**

- [ ] 대량 동기화·인덱스 재구축 같은 배치가 생기면 네트워크 대기와 DB I/O 횟수를 먼저 계측한다.
- [ ] 개별 `save/update`가 병목으로 확인될 때만 grouped update나 batch update를 비교한다.
- [ ] 병렬 처리 전후의 처리시간뿐 아니라 DB connection pool, CPU, 실패 복구 난이도까지 함께 기록한다.

---

**원문:** [Spring Batch 애플리케이션 성능 향상을 위한 주요 팁](https://tech.kakaopay.com/post/spring-batch-performance/)
