---
type: tech-article
title: "초당 100만 건, LINE 앱에 Apache Kafka 종단 간 암호화 적용기"
aliases: []
summary: "큰 보안 변경도 호환 레이어와 점진적 트래픽 전환을 이용하면 서비스 중단 없이 위험을 통제할 수 있습니다."
source: "techblog.lycorp.co.jp"
published: 
collected: 2026-08-09
url: "https://techblog.lycorp.co.jp/ko/applying-e2ee-to-apache-kafka-in-line-app"
topic: "보안"
categories:
  - "보안"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/보안"
migration_origin: notion
---

# 초당 100만 건, LINE 앱에 Apache Kafka 종단 간 암호화 적용기

> [!abstract] 한 줄 정리
> 큰 보안 변경도 호환 레이어와 점진적 트래픽 전환을 이용하면 서비스 중단 없이 위험을 통제할 수 있습니다.

> techblog.lycorp.co.jp

## 핵심 내용

LINE의 대규모 Kafka 토픽에 프로듀서부터 컨슈머까지 메시지 암호화를 적용합니다. 요구사항을 기밀성, 확장성, 최소 성능 오버헤드로 정의하고 여러 컨슈머별 키 때문에 헤더가 커지는 문제를 공유 KEK 구조로 풀되 KMS 접근 제어와 주기적 키 교체로 트레이드오프를 보완했습니다. 배포는 컨슈머가 평문·암호문을 함께 처리하게 만든 뒤 프로듀서 암호화 비율을 1%→10%→50%→100%로 올렸고, 운영 규모 벤치마크에서 CPU 증가는 약 1% 이하, 약 2주 점진 배포 동안 관련 장애 알림은 0건이었다고 설명합니다.

Kafka의 TLS 구간 암호화만으로는 브로커가 메시지 페이로드를 읽을 수 있는 문제를 없애지 못한다. 원문은 **DEK로 데이터 본문을 암호화**하고, 해당 DEK를 수신자가 해독할 수 있도록 **KEK로 보호한 정보와 KEK 식별자를 Kafka Header에 담는 구조**를 설명한다. 메시지 키는 파티셔닝에 사용되므로 그대로 유지하고, 기존 클라이언트와의 호환성을 고려해 Consumer부터 평문·암호문을 모두 처리하도록 준비했다.

![원문 Kafka 평문 메시지와 헤더 기반 E2EE 메시지의 구조 비교](https://vos.line-scdn.net/landpress-content-v2-vcfc68aynwenkh3bno0ixfx8/2632c33cc4ac4911bd1f93feb5608c26.png?updatedAt=1782444078000)

*그림 1. 기존 Kafka Key·Value와 암호화 메시지의 Header·Value 역할 비교 — [출처: LY Corporation Tech Blog](https://techblog.lycorp.co.jp/ko/applying-e2ee-to-apache-kafka-in-line-app)*

| 변경 단계 | 보호할 호환성 |
| --- | --- |
| Consumer 배포 | 이전 평문 및 새 암호문 모두 해석 |
| Producer 1% → 10% → 50% → 100% | 복호화 실패·성능 지표 관측 |
| 키 순환·접근 통제 | 허용된 Consumer만 DEK 사용 |

원문에서 보고한 운영 규모의 CPU 오버헤드 약 1% 이하와 점진 적용 기간의 관련 장애 알림 0건은 해당 테스트·배포 조건의 결과다. 키 유출과 오용에 대응하는 KMS 정책까지 함께 운영해야 E2EE의 보안 목적을 지킬 수 있다.

## 왜 읽을까

암호화 자체보다 호환 레이어, 메트릭 확인, 점진적 확대, 즉시 롤백이라는 대규모 변경 방식이 특히 좋습니다.

---

**원문:** [초당 100만 건, LINE 앱에 Apache Kafka 종단 간 암호화 적용기](https://techblog.lycorp.co.jp/ko/applying-e2ee-to-apache-kafka-in-line-app)
