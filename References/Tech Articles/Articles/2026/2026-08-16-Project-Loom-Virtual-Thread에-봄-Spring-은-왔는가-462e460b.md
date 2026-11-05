---
type: tech-article
title: "[Project Loom] Virtual Thread에 봄(Spring)은 왔는가"
aliases: []
summary: "애플리케이션이 더 많은 요청을 받을 수 있게 만드는 것과 시스템 전체 처리량이 늘어나는 것은 다른 문제입니다."
source: "tech.kakaopay.com"
published: 
collected: 2026-08-16
url: "https://tech.kakaopay.com/post/ro-spring-virtual-thread/"
topic: "성능"
categories:
  - "성능"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
migration_origin: notion
---

# \[Project Loom\] Virtual Thread에 봄(Spring)은 왔는가

> [!abstract] 한 줄 정리
> 애플리케이션이 더 많은 요청을 받을 수 있게 만드는 것과 시스템 전체 처리량이 늘어나는 것은 다른 문제입니다.

> tech.kakaopay.com

## 핵심 내용

Spring Boot 3.2와 Java 21 Virtual Thread를 `Redis 조회 → Cache Miss 시 MySQL` 구조에서 nGrinder로 Platform Thread와 비교합니다. Virtual Thread는 더 많은 요청을 받을 수 있었지만 DB Connection Pool 같은 제한 자원을 더 빨리 고갈시켰고 메모리 부족 시 GC와 지연도 증가했습니다. 당시 MySQL·Jedis 코드에서는 pinning 경고도 확인돼 높은 동시 처리 능력이 다른 인프라로 부하를 전파할 수 있음을 보여줍니다.

## 왜 읽을까

Virtual Thread TPS 향상보다 한 계층의 동시 처리 능력과 시스템 전체 처리 능력이 다르다는 메시지가 중요합니다.

---

**원문:** [\\[Project Loom\\] Virtual Thread에 봄(Spring)은 왔는가](https://tech.kakaopay.com/post/ro-spring-virtual-thread/)
