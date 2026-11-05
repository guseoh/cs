---
type: tech-article
title: "CockroachDB in Production"
aliases: []
summary: "분산 SQL 데이터베이스 선택은 SQL 호환성만으로 결정할 수 없다. 실제 워크로드의 지연 분포, 확장성, 장애 복원력, 키 분산과 복제 위치를 함께 검증해야 한다."
source: "데브시스터즈 기술 블로그"
published: 2022-12-13
collected: 2026-10-13
url: "https://tech.devsisters.com/posts/cockroachdb-in-production/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "설계·아키텍처"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# CockroachDB in Production

> [!abstract] 한 줄 정리
> 분산 SQL 데이터베이스 선택은 SQL 호환성만으로 결정할 수 없다. 실제 워크로드의 지연 분포, 확장성, 장애 복원력, 키 분산과 복제 위치를 함께 검증해야 한다.

> 데브시스터즈 기술 블로그 · 2022-12-13

## 핵심 내용

- **선택:** 쿠키런: 킹덤에서 DynamoDB·Aurora(PostgreSQL 호환)·CockroachDB를 비교했다. 트랜잭션 지원과 수평 확장성을 함께 얻으려는 요구가 있었다.
- **수치:** 해당 게임 워크로드의 벤치마크에서 CockroachDB와 Aurora의 p50은 비슷했고 CockroachDB의 p99가 더 좋았다. DynamoDB는 약 0.01%의 오류가 관측됐으며 결과는 워크로드 종속적이라고 명시한다.
- **구조:** CockroachDB는 데이터를 Range로 나누고 복제본의 Leaseholder·Raft Leader와 Raft 합의를 통해 읽기·쓰기를 처리한다. MVCC로 이전 버전이 보존되므로 쓰기 패턴은 저장 용량에도 영향을 준다.
- **주의점:** 증가하는 정수·타임스탬프 키는 마지막 Range에 쓰기가 집중되는 Hotspot을 만들 수 있다. UUID 등 분산된 키나 해시 샤딩을 검토하되 범위 조회 비용과 교환한다.
- **운영:** 다중 AZ에서 locality 설정 없이 복제본이 특정 AZ에 몰리면 장애 내성이 약해질 수 있다. 글에서는 초기 locality 미설정으로 실제 장애를 겪었다고 설명한다.

## 왜 읽을까

데이터베이스의 표면적인 API가 같아도 내부 저장·합의·복제 방식이 다르면 인덱스와 PK 설계의 판단 기준도 달라진다는 점을 배울 수 있다. 특히 성능 벤치마크와 실제 운영 실패를 함께 제시하는 것이 가치 있다.

**프로젝트에 적용 — FutMatch**

- [ ] 경기 참가·취소의 동시 요청에 필요한 트랜잭션 격리와 재시도 정책을 문서화한다.
- [ ] DB 선정 시 평균 지연뿐 아니라 p95/p99와 오류율을 함께 측정한다.
- [ ] 현재 DB의 백업·복구와 단일 인스턴스 장애 시 동작을 검증하고, 분산 DB 도입은 실제 요구가 확인될 때 판단한다.

---

**원문:** [CockroachDB in Production](https://tech.devsisters.com/posts/cockroachdb-in-production/)
