---
type: tech-article
title: "Elasticsearch 병렬 테스트를 향한 여정"
aliases: []
summary: "테스트를 병렬로 돌리는 것보다 여러 테스트가 공유하는 DB·Elasticsearch 상태를 서로 격리하는 일이 먼저입니다."
source: "techblog.woowahan.com"
published: 
collected: 2026-07-30
url: "https://techblog.woowahan.com/18486/"
topic: "테스트"
categories:
  - "테스트"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/테스트"
migration_origin: notion
---

# Elasticsearch 병렬 테스트를 향한 여정

> [!abstract] 한 줄 정리
> 테스트를 병렬로 돌리는 것보다 여러 테스트가 공유하는 DB·Elasticsearch 상태를 서로 격리하는 일이 먼저입니다.

> techblog.woowahan.com

## 핵심 내용

1,500개가 넘는 테스트로 CI 시간이 10분 이상 걸리자 병렬 실행을 시도하지만, Elasticsearch와 DB의 공유 상태 때문에 테스트가 간섭합니다. namespace를 분리해 데이터를 격리하고, DB connection 증가와 cleanup 비용을 함께 조절하며 필요한 테스트를 `@Tag`로 구분합니다.

결과적으로 로컬은 약 4분 5초에서 1분 48초, CI는 10분 41초에서 5분 3초 수준으로 줄였습니다.

## 왜 읽을까

병렬화가 설정 하나가 아니라 공유 자원의 동시성·격리 문제라는 점을 구체적으로 보여줍니다.

**프로젝트에 적용**

**DevPedia** — 테스트가 늘어난 뒤 병렬화를 시도한다면 먼저 테스트 데이터와 외부 저장소 상태가 독립적인지 확인하고, 병렬 실행 전후 CI 시간과 flaky test 비율을 같이 측정할 수 있습니다.

---

**원문:** [Elasticsearch 병렬 테스트를 향한 여정](https://techblog.woowahan.com/18486/)
