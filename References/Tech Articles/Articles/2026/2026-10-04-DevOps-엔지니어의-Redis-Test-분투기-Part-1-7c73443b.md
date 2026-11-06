---
type: tech-article
title: "DevOps 엔지니어의 Redis Test 분투기 - Part 1"
aliases: []
summary: "Redis 장애를 단순 캐시 서버 문제로 끝내지 않고 실제 애플리케이션 요청 패턴을 재현해 사이징과 병목을 확인한다. 캐시 미스가 원본 DB 부하로 증폭되는 구조를 부하 테스트로 검증하는 사례다."
source: "컬리 기술 블로그"
published: 2020-03-05
collected: 2026-10-04
url: "https://helloworld.kurly.com/blog/redis-fight-part-1/"
topic: "성능"
categories:
  - "성능"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
  - "tech/장애-운영"
migration_origin: notion
---

# DevOps 엔지니어의 Redis Test 분투기 - Part 1

> [!abstract] 한 줄 정리
> Redis 장애를 단순 캐시 서버 문제로 끝내지 않고 실제 애플리케이션 요청 패턴을 재현해 사이징과 병목을 확인한다. 캐시 미스가 원본 DB 부하로 증폭되는 구조를 부하 테스트로 검증하는 사례다.

> 컬리 기술 블로그 · 2020-03-05

## 핵심 내용

Look-Aside Cache는 키가 존재하고 조회가 분산되는 평상시에는 DB를 보호하지만, 동시에 키가 만료되면 같은 값을 다시 구하려는 요청이 원본 DB에 몰릴 수 있다. 컬리 DevOps 팀은 실제 장애와 비슷한 Redis 미스·만료 상황을 재현하기 위해 단순 `redis-benchmark`보다 애플리케이션 GET/SET 요청 흐름을 만들었다.

운영과 같은 ElastiCache `cache.m5.large` Failover 구성에서 Node.js/Express 테스트 API와 nGrinder를 결합해 2개 EC2에서 부하를 발생시켰다. Redis의 CPU·Connection·Memory·Latency를 보면서 캐시 적중 상태, 미스 시 DB 조회, 다시 SET할 때의 동시 요청을 나누어 관찰했다. 동일한 키 하나를 여러 사용자가 요청하는 구조에서는 한 요청이 캐시를 채워도 다른 요청이 동시에 DB를 호출하는 Stampede가 생길 수 있다.

| 시험 조건 | 관찰 결과 | 판단 |
| --- | --- | --- |
| 정상 hit | 캐시에서 빠르게 반환 | 원본 DB 부하가 숨겨질 수 있음 |
| 초기 키 미존재 | GET 미스·동시 SET | DB 유입 폭증 위험 |
| 1,500 Vuser | 오류·TPS 급락 재현 | Redis/DB·발신 서버를 함께 관찰 |
| 단일 Key 200명+ | Primary CPU 25%+ | Hot key에 대한 병렬 요청 부담 |

Vuser 1,500 환경에서 초기 키 부재와 만료 후 GET/SET에 오류와 TPS 급락이 재현됐고, 동일 Key를 반복 확인하는 경우에도 동시 사용자 200명 이상이면 Primary CPU가 25% 이상 증가했다. 이 수치만으로 Redis 전체 용량이 부족하다고 단정하지 말고 Redis·원본 DB·부하 발생기 각각의 시간을 구분해야 한다. 분산 락·Single-flight·TTL Jitter는 추가로 검토할 만한 대안이지만 원문에서 검증 완료한 해결책으로 기록하지 않는다.

## 왜 읽을까

오래된 글이지만 ‘Redis를 넣으면 빨라진다’보다 먼저 실제 워크로드를 재현하고 사이징 근거를 만드는 과정이 좋다. 캐시 계층의 실패가 DB 장애로 전파되는 흐름을 이해하는 데도 유용하다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis를 사용하는 경로는 정상 Hit뿐 아니라 Cache Miss·만료 순간의 DB 부하도 별도 시나리오로 측정한다.
- [ ] Redis 장애 시 fallback이 Hikari Connection Pool을 얼마나 빠르게 포화시키는지 관찰한다.
- [ ] RPS, Redis CPU/latency, DB connection active/pending, API p95/p99를 같은 타임라인으로 비교한다.

---

**원문:** [DevOps 엔지니어의 Redis Test 분투기 - Part 1](https://helloworld.kurly.com/blog/redis-fight-part-1/)
