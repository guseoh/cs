---
category: Spring
status:
tags:
  -
---
## 들어가기 전

Java와 Spring을 사용해 백엔드 애플리케이션을 개발하면 회원, 상품, 주문과 같은 데이터를 객체로 표현한다. 하지만 이러한 데이터를 애플리케이션이 종료된 이후에도 보관하려면 데이터베이스에 저장해야 한다. 이때 Java에서는 객체를 사용하고, 관계형 데이터베이스에서는 테이블을 사용한다는 차이가 발생한다.

Java 객체를 관계형 데이터베이스에 저장하려면 객체의 필드로 테이블의 컬럼과 연결해야 한다. 반대로 데이터베이스에서 조회한 데이터를 사용하려면 테이블의 행을 Java 객체로 변환해야 한다. 

이러한 문제를 해결하기 위한 기술이 **ORM(Object-Relational Mapping, 객체 관계 매핑)**이다. 


## 1. SQL 중심 개발의 문제와 ORM의 등장 배경

Java 애플리케이션에서 관계형 데이터베이스에 접근하는 기본 기술은 **JDBC(Java Database Connectivity)**다.

JDBC는 Java 프로그램이 데이터베이스에 연결하고 SQL을 실행하며, 실행 결과를 받아올 수 있도록 정의한 표준 API다. MySQL이나 PostgreSQL 같은 데이터베이스는 각각 JDBC 드라이버를 제공하며, Java 애플리케이션은 이 드라이버를 통해 데이터베이스와 통신한다.

| id  | name | email           |
| --- | ---- | --------------- |
| 1   | 김철수  | kim@example.com |
| 2   | 이영희  | lee@example.com |
```java

public class Member {

    private Long id;
    private String name;
    private String email;

	...
}
```
- 이 `Member` 객체를 데이터베이스에 저장하려면 어떻게 해야 할까?
- JDBC를 직접 사용하는 경우에는 개발자가 INSERT SQL을 작성하고, 객체의 각 필드를 SQL 파라미터에 연결해야 한다.
- `Member` 객체의 필드 값을 읽을 수 있다고 가정하면 아래 코드가 필요하다.
```java
String sql = """
    INSERT INTO member (id, name, email)
    VALUES (?, ?, ?)
    """;

try (Connection con = dataSource.getConnection();
     PreparedStatement pstmt = con.prepareStatement(sql)) {

    pstmt.setLong(1, member.getId());
    pstmt.setString(2, member.getName());
    pstmt.setString(3, member.getEmail());

    pstmt.executeUpdate();
}

```

먼저 `DataSource`에서 JDBC `Connection`을 얻고, `PreparedStatement`를 통해 INSERT SQL을 준비한다. 이후 `Member`객체의 각 필드 값을 SQL의 `?` 자리에 바인딩하고, `executeUpdate()`를 호출하면 데이터베이스에 SQL이 전달된다.

데이터를 조회할 때도 비슷한 문제가 발생한다. 예를 들어 `SELECT id, name, email FROM member WHERE id = ?`를 실행하면 JDBC는 `ResultSet`으로 조회 결과를 제공한다. 개발자는 `ResultSet`에서 각 컬럼 값을 꺼내 `new Member(…)`를 호출하여 객체를 생성하야 한다.