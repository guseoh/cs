---
type: tech-article
title: "Playwright와 Jira로 만드는 스마트 장애/변경 알림 및 관리 시스템"
aliases: []
summary: "E2E 테스트를 일회성 QA가 아닌 운영 모니터링으로 확장하고, 실패 감지부터 알림·티켓·복구 이력까지 연결하면 장애 대응의 누락을 줄일 수 있다."
source: "LY Corporation Tech Blog · 이동원"
published: 2024-10-28
collected: 2026-10-26
url: "https://techblog.lycorp.co.jp/ko/smart-monitoring-system-with-playwright-and-jira"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "테스트"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/테스트"
migration_origin: notion
---

# Playwright와 Jira로 만드는 스마트 장애/변경 알림 및 관리 시스템

> [!abstract] 한 줄 정리
> E2E 테스트를 일회성 QA가 아닌 운영 모니터링으로 확장하고, 실패 감지부터 알림·티켓·복구 이력까지 연결하면 장애 대응의 누락을 줄일 수 있다.

> LY Corporation Tech Blog · 이동원 · 2024-10-28

## 핵심 내용

- **문제:** 외부 TTS에 의존해 시나리오 등록·변경 시 협의 비용이 들고, 장애 감지·티켓·알림을 직접 통제하기 어려웠다. 분석한 장애 중 상위 5건은 대응에 1시간 넘게 걸렸다.
- **접근:** 기존 TTS 기능을 분석하고 Playwright로 E2E 시나리오를 PoC 검증한 뒤, Jira의 장애 티켓과 Slack 알림을 연계했다.
- **구조:** Playwright 테스트는 쿠버네티스 환경에서 1분 간격으로 실행하고, 서비스 코드별 기존 티켓 존재 여부를 확인해 중복 발행을 피한다. 정상 복구 시 티켓을 자동 완료하고 Slack에 복구 시간을 기록한다.
- **주의점:** 일시적인 실패가 곧 장애는 아니므로 재시도 후 연속 실패 조건과 거짓 경보(false positive) 감소를 별도로 튜닝했다. 테스트용 인증 세션·시나리오·공통 연동 코드를 분리했다.
- **결과:** 새 서비스는 E2E 시나리오를 추가해 공통 모니터링 구조에 연결할 수 있게 됐다. 정확한 장애 복구 시간 단축률은 원문에 제시되지 않았다.

## 왜 읽을까

테스트와 운영을 별개의 활동으로 보지 않고, 사용자가 실제로 이용하는 핵심 경로를 지속적으로 확인하는 구조를 배울 수 있다. 특히 경보 중복, 오탐, 자동 복구를 처리하지 않으면 모니터링 자체가 운영 부담이 된다는 판단이 중요하다.

**프로젝트에 적용 — PawCycle**

- [ ] 상품 목록 조회 → 상세 조회 → 장바구니 진입 같은 핵심 사용자 경로를 운영과 분리된 테스트 계정으로 E2E 점검한다.
- [ ] 실패가 발생하면 즉시 장애 확정하지 않고 재시도·연속 실패 기준을 정의한다.
- [ ] 감지 시간, 원인 조사, 복구 시간을 한 기록으로 연결하고 중복 알림 방지 여부를 확인한다.

---

**원문:** [Playwright와 Jira로 만드는 스마트 장애/변경 알림 및 관리 시스템](https://techblog.lycorp.co.jp/ko/smart-monitoring-system-with-playwright-and-jira)
