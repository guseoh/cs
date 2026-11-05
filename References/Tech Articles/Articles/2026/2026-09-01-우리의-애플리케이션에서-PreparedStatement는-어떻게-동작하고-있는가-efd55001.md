---
type: tech-article
title: "우리의 애플리케이션에서 PreparedStatement는 어떻게 동작하고 있는가"
aliases: []
summary: "Hibernate와 HikariCP 뒤에 가려진 PreparedStatement가 실제로는 MySQL Connector/J 설정에 따라 전혀 다른 방식으로 동작한다. JDBC 옵션은 모범 설정을 복사하기보다 드라이버 구현과 쿼리 패턴을 이해하고 측정해야 한다."
source: "카카오페이 기술 블로그"
published: 2025-05-13
collected: 2026-09-01
url: "https://tech.kakaopay.com/post/how-preparedstatement-works-in-our-apps/"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/성능"
migration_origin: notion
---

# 우리의 애플리케이션에서 PreparedStatement는 어떻게 동작하고 있는가

> [!abstract] 한 줄 정리
> Hibernate와 HikariCP 뒤에 가려진 PreparedStatement가 실제로는 MySQL Connector/J 설정에 따라 전혀 다른 방식으로 동작한다. JDBC 옵션은 모범 설정을 복사하기보다 드라이버 구현과 쿼리 패턴을 이해하고 측정해야 한다.

> 카카오페이 기술 블로그 · 2025-05-13

## 핵심 내용

- **구조:** 애플리케이션에서 DB까지 Hibernate → HikariCP → JDBC → MySQL Connector/J 계층을 따라가며 `PreparedStatement` 구현과 설정이 어디서 결정되는지 확인한다.
- **접근:** `useServerPrepStmts`와 `cachePrepStmts` 조합에 따라 `ServerPreparedStatement` 또는 `ClientPreparedStatement`가 선택되고, 서버 측 객체 캐시 여부도 달라진다. Client 방식은 객체 자체가 아니라 `QueryInfo`를 캐시한다.
- **수치:** 단일 Connection에서 단순 SELECT 2만 회를 반복했을 때 서버 PREPARE를 사용하면서 캐시하지 않은 조합은 약 21분, 나머지 세 조합은 약 4분이었다. 매 호출마다 PREPARE/DEALLOCATE가 왕복하는 비용이 크게 드러났다.
- **주의점:** 테스트 쿼리가 단순하고 Connection이 하나인 조건이라 결과를 일반화하면 안 된다. MySQL의 `max_prepared_stmt_count` 기본값 16,382와 Connection별 캐시 특성도 함께 고려해야 한다.

## 왜 읽을까

Spring/JPA를 사용하면 JDBC 드라이버의 동작을 직접 볼 일이 적지만, 실제 성능 문제는 ORM 아래 계층에서 발생할 수 있다. 설정값 하나를 외워 적용하는 대신 추상화 계층을 내려가 구현과 네트워크 비용을 확인하는 사고방식을 익히기 좋은 글이다.

**프로젝트에 적용 — PawCycle**

- [ ] 대량 조회·배치 성능 측정 시 SQL 시간뿐 아니라 JDBC 설정과 DB round trip도 함께 확인한다.
- [ ] Connector/J 옵션을 변경한다면 동일한 데이터·Connection pool 조건으로 Before/After를 재측정한다.
- [ ] `max_prepared_stmt_count`, HikariCP 크기, Connection별 캐시 개수의 곱이 운영 환경에서 어떤 상한을 만드는지 확인한다.

---

**원문:** [우리의 애플리케이션에서 PreparedStatement는 어떻게 동작하고 있는가](https://tech.kakaopay.com/post/how-preparedstatement-works-in-our-apps/)
