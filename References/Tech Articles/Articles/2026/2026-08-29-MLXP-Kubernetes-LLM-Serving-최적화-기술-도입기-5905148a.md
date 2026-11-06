---
type: tech-article
title: "MLXP : Kubernetes LLM Serving 최적화 기술 도입기"
aliases: []
summary: "LLM 서빙 최적화 기술은 단독으로 도입하면 끝나는 기능이 아니라 기존 Kubernetes·Istio·스케줄러·Pod 보호 정책과 충돌할 수 있는 운영 시스템의 일부다."
source: "NAVER D2"
published: 2026-06-11
collected: 2026-08-29
url: "https://d2.naver.com/helloworld/1059238"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
  - "tech/성능"
migration_origin: notion
---

# MLXP : Kubernetes LLM Serving 최적화 기술 도입기

> [!abstract] 한 줄 정리
> LLM 서빙 최적화 기술은 단독으로 도입하면 끝나는 기능이 아니라 기존 Kubernetes·Istio·스케줄러·Pod 보호 정책과 충돌할 수 있는 운영 시스템의 일부다.

> NAVER D2 · 2026-06-11

## 핵심 내용

KV Cache 인지 라우팅, Prefix Cache, 분산 멀티노드 서빙 같은 최신 최적화 기술을 Kubernetes 프로덕션 환경에 적용하자 기존 인프라 스택과 충돌하는 문제가 발생했다. MLXP 위에서 LLM 서빙 최적화 구조를 통합하면서 Istio 서비스 메시, 스케줄러, Pod 보호 정책까지 함께 고려했다.

기능을 개별 최적화로 보지 않고 실제 프로덕션의 라우팅·스케줄링·장애 보호 정책과 맞물려 진단하고, 충돌 지점을 하나씩 조정했다. GPU 사용 효율만 높이는 변경이라도 기존 Pod 생명주기와 disruption 정책을 깨뜨리면 전체 안정성이 낮아질 수 있다. 성능과 운영 안전성을 같은 검증 범위에 넣어야 한다.

KV Cache와 Prefix Cache의 활용은 프롬프트가 같은 부분을 얼마나 공유하는지, 요청이 어느 인스턴스로 라우팅되는지, Pod가 재시작·이동할 때 캐시가 유지되는지와 함께 봐야 한다. GPU만 빠르게 쓰게 만들고 서비스 메시나 스케줄러가 불안정해지면 사용자 관점의 가용성은 악화될 수 있다. Istio 라우팅·PodDisruptionBudget·스케줄링 정책처럼 서빙 외곽의 Kubernetes 제약을 실제 장애 시나리오와 함께 점검해야 한다.

| 개선 목표 | 함께 확인할 운영 제약 |
| --- | --- |
| Prefix Cache 적중 | 인스턴스 분산과 라우팅 정책 |
| KV-aware 라우팅 | Istio·트래픽 장애 우회 |
| 멀티노드 서빙 | 스케줄링·Pod 보호·GPU 사용률 |

## 왜 읽을까

새 기술을 도입할 때 벤치마크 결과만 보는 대신 현재 플랫폼의 전제와 충돌하는 지점을 먼저 찾는 관점을 얻을 수 있다. 특히 플랫폼 레이어가 늘어날수록 좋은 기능 하나가 다른 운영 안전장치를 무효화할 수 있다는 점을 생각하게 한다.

**프로젝트에 적용 — PawCycle**

- [ ] Redis·Queue·멀티 인스턴스 같은 새 기술을 도입할 때 기존 Nginx·배포·헬스체크·장애 복구 정책과의 충돌 항목을 먼저 적는다.
- [ ] 성능 향상 여부와 별개로 장애 시나리오와 롤백 가능 여부를 Acceptance Criteria에 포함한다.
- [ ] 기술 도입 전후에 운영 복잡도가 실제로 얼마나 늘었는지도 함께 기록한다.

---

**원문:** [MLXP : Kubernetes LLM Serving 최적화 기술 도입기](https://d2.naver.com/helloworld/1059238)
