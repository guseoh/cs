---
type: tech-article
title: "Harness Engineering: 29CM Project Mitosis"
aliases: []
summary: "AI로 레거시 마이그레이션 속도를 높이더라도 완료 기준을 코드 생성이나 Merge가 아니라 운영 트래픽에서의 동작 동등성으로 잡고, 이를 반복 검증할 Harness를 먼저 구축한 사례다."
source: "이한준 Aaron · Medium"
published: 2026-04-30
collected: 2026-09-09
url: "https://medium.com/@hanjune.lee/harness-engineering-29cm-project-mitosis-6d369b8b18a2"
topic: "리팩터링"
categories:
  - "리팩터링"
  - "AI·개발도구"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/리팩터링"
  - "tech/AI-개발도구"
migration_origin: notion
---

# Harness Engineering: 29CM Project Mitosis

> [!abstract] 한 줄 정리
> AI로 레거시 마이그레이션 속도를 높이더라도 완료 기준을 코드 생성이나 Merge가 아니라 운영 트래픽에서의 동작 동등성으로 잡고, 이를 반복 검증할 Harness를 먼저 구축한 사례다.

> 이한준 Aaron · Medium · 2026-04-30

## 핵심 내용

- **문제:** 29CM의 Django 레거시를 Spring Boot와 도메인별 DB 구조로 옮기는 과정에서 전체 1,333개 API 중 실제 마이그레이션 대상은 운영 사용량을 기준으로 295개였고, 도메인 간 직접 DB 참조도 427곳 존재했다.
- **접근:** 기존 Django 요청을 Spring Boot Shadow 경로로 1~10% 복제하고 응답과 Intent Log를 비교하되, Write·Cache·Kafka 같은 부작용은 차단했다. Match Rate 99.9% 이상을 성공 기준으로 두고 1%→5%→10% 각 24시간, 마지막 72시간의 검증 단계를 운영했다.
- **결과:** Harness는 코드 리뷰만으로 놓치기 쉬운 JPA N+1, Celery→Spring 전환의 트랜잭션·재시도 차이, 쿠폰 계산 오류 같은 동작 불일치를 실제 비교 과정에서 찾아냈다.
- **수치:** DB 전환은 목표 중단 시간 30초 이하에 대해 실제 약 4초로 수행됐고, 글에서는 정합성 문제 0건과 주요 장애 0건을 기록했다고 설명한다.
- **주의점:** AI 활용 생산성은 약 2.8~3.4배로 추정하지만 저자도 통제된 실험이 아닌 추정치라고 명시한다. 숫자 자체보다 검증 가능한 작업 경계와 운영 증거를 만든 방식에 초점을 맞춰 읽는 편이 좋다.

## 왜 읽을까

“AI가 레거시를 빠르게 바꿔줬다”는 사례가 아니라, AI가 빠르게 만든 변경을 **어떤 구조로 신뢰할 것인가**가 중심이다. Shadow Traffic, 부작용 차단, 단계별 Gate, 명시적인 완료 조건이 한 흐름으로 연결되어 있어 대규모 리팩터링과 마이그레이션의 검증 설계를 참고하기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 큰 리팩터링이나 데이터·계산 로직 교체의 완료 조건을 Merge가 아니라 기존 동작과의 검증 결과로 정의한다.
- [ ] 부작용 없는 조회·계산 경로부터 old/new 결과를 동시에 실행해 mismatch를 수집할 수 있는지 검토한다.
- [ ] 전환 시 한 번에 전체 트래픽을 바꾸기보다 단계별 Gate와 롤백 조건을 미리 정한다.
- [ ] 성능·정합성·오류율을 함께 기록해 “AI가 빨랐다”가 아니라 실제 운영 증거를 남긴다.

프로젝트 규모상 동일한 Harness 플랫폼을 복제할 필요는 없고, **동작 동등성을 자동 비교하고 결과로 전환 여부를 판단한다**는 원칙만 가져오는 것이 적절하다.

---

**원문:** [Harness Engineering: 29CM Project Mitosis](https://medium.com/@hanjune.lee/harness-engineering-29cm-project-mitosis-6d369b8b18a2)
