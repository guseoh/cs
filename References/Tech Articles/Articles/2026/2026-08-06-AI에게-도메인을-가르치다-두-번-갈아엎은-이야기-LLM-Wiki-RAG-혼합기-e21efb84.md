---
type: tech-article
title: "AI에게 도메인을 가르치다 두 번 갈아엎은 이야기 — LLM Wiki + RAG 혼합기"
aliases: []
summary: "RAG 검색 품질은 벡터 DB를 붙이는 것으로 해결되지 않으며, 의미 검색과 정확한 키워드 검색의 역할을 나눠야 합니다."
source: "helloworld.kurly.com"
published: 
collected: 2026-08-06
url: "https://helloworld.kurly.com/blog/2026-delivery-domain-rag"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
migration_origin: notion
---

# AI에게 도메인을 가르치다 두 번 갈아엎은 이야기 — LLM Wiki + RAG 혼합기

> [!abstract] 한 줄 정리
> RAG 검색 품질은 벡터 DB를 붙이는 것으로 해결되지 않으며, 의미 검색과 정확한 키워드 검색의 역할을 나눠야 합니다.

> helloworld.kurly.com

## 핵심 내용

도메인 문서를 AI가 활용하게 하기 위해 수동 역색인, 본문 임베딩, 요약 임베딩+전문 검색까지 세 차례 구조를 바꿨습니다. 문서가 약 100개로 늘자 모든 문서를 컨텍스트에 넣는 방식은 토큰 비용과 누락을 만들었고 필요한 1~2개만 찾는 구조로 전환했습니다. 본문 전체 임베딩은 여러 주제가 한 벡터에 섞이고 약어·식별자 검색이 약해지는 문제가 있어, 한 문서 한 주제, 요약 임베딩, SQLite FTS5 조합으로 역할을 분리했습니다.

## 왜 읽을까

벡터 검색 성공담보다 실패한 방식과 개선 이유가 명확합니다. LLM과 전통 검색, 사람의 문서 구조화가 각각 맡아야 할 역할을 생각하게 합니다.

---

**원문:** [AI에게 도메인을 가르치다 두 번 갈아엎은 이야기 — LLM Wiki + RAG 혼합기](https://helloworld.kurly.com/blog/2026-delivery-domain-rag)
