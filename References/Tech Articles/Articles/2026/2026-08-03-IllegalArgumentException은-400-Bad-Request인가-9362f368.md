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

## 왜 읽을까

상태 코드는 응답 형식이 아니라 재시도 정책, 장애 알림, 운영자의 원인 판단과 연결됩니다. 서버 버그가 400으로 숨으면 실제 장애를 클라이언트 문제로 오인할 수 있다는 점이 실무적입니다.

---

**원문:** [IllegalArgumentException은 400 Bad Request인가?](https://techblog.woowahan.com/21686/)
