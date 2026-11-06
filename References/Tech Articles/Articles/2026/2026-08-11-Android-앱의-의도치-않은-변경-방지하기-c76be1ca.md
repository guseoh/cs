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

AndroidManifest는 개발자가 직접 수정하지 않았어도 라이브러리 갱신과 Manifest Merge 과정에서 권한·컴포넌트 설정이 달라질 수 있다. 따라서 소스의 의도와 최종 빌드 아티팩트의 상태를 분리해 봐야 한다. Manifest Shield는 최종 결과와 Baseline을 비교해 변경 자체를 무조건 실패시키기보다 검토해야 하는 차이를 드러내는 장치다.

| 검증 대상 | 필요한 판단 |
| --- | --- |
| Permission 추가·삭제 | 앱의 권한 표면이 달라졌는가? |
| Component 선언 | 외부에 노출되는 진입점이 바뀌는가? |
| 라이브러리 업데이트 | 직접 수정 없이 병합 결과가 달라졌는가? |
| Baseline 변경 | 합의된 의도적 변경인가? |

변경을 허용할 때에는 Baseline 업데이트의 리뷰 근거를 남겨야 다음 업데이트에서 같은 변경이 다시 미확인 상태로 돌아가지 않는다.

## 왜 읽을까

회귀 검증의 범위를 비즈니스 로직에서 빌드·설정·의존성 결과까지 넓혀 생각하게 합니다.

---

**원문:** [Android 앱의 의도치 않은 변경 방지하기](https://d2.naver.com/helloworld/3431313)
