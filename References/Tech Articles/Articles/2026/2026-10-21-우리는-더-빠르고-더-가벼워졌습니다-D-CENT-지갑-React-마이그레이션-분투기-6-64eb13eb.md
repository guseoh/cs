---
type: tech-article
title: "🪶우리는 더 빠르고, 더 가벼워졌습니다 — D’CENT 지갑 React 마이그레이션 분투기 #6"
aliases: []
summary: "Vue 2.7에서 React 19로 전환하며 프레임워크뿐 아니라 번들, CI, 상태 관리, 테스트를 함께 재설계했다. 성능 수치와 검증 범위를 나란히 보여 주어 ‘더 빠른 빌드’와 ‘더 안전한 변경’을 구별하게 한다."
source: "IOTRUST 팀 블로그 · 박민수"
published: 2026-05-04
collected: 2026-10-21
url: "https://medium.com/iotrustlab/%EC%9A%B0%EB%A6%AC%EB%8A%94-%EB%8D%94-%EB%B9%A0%EB%A5%B4%EA%B3%A0-%EB%8D%94-%EA%B0%80%EB%B2%BC%EC%9B%8C%EC%A1%8C%EC%8A%B5%EB%8B%88%EB%8B%A4-dcent-%EC%A7%80%EA%B0%91-react-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-%EB%B6%84%ED%88%AC%EA%B8%B0-6-fb38f984137c"
topic: "리팩터링"
categories:
  - "리팩터링"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/리팩터링"
  - "tech/성능"
migration_origin: notion
---

# 🪶우리는 더 빠르고, 더 가벼워졌습니다 — D’CENT 지갑 React 마이그레이션 분투기 #6

> [!abstract] 한 줄 정리
> Vue 2.7에서 React 19로 전환하며 프레임워크뿐 아니라 번들, CI, 상태 관리, 테스트를 함께 재설계했다. 성능 수치와 검증 범위를 나란히 보여 주어 ‘더 빠른 빌드’와 ‘더 안전한 변경’을 구별하게 한다.

> IOTRUST 팀 블로그 · 박민수 · 2026-05-04

## 핵심 내용

- **수치:** 프로덕션 번들은 전체 크기 19%, Gzip 전송 크기 42% 감소했다. CSS는 93개 파일·796KB에서 2개 파일·134KB로 줄어 약 83% 감소했다.
- **접근:** 지원 브라우저 상향에 맞춰 레거시 폴리필을 제거하고 압축을 CDN으로 넘겼다. 같은 GitHub Actions 러너에서 프로덕션 빌드 시간은 53% 줄고 배포 시간은 약 1/7이 됐다.
- **구조:** PR에서는 변경 파일 lint, 변경·의존 패키지 타입 검사, 변경 패키지 테스트를 수행한다. main에서는 전체 검사를 실행하고 pnpm store·Turborepo 캐시 및 중복 CI 취소를 활용했다.
- **트레이드오프:** 기존 Vue CI는 평균 2.4분이지만 lint 위주였고, React CI는 평균 7.7분이 걸리는 대신 lint·type-check·test를 수행했다. 단순 소요 시간 비교만으로 CI 품질을 평가하면 안 된다.
- **결과:** UI 상태는 Zustand, 서버 상태는 TanStack Query로 분리했고, 기존 12개 테스트에서 346개 테스트와 356개 Storybook 스토리로 검증·문서화 범위를 넓혔다.

## 왜 읽을까

프레임워크 전환의 성과를 번들·빌드·배포 수치로 검증하면서도, CI의 수행 범위가 달라졌다는 비교 조건을 숨기지 않는다. 모노레포 전환과 상태 책임 분리가 왜 개발 생산성에 영향을 주는지도 함께 살펴볼 수 있다.

**프로젝트에 적용 — PawCycle**

- [ ] 기존 프런트엔드의 번들 크기, 압축 후 전송량, 빌드·배포 시간을 먼저 측정한다.
- [ ] 클라이언트 UI 상태와 서버 API 캐시의 책임이 섞인 부분이 있는지 확인한다.
- [ ] CI 시간을 줄이기 전에 현재 lint·type-check·test의 실제 검증 범위를 기록한다.

---

**원문:** [🪶우리는 더 빠르고, 더 가벼워졌습니다 — D’CENT 지갑 React 마이그레이션 분투기 #6](https://medium.com/iotrustlab/%EC%9A%B0%EB%A6%AC%EB%8A%94-%EB%8D%94-%EB%B9%A0%EB%A5%B4%EA%B3%A0-%EB%8D%94-%EA%B0%80%EB%B2%BC%EC%9B%8C%EC%A1%8C%EC%8A%B5%EB%8B%88%EB%8B%A4-dcent-%EC%A7%80%EA%B0%91-react-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-%EB%B6%84%ED%88%AC%EA%B8%B0-6-fb38f984137c)
