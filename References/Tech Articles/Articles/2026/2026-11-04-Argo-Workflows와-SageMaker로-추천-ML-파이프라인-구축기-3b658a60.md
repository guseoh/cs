---
type: tech-article
title: "Argo Workflows와 SageMaker로 추천 ML 파이프라인 구축기"
aliases: []
summary: "서로 다른 저장소의 모델·임베딩·검색 인덱스를 하나의 DB 트랜잭션으로 묶는 대신, 버전별 세대를 준비하고 활성 포인터 하나로 전환합니다."
source: "컬리 기술 블로그 · 유성규"
published: 2026-11-03
collected: 2026-11-04
url: "https://helloworld.kurly.com/blog/recommend-ml-pipeline"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "인프라·DevOps"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/인프라-DevOps"
migration_origin: notion
---

# Argo Workflows와 SageMaker로 추천 ML 파이프라인 구축기

> [!abstract] 한 줄 정리
> 서로 다른 저장소의 모델·임베딩·검색 인덱스를 하나의 DB 트랜잭션으로 묶는 대신, 버전별 세대를 준비하고 활성 포인터 하나로 전환합니다.

> 컬리 기술 블로그 · 유성규 · 2026-11-03

## 핵심 내용

- **문제:** SageMaker 추론 모델, DynamoDB 유저 임베딩, OpenSearch 인덱스를 순차 교체하면 서로 다른 세대가 섞여 추천 결과의 정합성이 깨집니다.
- **구조:** Argo가 DAG·재시도·게이트를, SageMaker가 GPU 학습·추론·모델 승인 상태를 담당합니다. 활성 키 `sdm:active`로 세대 전환을 통제합니다.
- **접근:** 신규 Variant를 Weight 0으로 준비하고 새 데이터와 인덱스를 생성한 뒤, 검증과 InService 확인을 통과한 경우에만 컷오버합니다.
- **트레이드오프:** 직전 세대를 롤백용으로 유지하는 비용이 발생합니다. 오토스케일링 도입 후 상시 인스턴스가 이전의 약 2/3 수준으로 줄었습니다.
- **주의점:** UpdateEndpoint가 기존 Fleet도 교체해 지연이 발생할 수 있어 워커 초기화 웜업이 필요했습니다. 자식 Workflow의 제출은 재시도하지 않고 상태 조회만 재시도해 중복 실행을 막았습니다.

## 왜 읽을까

여러 저장소를 동시에 갱신할 수 없을 때 논리적인 원자성을 어떻게 구성하는지 보여줍니다. 배포 성공과 실제 서비스 활성화, 이전 세대로의 복구를 분리한 설계가 핵심입니다.

**프로젝트에 적용 — PawCycle**

- [ ] 배포 SHA·이미지·DB 스키마의 호환성 경계를 기록합니다.
- [ ] 신규 버전 준비, 헬스 검증, 트래픽 전환, 롤백 단계를 분리합니다.
- [ ] 중복 실행 방지를 위해 생성 작업과 상태 조회 재시도 정책을 다르게 설정합니다.

---

**원문:** [Argo Workflows와 SageMaker로 추천 ML 파이프라인 구축기](https://helloworld.kurly.com/blog/recommend-ml-pipeline)
