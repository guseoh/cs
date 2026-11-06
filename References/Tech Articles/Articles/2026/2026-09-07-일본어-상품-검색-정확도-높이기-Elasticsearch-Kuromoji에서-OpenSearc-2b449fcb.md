---
type: tech-article
title: "일본어 상품 검색 정확도 높이기: Elasticsearch + Kuromoji에서 OpenSearch + Sudachi로"
aliases: []
summary: "검색 품질 문제를 사용자 사전 추가로 계속 봉합하지 않고, 형태소 분석기·정규화·색인 필드·쿼리 전략을 도메인에 맞게 다시 설계했다. 검색 엔진 교체 자체보다 데이터 특성과 인덱스 비용을 함께 본 점이 핵심이다."
source: "LY Corporation Tech Blog"
published: 2026-08-21
collected: 2026-09-07
url: "https://techblog.lycorp.co.jp/ko/japanese-search-kuromoji-to-sudachi"
topic: "DB·데이터"
categories:
  - "DB·데이터"
  - "리팩터링"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/DB-데이터"
  - "tech/리팩터링"
migration_origin: notion
---

# 일본어 상품 검색 정확도 높이기: Elasticsearch + Kuromoji에서 OpenSearch + Sudachi로

> [!abstract] 한 줄 정리
> 검색 품질 문제를 사용자 사전 추가로 계속 봉합하지 않고, 형태소 분석기·정규화·색인 필드·쿼리 전략을 도메인에 맞게 다시 설계했다. 검색 엔진 교체 자체보다 데이터 특성과 인덱스 비용을 함께 본 점이 핵심이다.

> LY Corporation Tech Blog · 2026-08-21

## 핵심 내용

Elasticsearch 7.10.2 + Kuromoji 기본 설정에서는 복합어가 과도하게 분해되고 오래된 IPADIC 사전 때문에 신조어·고유명사 검색이 누락됐다. 모델 번호와 전각·반각 구분자 혼용도 검색 불일치를 만들었다. Elasticsearch 일몰 시점과 맞춰 OpenSearch 2.15.0 + Sudachi로 전환했다. 당시 Sudachi CI 지원 범위는 2.6~2.14였지만 실제 호환성을 검증했고, 이후 공식 지원도 2.19까지 확대됐다.

약 8억 건 상품 인덱스와 약 1억 건 카탈로그 인덱스에 동일한 analyzer를 기계적으로 적용하지 않았다. 모델 번호용 `compact`, 자동완성용 `edge`, 완전 일치용 `keyword` 등 Multi-field를 목적별로 분리했다. Edge N-gram은 접두사 토큰을 대량 생성하므로 8억 건 상품 인덱스에는 적용하지 않고 상대적으로 작고 정제된 1억 건 카탈로그 인덱스에만 적용했다. 기능 추가가 인덱스 크기·segment merge·Kafka 처리 지연으로 이어질 수 있기 때문이다.

형태소 분석기로 해결할 수 없는 영숫자 모델 번호는 별도 정규화와 whitespace tokenizer로 처리하고, 짧은 일본어 검색에는 `compact`를 활성화하지 않아 recall 향상이 노이즈 증가로 바뀌는 것을 막았다.

| 검색 목적 | 처리 방식 | 주의할 비용 |
| --- | --- | --- |
| 제품 모델 번호 | 정규화 + `compact` 필드 | 기호·전각/반각 차이 |
| 자동완성 | `edge` 필드 | 접두 토큰 증가와 인덱스 부담 |
| 정확한 문자열 비교 | `keyword` 필드 | 형태소 분해로 인한 오탐 방지 |

여기서 성능과 정확도는 하나의 analyzer만 잘 고르는 문제가 아니다. 상품 인덱스와 카탈로그 인덱스의 크기 차이 때문에 같은 자동완성 설계도 서로 다른 운영 비용을 낳는다. 형태소 분석의 정확도와 재색인·segment merge·유입 지연까지 한 묶음으로 평가한 결정이다.

## 왜 읽을까

검색 정확도를 단순히 analyzer 하나를 바꾸는 문제로 보지 않고 **입력 데이터의 형태, 인덱스 규모, 검색 시나리오, 운영 비용**을 하나의 설계 문제로 다룬다. 대용량 데이터에서 기능 하나가 저장 공간과 색인 지연으로 번지는 과정도 확인하기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 상품 검색 문제가 생기면 먼저 실제 검색 실패 예시를 수집하고 tokenizer/analyzer 결과를 재현한다.
- [ ] 상품명·모델명·카테고리처럼 데이터 특성이 다른 필드를 한 검색 전략에 억지로 맞추지 않는다.
- [ ] 자동완성이나 n-gram을 도입하기 전에 인덱스 크기와 색인 처리량 변화를 측정한다.
- [ ] 검색 품질 개선은 `정확도 향상`과 함께 조회 지연·색인 비용·운영 복잡도를 같이 기록한다.

---

**원문:** [일본어 상품 검색 정확도 높이기: Elasticsearch + Kuromoji에서 OpenSearch + Sudachi로](https://techblog.lycorp.co.jp/ko/japanese-search-kuromoji-to-sudachi)
