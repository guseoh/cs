---
type: tech-article
title: "Next.js 트러블슈팅: CORS와 Version Skew 에러 원인부터 해결까지"
aliases: []
summary: "배포 중 발생하는 오류는 단일 설정 문제가 아니라 브라우저 캐시, CDN, SSR, 서로 다른 애플리케이션 버전이 만나는 전체 요청 흐름을 봐야 풀립니다."
source: "tech.kakaopay.com"
published: 
collected: 2026-07-25
url: "https://tech.kakaopay.com/post/nextjs-troubleshooting-cors-version-skew/"
topic: "장애·운영"
categories:
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
migration_origin: notion
---

# Next.js 트러블슈팅: CORS와 Version Skew 에러 원인부터 해결까지

> [!abstract] 한 줄 정리
> 배포 중 발생하는 오류는 단일 설정 문제가 아니라 브라우저 캐시, CDN, SSR, 서로 다른 애플리케이션 버전이 만나는 전체 요청 흐름을 봐야 풀립니다.

> tech.kakaopay.com

## 핵심 내용

SSR 리소스 요청에서 Origin/Vary와 캐시 동작이 맞물려 CORS 문제가 발생한 원인을 추적하고 `crossOrigin: anonymous` 같은 대응을 검토합니다. 이후 Canary·rolling 배포 중 서로 다른 BUILD\_ID의 서버가 공존하면서 정적 리소스 404와 Version Skew가 생기는 문제까지 이어집니다.

sticky session만으로 모든 skew를 막을 수 없고, 새로고침이 발생해도 사용자 상태가 안전하게 복구되는 구조가 필요하다는 점이 중요합니다.

CORS와 Version Skew는 둘 다 브라우저에서 리소스 오류처럼 보이지만 발생하는 경계가 다르다. CORS는 Origin·응답 헤더·캐시 정책이 서로 맞지 않아 브라우저가 리소스를 막는 문제이고, Version Skew는 서로 다른 Build ID의 HTML과 JS가 롤링 배포 중 섞여 **존재하지 않는 자산**을 요청하는 문제다. 하나의 설정으로 두 문제를 동시에 해결하려고 하면 원인을 잘못 찾기 쉽다.

| 장애 유형 | 원인 범위 | 확인할 항목 |
| --- | --- | --- |
| CORS | Origin, `Vary`, 프록시·CDN 캐시 | 응답 헤더·요청 Origin |
| 정적 자산 404 | 서로 다른 `BUILD_ID` | HTML/JS 생성 버전 |
| Canary 중 세션 이동 | 여러 배포 버전 공존 | 자산 보존·호환 기간 |
| 새로고침 후 상태 분실 | 앱 상태·복구 경로 | 세션·폼 복원 정책 |

Sticky Session은 요청을 같은 서버에 붙일 수 있지만 모든 CDN 자산과 이미 열린 탭의 버전 일관성까지 자동 보장하지는 않는다.

## 왜 읽을까

프론트 장애처럼 보이는 현상이 CDN·배포 전략·서버 버전 공존 문제와 연결되는 과정을 따라가기 좋습니다.

**프로젝트에 적용**

**PawCycle** — blue/green 또는 rolling 배포를 도입할 때 API·정적 리소스의 하위 호환성과 새로고침 후 상태 복구를 실제 배포 검증 항목에 포함할 수 있습니다.

---

**원문:** [Next.js 트러블슈팅: CORS와 Version Skew 에러 원인부터 해결까지](https://tech.kakaopay.com/post/nextjs-troubleshooting-cors-version-skew/)
