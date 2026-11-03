# PawCycle GitHub PR·Issue 전수 조사대장 — 2026-11-03

이 문서는 PawCycle의 **최초 GitHub 기록부터 현재까지 모든 결정·대안·트레이드오프·운영/성능 결과를 소급 복원하기 위한 출처 확인 대장**입니다. 이 파일은 결정 그 자체가 아니며 모든 PR마다 별도의 Decision을 만들겠다는 뜻도 아닙니다. 작은 기술 결정도 원본과 후속 구현에 연결해 빠짐없이 수집하되, 중복 구현 수정은 기존 결정과 연결합니다.

## 범위 스냅샷

- 저장소 생성: 2026-07-02.
- GitHub 번호: **#1–#500 전부** (Issue/PR 공통 번호 체계), PR **367개**, Issue **133개**.
- 분류: PR Merged **342**, Closed/Unmerged **21**, Open **4**; Issue Closed **118**, Open **15**.
- 첫 PR: [#1](https://github.com/guseoh/pawcycle-commerce/pull/1); 첫 별도 Issue: [#88](https://github.com/guseoh/pawcycle-commerce/issues/88).
- 스냅샷에 포함된 이후 생성·수정된 PR/Issue는 별도 날짜의 delta audit가 필요합니다.

## 번호 범위별 원본 대장

- [#001–100](001-100.md) — 2026-07 초창기 제품·아키텍처·Harness·인증·성능·AWS 배포에서 첫 Issue까지
- [#101–200](101-200.md) — MVP2/3, Observability, AWS SRE/DB, 성능 기준선
- [#201–300](201-300.md) — Phase 10, MVP4/Catalog/UX, AWS→OCI 전환
- [#301–400](301-400.md) — OCI 성능 실험, Backend V2, 동시성/수평 구조 개선
- [#401–500](401-500.md) — Backend Closure, 실제 OCI Host Pull CD, 결제 복구, UI 및 Wiki Harness

## 전수 조사 프로토콜

1. **번호 오름차순 원본 확인:** PR body+전체 diff+주요 review/commit, Issue body+결정/종료 댓글+연결 PR. 보류·미병합·대체된 원본도 제외하지 않습니다.
2. **결정 원자 단위 추출:** 무엇을 왜 선택했는지, 검토·기각·보류한 대안, 요구사항·제약, 사용자 승인/미승인, 예상 결과/실제 비용, 당시 코드/DB/운영 경계를 분리합니다. 하나의 PR에 여러 선택이 있으면 여러 결정 후보로 분해합니다.
3. **시간축 연결:** 최초 Proposed/Approved input → Implementation PR → CI/실측/장애 → Correction → KEEP/DEFER/REJECT/SUPERSEDED 및 최신 main 코드의 일치/불일치. 후속 설계가 과거 선택을 지웠다고 보지 않습니다.
4. **결과 형태:** 승인된 결정은 `Wiki/decisions/PWC-*.md`, 장애·실패·실험 교훈은 `Wiki/lessons/PWL-*.md`; 실행 사건·중간 상태는 `Wiki/history/`와 기존 Journals를 사용합니다. **결정마다 반드시 원본 URL/승인·검증 범위/불확정 사항을 포함**합니다.
5. **상태 판정:** 미조사 / 검토중 / 판단·승인 불명 / 기록 완료(Decision 또는 기존 기록 참조) / 독립 기록 불필요(근거·설명) 등을 구별합니다. 전체 종료는 각 원본의 판정과 생성된 결정의 원본 역링크가 맞고, 중복·누락 검토까지 통과해야 가능합니다.
6. **실행 경계:** 읽기/소급 정리만 하고 PawCycle 코드·Issue/PR·Cloud·DB·비용·Secret 변경 금지. 중앙 Wiki Draft PR에서 리뷰·검증하고 사용자 별도 승인 전까지 병합하지 않습니다.

## 최초 번호 순 상세 판정 — 2026-11-03

- **#1~#10: 원본별 상세 판정 기록 완료(10/500)**. 원본 PR 본문, 전체 변경파일 diff 목록 및 결정에 중요한 변경, 공개 PR 토론(댓글 0건), 병합 상태를 검토했습니다. 각각 [#001–100 대장](001-100.md)의 상세 심사 칸에 결정/교훈/독립 기록 불필요 판단과 남은 검증 경계를 연결했습니다.
- **#11~#500: 490건의 상세 판정이 아직 미완료**입니다. 이미 부분적으로 추적한 PWC/PWL 원본이 있더라도 번호별 심사 완료로 중복 계산하지 않습니다.
- 초기 Harness와 제품 범위는 [PWC-0028](../../decisions/PWC-0028.md)·[PWC-0003](../../decisions/PWC-0003.md)에 연결했습니다. 후속 DOMAIN-001 설계는 [PWC-0033](../../decisions/PWC-0033.md), 협업 알림 false-green과 HTTP 403·본문 인코딩 문제는 [PWL-0010](../../lessons/PWL-0010.md)에 보존합니다. [PR #2](https://github.com/guseoh/pawcycle-commerce/pull/2)의 Obsidian 기록 실패 수정은 [PWL-0009](../../lessons/PWL-0009.md)에 별도로 보존합니다. PR #1의 fixture에 적힌 예시 PR 번호/이벤트는 실제 수행 증거가 아닙니다.
- 이 대장은 **개별 원본이 어떤 결정을 지원하는지 또는 왜 별도 Decision이 불필요한지** 모두 추적합니다. 한 PR에 다수 판단이 있으면 분해하고, 문서와 운영 근거의 부재를 그대로 표시합니다.

## 2026-07 최초 내용 소급 기록 (부분 검토)

- [PWC-0028](../../decisions/PWC-0028.md): PR #1/#3의 초기 Harness/역할/병합 결정.
- [PWC-0027](../../decisions/PWC-0027.md): PR #13 / PS-003 승인 UX 4항.
- [PWC-0032](../../decisions/PWC-0032.md): PR #20 / FOUNDATION-000 Proposed 기술 버전.
- [PWC-0029](../../decisions/PWC-0029.md): PR #29/#31 / ARCH-006 제한 승인과 후속 AUTH-003.
- [PWC-0030](../../decisions/PWC-0030.md): PR #35 / API-002 D1~D7.
- [PWC-0031](../../decisions/PWC-0031.md): PR #39 / API-003 D1~D8.
- 해당 원본의 body/권위 문서를 근거로 일부 Decision을 추출했지만 **모든 초기 PR/Issue의 diff·review·후속 운영 검증을 끝낸 것은 아니다.** 원본 표의 '대기'는 이 완전한 전수 판정을 가리킨다.

## 미완료 설명

대장 전체는 **목록화 완료 / 상세 전수 심사 진행 중(#1~#10 상세 판정 완료, 나머지 미완료)**입니다. 기존 [주요 결정 인벤토리](../pawcycle-historical-decision-inventory-2026-11-03.md)의 선별 등록을 전체 완료로 계산하지 않습니다. 특히 최초 [#1–#31](001-100.md) 시기에만 승인 입력, Proposed, UX/기술/보안·Harness 선택이 서로 다른 PR에 걸쳐 있으므로, 첫 Batch에서 이를 세분화합니다.
