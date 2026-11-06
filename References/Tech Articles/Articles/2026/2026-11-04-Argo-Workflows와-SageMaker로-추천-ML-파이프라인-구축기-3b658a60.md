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

SageMaker 추론 모델, DynamoDB 유저 임베딩, OpenSearch 아이템 인덱스가 서로 다른 서비스에 흩어져 있으면 각각의 배포가 성공해도 서로 다른 세대의 산출물을 함께 읽는 문제가 생긴다. 컬리는 개별 자원의 원자적 갱신을 시도하는 대신 세대별 산출물을 준비한 뒤 활성 포인터 하나를 전환하는 설계를 선택했다.

![세대별 ML 파이프라인 준비와 활성화](https://helloworld.kurly.com/_astro/04-daily-pipeline.BQ182-iq_Z1JbLwQ.webp)

*그림 1. 신규 세대 준비 중에는 라이브를 바꾸지 않는 컷오버 순서 — [출처: 원문 기술 블로그](https://helloworld.kurly.com/blog/recommend-ml-pipeline)*

![ElastiCache 활성 포인터를 기준으로 저장소를 선택하는 구조](https://helloworld.kurly.com/_astro/05-cutover.cglInzAI_W5UoS.webp)

*그림 2. sdm:active가 모델·유저 임베딩·색인의 세대를 함께 결정 — [출처: 원문 기술 블로그](https://helloworld.kurly.com/blog/recommend-ml-pipeline)*

Argo의 CronWorkflow는 학습→배포→피처 적재→검색 색인→컷오버 순서를 실행하며, SageMaker는 GPU 작업과 모델 승인을 담당한다. 새로운 모델은 기존 챔피언과 같은 입력으로 비교해 성공률·오류·벡터 수·지연을 검증한다. 검증에 실패하면 라이브 세대는 유지한다. 신규 SageMaker Variant를 Weight 0으로 준비하고 임베딩·인덱스도 별도 네임스페이스에 적재한 뒤 `sdm:active`를 바꾸는 것이 핵심이다.

| 자원·단계 | 새로운 세대 준비 | 실제 전환 또는 확인 |
| --- | --- | --- |
| SageMaker 추론 | 신규 Variant를 Weight 0으로 추가 | 서빙 준비 및 `InService`, 웜업 확인 |
| DynamoDB 유저 임베딩 | 세대별 키로 사전 적재 | 활성 모델 세대가 선택한 키 읽기 |
| OpenSearch 인덱스 | 별도의 신규 인덱스 구축 | 활성 세대에 대응한 인덱스 선택 |
| ElastiCache | 이전 `sdm:active` 유지 | 검증 게이트 통과 후 포인터 변경 |

*모델과 데이터의 생명주기는 다르므로 롤백은 포인터만 되돌리는 작업으로 끝나지 않을 수 있다.*

`UpdateEndpoint`는 신규 Variant만 추가해도 기존 Fleet을 교체할 수 있어 일시적인 cold start 지연이 발생할 수 있었다. 원문은 TorchServe Worker의 모델 로딩 직후 실제 Forward pass 웜업을 수행해 이를 완화했다. 롤백도 포인터만 되돌리면 되는 것은 아니다. 이전 Variant 용량·`InService` 상태와 임베딩 TTL, 인덱스 보존 기간을 함께 확인해야 한다.

## 왜 읽을까

여러 저장소를 동시에 갱신할 수 없을 때 논리적인 원자성을 어떻게 구성하는지 보여줍니다. 배포 성공과 실제 서비스 활성화, 이전 세대로의 복구를 분리한 설계가 핵심입니다.

**프로젝트에 적용 — PawCycle**

- [ ] 배포 SHA·이미지·DB 스키마의 호환성 경계를 기록합니다.
- [ ] 신규 버전 준비, 헬스 검증, 트래픽 전환, 롤백 단계를 분리합니다.
- [ ] 중복 실행 방지를 위해 생성 작업과 상태 조회 재시도 정책을 다르게 설정합니다.

---

**원문:** [Argo Workflows와 SageMaker로 추천 ML 파이프라인 구축기](https://helloworld.kurly.com/blog/recommend-ml-pipeline)
