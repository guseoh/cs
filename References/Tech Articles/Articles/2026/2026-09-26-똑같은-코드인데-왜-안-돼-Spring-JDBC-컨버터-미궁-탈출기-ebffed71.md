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

`LocalDate`를 문자열로 저장하도록 Spring Data JDBC의 WritingConverter를 등록해도 VARCHAR 컬럼에 원하는 ISO 형식이 아닌 Oracle DATE 표현이 저장될 수 있다. 네이버파이낸셜은 거의 같은 코드로 보이는 LocalDateTime 쪽은 정상으로 작동하는데 LocalDate만 실패해 Spring JDBC의 실제 타입 처리·파라미터 바인딩 경로를 추적했다.

Spring JDBC는 Java 타입과 SQL 타입의 힌트를 이용해 `setDate`, `setTimestamp`, `setString` 등 다른 바인딩 경로로 내려간다. 애플리케이션이 String을 의도해도 변환 전 타입에 대한 특별 취급이나 드라이버의 암묵적 변환이 개입하면 저장 값이 달라질 수 있다. 해결은 `LocalDate`를 직접 필드로 쓰는 대신 `CustomLocalDate` 래퍼를 정의하고 양방향 Converter를 등록해 기본 특수 처리 경로와 구분한 것이다.

```java
// 별도의 값 객체를 통해 JDBC 기본 LocalDate 경로를 구분하는 개념 예시
record CustomLocalDate(LocalDate value) {}

@WritingConverter
class DateToString implements Converter<CustomLocalDate, String> {
    public String convert(CustomLocalDate d) { return d.value().toString(); }
}
```

*실제 원문의 클래스명·애너테이션 조합을 그대로 옮긴 것이 아니라 래퍼 타입의 역할을 설명한다.*

| 계층 | 기대한 동작 | 실제 확인할 것 |
| --- | --- | --- |
| Converter | LocalDate→ISO String | 실제 Converter가 선택됐는가 |
| JDBC 바인딩 | 문자열로 전달 | setDate/setString 중 무엇인가 |
| Oracle VARCHAR | `YYYY-MM-DD` 저장 | 드라이버의 암묵적 변환 유무 |
| 검증 | Repository 조회가 정상 | raw DB 값 직접 비교 |

검증에서 Repository로 저장한 뒤 다시 같은 매퍼로 읽으면 저장/읽기 변환의 오류가 서로 상쇄될 수 있다. JdbcTemplate으로 실제 DB의 원시 문자열을 읽어 기대한 날짜 포맷이 저장됐는지 따로 확인해야 한다. 스프링 버전·JDBC 드라이버·DB 벤더의 타입 바인딩을 바꾸면 결과가 달라질 수 있다.

## 왜 읽을까

“컨버터를 등록했는데 왜 안 되지?”에서 멈추지 않고 Spring Data JDBC → Spring JDBC → JDBC 드라이버 → DB 저장값까지 계층을 내려가는 디버깅 흐름이 좋다. 프레임워크 추상화가 항상 개발자의 의도대로 저수준 동작을 덮어주는 것은 아니라는 점도 선명하다.

**프로젝트에 적용 — DevPedia**

- [ ] JPA/JDBC의 Converter를 사용할 때 엔티티 왕복 테스트만 하지 말고 DB에 실제 저장된 raw 값도 확인한다.
- [ ] 날짜·Enum·JSON 같은 변환 규칙은 애플리케이션 타입, JDBC 타입, DB 컬럼 타입의 세 층을 함께 문서화한다.
- [ ] DB나 드라이버 버전을 바꿀 때 변환 회귀 테스트를 포함해 암묵적 변환에 의존한 코드가 없는지 확인한다.

---

**원문:** [똑같은 코드인데 왜 안 돼? Spring JDBC 컨버터 미궁 탈출기](https://medium.com/naverfinancial/%EB%98%91%EA%B0%99%EC%9D%80-%EC%BD%94%EB%93%9C%EC%9D%B8%EB%8D%B0-%EC%99%9C-%EC%95%88-%EB%8F%BC-spring-jdbc-%EC%BB%A8%EB%B2%84%ED%84%B0-%EB%AF%B8%EA%B6%81-%ED%83%88%EC%B6%9C%EA%B8%B0-9bbe3935fb15)
