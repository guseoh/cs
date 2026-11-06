---
type: tech-article
title: "토스가 다양한 ML 모델을 만드는 법: Feature Store & Trainkit"
aliases: []
summary: "ML 모델 운영에서 가장 어려운 부분은 모델 코드보다 학습·서빙 데이터의 일관성과 반복 가능한 파이프라인입니다. 토스는 Feature Store와 Trainkit으로 Feature 재사용, Training-Serving skew, Point-In-Time 조인을 플랫폼 레벨에서 해결했습니다."
source: "Toss Tech"
published: 2025-08-14
collected: 2026-08-18
url: "https://toss.tech/article/feature-store-trainkit"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "AI·개발도구"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/AI-개발도구"
migration_origin: notion
---

# 토스가 다양한 ML 모델을 만드는 법: Feature Store & Trainkit

> [!abstract] 한 줄 정리
> ML 모델 운영에서 가장 어려운 부분은 모델 코드보다 학습·서빙 데이터의 일관성과 반복 가능한 파이프라인입니다. 토스는 Feature Store와 Trainkit으로 Feature 재사용, Training-Serving skew, Point-In-Time 조인을 플랫폼 레벨에서 해결했습니다.

> Toss Tech · 2025-08-14

## 핵심 내용

모델마다 Feature 생성·데이터 로딩·전처리 로직을 따로 구현하면서 중복 코드, 재현성 저하, 학습과 온라인 서빙의 데이터 불일치가 발생했습니다. Feature Store는 오프라인 저장소와 온라인 저장소, Feature Serving API, 메타데이터·품질·권한 관리를 묶고, Trainkit은 학습 파이프라인의 데이터 로딩·전처리·조인을 표준화합니다.

토스는 기존 오픈소스를 그대로 쓰기보다 현재 데이터 소스와 운영 요구에 맞춰 자체 플랫폼을 구축했습니다. Online Storage에는 대용량 저지연 서빙을 위해 Aerospike를 사용합니다. Training-Serving skew를 막기 위해 Target 기준으로 시간 파티션을 Shift하고, 과거 시점의 정확한 Feature를 결합하기 위해 PIT 조인을 지원합니다. 이는 미래 데이터가 학습에 섞이는 Data Leakage를 막기 위한 장치입니다.

PIT 조인 예시에서 데이터를 미리 결합하면 42개 단위가 필요하지만 런타임 조인 방식은 12개 단위로 줄어, Feature가 많아질수록 메모리 중복을 크게 줄일 수 있음을 보여줍니다.

Feature Store의 핵심은 Feature를 중앙에 저장한다는 사실보다 **같은 Feature 정의를 학습과 실시간 추론에서 재사용하는 계약**이다. 온라인 서빙에 빠른 값을 둬도 학습 시점에 미래의 데이터를 참조하면 모델의 오프라인 평가가 실제 성능보다 좋아 보일 수 있다. 그래서 PIT(Point-in-Time) 조인과 시간 Shift를 적용해 Target이 발생했을 때 알 수 있던 정보만 결합한다.

| 경계 | 보호하는 것 |
| --- | --- |
| Feature 정의·메타데이터 | 중복 구현과 의미 차이 |
| 오프라인/온라인 저장소 | 학습·서빙 일관성 |
| PIT 조인 | 미래 데이터 누수 방지 |
| Trainkit 파이프라인 | 조인·전처리의 재현 가능성 |

원문의 42개 단위 → 12개 단위 비교는 특정 PIT 조인 방식의 메모리 구성 예시이며 일반적인 성능 배수는 아니다.

## 왜 읽을까

'플랫폼화'가 단순 공통 라이브러리 제작이 아니라 반복되는 오류와 일관성 문제를 중앙에서 해결하는 것이라는 점을 볼 수 있습니다. 데이터의 스키마·시점·권한까지 계약으로 관리하는 사고는 ML이 아니어도 백엔드 데이터 파이프라인 설계에 적용할 수 있습니다.

**프로젝트에 적용 — FutMatch**

향후 추천·매칭 점수나 사용자 행동 기반 기능을 실험한다면, 모델 선택보다 먼저 학습 시점의 데이터와 실제 서빙 시점의 데이터가 같은 의미를 가지는지 검증하는 기준을 두는 것이 좋습니다. 기능이 작을 때는 별도 Feature Store가 필요 없더라도 `Feature 정의 / 생성 시점 / 데이터 출처 / 서빙 시점`을 명시해두면 이후 확장이 쉬워집니다.

---

**원문:** [토스가 다양한 ML 모델을 만드는 법: Feature Store & Trainkit](https://toss.tech/article/feature-store-trainkit)
