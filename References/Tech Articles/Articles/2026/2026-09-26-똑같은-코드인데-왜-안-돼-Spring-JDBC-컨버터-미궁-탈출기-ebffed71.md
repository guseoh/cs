---
type: tech-article
title: "똑같은 코드인데 왜 안 돼? Spring JDBC 컨버터 미궁 탈출기"
aliases: []
summary: "Spring Data JDBC 커스텀 컨버터가 등록돼 있어도 Java 타입의 저수준 JDBC 처리와 DB 드라이버 변환 규칙 때문에 기대와 다른 값이 저장될 수 있음을 소스 코드와 실제 DB 값으로 추적한 사례다."
source: "NAVER Pay Dev Blog"
published: 2025-08-03
collected: 2026-09-26
url: "https://medium.com/naverfinancial/%EB%98%91%EA%B0%99%EC%9D%80-%EC%BD%94%EB%93%9C%EC%9D%B8%EB%8D%B0-%EC%99%9C-%EC%95%88-%EB%8F%BC-spring-jdbc-%EC%BB%A8%EB%B2%84%ED%84%B0-%EB%AF%B8%EA%B6%81-%ED%83%88%EC%B6%9C%EA%B8%B0-9bbe3935fb15"
topic: "DB·데이터"
categories:
  - "DB·데이터"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
migration_origin: notion
---

# 똑같은 코드인데 왜 안 돼? Spring JDBC 컨버터 미궁 탈출기

> [!abstract] 한 줄 정리
> Spring Data JDBC 커스텀 컨버터가 등록돼 있어도 Java 타입의 저수준 JDBC 처리와 DB 드라이버 변환 규칙 때문에 기대와 다른 값이 저장될 수 있음을 소스 코드와 실제 DB 값으로 추적한 사례다.

> NAVER Pay Dev Blog · 2025-08-03

## 핵심 내용

- **문제:** `LocalDate → String` WritingConverter를 등록했지만 VARCHAR 컬럼에 기대한 `2024-08-01` 대신 Oracle DATE 형식의 값이 저장됐고, 비슷하게 만든 LocalDateTime 쪽은 정상처럼 보여 원인이 더 헷갈렸다.
- **접근:** Spring JDBC의 파라미터 바인딩 경로까지 내려가 `LocalDate`, `LocalDateTime`, `String`이 각각 어떤 JDBC 타입 힌트로 전달되는지 추적했다.
- **주의점:** 같은 애플리케이션 코드라도 `setDate`, `setTimestamp`, `setString`과 JDBC 드라이버의 암묵적 타입 변환에 따라 실제 저장 결과가 달라질 수 있다. DB 벤더와 드라이버 버전 차이도 고려해야 한다.
- **해결:** `LocalDate`를 직접 쓰는 대신 `CustomLocalDate` 래퍼 타입을 두고 양방향 컨버터를 등록해 Spring JDBC의 특별 처리 경로를 피했다.
- **검증:** Repository 왕복 결과뿐 아니라 JdbcTemplate으로 DB의 실제 raw 값을 읽어 원하는 문자열 형식으로 저장됐는지 테스트하도록 했다.

## 왜 읽을까

“컨버터를 등록했는데 왜 안 되지?”에서 멈추지 않고 Spring Data JDBC → Spring JDBC → JDBC 드라이버 → DB 저장값까지 계층을 내려가는 디버깅 흐름이 좋다. 프레임워크 추상화가 항상 개발자의 의도대로 저수준 동작을 덮어주는 것은 아니라는 점도 선명하다.

**프로젝트에 적용 — DevPedia**

- [ ] JPA/JDBC의 Converter를 사용할 때 엔티티 왕복 테스트만 하지 말고 DB에 실제 저장된 raw 값도 확인한다.
- [ ] 날짜·Enum·JSON 같은 변환 규칙은 애플리케이션 타입, JDBC 타입, DB 컬럼 타입의 세 층을 함께 문서화한다.
- [ ] DB나 드라이버 버전을 바꿀 때 변환 회귀 테스트를 포함해 암묵적 변환에 의존한 코드가 없는지 확인한다.

---

**원문:** [똑같은 코드인데 왜 안 돼? Spring JDBC 컨버터 미궁 탈출기](https://medium.com/naverfinancial/%EB%98%91%EA%B0%99%EC%9D%80-%EC%BD%94%EB%93%9C%EC%9D%B8%EB%8D%B0-%EC%99%9C-%EC%95%88-%EB%8F%BC-spring-jdbc-%EC%BB%A8%EB%B2%84%ED%84%B0-%EB%AF%B8%EA%B6%81-%ED%83%88%EC%B6%9C%EA%B8%B0-9bbe3935fb15)
