---
type: tech-article
title: "Pushsphere: LINE 메신저의 빠르고 신뢰할 수 있는 대량 푸시 알림 비법"
aliases: []
summary: "외부 푸시 제공자의 일부 장애와 할당량 제한을 고려해, 무작정 재시도하지 않고 실패한 엔드포인트 회피·할당량 인식·서킷 브레이커·분산 라우팅을 결합했다."
source: "LY Corporation Tech Blog"
published: 2025-11-13
collected: 2026-10-08
url: "https://techblog.lycorp.co.jp/ko/pushsphere-reliable-and-prompt-high-volume-push-notification"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "장애·운영"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/장애-운영"
migration_origin: notion
---

# Pushsphere: LINE 메신저의 빠르고 신뢰할 수 있는 대량 푸시 알림 비법

> [!abstract] 한 줄 정리
> 외부 푸시 제공자의 일부 장애와 할당량 제한을 고려해, 무작정 재시도하지 않고 실패한 엔드포인트 회피·할당량 인식·서킷 브레이커·분산 라우팅을 결합했다.

> LY Corporation Tech Blog · 2025-11-13

## 핵심 내용

LINE 메신저 수준의 푸시 알림은 APNs나 FCM 일부 엔드포인트가 느려질 때 무조건 재시도하면 전체 전달 성공률을 오히려 낮출 수 있다. 특정 서버 장애가 발생한 시점의 재시도가 Firebase 분당 할당량까지 소진시키면 새롭고 정상적인 알림 요청도 429 응답을 받는다.

```mermaid
flowchart LR
 A[LINE 메시징 서비스] --> B[Pushsphere 클라이언트]
 B --> C[Endpoint Manager·Zone 라우팅]
 C --> D[Gateway / APNs·FCM]
 D --> E{성공·실패}
 E -- 실패 --> F[CB·남은 Quota 검사]
 F --> C
```

*원문과 발표 슬라이드의 흐름을 토대로 가로형으로 재구성한 도식이며, 원본 슬라이드 자료는 [공식 발표](https://speakerdeck.com/player/ecdcc92c8fa144ce98daca5d156ca6a8)에서 확인할 수 있다.*

Pushsphere는 Kotlin·Armeria·Netty 기반 클라이언트 라이브러리와 Gateway를 나누고, 실패한 재시도에서 직전 실패 엔드포인트를 후보에서 제외한다. 엔드포인트별 Circuit Breaker가 불건전한 대상을 풀에서 제거하며 DNS 갱신을 통해 새 후보를 공급한다. 분당 할당량의 남은 예산을 확인해 재시도를 제한하고, 중앙 L4 로드 밸런서 대신 xDS/CDCP 기반 클라이언트 측 로드 밸런싱과 존 인식 라우팅을 도입하여 편중과 단일 실패 지점을 줄였다.

| 실패 대응 | 기대 효과 | 한계 |
| --- | --- | --- |
| 실패 엔드포인트 제외 | 같은 문제 서버 연속 호출 감소 | 후보가 부족하면 전달 실패 가능 |
| 엔드포인트별 Circuit Breaker | 국지적 장애 격리 | 회복 탐지 비용 |
| Quota-aware 재시도 | 429 확산 방지 | 일부 과거 알림을 포기할 수 있음 |
| xDS 존 인식 라우팅 | 중앙 L4 의존 감소 | 설정 관리·엔드포인트 신선도 요구 |

이 시스템의 설계 목표는 40만 QPS 규모였으며, 기존 연간 30건 이상이던 온콜 알람이 더 엄격한 알림 조건에서도 2025년 4건으로 줄었다고 보고했다. 이는 전달 자체가 정확히 한 번 일어남을 뜻하지 않으며 APNs/FCM의 단말 도착·표시 보장과도 구분해야 한다. 재시도는 실패 회복 수단인 동시에 다른 요청의 할당량을 소비하므로 회로 차단·할당량·요청 우선순위 정책을 함께 검토해야 한다.

## 왜 읽을까

Retry가 언제나 안정성을 높인다는 직관을 깨뜨리는 사례다. 외부 서비스의 장애와 쿼터, 로드 밸런싱, 서킷 브레이커를 함께 설계해야 한다는 점을 구체적인 429 장애와 운영 지표로 확인할 수 있다.

**프로젝트에 적용 — FutMatch**

- [ ] 경기 시작·취소 알림의 중요도와 지연 허용 시간을 구분한다.
- [ ] 외부 푸시 API의 429·timeout을 재현해 재시도 횟수·백오프·전체 발송 예산을 테스트한다.
- [ ] 중복 발송 방지 키와 발송 성공/실패 지표를 분리해 관측한다.

---

**원문:** [Pushsphere: LINE 메신저의 빠르고 신뢰할 수 있는 대량 푸시 알림 비법](https://techblog.lycorp.co.jp/ko/pushsphere-reliable-and-prompt-high-volume-push-notification)
