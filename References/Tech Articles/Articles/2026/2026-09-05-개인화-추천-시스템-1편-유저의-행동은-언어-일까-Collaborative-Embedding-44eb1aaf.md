---
type: tech-article
title: "개인화 추천 시스템 1편 - 유저의 행동은 “언어”일까? : Collaborative Embedding 구축기 (feat. Knowledge Distillation)"
aliases: []
summary: "추천 모델의 가치는 오프라인 정확도만으로 판단하지 않고 실제 사용자 행동과 비즈니스 지표까지 이어서 검증해야 한다. 컬리는 인기 편향과 쉬운 Negative 문제를 보정한 뒤 Ablation Study와 50:50 A/B 테스트로 효과를 단계적으로 확인했다."
source: "컬리 기술 블로그"
published: 2025-11-26
collected: 2026-09-05
url: "https://helloworld.kurly.com/blog/personalized-recommendation-v1/"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
  - "테스트"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
  - "tech/테스트"
migration_origin: notion
---

# 개인화 추천 시스템 1편 - 유저의 행동은 “언어”일까? : Collaborative Embedding 구축기 (feat. Knowledge Distillation)

> [!abstract] 한 줄 정리
> 추천 모델의 가치는 오프라인 정확도만으로 판단하지 않고 실제 사용자 행동과 비즈니스 지표까지 이어서 검증해야 한다. 컬리는 인기 편향과 쉬운 Negative 문제를 보정한 뒤 Ablation Study와 50:50 A/B 테스트로 효과를 단계적으로 확인했다.

> 컬리 기술 블로그 · 2025-11-26

## 핵심 내용

- **문제:** 상품 콘텐츠 유사성만으로는 사용자의 복합적인 구매 취향을 충분히 표현하기 어렵고, 롱테일 데이터에서는 인기 상품 쪽으로 추천이 쏠리기 쉽다.
- **접근:** 사용자 행동 시퀀스를 Transformer 기반 Collaborative Embedding으로 표현하고, 인기 상품 과대표현은 빈도 역가중 샘플링으로 완화했다. 같은 카테고리 상품 등을 Hard Negative로 사용해 쉬운 분류 문제에 머무르지 않게 했다.
- **구조:** 무거운 Teacher의 순위 정보를 Knowledge Distillation으로 가벼운 Retrieval Head에 전달하고, 각 기법의 기여도는 Ablation Study로 분리해 확인했다.
- **수치:** Knowledge Distillation 적용 모델은 베이스라인 대비 HR@10이 약 66% 상승해 Teacher의 약 80% 수준에 접근했다. 1주간 50:50 온라인 A/B 테스트에서는 세일 지면 ATC +32.2%, ARPU +44.9%, 다른 가격 지면에서는 ATC +138.7%, ARPU +140.1%를 기록했다.
- **결과:** CRM 실험에서도 기존 룰 기반 개인화 대비 CTR이 약 55.6% 증가해, 오프라인 지표 개선이 실제 사용자 반응으로 이어지는지 별도로 확인했다.

## 왜 읽을까

추천 시스템의 모델 구조보다 더 중요한 실험 순서를 볼 수 있다. 오프라인 지표 → Ablation → 온라인 A/B → CRM이라는 단계가 있어 ‘모델 점수가 올랐으니 성공’이라는 함정을 피하고, 개선이 실제 제품 지표에 연결되는지 확인한다.

**프로젝트에 적용 — FutMatch**

- [ ] 추천·매칭 고도화 전 룰 기반 기준선을 먼저 만들고 비교 가능한 성공 지표를 정의한다.
- [ ] 후보 추천 정확도만 보지 않고 신청률, 실제 참여율, 취소율처럼 최종 행동 지표까지 연결해 측정한다.
- [ ] 여러 개선을 한꺼번에 넣지 않고 각각의 기여도를 분리할 수 있는 실험을 설계한다.

---

**원문:** [개인화 추천 시스템 1편 - 유저의 행동은 “언어”일까? : Collaborative Embedding 구축기 (feat. Knowledge Distillation)](https://helloworld.kurly.com/blog/personalized-recommendation-v1/)
