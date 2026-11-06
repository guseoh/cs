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

Virtual Thread의 핵심 이점은 대기 중인 요청마다 무거운 OS 스레드를 계속 점유하지 않아도 된다는 것이지 MySQL의 커넥션이나 Redis 처리 용량까지 증가한다는 뜻은 아니다. Platform Thread에서 Tomcat 스레드 상한이 자연스러운 Backpressure 역할을 했다면, Virtual Thread는 더 많은 요청이 동시에 DB 커넥션 획득을 기다리게 만들 수 있다. 따라서 스레드 방식과 함께 요청 유입 제한·Pool Borrow Timeout·GC·하위 서비스의 TPS를 묶어 측정해야 한다.

```yaml
# 원문에 등장하는 Spring Boot 3.2 설정
spring:
  threads:
    virtual:
      enabled: true
```

| 테스트에서 비교한 경계 | Platform Thread | Virtual Thread |
| --- | --- | --- |
| 요청 수용 | Tomcat 스레드 상한으로 제한 | 높은 동시 수용 |
| DB Connection Pool | 자연스러운 유입 제한 효과 | Pool 고갈·대기 가능 |
| 동기화 구간 | 기존 스레드 동작 | 사용 라이브러리의 pinning 확인 필요 |

원문은 Redis Cache Miss 시 MySQL을 조회하는 실무형 경로와 nGrinder 결과를 비교했다. 단순 `Thread.sleep()` 예제의 성능을 실서비스 처리량으로 일반화하지 않았다는 점도 중요하다.

## 왜 읽을까

Virtual Thread TPS 향상보다 한 계층의 동시 처리 능력과 시스템 전체 처리 능력이 다르다는 메시지가 중요합니다.

---

**원문:** [\\[Project Loom\\] Virtual Thread에 봄(Spring)은 왔는가](https://tech.kakaopay.com/post/ro-spring-virtual-thread/)
