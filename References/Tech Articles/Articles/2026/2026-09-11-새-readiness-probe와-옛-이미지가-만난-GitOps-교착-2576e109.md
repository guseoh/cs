---
type: tech-article
title: "새 readiness probe와 옛 이미지가 만난 GitOps 교착"
aliases: []
summary: "Git 소스와 컨테이너 이미지가 서로 다른 정본을 가리키면서 새 readiness probe와 옛 이미지가 결합해 배포가 교착된 사례로, GitOps의 완료 기준은 ‘Sync 성공’이 아니라 실제 실행 artifact까지 이어지는 chain 검증이어야 함을 보여준다."
source: "홍성주의 개발 노트"
published: 2026-07-18
collected: 2026-09-11
url: "https://seongju.vercel.app/writing/gitops-stale-image-readiness/"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
  - "tech/장애-운영"
migration_origin: notion
---

# 새 readiness probe와 옛 이미지가 만난 GitOps 교착

> [!abstract] 한 줄 정리
> Git 소스와 컨테이너 이미지가 서로 다른 정본을 가리키면서 새 readiness probe와 옛 이미지가 결합해 배포가 교착된 사례로, GitOps의 완료 기준은 ‘Sync 성공’이 아니라 실제 실행 artifact까지 이어지는 chain 검증이어야 함을 보여준다.

> 홍성주의 개발 노트 · 2026-07-18

## 핵심 내용

- **문제:** GitHub repository owner 변경 후 Git URL은 redirect로 새 저장소를 정상 fetch했지만 Image Updater의 GHCR owner는 옛 값을 계속 가리켰다. 새 chart의 `/ready` probe가 오래된 image에 적용되면서 replacement Pod가 404로 계속 NotReady가 됐다.
- **구조:** Git source는 redirect 덕분에 최신 상태였지만 registry 좌표는 별도 식별자였다. Git과 OCI image를 같은 이동 규칙으로 생각한 결과 source revision과 실제 배포 artifact의 정본이 갈라졌다.
- **접근:** version-controlled Application manifest의 repository URL과 image-list owner를 교정하고, 새 SHA가 registry와 Git value에 모두 존재하는지 확인한 뒤 이미 성공할 수 없어진 과거 Argo operation만 최소 범위로 종료했다. Application이나 Deployment를 통째로 삭제하지 않았다.
- **결과:** RollingUpdate가 기존 Ready Pod를 유지해 외부 서비스 중단 없이 복구했다. 최종 확인은 정확한 image SHA, Pod 1/1 Ready·restart 0, Argo Synced/Healthy, `/health`·`/ready` 200, 인증 실패/정상 응답까지 연결해 수행했다.
- **주의점:** controller 화면의 정상 상태만으로 배포 성공을 판단하면 source와 artifact 사이의 불일치를 놓칠 수 있다. source revision → selected image → live digest → readiness를 하나의 검증 chain으로 봐야 한다.

## 왜 읽을까

GitOps 장애를 ‘Argo가 이상하다’고 뭉뚱그리지 않고 각 시스템이 무엇을 정본으로 보고 있는지 분해해 원인을 좁히는 과정이 좋다. 특히 복구 전에 새 artifact의 존재와 정합성을 먼저 증명하고, 최소한의 상태만 변경하는 운영 태도를 참고할 만하다.

**프로젝트에 적용 — PawCycle**

- [ ] 배포 Evidence에 Git SHA뿐 아니라 실제 실행 중인 container image digest/SHA를 함께 남긴다.
- [ ] readiness 변경 시 현재 배포 image에도 해당 endpoint가 실제 존재하는지 rollout 전에 검증한다.
- [ ] GitOps 장애 복구는 전체 리소스 삭제보다 source revision → registry artifact → live Pod 순으로 정본을 대조한 뒤 최소 변경으로 수행한다.

---

**원문:** [새 readiness probe와 옛 이미지가 만난 GitOps 교착](https://seongju.vercel.app/writing/gitops-stale-image-readiness/)
