---
type: tech-article
title: "IllegalArgumentException은 400 Bad Request인가?"
aliases: []
summary: "예외 이름만 보고 4xx를 결정하면 서버 버그를 클라이언트 오류로 숨길 수 있으므로, HTTP 상태는 책임과 의미가 분명한 예외에 매핑해야 합니다."
source: "techblog.woowahan.com"
published: 
collected: 2026-08-03
url: "https://techblog.woowahan.com/21686/"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# IllegalArgumentException은 400 Bad Request인가?

> [!abstract] 한 줄 정리
> 예외 이름만 보고 4xx를 결정하면 서버 버그를 클라이언트 오류로 숨길 수 있으므로, HTTP 상태는 책임과 의미가 분명한 예외에 매핑해야 합니다.

> techblog.woowahan.com

## 핵심 내용

`IllegalArgumentException`은 잘못된 인수 때문에 발생하지만 서버 내부 버그나 라이브러리에서도 발생할 수 있습니다. 글은 예상 가능한 클라이언트 오류와 예상하지 못한 서버 오류를 구분하고, 클라이언트 책임이 명확할 때만 커스텀 비즈니스 예외를 4xx에 매핑하는 방식을 설명합니다.

HTTP 400은 서버 메서드가 `IllegalArgumentException`을 던졌다는 사실이 아니라 **클라이언트가 수정할 수 있는 잘못된 요청**이라는 판단을 표현해야 한다. 같은 예외도 외부 입력 검증에서 예상 가능하게 발생할 수 있고 내부 프로그래밍 오류나 라이브러리 상태 이상에서 발생할 수 있다. 전역적으로 모든 `IllegalArgumentException`을 400으로 바꾸면 서버 결함을 클라이언트의 잘못으로 기록해 장애 모니터링에서 놓칠 위험이 있다.

```java
// 개념 설명용 재구성: 업무상 예상한 잘못된 입력을 명확한 예외로 구분
if (quantity < 1) {
    throw new InvalidOrderQuantityException(quantity);
}
```

| 예외 의미 | 권장 판정 원리 |
| --- | --- |
| 업무 규칙상 잘못된 요청 | 명시적인 비즈니스 예외 → 4xx |
| 파라미터 형식 검증 실패 | 입력 검증 오류 → 4xx |
| 예상하지 못한 코드·상태 오류 | 원인 로그와 함께 5xx 검토 |

잘못된 입력의 의미를 정의하는 계층과 외부 HTTP 상태로 매핑하는 계층을 나누면 예외 분류가 코드 계약으로 남는다.

## 왜 읽을까

상태 코드는 응답 형식이 아니라 재시도 정책, 장애 알림, 운영자의 원인 판단과 연결됩니다. 서버 버그가 400으로 숨으면 실제 장애를 클라이언트 문제로 오인할 수 있다는 점이 실무적입니다.

---

**원문:** [IllegalArgumentException은 400 Bad Request인가?](https://techblog.woowahan.com/21686/)
