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

Java 백엔드 프레임워크를 선택할 때는 무조건 적은 메모리를 쓰는 프레임워크가 빠르다고 해석해서는 안 된다. 카카오페이는 Spring과 Ktor의 부팅·시작 메모리·CPU 중심과 Blocking 중심 부하를 분리하고 동일 조건에서 10회씩 평균을 측정했다.

기본 의존성 6개 환경에서 Spring은 부팅 6.694초·메모리 195MB·로드 클래스 15,666개, Ktor는 1.054초·60MB·7,716개였다. CPU 연산 중심 테스트는 둘의 처리량이 거의 같았지만 긴 DB Blocking에서 Spring 약 230TPS, Ktor 약 430TPS라는 차이가 나타났다. 이는 Ktor가 모든 애플리케이션에서 두 배 빠르다는 의미가 아니라 실험의 스레드·Coroutine·I/O 구성에 좌우되는 특정 결과다.

| 관측 항목 | Spring | Ktor |
| --- | ---: | ---: |
| 초기 부팅 | 6.694초 | 1.054초 |
| 메모리 | 195MB | 60MB |
| 로드 클래스 | 15,666 | 7,716 |
| 긴 DB Blocking | 약 230TPS | 약 430TPS |
| CPU-bound | 거의 같은 처리량 | 거의 같은 처리량 |

*해당 버전·설정과 부하 유형의 10회 평균이다. Spring/Ktor 일반 성능의 보편 값이 아니다.*

Ktor는 작은 HTTP 서비스나 빠른 기동이 필요한 워크로드에서 유리할 수 있지만 Spring Security·Spring Data·Cloud 생태계를 그대로 대체할 수는 없다. 운영 팀의 디버깅 숙련도, 기존 라이브러리 연동, Blocking 호출을 실제로 어느 Dispatcher에서 처리하는지까지 확인해야 프레임워크 선정의 근거가 된다.

## 왜 읽을까

'Spring이 무겁다' 같은 인상을 실제 측정 항목으로 분해하고, 프레임워크 자체보다 워크로드가 결과를 어떻게 바꾸는지 볼 수 있다. 오래된 글이라 최신 Spring/JDK와 수치를 그대로 비교하면 안 되지만 기술 선택 실험을 설계하는 방식은 여전히 유효하다.

**프로젝트에 적용 — PawCycle**

- [ ] 현재 Spring Boot의 startup time, 메모리, loaded classes를 직접 측정해 기준선을 만든다.
- [ ] 성능 병목을 프레임워크 탓으로 돌리기 전에 CPU-bound, DB I/O, 외부 I/O 중 어디에 있는지 분리한다.
- [ ] 대체 기술을 검토할 때 성능 이득뿐 아니라 생태계·운영·학습 비용까지 같이 비교한다.

---

**원문:** [Spring 공화국에서 Ktor 사용하기](https://tech.kakaopay.com/post/spring-and-ktor/)
