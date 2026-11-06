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

29CM의 Django 레거시를 Spring Boot·도메인별 DB로 이전할 때 전체 1,333개 API를 코드 그대로 옮기는 것은 실제 운영 효용과 비용이 맞지 않았다. 팀은 운영 사용량으로 이관 대상 295개 API를 선택했고 도메인 간 직접 DB 참조 427곳도 계약 경계로 정리해야 했다. AI를 통한 이관 속도보다 이전과 같은 사용자 동작을 보장할 수 있는 검증 장치를 먼저 마련했다.

 ```mermaid
flowchart LR
 A[Django 운영 요청] --> B[기존 서비스 정상 처리]
 A --> C[Shadow 1→5→10% 복제]
 C --> D[Spring Boot 실행·부작용 차단]
 B --> E[응답·Intent Log 비교]
 D --> E
 E --> F{Match Rate 99.9%+?}
 F -- 충족 --> G[점진 전환 승인]
 F -- 실패 --> H[차이 조사·회귀 테스트]
```

*원문 근거를 바탕으로 자체 재구성한 가로형 학습 도식이다.*

구 Django 서비스 요청의 1~10%를 신규 Spring Boot의 Shadow 경로에 복제하되, Write·Cache·Kafka 발행 같은 부작용은 차단했다. 두 응답과 Intent Log를 비교해 데이터·업무 판단이 일치하는지 확인하고 Match Rate 99.9% 이상을 승인 기준으로 두었다. 노출 비율을 1→5→10%로 높이며 각 24시간, 마지막에는 72시간 검증했으므로 단순 테스트 통과보다 실제 입력 분포를 관찰할 수 있었다.

| 검증 조건 | 설정·관측 | 실제 의미 |
| --- | --- | --- |
| 이관 API | 1,333개 중 295개 | 실제 사용량 기반 범위 |
| 직접 DB 의존 | 427곳 | 도메인 분리의 위험 |
| Shadow | 1/5/10%, 각 24시간+72시간 | 실입력 비교 |
| Match Rate | 99.9% 이상 | 응답·업무 의도 일치 |
| DB 전환 | 목표 30초, 실제 약 4초 | 절차 검증 결과 |
| AI 생산성 | 추정 2.8~3.4배 | 통제 실험 아님 |

이 Harness는 JPA N+1, Celery에서 Spring으로 바뀌며 달라진 트랜잭션·재시도 동작, 쿠폰 계산 오류를 발견했다. DB 전환 중단 목표는 30초 이하였고 실제 약 4초였으며, 원문은 정합성 문제·주요 장애 0건을 보고했다. AI 생산성 약 2.8~3.4배는 통제 실험이 아닌 저자의 추정치임을 구분해야 한다.

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
