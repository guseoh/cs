---
type: tech-article
title: "임베딩 안정화로 검색 리랭킹의 콜드 스타트 문제를 해결하다: LINE Part Time Jobs 적용 사례"
aliases: []
summary: "재학습할 때마다 좌표계가 바뀌는 2-tower 임베딩을 모델 자체를 바꾸지 않고 후처리로 정렬해, 학습·서빙 간 불일치와 검색 리랭킹의 콜드 스타트 문제를 완화한 사례다."
source: "LY Corporation Tech Blog"
published: 2026-06-26
collected: 2026-08-24
url: "https://techblog.lycorp.co.jp/ko/techverse2026-62"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
  - "성능"
projects:
  - "FutMatch"
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
  - "tech/성능"
migration_origin: notion
---

# 임베딩 안정화로 검색 리랭킹의 콜드 스타트 문제를 해결하다: LINE Part Time Jobs 적용 사례

> [!abstract] 한 줄 정리
> 재학습할 때마다 좌표계가 바뀌는 2-tower 임베딩을 모델 자체를 바꾸지 않고 후처리로 정렬해, 학습·서빙 간 불일치와 검색 리랭킹의 콜드 스타트 문제를 완화한 사례다.

> LY Corporation Tech Blog · 2026-06-26

## 핵심 내용

- **문제:** LINE Part Time Jobs는 월초에 구인 공고 대부분이 교체돼 신규 아이템이 급증하고, 2-tower 모델을 랜덤 초기값에서 재학습할 때마다 임베딩 공간도 달라져 충분한 리랭킹 학습 데이터가 쌓이기 전까지 성능이 떨어졌다.
- **접근:** 매일 생성한 임베딩을 직전의 안정화 임베딩 공간에 맞추기 위해 Low-rank SVD와 Orthogonal Procrustes를 사용한 후처리를 만들고 Spark 파이프라인으로 구현했다.
- **수치:** 안정화 후 임베딩 유사도는 1주 뒤 약 0.88, 한 달 뒤에도 약 0.87 수준을 유지했다.
- **결과:** 안정화 임베딩 사용 시 conversion nDCG는 약 9.0%, click nDCG는 약 4.5% 개선됐다. 온라인 A/B에서는 검색 페이지 KPI의 유의한 개선은 없었지만 전체 서비스 KPI는 4.7%, 매출은 6.5% 증가했다.
- **트레이드오프:** 기존 2-tower 모델을 수정하지 않고 후처리 단계에서 공간을 정렬해 기존 학습·서빙 파이프라인에 미치는 영향을 최소화했다.

## 왜 읽을까

모델을 다시 만드는 대신 모델과 다운스트림 시스템 사이의 인터페이스를 안정화해 문제를 해결한다는 점이 흥미롭다. 변화 비용을 낮추면서 계약을 안정시키는 방식은 AI 시스템이 아니어도 설계 문제에 응용할 수 있다.

또 오프라인 nDCG, 검색 화면 KPI, 서비스 전체 KPI가 서로 같은 결과를 내지 않았다는 점이 중요하다. 한 단계의 지표 개선을 전체 서비스 성과로 곧바로 해석하면 안 된다는 좋은 사례다.

**프로젝트에 적용 — FutMatch**

- [ ] 추후 매칭·추천을 도입한다면 모델과 입력 특징·임베딩 버전을 분리해 추적한다.
- [ ] 학습 시점과 실제 서빙 시점의 표현이 호환되는지 회귀 검증 항목을 둔다.
- [ ] 랭킹 지표뿐 아니라 신청·참여 같은 최종 사용자 행동 지표까지 함께 평가한다.

---

**원문:** [임베딩 안정화로 검색 리랭킹의 콜드 스타트 문제를 해결하다: LINE Part Time Jobs 적용 사례](https://techblog.lycorp.co.jp/ko/techverse2026-62)
