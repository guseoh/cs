---
type: tech-article
title: "핀테크그룹의 GraphQL 기반 BFF와 프론트엔드 활용기"
aliases: []
summary: "BFF는 클라이언트 복잡도를 줄이지만 캐시와 식별자 규칙을 잘못 모델링하면 새로운 데이터 오류를 만들 수 있습니다."
source: "helloworld.kurly.com"
published: 
collected: 2026-08-04
url: "https://helloworld.kurly.com/blog/fintech-bff-introduction/"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# 핀테크그룹의 GraphQL 기반 BFF와 프론트엔드 활용기

> [!abstract] 한 줄 정리
> BFF는 클라이언트 복잡도를 줄이지만 캐시와 식별자 규칙을 잘못 모델링하면 새로운 데이터 오류를 만들 수 있습니다.

> helloworld.kurly.com

## 핵심 내용

여러 백엔드 API가 흩어지면서 프론트엔드가 데이터 조합, 인증 정책, CORS와 스펙 변경을 직접 감당하게 된 문제를 GraphQL BFF로 완화한 사례입니다. BFF가 여러 서비스 데이터를 단일 스키마로 조합하고 코드 생성으로 프론트엔드 타입을 동기화했습니다. 운영 중 Apollo Client가 기본 `__typename:id`를 캐시 식별자로 사용해 실제로는 복합 키가 필요한 서로 다른 데이터가 병합되는 오류를 겪었고 `id`, `idType`, `kycSeq`를 조합하도록 키를 재정의했습니다.

## 왜 읽을까

GraphQL의 장점뿐 아니라 캐시가 도메인 식별자 규칙을 잘못 이해할 때 정상 응답도 잘못 표시될 수 있다는 실패 사례가 좋습니다.

---

**원문:** [핀테크그룹의 GraphQL 기반 BFF와 프론트엔드 활용기](https://helloworld.kurly.com/blog/fintech-bff-introduction/)
