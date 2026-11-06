---
type: tech-article
title: "장애 Alert의 원인을 스스로 찾다: SRE Observer 개발기"
aliases: []
summary: "AIOps의 핵심은 LLM에게 장애 판단을 전부 맡기는 것이 아니라, 여러 관측 신호를 근거로 묶고 확신할 수 없는 경우 ‘모른다’고 말하게 하며 실제 복구 작업에는 승인 경계를 두는 것이다."
source: "LY Corporation Tech Blog"
published: 2026-09-04
collected: 2026-09-06
url: "https://techblog.lycorp.co.jp/ko/building-sre-observer-for-alert-root-cause-analysis"
topic: "장애·운영"
categories:
  - "장애·운영"
  - "AI·개발도구"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/장애-운영"
  - "tech/AI-개발도구"
migration_origin: notion
---

# 장애 Alert의 원인을 스스로 찾다: SRE Observer 개발기

> [!abstract] 한 줄 정리
> AIOps의 핵심은 LLM에게 장애 판단을 전부 맡기는 것이 아니라, 여러 관측 신호를 근거로 묶고 확신할 수 없는 경우 ‘모른다’고 말하게 하며 실제 복구 작업에는 승인 경계를 두는 것이다.

> LY Corporation Tech Blog · 2026-09-04

## 핵심 내용

메트릭·로그·트레이스·프로파일은 이미 수집되고 있었지만, 하나의 장애가 여러 Alert로 쪼개지고 신호를 연결해 RCA를 수행하는 과정은 사람의 머릿속에 남아 있었다. Alert를 Temporal·Topology·Semantic 세 축으로 비교해 하나의 Incident로 묶고, 의미 유사성과 서비스 의존 관계를 시간 근접성보다 더 강한 신호로 사용한다.

AI 분석은 가설 기반 RCA를 수행하되 직접 근거가 부족하면 높은 신뢰도를 허용하지 않고, 확정할 수 없는 원인은 추정 상태로 남긴다. 로그가 아직 수집되지 않은 경우에도 근거 없이 그럴듯한 원인을 확정하지 않는다. Slack 알림·에스컬레이션 같은 1차 대응은 자동 실행하지만, Pod 재시작·롤백처럼 시스템 상태를 바꾸는 2차 대응은 Approval Gate 뒤에 둔다.

도입 후 초기 Alert 노이즈의 85~95%를 실시간 차단했고 평균 장애 식별 시간(MTTR)을 50% 단축했다.

서로 비슷한 시간에 발생한 Alert가 항상 동일한 장애를 뜻하지는 않는다. 서비스 의존성과 의미 유사성까지 함께 고려해야 관련 없는 장애를 무리하게 한 Incident로 합치는 오류를 줄일 수 있다. 또한 로그 수집 지연을 실제 원인 부재로 잘못 해석하면 안 되므로 신뢰도를 근거의 가용성과 분리해서 표시해야 한다.

| 실행 범위 | 자동화 수준 | 보호 장치 |
| --- | --- | --- |
| Alert 그룹화·근거 수집 | 자동 | 시간·Topology·Semantic 비교 |
| Slack 전달·에스컬레이션 | 자동 | 분석 근거와 불확실성 표시 |
| Pod 재시작·롤백 | 승인 후 실행 | Approval Gate |

원문 수치는 **초기 Alert 노이즈 85~95% 감소, 평균 장애 식별 시간 50% 단축**으로 보고되어 있다. 이를 장애 복구 전체 소요 시간의 동일한 개선이라고 확대 해석해서는 안 된다.

## 왜 읽을까

Observability 데이터를 많이 모으는 것과 장애 원인을 빠르게 찾는 것은 다른 문제라는 점을 잘 보여준다. 특히 LLM에 더 많은 자율성을 주는 대신 근거 수준, 신뢰도, 승인 가능한 행동 범위를 구조적으로 제한한 설계가 운영 자동화의 현실적인 기준이 된다.

**프로젝트에 적용 — PawCycle**

- [ ] 장애 실험에서 메트릭·로그·트레이스를 각각 남기는 데서 끝내지 않고 같은 Incident로 연결할 공통 식별자와 시간축을 만든다.
- [ ] 자동 장애 분석을 붙일 경우 ‘근거 없음/검증 불가’를 정상 결과로 허용하고 원인 링크를 함께 남긴다.
- [ ] 알림·요약은 자동화해도 재시작·롤백·스케일 조정 같은 변경 작업은 별도 승인 경계로 둔다.

---

**원문:** [장애 Alert의 원인을 스스로 찾다: SRE Observer 개발기](https://techblog.lycorp.co.jp/ko/building-sre-observer-for-alert-root-cause-analysis)
