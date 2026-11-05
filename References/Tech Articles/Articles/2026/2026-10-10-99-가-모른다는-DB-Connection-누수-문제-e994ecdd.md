---
type: tech-article
title: "99%가 모른다는 DB Connection 누수 문제"
aliases: []
summary: "드라이버 교체 후 발생한 OOM은 SQL 지연이 아니라 짧은 커넥션 수명과 MySQL JDBC 정리 스레드의 처리 속도 불균형에서 비롯됐다. 힙 덤프로 런타임 객체의 실제 보유 관계를 확인해야 원인을 좁힐 수 있다."
source: "컬리 기술 블로그"
published: 2025-01-06
collected: 2026-10-10
url: "https://helloworld.kurly.com/blog/connection-leak/"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "DB·데이터"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/DB-데이터"
migration_origin: notion
---

# 99%가 모른다는 DB Connection 누수 문제

> [!abstract] 한 줄 정리
> 드라이버 교체 후 발생한 OOM은 SQL 지연이 아니라 짧은 커넥션 수명과 MySQL JDBC 정리 스레드의 처리 속도 불균형에서 비롯됐다. 힙 덤프로 런타임 객체의 실제 보유 관계를 확인해야 원인을 좁힐 수 있다.

> 컬리 기술 블로그 · 2025-01-06

## 핵심 내용

- **문제:** MariaDB JDBC 드라이버를 MySQL로 바꾼 뒤 EC2 인스턴스가 반복적으로 OOM으로 종료됐다. 요청이 약 2분 지연되는 구간에도 실제 DB 쿼리 시간은 짧았다.
- **증거:** Heap Dump 분석에서 `ConnectionImpl` 객체 13,689개와 `AbandonedConnectionCleanupThread`가 관리하는 참조 구조에 메모리가 집중된 사실을 발견했다.
- **원인:** HikariCP `max-lifetime`이 50초여서 기본값 30분보다 36배 빠르게 커넥션이 교체됐다. 단일 스레드로 네트워크 리소스를 정리하는 작업이 생성 속도를 따라가지 못했다.
- **트레이드오프:** DB failover 시 빠른 재연결을 위해 50초 수명을 유지해야 했으므로, 수명 연장 대신 mysql-connector-j 8.0.22 이상에서 제공하는 `-Dcom.mysql.cj.disableAbandonedConnectionCleanup=true` 옵션을 선택했다.
- **결과:** 옵션 적용 후 힙 덤프에서 해당 정리 스레드의 메모리 점유가 사라졌고, 이후 수개월 동안 안정적으로 운영됐다고 보고했다.

## 왜 읽을까

Hikari active/pending, GC, 힙 덤프, JDBC 드라이버의 백그라운드 동작을 함께 봐야 하는 이유를 잘 보여준다. DB 관련 장애라고 해서 반드시 느린 SQL이나 풀 크기만 원인인 것은 아니다. 이 옵션은 모든 서비스에 일괄 적용하는 처방이 아니라 드라이버 버전·리소스 수명 관리 방식에 맞춰 검토해야 한다.

**프로젝트에 적용 — PawCycle**

- [ ] JDBC 드라이버 버전과 Hikari `maxLifetime`, `maximumPoolSize` 설정값을 기록한다.
- [ ] 부하 테스트에서 Hikari pending과 함께 JVM heap·GC·커넥션 생성/종료 추이를 관측한다.
- [ ] 메모리 증가가 재현되면 Heap Dump로 커넥션 객체와 참조 보유자를 확인한 뒤 설정 변경 전후를 비교한다.

---

**원문:** [99%가 모른다는 DB Connection 누수 문제](https://helloworld.kurly.com/blog/connection-leak/)
