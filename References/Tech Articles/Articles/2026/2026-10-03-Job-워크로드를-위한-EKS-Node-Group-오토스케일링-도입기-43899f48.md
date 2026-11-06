---
type: tech-article
title: "Job 워크로드를 위한 EKS Node Group 오토스케일링 도입기"
aliases: []
summary: "중단하기 어려운 장시간 Job에 오토스케일링을 적용하려면 단순히 노드를 자동 증감하는 것으로 끝나지 않는다. 스케줄링 밀집도와 강제 종료 방지, 노드당 Pod 상한, 이미지·스토리지·네트워크 병목까지 함께 설계하고 재측정해야 한다."
source: "당근 기술 블로그"
published: 2026-04-16
collected: 2026-10-03
url: "https://medium.com/daangn/job-%EC%9B%8C%ED%81%AC%EB%A1%9C%EB%93%9C%EB%A5%BC-%EC%9C%84%ED%95%9C-eks-node-group-%EC%98%A4%ED%86%A0%EC%8A%A4%EC%BC%80%EC%9D%BC%EB%A7%81-%EB%8F%84%EC%9E%85%EA%B8%B0-a6a28376d153"
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

# Job 워크로드를 위한 EKS Node Group 오토스케일링 도입기

> [!abstract] 한 줄 정리
> 중단하기 어려운 장시간 Job에 오토스케일링을 적용하려면 단순히 노드를 자동 증감하는 것으로 끝나지 않는다. 스케줄링 밀집도와 강제 종료 방지, 노드당 Pod 상한, 이미지·스토리지·네트워크 병목까지 함께 설계하고 재측정해야 한다.

> 당근 기술 블로그 · 2026-04-16

## 핵심 내용

Kubernetes Job을 실행할 전용 Node Group을 고정 크기로 운영하면 평상시에는 유휴 서버 비용이 생기고 작업이 몰리는 시간에는 예약된 노드가 부족해 Pod 시작이 늦어진다. 반대로 무작정 오토스케일링해 빈 노드를 없애면 다음 Job 시작 때 이미지 다운로드와 Volume 연결 지연을 감수해야 한다.

당근은 Job을 소수 노드에 모으는 PodAffinity로 Bin-packing 경향을 만들고 Karpenter의 `do-not-disrupt` 보호로 실행 중인 Job이 강제로 축출되지 않도록 했다. 그러나 일정 시각에 다수 Job이 몰릴 때 Pod를 지나치게 한 노드에 채우면 Kubelet 과부하, EBS Volume Throttling, CNI IP 할당 지연이 생겼다. 노드의 `maxPods`를 60으로 제한하고 Node Group과 워크로드별 Image Pull·Pending·Running 시간을 나누어 측정했다.

| 구간 | 이전 | 이후 | 변화 방향 |
| --- | ---: | ---: | --- |
| 평균 Pending | 1.54초 | 0.78초 | 개선 |
| 평균 Running | 138초 | 72.6초 | 개선 |
| Image Pull (job) | 3초 | 7.972초 | 악화 |
| Image Pull (job-arm) | 16초 | 29.76초 | 악화 |

*노드 축소가 이미지 캐시를 버리는 영향이 있기에 Pod 전체 생명주기로 성과를 측정해야 한다.*

workflow Pod 평균 Pending은 1.54초→0.78초, Running은 138초→72.6초로 줄었지만 이미지 다운로드는 job에서 3→7.972초, job-arm에서 16→29.76초로 늘었다. 전체 처리 시간을 줄여도 모든 단계가 동시에 개선되지 않는다는 것이 핵심이다. Job의 중단 불가능성·노드 축소 조건·이미지 캐시 손실을 함께 고려한 최종 비용 모델이 필요하다.

## 왜 읽을까

오토스케일링을 CPU 임계값 하나의 문제가 아니라 워크로드 생명주기와 스케줄링·노드 내부 병목의 상호작용으로 볼 수 있다. Alpha에서 성공한 설정이 Production의 burst 패턴에서 다른 병목을 만든 과정도 실전적이다.

**프로젝트에 적용 — PawCycle**

- [ ] 배치나 장시간 작업을 운영할 때 중단·재시작 비용과 안전한 종료 조건을 먼저 정의한다.
- [ ] 부하 테스트에서 평균 CPU뿐 아니라 pending, 실행시간, connection·I/O 대기와 순간 burst를 함께 관찰한다.
- [ ] 자원 최적화 전후에 좋아진 지표와 악화된 지표를 함께 남겨 트레이드오프를 Evidence로 기록한다.

---

**원문:** [Job 워크로드를 위한 EKS Node Group 오토스케일링 도입기](https://medium.com/daangn/job-%EC%9B%8C%ED%81%AC%EB%A1%9C%EB%93%9C%EB%A5%BC-%EC%9C%84%ED%95%9C-eks-node-group-%EC%98%A4%ED%86%A0%EC%8A%A4%EC%BC%80%EC%9D%BC%EB%A7%81-%EB%8F%84%EC%9E%85%EA%B8%B0-a6a28376d153)
