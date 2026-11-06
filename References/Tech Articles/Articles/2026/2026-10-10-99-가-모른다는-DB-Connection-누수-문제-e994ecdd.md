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

JDBC 드라이버를 MariaDB에서 MySQL로 바꾼 뒤 컬리 서비스의 EC2 인스턴스가 주기적으로 OOM으로 교체되었다. DB 쿼리 자체가 오래 걸리는 것은 아니었지만 요청 지연이 약 2분에 달했고, 힙 덤프에는 `ConnectionImpl` 객체 13,689개가 남아 있었다.

![PhantomReference와 ConnectionFinalizerPhantomReference의 네트워크 자원 정리 참조 구조](https://helloworld.kurly.com/_astro/lifetime3.C-P8FLaj_1XDLql.webp)

*그림 1. 원문 PhantomReference 수명 그림: 직접 참조가 끊긴 Connection을 Cleanup Thread가 정리할 때 남는 참조 관계 — [출처: 원문 기술 블로그](https://helloworld.kurly.com/blog/connection-leak/)*

HikariCP가 Connection 수명을 50초로 짧게 설정한 것은 DB failover 이후 빠른 재접속을 위한 정책이었다. 하지만 기본 30분 대비 36배 빠르게 연결이 교체되자 MySQL 드라이버의 `AbandonedConnectionCleanupThread`가 `PhantomReference`를 통해 관리하는 네트워크 자원의 정리가 새 연결 생성 속도를 따라가지 못했다. Heap Dump의 참조 그래프를 보면 `ConnectionFinalizerPhantomReference`가 단일 Cleanup Thread의 자료구조에 남는 과정을 확인할 수 있다.

```text
# 원문에서 채택한 MySQL Connector/J JVM 옵션
-Dcom.mysql.cj.disableAbandonedConnectionCleanup=true
```

해당 속성은 특정 Connector/J 버전의 동작을 제어한다. 일반적인 커넥션 풀의 누수나 커넥션 미반납을 해결하는 범용 플래그가 아니다.

| 진단 근거 | 관찰 결과 | 설계 의사결정 |
| --- | --- | --- |
| Heap Dump | ConnectionImpl 13,689개 | 드라이버 Cleanup 참조 경로 추적 |
| Hikari max-lifetime | 50초(기본 약 30분 대비 36배) | failover 대응 수명 유지 |
| CleanupThread | 연결 교체 속도를 따라가지 못함 | 지원 플래그로 비활성화 |
| 후속 관측 | 누적 메모리 감소·수개월 안정 | 드라이버 버전·풀 폐기 경로 검증 |

팀은 수명 50초를 늘리는 대신 mysql-connector-j 8.0.22 이상에서 지원하는 `-Dcom.mysql.cj.disableAbandonedConnectionCleanup=true`를 적용해 관련 정리 스레드를 비활성화했다. 이후 해당 스레드의 누적 점유가 사라지고 수개월간 안정적으로 운영했다고 보고했다. 하지만 이 설정은 모든 JDBC 드라이버에 동일하게 적용되는 해결책이 아니며 커넥션을 명시적으로 닫는 풀과 리소스 관리 책임이 유지되어야 한다.

## 왜 읽을까

Hikari active/pending, GC, 힙 덤프, JDBC 드라이버의 백그라운드 동작을 함께 봐야 하는 이유를 잘 보여준다. DB 관련 장애라고 해서 반드시 느린 SQL이나 풀 크기만 원인인 것은 아니다. 이 옵션은 모든 서비스에 일괄 적용하는 처방이 아니라 드라이버 버전·리소스 수명 관리 방식에 맞춰 검토해야 한다.

**프로젝트에 적용 — PawCycle**

- [ ] JDBC 드라이버 버전과 Hikari `maxLifetime`, `maximumPoolSize` 설정값을 기록한다.
- [ ] 부하 테스트에서 Hikari pending과 함께 JVM heap·GC·커넥션 생성/종료 추이를 관측한다.
- [ ] 메모리 증가가 재현되면 Heap Dump로 커넥션 객체와 참조 보유자를 확인한 뒤 설정 변경 전후를 비교한다.

---

**원문:** [99%가 모른다는 DB Connection 누수 문제](https://helloworld.kurly.com/blog/connection-leak/)
