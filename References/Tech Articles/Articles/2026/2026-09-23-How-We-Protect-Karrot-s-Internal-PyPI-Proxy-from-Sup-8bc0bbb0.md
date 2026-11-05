---
type: tech-article
title: "How We Protect Karrot’s Internal PyPI Proxy from Supply Chain Attacks"
aliases: []
summary: "패키지 공급망 공격을 개발자 개인 설정으로 막기보다 사내 PyPI 프록시라는 단일 진입점에서 cooldown 정책을 강제해, 보안 정책의 누락 가능성을 구조적으로 줄인 사례다."
source: "당근 기술 블로그"
published: 2026-05-06
collected: 2026-09-23
url: "https://medium.com/daangn/how-we-protect-karrots-internal-pypi-proxy-from-supply-chain-attacks-0cf197205915"
topic: "보안"
categories:
  - "보안"
  - "인프라·DevOps"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/보안"
  - "tech/인프라-DevOps"
migration_origin: notion
---

# How We Protect Karrot’s Internal PyPI Proxy from Supply Chain Attacks

> [!abstract] 한 줄 정리
> 패키지 공급망 공격을 개발자 개인 설정으로 막기보다 사내 PyPI 프록시라는 단일 진입점에서 cooldown 정책을 강제해, 보안 정책의 누락 가능성을 구조적으로 줄인 사례다.

> 당근 기술 블로그 · 2026-05-06

## 핵심 내용

- **문제:** 2026년 3월 LiteLLM PyPI 공급망 공격처럼 악성 버전이 탐지·격리되기 전 짧은 노출 구간에 설치될 수 있다. 글에서 인용한 분석에 따르면 최근 주요 공격 10건 중 8건의 노출 구간이 1주 미만이었고, 14일 cooldown이면 9건을 막을 수 있었다.
- **구조:** AWS CodeArtifact 앞에 얇은 PyPI 프록시를 두어 로컬·CI·Docker 모두 동일한 index URL만 사용하게 했다. 프록시가 CodeArtifact 토큰 수명주기를 책임지고 wheel 같은 큰 바이너리는 8KB 청크로 스트리밍한다.
- **접근:** 클라이언트에는 PEP 503 HTML을 제공하면서, PyPI의 PEP 691 JSON에서 `upload-time`을 읽어 cooldown 대상 파일을 판정하고 HTML 링크에서 제거한다.
- **운영:** CodeArtifact 토큰은 15분으로 짧게 발급하고 만료 5분 전에 갱신하며 ±60초 jitter를 둔다. `/health`는 프로세스 생존이 아니라 현재 토큰 유효성까지 검사해 연속 갱신 실패 시 503을 반환한다.
- **트레이드오프:** cooldown은 신규 악성 패키지 노출을 줄이지만 긴급 보안 패치도 늦출 수 있고 기존 악성 패키지는 잡지 못한다. 그래서 예외 목록과 dependency audit 같은 다른 방어층이 필요하다.

## 왜 읽을까

공급망 보안을 “개발자가 설정을 잘 지켜야 한다”는 규칙으로 두지 않고, 모든 패키지 요청이 지나는 경계에서 정책을 강제하는 설계가 좋다. 보안뿐 아니라 인증·관측·정책 집행에서 단일 진입점을 만드는 이유를 구체적으로 볼 수 있다.

**프로젝트에 적용 — DevPedia**

- [ ] GitHub Actions와 Docker 빌드에서 외부 의존성을 가져오는 경로와 자격증명 노출 지점을 정리한다.
- [ ] Dependabot 같은 업데이트 자동화와 dependency audit를 CI 검증에 포함할지 점검한다.
- [ ] 민감한 정책을 개발자 로컬 설정에 맡기기보다 CI나 공통 빌드 경계에서 강제할 수 있는 항목을 찾는다.

---

**원문:** [How We Protect Karrot’s Internal PyPI Proxy from Supply Chain Attacks](https://medium.com/daangn/how-we-protect-karrots-internal-pypi-proxy-from-supply-chain-attacks-0cf197205915)
