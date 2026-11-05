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

## 왜 읽을까

암호화 자체보다 호환 레이어, 메트릭 확인, 점진적 확대, 즉시 롤백이라는 대규모 변경 방식이 특히 좋습니다.

---

**원문:** [초당 100만 건, LINE 앱에 Apache Kafka 종단 간 암호화 적용기](https://techblog.lycorp.co.jp/ko/applying-e2ee-to-apache-kafka-in-line-app)
