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

## 한눈에 보기

추천 서빙의 모델, 유저 임베딩, 검색 인덱스가 서로 다른 서비스에 저장되어 있다면 각각의 교체가 성공해도 서로 다른 버전의 산출물이 섞일 수 있다. 컬리는 새 세대를 사용자가 보지 않는 곳에서 먼저 준비하고, 검증이 끝난 뒤 활성 세대 포인터만 전환하는 방식을 채택했다. 데이터베이스 하나로 묶을 수 없는 자원에 대해 논리적인 전환 경계를 만드는 사례다.

![추천 ML 파이프라인의 학습 배포 피처 적재 인덱싱과 컷오버](https://helloworld.kurly.com/_astro/04-daily-pipeline.BQ182-iq_Z1JbLwQ.webp)

*그림 1. Argo가 단계별 검증을 통과시키고 마지막 단계에서만 라이브를 전환하는 파이프라인 — [출처: 원문 기술 블로그](https://helloworld.kurly.com/blog/recommend-ml-pipeline)*

![sdm active 포인터가 SageMaker DynamoDB OpenSearch에 연결되는 세대 구조](https://helloworld.kurly.com/_astro/05-cutover.cglInzAI_W5UoS.webp)

*그림 2. 활성 포인터 하나를 통해 서로 다른 저장소의 세대를 함께 선택하는 서빙 경로 — [출처: 원문 기술 블로그](https://helloworld.kurly.com/blog/recommend-ml-pipeline)*

첫 번째 그림에서는 새 모델 배포·피처 적재·검색 색인이 끝나도 컷오버 전까지 현재 세대가 유지된다는 점이 중요하다. 두 번째 그림의 `sdm:active`는 모델 파일 자체가 아니라 어떤 세대의 데이터를 읽을지 결정하는 논리적 경계다. 컷오버가 실패했을 때 직전 세대를 유지하려면 각 산출물의 보존 기한과 복구 가능 상태도 함께 관리해야 한다.

## 핵심 내용

### 문제와 제약

**문제:** SageMaker 추론 모델, DynamoDB 유저 임베딩, OpenSearch 인덱스를 순차 교체하면 서로 다른 세대가 섞여 추천 결과의 정합성이 깨집니다.

### 선택한 구조와 구현

**구조:** Argo가 DAG·재시도·게이트를, SageMaker가 GPU 학습·추론·모델 승인 상태를 담당합니다. 활성 키 `sdm:active`로 세대 전환을 통제합니다.

**접근:** 신규 Variant를 Weight 0으로 준비하고 새 데이터와 인덱스를 생성한 뒤, 검증과 InService 확인을 통과한 경우에만 컷오버합니다.

### 검증 결과와 남은 판단

**트레이드오프:** 직전 세대를 롤백용으로 유지하는 비용이 발생합니다. 오토스케일링 도입 후 상시 인스턴스가 이전의 약 2/3 수준으로 줄었습니다.

**주의점:** UpdateEndpoint가 기존 Fleet도 교체해 지연이 발생할 수 있어 워커 초기화 웜업이 필요했습니다. 자식 Workflow의 제출은 재시도하지 않고 상태 조회만 재시도해 중복 실행을 막았습니다.

### 핵심 근거와 비교

| 자원·단계 | 새로운 세대 준비 | 실제 전환 또는 확인 |
| --- | --- | --- |
| SageMaker 추론 | 신규 Variant를 Weight 0으로 추가 | 서빙 준비 및 `InService`, 웜업 확인 |
| DynamoDB 유저 임베딩 | 세대별 키로 사전 적재 | 활성 모델 세대가 선택한 키 읽기 |
| OpenSearch 인덱스 | 별도의 신규 인덱스 구축 | 활성 세대에 대응한 인덱스 선택 |
| ElastiCache | 이전 `sdm:active` 유지 | 검증 게이트 통과 후 포인터 변경 |

*모델과 데이터의 생명주기는 다르므로 롤백은 포인터만 되돌리는 작업으로 끝나지 않을 수 있다.*

## 왜 읽을까

여러 저장소를 동시에 갱신할 수 없을 때 논리적인 원자성을 어떻게 구성하는지 보여줍니다. 배포 성공과 실제 서비스 활성화, 이전 세대로의 복구를 분리한 설계가 핵심입니다.

**프로젝트에 적용 — PawCycle**

- [ ] 배포 SHA·이미지·DB 스키마의 호환성 경계를 기록합니다.
- [ ] 신규 버전 준비, 헬스 검증, 트래픽 전환, 롤백 단계를 분리합니다.
- [ ] 중복 실행 방지를 위해 생성 작업과 상태 조회 재시도 정책을 다르게 설정합니다.

---

**원문:** [Argo Workflows와 SageMaker로 추천 ML 파이프라인 구축기](https://helloworld.kurly.com/blog/recommend-ml-pipeline)
