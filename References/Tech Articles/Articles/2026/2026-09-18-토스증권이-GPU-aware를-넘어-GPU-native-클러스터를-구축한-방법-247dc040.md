---
type: tech-article
title: "토스증권이 GPU-aware를 넘어 GPU-native 클러스터를 구축한 방법"
aliases: []
summary: "GPU를 쿠버네티스에 할당할 수 있다는 것과 실제 서비스에 안전하게 투입할 수 있다는 것은 다르다. 운영 가능한 플랫폼은 장치 내부 상태, 검증 기준, 장애 신호까지 별도의 계약으로 만들어야 한다."
source: "Toss Tech"
published: 2026-09-15
collected: 2026-09-18
url: "https://toss.tech/article/53143"
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

# 토스증권이 GPU-aware를 넘어 GPU-native 클러스터를 구축한 방법

> [!abstract] 한 줄 정리
> GPU를 쿠버네티스에 할당할 수 있다는 것과 실제 서비스에 안전하게 투입할 수 있다는 것은 다르다. 운영 가능한 플랫폼은 장치 내부 상태, 검증 기준, 장애 신호까지 별도의 계약으로 만들어야 한다.

> Toss Tech · 2026-09-15

## 핵심 내용

- **문제:** `Node Ready=True`와 `Pod Running`만으로 개별 GPU의 `ERR!`, Xid 오류, VRAM 상태까지 정상이라고 판단할 수 없었다.
- **접근:** 드라이버·Container Toolkit·Device Plugin·CUDA readiness를 별도로 측정하고, `nvidia-smi` 출력과 치명적 Xid, 실제 PCI GPU 수와 쿠버네티스 노출 수까지 함께 검증했다.
- **주의점:** 실제 H100 노드에서 GPU 한 장이 `ERR!`였지만 `nvidia-smi` 자체는 exit 0을 반환해 기본 validator가 정상으로 판정했다. 성공 코드 하나가 운영상 정상 상태를 보장하지 않았다.
- **구조:** 신규·복구 노드는 OS/커널/드라이버/CUDA 정합성, GPU burn-in, 쿠버네티스 편입, CUDA 연산, 작은 LLM 서빙까지 통과해야 `preflight=passed`가 붙고 스케줄 대상이 된다.

## 왜 읽을까

인프라에서 중요한 건 자원을 '보이게 만드는 것'보다 서비스가 의존할 수 있는 상태를 정의하는 일이라는 점을 잘 보여준다. readiness를 단순 헬스체크가 아니라 운영 계약으로 설계하는 관점을 얻기 좋다.

**프로젝트에 적용 — PawCycle**

- [ ] 배포 시 `프로세스 실행 중`과 `실제 요청 처리 가능`을 구분해 readiness 기준을 정의한다.
- [ ] DB·Redis·외부 의존성이 붙는다면 단순 포트 오픈이 아니라 실제 서비스 경로가 준비됐는지 검증한다.
- [ ] 장애 대응 지표는 수집 가능한 메트릭 수보다 운영자가 답해야 하는 질문을 기준으로 선정한다.

---

**원문:** [토스증권이 GPU-aware를 넘어 GPU-native 클러스터를 구축한 방법](https://toss.tech/article/53143)
