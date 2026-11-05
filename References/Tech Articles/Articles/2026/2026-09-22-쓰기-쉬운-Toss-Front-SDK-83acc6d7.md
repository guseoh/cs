---
type: tech-article
title: "쓰기 쉬운 Toss Front SDK"
aliases: []
summary: "좋은 SDK는 기능을 많이 노출하는 것이 아니라 사용자의 의도를 안전한 인터페이스로 표현하게 만든다. Facade로 흔한 흐름을 감싸되 저수준 API라는 탈출구를 남겨 편의성과 확장성을 함께 확보한다."
source: "Toss Tech"
published: 2026-02-26
collected: 2026-09-22
url: "https://toss.tech/article/45387"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# 쓰기 쉬운 Toss Front SDK

> [!abstract] 한 줄 정리
> 좋은 SDK는 기능을 많이 노출하는 것이 아니라 사용자의 의도를 안전한 인터페이스로 표현하게 만든다. Facade로 흔한 흐름을 감싸되 저수준 API라는 탈출구를 남겨 편의성과 확장성을 함께 확보한다.

> Toss Tech · 2026-02-26

## 핵심 내용

- **문제:** 서버 연결 후 이벤트 리스너 등록·해제와 종료 순서를 사용자가 직접 맞추면, cleanup 누락으로 메모리 누수나 장애가 발생할 수 있다. 문서로 올바른 순서를 안내하는 것만으로는 휴먼 에러를 막기 어렵다.
- **접근:** `open/listen/close` 같은 원자적 호출을 사용자의 의도인 `start/stop`으로 묶는 Facade를 두고 인증·재시도·상태 관리·cleanup 같은 책임을 내부로 옮겼다.
- **구조:** 흔한 약 80%의 유즈케이스는 high-level Facade로 처리하고, 세밀한 제어가 필요한 특수 사례에는 low-level API를 Escape Hatch로 유지한다.
- **트레이드오프:** 추상화가 높아질수록 사용자의 인지 부하는 줄지만 SDK 내부 오케스트레이션과 유지보수 비용은 커진다. 따라서 모든 기능을 Facade로 숨기지 않고 추상화 경계를 계속 조정해야 한다.

## 왜 읽을까

Facade를 단순히 '복잡한 기능을 감싸는 패턴'으로 외우는 대신, 잘못된 사용 자체를 어렵게 만드는 API 설계 관점으로 볼 수 있다. 객체지향 설계에서 책임을 어디에 둘지 판단하는 데도 좋은 사례다.

**프로젝트에 적용 — PawCycle**

- [ ] 서비스·Repository API에서 호출자가 반드시 지켜야 하는 호출 순서가 숨어 있는지 찾는다.
- [ ] 반복되는 orchestration과 cleanup 책임을 의도 중심 메서드로 캡슐화할 수 있는지 검토한다.
- [ ] 고수준 API를 만들더라도 특수 요구를 위한 저수준 확장 지점이 필요한지 함께 판단한다.

---

**원문:** [쓰기 쉬운 Toss Front SDK](https://toss.tech/article/45387)
