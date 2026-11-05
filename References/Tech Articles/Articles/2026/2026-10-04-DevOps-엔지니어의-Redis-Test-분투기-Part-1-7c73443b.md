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

- **문제:** Redis에서 필요한 Key를 얻지 못하면서 Look-Aside Cache의 요청이 RDS로 몰려 장애가 발생했고, Redis 용량과 사용 방식이 적절한지도 검증 근거가 부족했다.
- **접근:** ElastiCache 제약과 실제 장애 재현 요구 때문에 `redis-benchmark`만 사용하지 않고 Node.js/Express 테스트 API와 nGrinder로 실제 GET/SET 흐름을 만들었다.
- **구조:** 운영과 같은 `cache.m5.large` Failover 구성, EC2 2대에서 테스트하고 Redis의 CPU·Connection·Memory·Latency를 함께 관찰했다.
- **수치:** 총 Vuser 1,500 부하에서 초기 Key 부재/만료 후 GET·SET이 몰릴 때 오류와 TPS 급락을 재현했고, 단일 Key를 반복 확인하는 구조에서도 200명 이상 동시 요청 시 Primary CPU가 25% 이상 올라갔다.
- **주의점:** 캐시는 정상 상태의 hit rate만 볼 것이 아니라 Key 만료·미스·장애 시 원본 DB로 부하가 얼마나 증폭되는지를 함께 시험해야 한다.

## 왜 읽을까

오래된 글이지만 ‘Redis를 넣으면 빨라진다’보다 먼저 실제 워크로드를 재현하고 사이징 근거를 만드는 과정이 좋다. 캐시 계층의 실패가 DB 장애로 전파되는 흐름을 이해하는 데도 유용하다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis를 사용하는 경로는 정상 Hit뿐 아니라 Cache Miss·만료 순간의 DB 부하도 별도 시나리오로 측정한다.
- [ ] Redis 장애 시 fallback이 Hikari Connection Pool을 얼마나 빠르게 포화시키는지 관찰한다.
- [ ] RPS, Redis CPU/latency, DB connection active/pending, API p95/p99를 같은 타임라인으로 비교한다.

---

**원문:** [DevOps 엔지니어의 Redis Test 분투기 - Part 1](https://helloworld.kurly.com/blog/redis-fight-part-1/)
