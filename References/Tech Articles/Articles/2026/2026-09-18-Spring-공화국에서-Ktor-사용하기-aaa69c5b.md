---
type: tech-article
title: "Spring 공화국에서 Ktor 사용하기"
aliases: []
summary: "프레임워크 선택은 익숙함이나 유행보다 워크로드 특성과 측정 결과로 판단해야 한다. Ktor와 Spring의 차이는 CPU 연산보다 시작 비용과 Blocking이 긴 상황에서 더 선명하게 나타났다."
source: "카카오페이 기술 블로그"
published: 2024-01-11
collected: 2026-09-18
url: "https://tech.kakaopay.com/post/spring-and-ktor/"
topic: "성능"
categories:
  - "성능"
  - "설계·아키텍처"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/성능"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# Spring 공화국에서 Ktor 사용하기

> [!abstract] 한 줄 정리
> 프레임워크 선택은 익숙함이나 유행보다 워크로드 특성과 측정 결과로 판단해야 한다. Ktor와 Spring의 차이는 CPU 연산보다 시작 비용과 Blocking이 긴 상황에서 더 선명하게 나타났다.

> 카카오페이 기술 블로그 · 2024-01-11

## 핵심 내용

- **접근:** Spring과 Ktor를 부팅 속도, 시작 리소스, CPU 중심·Blocking 중심 부하로 나눠 동일 조건에서 비교하고 각 수치는 10회 평균으로 측정했다.
- **수치:** 기본 의존성 6개 환경에서 부팅 시간은 Spring 6.694초, Ktor 1.054초였고 시작 메모리는 195MB 대 60MB, 로드 클래스는 15,666개 대 7,716개였다.
- **결과:** CPU 연산 중심 테스트에서는 두 프레임워크 결과가 거의 같았지만, 긴 DB Blocking 테스트에서는 Spring 약 230 TPS, Ktor 약 430 TPS가 한계로 측정됐다.
- **트레이드오프:** Ktor는 가볍고 Coroutine 활용이 자연스럽지만 Spring보다 공식 기능·운영 자료가 적고 Spring Cloud 생태계를 그대로 대체하지는 못한다.

## 왜 읽을까

'Spring이 무겁다' 같은 인상을 실제 측정 항목으로 분해하고, 프레임워크 자체보다 워크로드가 결과를 어떻게 바꾸는지 볼 수 있다. 오래된 글이라 최신 Spring/JDK와 수치를 그대로 비교하면 안 되지만 기술 선택 실험을 설계하는 방식은 여전히 유효하다.

**프로젝트에 적용 — PawCycle**

- [ ] 현재 Spring Boot의 startup time, 메모리, loaded classes를 직접 측정해 기준선을 만든다.
- [ ] 성능 병목을 프레임워크 탓으로 돌리기 전에 CPU-bound, DB I/O, 외부 I/O 중 어디에 있는지 분리한다.
- [ ] 대체 기술을 검토할 때 성능 이득뿐 아니라 생태계·운영·학습 비용까지 같이 비교한다.

---

**원문:** [Spring 공화국에서 Ktor 사용하기](https://tech.kakaopay.com/post/spring-and-ktor/)
