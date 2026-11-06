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

통합 테스트를 여러 프로세스에서 동시에 실행할 때는 테스트 클래스의 코드가 독립적이어도 Elasticsearch 인덱스나 DB 테이블을 공유하면 한 테스트의 삭제·변경이 다른 테스트의 결과를 오염시킬 수 있다. 따라서 JUnit 병렬 옵션을 켜기 전에 테스트별 데이터 식별자와 초기화·정리 경계를 고정해야 한다.

| 테스트 실행 | 기존 | 개선 |
| --- | ---: | ---: |
| 로컬 전체 테스트 | 4분 5초 | 1분 48초 |
| CI 전체 테스트 | 10분 41초 | 5분 3초 |

Test Namespace를 분리하면 간섭이 줄지만 DB Connection 증가와 인덱스 생성·삭제 비용이 늘 수 있다. 실행 시간이 짧아져도 간헐적 실패가 발생하면 테스트 자체의 신뢰도가 낮아지므로 반복 CI에서 Flaky Test 여부도 함께 확인해야 한다.

## 왜 읽을까

병렬화가 설정 하나가 아니라 공유 자원의 동시성·격리 문제라는 점을 구체적으로 보여줍니다.

**프로젝트에 적용**

**DevPedia** — 테스트가 늘어난 뒤 병렬화를 시도한다면 먼저 테스트 데이터와 외부 저장소 상태가 독립적인지 확인하고, 병렬 실행 전후 CI 시간과 flaky test 비율을 같이 측정할 수 있습니다.

---

**원문:** [Elasticsearch 병렬 테스트를 향한 여정](https://techblog.woowahan.com/18486/)
