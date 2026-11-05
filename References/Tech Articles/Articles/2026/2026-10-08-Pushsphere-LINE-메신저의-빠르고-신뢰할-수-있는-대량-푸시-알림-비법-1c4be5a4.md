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

- **문제:** APNs/FCM 일부 인스턴스의 타임아웃과 트래픽 급증이 겹치면 재시도가 할당량을 소진시켜 정상 요청까지 실패할 수 있다. 실제 특정 리전 장애 때 재시도가 늘어 전체 요청이 일시적으로 HTTP 429를 받았다.
- **구조:** Kotlin·Armeria·Netty 기반 게이트웨이와 클라이언트 라이브러리를 분리했다. 재시도 시 실패했던 엔드포인트를 제외하고, 엔드포인트별 서킷 브레이커로 불건전한 서버를 후보군에서 제거한다.
- **트레이드오프:** Firebase의 분당 할당량을 고려해 남은 예산이 부족하면 재시도를 억제한다. 실패한 과거 요청을 모두 재전송하는 것보다 새로운 요청을 처리하는 편이 전체 도달률에 유리할 수 있다.
- **운영 개선:** 중앙 L4 로드 밸런서의 편중과 단일 장애점을 줄이기 위해 CDCP/xDS 기반 프록시 없는 서비스 메시, 클라이언트 측 로드 밸런싱, 존 인식 라우팅을 적용했다. 설계 요구 처리량은 40만 QPS였다.
- **결과:** 기존 연간 30건 이상이던 온콜 알람이 더 엄격한 조건에서도 2025년 4건으로 줄었다. 글은 최종 전송 실패율이 0에 가까웠다고 설명하지만 완전한 전달 보장을 주장하지 않는다.

## 왜 읽을까

Retry가 언제나 안정성을 높인다는 직관을 깨뜨리는 사례다. 외부 서비스의 장애와 쿼터, 로드 밸런싱, 서킷 브레이커를 함께 설계해야 한다는 점을 구체적인 429 장애와 운영 지표로 확인할 수 있다.

**프로젝트에 적용 — FutMatch**

- [ ] 경기 시작·취소 알림의 중요도와 지연 허용 시간을 구분한다.
- [ ] 외부 푸시 API의 429·timeout을 재현해 재시도 횟수·백오프·전체 발송 예산을 테스트한다.
- [ ] 중복 발송 방지 키와 발송 성공/실패 지표를 분리해 관측한다.

---

**원문:** [Pushsphere: LINE 메신저의 빠르고 신뢰할 수 있는 대량 푸시 알림 비법](https://techblog.lycorp.co.jp/ko/pushsphere-reliable-and-prompt-high-volume-push-notification)
