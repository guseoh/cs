---
type: tech-article
title: "실시간 OLAP을 위한 Apache Pinot 운영 노하우"
aliases: []
summary: "실시간 OLAP을 운영하려면 빠른 조회만큼 장애 판정, DR 전환, 메모리 관리, 부분 결과 감지가 중요하다. 시스템이 HTTP 200을 반환해도 데이터가 완전하다는 보장은 별개의 계약이다."
source: "카카오페이 기술 블로그"
published: 2025-05-13
collected: 2026-09-01
url: "https://tech.kakaopay.com/post/realtime-olap-with-apache-pinot/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "장애·운영"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/장애-운영"
migration_origin: notion
---

# 실시간 OLAP을 위한 Apache Pinot 운영 노하우

> [!abstract] 한 줄 정리
> 실시간 OLAP을 운영하려면 빠른 조회만큼 장애 판정, DR 전환, 메모리 관리, 부분 결과 감지가 중요하다. 시스템이 HTTP 200을 반환해도 데이터가 완전하다는 보장은 별개의 계약이다.

> 카카오페이 기술 블로그 · 2025-05-13

## 핵심 내용

- **구조:** Kafka 등 실시간 소스를 처리하는 Pinot 클러스터를 Broker·Server·Controller로 운영하며, 자체 Active-Standby DR 구조를 추가했다.
- **장애:** PoC에서 컴포넌트별 장애 기준을 정의하고 헬스체크 모듈로 상태를 감지해 Active 클러스터 장애 시 Standby로 5분 이내 전환하도록 구성했다.
- **주의점:** 리플리카 서버가 모두 내려가도 쿼리는 HTTP 200으로 성공할 수 있지만 일부 세그먼트 데이터가 누락될 수 있다. Pinot 1.2부터 `X-Pinot-Error-Code`와 `partialResult`로 이를 감지할 수 있다.
- **트레이드오프:** Upsert의 PK 메타데이터는 서버 힙에 올라가므로 PK 규모가 메모리 부담으로 직결된다. 실시간성을 얻는 대신 메모리와 복구 운영을 함께 설계해야 한다.
- **운영:** Under Replica가 자동 복구될 것이라는 기대와 달리 별도 복구가 필요하고, 스냅샷 테이블의 완전 교체도 세그먼트 이름·개수 조건을 맞춰야 한다.

## 왜 읽을까

새 데이터 기술을 도입할 때 벤치마크보다 운영 의미론을 먼저 확인해야 하는 이유를 보여준다. 특히 성공 상태 코드와 데이터 완전성이 다를 수 있다는 사례는 외부 API, 캐시, 비동기 처리 등 다른 시스템에도 그대로 적용되는 관점이다.

**프로젝트에 적용 — FutMatch**

- [ ] 통계·집계 API를 만들 때 `응답 성공`과 `데이터 완전성`을 별도 조건으로 정의한다.
- [ ] 캐시나 비동기 집계가 실패했을 때 부분 데이터 제공 여부와 오류 표기 방식을 계약으로 남긴다.
- [ ] 향후 실시간 통계가 실제 병목이 된 뒤 OLAP 도입을 검토하되, DR·메모리·복구 비용도 도입 기준에 포함한다.

---

**원문:** [실시간 OLAP을 위한 Apache Pinot 운영 노하우](https://tech.kakaopay.com/post/realtime-olap-with-apache-pinot/)
