---
type: tech-article
title: "Android 앱의 의도치 않은 변경 방지하기"
aliases: []
summary: "테스트는 입력·출력뿐 아니라 의존성이나 구성 결과의 의도치 않은 변경을 Baseline과 비교해 방어하는 데도 사용할 수 있습니다."
source: "d2.naver.com"
published: 
collected: 2026-08-11
url: "https://d2.naver.com/helloworld/3431313"
topic: "테스트"
categories:
  - "테스트"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/테스트"
migration_origin: notion
---

# Android 앱의 의도치 않은 변경 방지하기

> [!abstract] 한 줄 정리
> 테스트는 입력·출력뿐 아니라 의존성이나 구성 결과의 의도치 않은 변경을 Baseline과 비교해 방어하는 데도 사용할 수 있습니다.

> d2.naver.com

## 핵심 내용

Android 의존성을 업데이트할 때 `AndroidManifest`에 예상하지 못한 변경이 들어오는 문제를 사람이 눈으로 비교하는 대신 Baseline 기준으로 자동 감지하는 Manifest Shield를 구축한 사례입니다. 핵심은 변경을 막는 것이 아니라 `우리가 의도한 변경인가`를 자동으로 확인할 기준선을 만드는 것입니다.

## 왜 읽을까

회귀 검증의 범위를 비즈니스 로직에서 빌드·설정·의존성 결과까지 넓혀 생각하게 합니다.

---

**원문:** [Android 앱의 의도치 않은 변경 방지하기](https://d2.naver.com/helloworld/3431313)
