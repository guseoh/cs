---
type: tech-article
title: "Flava MCP Hub가 걸어온 길: AI 시대를 위한 배관 공사"
aliases: []
summary: "사내 MCP 서버가 늘면서 중복 인증 구현, 불분명한 소유권, 사용 현황 부재가 플랫폼 문제로 바뀌었다. Connector·Gateway·권한·모니터링을 분리해 도구 연결을 표준화하고 운영 제어권을 확보한 사례다."
source: "LY Corporation 기술 블로그 · 박민혁, 강인배"
published: 2026-10-26
collected: 2026-10-27
url: "https://techblog.lycorp.co.jp/ko/flava-mcp-hub-ai-infrastructure"
topic: "설계·아키텍처"
categories:
  - "설계·아키텍처"
  - "보안"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/설계-아키텍처"
  - "tech/보안"
migration_origin: notion
---

# Flava MCP Hub가 걸어온 길: AI 시대를 위한 배관 공사

> [!abstract] 한 줄 정리
> 사내 MCP 서버가 늘면서 중복 인증 구현, 불분명한 소유권, 사용 현황 부재가 플랫폼 문제로 바뀌었다. Connector·Gateway·권한·모니터링을 분리해 도구 연결을 표준화하고 운영 제어권을 확보한 사례다.

> LY Corporation 기술 블로그 · 박민혁, 강인배 · 2026-10-26

## 핵심 내용

- **문제:** 팀마다 MCP 서버와 OIDC 콜백·토큰 캐시·갱신을 중복 구현했고, 어떤 도구가 어디에 존재하는지나 사용량을 한눈에 확인하기 어려웠다. MCP 클라이언트의 표준 연결 방식과 사내 사전 등록형 IAM 인증 사이에도 Protocol Gap이 있었다.
- **구조:** 4층 모델로 Connection(Connector의 stdio·OIDC 처리), Proxy(Gateway의 전송·헤더·CORS 표준화), Authorization(OAuth/OIDC 토큰 검증), Monitoring(도구 호출·인증·지연 추적)을 분리했다. 카탈로그·런타임·Gateway가 서버 검색, 배포, 접근 통제를 담당한다.
- **트레이드오프:** 초기 2개월 개발 일정에서는 오픈소스 Gateway로 빠르게 시작했으나, Rust/Go 스택 차이, ES512 키가 포함된 JWKS 파싱 실패, CORS와 인증 미들웨어 순서 문제, OOM, fork 패치 부담을 겪었다. 이후 Go 기반 자체 Gateway로 전환해 운영 제어권을 높였다.
- **수치:** 운영 기준 MCP 서버 650개 이상, 사용 팀 200팀 이상, 누적 도구 호출 1,150만 건 이상이다. 서버 연결은 1분 이내, 인증이 포함된 신규 서버 배포는 5분 이내라고 보고했다. 인증 준비는 기존 내부 추정 약 1주일에서 약 5분으로 단축됐다.
- **결과:** 공통 인증과 운영 처리를 통합하면서 도구 호출 경로가 사용량·소유권·우선순위를 판단하는 관측 지점이 됐다. 향후 OpenAPI-to-MCP와 ID-JAG는 계획 단계로 소개되며 현재 완료 기능과 구분해야 한다.

## 왜 읽을까

플랫폼은 공통 코드를 모아 놓는 것만으로 완성되지 않는다. 조직의 인증 경계, 프로토콜 호환성, 소유권, 장애 대응 역량을 함께 설계해야 한다는 판단 기준을 제공한다.

오픈소스 채택과 자체 구현 중 어느 쪽이 항상 정답인 것이 아니라, 팀 역량과 운영 요구가 바뀌면 결정도 재평가해야 함을 보여준다.

**프로젝트에 적용 — PawCycle**

- [ ] Codex나 연결 도구가 접근할 수 있는 로컬·운영 리소스를 목록화하고 읽기/쓰기 권한을 구분한다.
- [ ] 운영 데이터 접근은 최소 권한으로 제한하고 토큰 저장·갱신·만료 및 로그 노출 위험을 점검한다.
- [ ] 도구 연결을 추가할 때 호출 기록, 실패 원인, 변경 승인 경로를 남기도록 작업 기준을 정한다.

---

**원문:** [Flava MCP Hub가 걸어온 길: AI 시대를 위한 배관 공사](https://techblog.lycorp.co.jp/ko/flava-mcp-hub-ai-infrastructure)
