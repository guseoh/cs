# PawCycle GitHub PR·Issue 전수 조사대장 — 2026-11-03

이 문서는 PawCycle의 **최초 GitHub 기록부터 현재까지 모든 결정·대안·트레이드오프·운영/성능 결과를 소급 복원하기 위한 출처 확인 대장**입니다. 이 파일은 결정 그 자체가 아니며 모든 PR마다 별도의 Decision을 만들겠다는 뜻도 아닙니다. 작은 기술 결정도 원본과 후속 구현에 연결해 빠짐없이 수집하되, 중복 구현 수정은 기존 결정과 연결합니다.

## 범위 스냅샷

- 저장소 생성: 2026-07-02.
- GitHub 번호: **#1–#500 전부** (Issue/PR 공통 번호 체계), PR **367개**, Issue **133개**.
- 분류: PR Merged **342**, Closed/Unmerged **21**, Open **4**; Issue Closed **118**, Open **15**.
- 첫 PR: [#1](https://github.com/guseoh/pawcycle-commerce/pull/1); 첫 별도 Issue: [#88](https://github.com/guseoh/pawcycle-commerce/issues/88).
- 이후 추가 목록: [#501](501-600.md) 1건을 2026-11-03 확인했습니다. 현재 목록 총 **501건**(원래 500 + 신규 PR 1), 상세 완료 **80**, 미완료 **421**입니다. 원래 스냅샷의 상태 집계는 당시 값으로 보존하며 현재 상태 전수 갱신으로 간주하지 않습니다.

## 번호 범위별 원본 대장

- [#001–100](001-100.md) — 2026-07 초창기 제품·아키텍처·Harness·인증·성능·AWS 배포에서 첫 Issue까지
- [#101–200](101-200.md) — MVP2/3, Observability, AWS SRE/DB, 성능 기준선
- [#201–300](201-300.md) — Phase 10, MVP4/Catalog/UX, AWS→OCI 전환
- [#301–400](301-400.md) — OCI 성능 실험, Backend V2, 동시성/수평 구조 개선
- [#401–500](401-500.md) — Backend Closure, 실제 OCI Host Pull CD, 결제 복구, UI 및 Wiki Harness

- [#501 이후 추가 목록](501-600.md) — 새 원본 metadata, 상세 심사는 앞 번호부터 순차 진행
- [#011–020 상세 처리](batch-011-020.md) — 요구·대안·승인·실패·검증·후속 연결
- [#021–030 상세 처리](batch-021-030.md) — scaffold/CI→계획/후보→좁은 승인→인증 제안
- [#031–040 상세 처리](batch-031-040.md) / [모든 변경파일·SHA·CI 목록](batch-031-040.sources.json) — 승인→구현→QA 조건과 알림 신뢰 경계
- [기계 판독 재개점](progress.json), [7월 사건 연대기](../../journal/pawcycle/2026-07.md)

## 전수 조사 프로토콜

1. **번호 오름차순 원본 확인:** PR body+전체 diff+주요 review/commit, Issue body+결정/종료 댓글+연결 PR. 보류·미병합·대체된 원본도 제외하지 않습니다.
2. **결정 원자 단위 추출:** 무엇을 왜 선택했는지, 검토·기각·보류한 대안, 요구사항·제약, 사용자 승인/미승인, 예상 결과/실제 비용, 당시 코드/DB/운영 경계를 분리합니다. 하나의 PR에 여러 선택이 있으면 여러 결정 후보로 분해합니다.
3. **시간축 연결:** 최초 Proposed/Approved input → Implementation PR → CI/실측/장애 → Correction → KEEP/DEFER/REJECT/SUPERSEDED 및 최신 main 코드의 일치/불일치. 후속 설계가 과거 선택을 지웠다고 보지 않습니다.
4. **결과 형태:** 승인된 결정은 `Wiki/decisions/PWC-*.md`, 장애·실패·실험 교훈은 `Wiki/lessons/PWL-*.md`; 실행 사건·중간 상태는 `Wiki/history/`와 기존 Journals를 사용합니다. **결정마다 반드시 원본 URL/승인·검증 범위/불확정 사항을 포함**합니다.
5. **상태 판정:** 미조사 / 검토중 / 판단·승인 불명 / 기록 완료(Decision 또는 기존 기록 참조) / 독립 기록 불필요(근거·설명) 등을 구별합니다. 전체 종료는 각 원본의 판정과 생성된 결정의 원본 역링크가 맞고, 중복·누락 검토까지 통과해야 가능합니다.
6. **실행 경계:** 읽기/소급 정리만 하고 PawCycle 코드·Issue/PR·Cloud·DB·비용·Secret 변경 금지. 중앙 Wiki Draft PR에서 리뷰·검증하고 사용자 별도 승인 전까지 병합하지 않습니다.

## 최신 번호순 상세 판정 — 2026-11-04

- **#1~#80: 원본별 상세 판정 완료(80/501)**. 각 배치의 source 본문·전체 comment/review·commit·변경파일·CI와 판정을 아래 링크에서 추적한다. 완료는 원본 처리 결과가 있다는 뜻이며 모든 운영/승인 불확실성이 해소됐다는 뜻은 아니다.
- **#81~#501: 421건 미완료**. #81부터 번호순으로 이어간다. 기존 선별 인벤토리가 있어도 생략하지 않는다.
- 신규 [PWC-0034](../../decisions/PWC-0034.md)는 한국어/보조 AI 리뷰 운영, [PWC-0035](../../decisions/PWC-0035.md)~[PWC-0038](../../decisions/PWC-0038.md)는 ARCH/DATA/API/AUTH의 **Proposed** 제안입니다. [PWL-0011](../../lessons/PWL-0011.md)은 리뷰 후에도 남은 본문/handoff 불일치입니다.
- 초기 Harness와 제품 범위는 [PWC-0028](../../decisions/PWC-0028.md)·[PWC-0003](../../decisions/PWC-0003.md)에 연결했습니다. 후속 DOMAIN-001 설계는 [PWC-0033](../../decisions/PWC-0033.md), 협업 알림 false-green과 HTTP 403·본문 인코딩 문제는 [PWL-0010](../../lessons/PWL-0010.md)에 보존합니다. [PR #2](https://github.com/guseoh/pawcycle-commerce/pull/2)의 Obsidian 기록 실패 수정은 [PWL-0009](../../lessons/PWL-0009.md)에 별도로 보존합니다. PR #1의 fixture에 적힌 예시 PR 번호/이벤트는 실제 수행 증거가 아닙니다.
- 이 대장은 **개별 원본이 어떤 결정을 지원하는지 또는 왜 별도 Decision이 불필요한지** 모두 추적합니다. 한 PR에 다수 판단이 있으면 분해하고, 문서와 운영 근거의 부재를 그대로 표시합니다.

## 2026-07 최초 내용 소급 기록 (부분 검토)

- [PWC-0028](../../decisions/PWC-0028.md): PR #1/#3의 초기 Harness/역할/병합 결정.
- [PWC-0027](../../decisions/PWC-0027.md): PR #13 / PS-003 승인 UX 4항.
- [PWC-0032](../../decisions/PWC-0032.md): PR #20 / FOUNDATION-000 Proposed 기술 버전.
- [PWC-0029](../../decisions/PWC-0029.md): PR #29/#31 / ARCH-006 제한 승인과 후속 AUTH-003.
- [PWC-0030](../../decisions/PWC-0030.md): PR #35 / API-002 D1~D7.
- [PWC-0031](../../decisions/PWC-0031.md): PR #39 / API-003 D1~D8.
- 위 목록은 전수 심사 전 초기 선별 등록 이력이다. 현재 원본별 처리 범위는 위 최신 판정과 번호 대장을 따르며, **초기 PR/Issue 전체와 후속 운영 검증을 모두 마친 것은 아니다.** 원본 표의 '대기'는 이 완전한 전수 판정을 가리킨다.

## 미완료 설명

대장 전체는 **목록화 완료 / 상세 전수 심사 진행 중(#1~#80 완료, #81~#501 미완료)**입니다. 기존 [주요 결정 인벤토리](../pawcycle-historical-decision-inventory-2026-11-03.md)의 선별 등록을 전체 완료로 계산하지 않습니다. 특히 최초 [#1–#31](001-100.md) 시기에만 승인 입력, Proposed, UX/기술/보안·Harness 선택이 서로 다른 PR에 걸쳐 있으므로, 첫 Batch에서 이를 세분화합니다.


## 정확한 재개 지점

- 다음 원본: **#81**. #1~#80을 중복 생성하지 않는다. 사용자 요청 목표 #100까지 번호순으로 이어간다.
- 재개 기준: 이 PR 최신 HEAD와 main을 다시 조회하고 [progress.json](progress.json)·대장·연대기를 대조합니다. source가 수정됐다면 과거 판정을 지우지 말고 delta를 덧붙입니다.
- #13의 당시 검토 SHA 맥락/학습 기록 후속, Proposed 문서의 별도 승인, #17/#19 불일치 후속 해결과 실제 앱/운영 증거는 미확인 추적 항목입니다.

- 두 번째 배치는 [PWC-0039](../../decisions/PWC-0039.md)·[PWC-0040](../../decisions/PWC-0040.md) 제안 2개와 [PWL-0012](../../lessons/PWL-0012.md), 기존 기록 후속을 추가했다. #21 JAR binary는 metadata만 확인했고 옛 Windows 실패는 재현하지 않았다. 이전 배치 미확인은 #21–#30, 최신 배치의 추가 미확인은 #31–#40을 따른다.

- 2026-11-04 배치 #31~#40은 신규 Decision 3개(PWC-0041~0043)·Lesson 3개(PWL-0013~0015)와 기존 계약의 구현/QA 후속을 추가했다. source별 112개 파일과 최종 head CI를 확인했다. 배포 로그·수정 후 알림 실제 수신은 미확인으로 남긴다.

- 2026-11-04 [#41~#50 상세 처리](batch-041-050.md): 구독 V1 구현의 도메인/DB 날짜 경계, Frontend CSRF·비동기 인증 경쟁, local-only fixture와 쿠키·readiness 교정, 첫 MVP의 조건부 완료와 후속 접근성 QA, 성능 측정 후보→범위 승인·세부 차단을 복원했다. 누적 50/501, 미완료 451, 다음 #51.

- 2026-11-04 [#51~#60 상세 처리](batch-051-060.md): 성능 세부 승인→순서 이탈 부분 관측→전체 재승인→native stderr/배열 SelfTest 실패→기준선 미확보 종료를 복원하고, 위험 기반 Lean Harness·AWS 준비·동일 SHA release·HTTPS의 준비/운영 경계를 연결했다. 누적 60/501, 미완료 441, 다음 #61.

- 2026-11-04 [#61~#70 상세 처리](batch-061-070.md): HTTPS 실제 발급·갱신/재부팅, S3 격리 복원과 유지보수 예외, 자동 cleanup·IAM gate의 검증 한계, 기능 차이 없는 release rollback, EC2 SNS 수동 알림, 인증 smoke·one-shot 회원 준비와 사전 gate 잔여 지적을 복원했다. 누적 70/501, 미완료 431, 다음 #71.

- 2026-11-04 [#71~#80 상세 처리](batch-071-080.md): 운영 회원 wrapper·실제 회원/세션 증거, Application/Control SHA 분리와 rollback 호환성 교정, candidate DB restore 준비, 운영 안전성 판정 철회·보류와 실제 Control 왕복 검증을 시간순으로 연결했다. 누적 80/501, 미완료 421, 다음 #81.
