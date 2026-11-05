---
type: tech-article
title: "수억 건의 데이터, 맛있게 쪼개 먹는 방법 (with. Partitioning)"
aliases: []
summary: "대량 배치는 단순히 스레드를 늘리는 문제가 아닙니다. 작업 범위 분할, 스트리밍 읽기, 일괄 쓰기를 함께 설계해야 OOM과 DB·네트워크 병목을 피하면서 데이터 규모에 따라 안정적으로 확장할 수 있습니다."
source: "카카오페이 기술 블로그"
published: 2026-03-18
collected: 2026-08-20
url: "https://tech.kakaopay.com/post/spring-batch-partitioning/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/성능"
migration_origin: notion
---

# 수억 건의 데이터, 맛있게 쪼개 먹는 방법 (with. Partitioning)

> [!abstract] 한 줄 정리
> 대량 배치는 단순히 스레드를 늘리는 문제가 아닙니다. 작업 범위 분할, 스트리밍 읽기, 일괄 쓰기를 함께 설계해야 OOM과 DB·네트워크 병목을 피하면서 데이터 규모에 따라 안정적으로 확장할 수 있습니다.

> 카카오페이 기술 블로그 · 2026-03-18

## 핵심 내용

- **문제:** 월 수천만·연 수억 건의 원장 통계 데이터를 재생성해야 했고, 데이터를 병렬로 나누기만 했더니 하루치 수백만 건 × 6개 스레드가 동시에 메모리에 올라 OOM이 발생했습니다.
- **구조:** 전체 기간을 월 단위로 먼저 나누고, 월 내부에서는 일 단위 Partition을 병렬 처리했습니다. `gridSize`와 스레드 풀을 함께 조정하고 DB 커넥션과 메모리 사용량도 제약 조건으로 봤습니다.
- **접근:** MongoDB의 skip 기반 Paging 대신 서버 사이드 커서를 사용하는 `MongoCursorItemReader`로 스트리밍하고, 쓰기는 개별 `saveAll()` 대신 Bulk Operations로 네트워크 왕복과 객체 유지 시간을 줄였습니다.
- **수치:** 동일 chunkSize 1,000 조건에서 100만 건은 11분 22초→1분 53초, 500만 건은 1시간 37분 25초→8분 55초로 줄어 최대 약 10.9배 개선됐습니다.
- **주의점:** 병렬도를 높이면 CPU뿐 아니라 메모리와 DB 커넥션이 먼저 고갈될 수 있습니다. 글에서도 CPU 사용률·OOM·커넥션 부족 여부를 보며 gridSize를 조정합니다.

## 왜 읽을까

Spring Batch의 Partitioning 문법보다 **왜 병렬화만으로 해결되지 않았고 어떤 병목을 하나씩 분리했는지**가 핵심입니다. 읽기·처리·쓰기 단계 각각의 비용을 분해해 보는 방식이 일반적인 백엔드 성능 개선에도 그대로 적용됩니다.

**프로젝트에 적용 — PawCycle**

- [ ] 향후 정산·통계·대량 상태 변경 배치를 만들 때 예상 데이터량과 메모리 상한을 먼저 적기
- [ ] 대량 조회는 offset paging과 cursor streaming을 같은 데이터 규모에서 직접 비교하기
- [ ] bulk 처리 전후로 처리 시간, Heap, DB connection, 네트워크 요청 횟수를 함께 측정하기

---

**원문:** [수억 건의 데이터, 맛있게 쪼개 먹는 방법 (with. Partitioning)](https://tech.kakaopay.com/post/spring-batch-partitioning/)
