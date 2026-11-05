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

- **문제:** Job 전용 Node Group을 고정 크기로 운영하자 한산할 때는 비용이 낭비되고, 작업이 몰릴 때는 시작이 지연됐다. 실행 중 Job이 있는 노드는 Scale-in하기 어렵다는 제약도 있었다.
- **접근:** 별도 스케줄러 대신 PodAffinity로 Job을 소수 노드에 모으는 Bin-packing 효과를 만들고, Karpenter의 `do-not-disrupt` 같은 보호 설정으로 실행 중 Job의 강제 종료를 막았다.
- **주의점:** Production에서 Job이 정시마다 몰리자 kubelet 과부하, Image Pull 실패, EBS Volume Throttling, CNI IP 할당 지연이 드러났다. Right-sizing만 기대하지 않고 노드의 `maxPods`를 60으로 제한해 과도한 밀집을 막았다.
- **수치:** 오토스케일링 뒤 workflow Pod 평균 Pending은 1.54초에서 0.78초로 약 49% 감소했고 Running은 138초에서 72.6초로 약 47% 줄었다. 반면 Image Pull은 job 3→7.972초, job-arm 16→29.76초로 증가했다.
- **트레이드오프:** 노드 생성·삭제가 잦아지면 로컬 이미지 캐시가 줄어 Image Pull 비용이 커진다. 전체 지표가 모두 좋아지는 것이 아니라 핵심 목표와 부작용을 함께 측정해야 한다.

## 왜 읽을까

오토스케일링을 CPU 임계값 하나의 문제가 아니라 워크로드 생명주기와 스케줄링·노드 내부 병목의 상호작용으로 볼 수 있다. Alpha에서 성공한 설정이 Production의 burst 패턴에서 다른 병목을 만든 과정도 실전적이다.

**프로젝트에 적용 — PawCycle**

- [ ] 배치나 장시간 작업을 운영할 때 중단·재시작 비용과 안전한 종료 조건을 먼저 정의한다.
- [ ] 부하 테스트에서 평균 CPU뿐 아니라 pending, 실행시간, connection·I/O 대기와 순간 burst를 함께 관찰한다.
- [ ] 자원 최적화 전후에 좋아진 지표와 악화된 지표를 함께 남겨 트레이드오프를 Evidence로 기록한다.

---

**원문:** [Job 워크로드를 위한 EKS Node Group 오토스케일링 도입기](https://medium.com/daangn/job-%EC%9B%8C%ED%81%AC%EB%A1%9C%EB%93%9C%EB%A5%BC-%EC%9C%84%ED%95%9C-eks-node-group-%EC%98%A4%ED%86%A0%EC%8A%A4%EC%BC%80%EC%9D%BC%EB%A7%81-%EB%8F%84%EC%9E%85%EA%B8%B0-a6a28376d153)
