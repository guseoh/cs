---
type: tech-article
title: "최적화된 인스턴스 추천을 위한 Rightsizing Recommendations 시스템 개발 여정"
aliases: []
summary: "클라우드 비용 최적화는 자동 다운사이징보다 실제 리소스 사용량과 안전 여유를 바탕으로 담당자가 판단할 수 있게 만드는 문제입니다."
source: "techblog.woowahan.com"
published: 
collected: 2026-08-05
url: "https://techblog.woowahan.com/19685/"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
migration_origin: notion
---

# 최적화된 인스턴스 추천을 위한 Rightsizing Recommendations 시스템 개발 여정

> [!abstract] 한 줄 정리
> 클라우드 비용 최적화는 자동 다운사이징보다 실제 리소스 사용량과 안전 여유를 바탕으로 담당자가 판단할 수 있게 만드는 문제입니다.

> techblog.woowahan.com

## 핵심 내용

운영 인스턴스 가운데 1,000대 이상이 최대 CPU 사용률 30% 미만이라는 데이터를 확인한 뒤 CPU·메모리 사용량과 안전 버퍼로 적절한 AWS 인스턴스를 추천하는 시스템을 만들었습니다. 가장 작은 인스턴스로 자동 축소하지 않고 여러 후보와 예상 절감액을 제공하며, 서비스 담당자가 Slack에서 선택한 결과를 Jira 작업으로 연결합니다.

Rightsizing은 현재 CPU 사용률이 낮다는 이유만으로 가장 싼 인스턴스를 고르는 작업이 아니다. 서비스의 피크 부하·메모리 여유·확장 정책을 보면서 여러 후보의 위험과 절감 효과를 비교해야 한다. 원문은 1,000대 이상의 운영 인스턴스에서 최대 CPU 사용률 30% 미만이라는 관측을 출발점으로 추천 후보를 도출하고, Slack에서 담당자의 선택을 Jira로 연결했다.

| 추천 입력 | 필요한 판단 |
| --- | --- |
| CPU 피크·사용 패턴 | 일시 스파이크를 버틸 여유 |
| 메모리 사용량 | OOM·GC 여유 |
| 인스턴스 종류·크기 | 호환성과 네트워크·스토리지 성능 |
| 예상 절감액 | 실제 운영 비용 |
| 담당자 승인 | 변경·롤백 리스크 |

추천 엔진의 결과와 실제 인스턴스 변경은 다른 책임이다. 운영 환경에서 크기를 줄인 뒤의 지연·에러율·자원 여유를 검증하지 않으면 비용 절감만으로 성공을 판단할 수 없다.

## 왜 읽을까

비용 최적화를 알고리즘 하나로 끝내지 않고 트래픽 급증, 서비스 특성, 예외 처리와 실제 적용 프로세스까지 포함합니다.

---

**원문:** [최적화된 인스턴스 추천을 위한 Rightsizing Recommendations 시스템 개발 여정](https://techblog.woowahan.com/19685/)
