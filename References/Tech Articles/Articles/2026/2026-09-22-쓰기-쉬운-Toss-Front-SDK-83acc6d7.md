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

SDK 사용자가 `open → listen → close`의 호출 순서와 예외·cleanup을 직접 기억해야 한다면 간단한 실시간 연결도 실수에 취약하다. 토스 Front SDK는 올바른 호출 순서를 문서로 설명하는 데 그치지 않고 의도 단위의 API로 재구성해 사람의 인지 부담을 줄이려 했다.

일반적인 호출 패턴의 `start/stop` Facade가 내부에서 연결·이벤트 리스너·인증·재시도·정리 상태를 관리한다. 사용자는 연결이 실패했을 때 직접 각 객체를 되돌리는 코드를 반복하지 않고 상위 계약으로 기능을 실행한다. 하지만 특수한 연결 순서나 타이밍을 직접 제어해야 하는 소비자를 위해 `open/listen/close`와 같은 낮은 수준 API도 Escape Hatch로 유지했다.

```ts
// 원자의 호출 순서를 감추는 Facade 의도 예시
const session = sdk.start({ onEvent: handleEvent });
// ... UI 언마운트 또는 작업 종료
session.stop();
```

*실제 원문 SDK의 함수 서명이 아니라 소비자 관점 API 설계의 예시다.*

| 인터페이스 | 소비자가 부담하는 일 | SDK가 부담하는 일 |
| --- | --- | --- |
| Low-level | open/listen/close 순서·해제 | 최소 연결 기능 |
| High-level Facade | start/stop 의도 전달 | 인증·재시도·cleanup·상태 |
| Escape Hatch | 특별한 호출 흐름 | 기존 낮은 수준 제어 보존 |

추상화는 반복 코드를 없애지만 내부 상태기계의 테스트·호환성 책임이 SDK로 이동한다. 일반적인 약 80%의 사용 사례를 Facade로 감싸되 예외적인 20%의 경로를 완전히 막으면 오히려 SDK를 우회하는 임의 구현이 늘 수 있다. 종료를 두 번 호출하거나 시작 중 오류가 발생해도 리스너가 남지 않는지를 API 계약으로 테스트해야 한다.

## 왜 읽을까

Facade를 단순히 '복잡한 기능을 감싸는 패턴'으로 외우는 대신, 잘못된 사용 자체를 어렵게 만드는 API 설계 관점으로 볼 수 있다. 객체지향 설계에서 책임을 어디에 둘지 판단하는 데도 좋은 사례다.

**프로젝트에 적용 — PawCycle**

- [ ] 서비스·Repository API에서 호출자가 반드시 지켜야 하는 호출 순서가 숨어 있는지 찾는다.
- [ ] 반복되는 orchestration과 cleanup 책임을 의도 중심 메서드로 캡슐화할 수 있는지 검토한다.
- [ ] 고수준 API를 만들더라도 특수 요구를 위한 저수준 확장 지점이 필요한지 함께 판단한다.

---

**원문:** [쓰기 쉬운 Toss Front SDK](https://toss.tech/article/45387)
