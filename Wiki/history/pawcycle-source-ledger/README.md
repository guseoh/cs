# PawCycle GitHub PR·Issue 전수 조사대장 — 2026-11-03

이 문서는 PawCycle의 **최초 GitHub 기록부터 현재까지 모든 결정·대안·트레이드오프·운영/성능 결과를 소급 복원하기 위한 출처 확인 대장**입니다. 이 파일은 결정 그 자체가 아니며 모든 PR마다 별도의 Decision을 만들겠다는 뜻도 아닙니다. 작은 기술 결정도 원본과 후속 구현에 연결해 빠짐없이 수집하되, 중복 구현 수정은 기존 결정과 연결합니다.

## 범위 스냅샷

- 저장소 생성: 2026-07-02.
- GitHub 번호: **#1–#500 전부** (Issue/PR 공통 번호 체계), PR **367개**, Issue **133개**.
- 분류: PR Merged **342**, Closed/Unmerged **21**, Open **4**; Issue Closed **118**, Open **15**.
- 첫 PR: [#1](https://github.com/guseoh/pawcycle-commerce/pull/1); 첫 별도 Issue: [#88](https://github.com/guseoh/pawcycle-commerce/issues/88).
- 추가 목록: [#501~#503](501-600.md). #501은 2026-11-03, #502는 2026-11-04 metadata로 확인했습니다. 현재 목록 총 **503건**, 상세 출처 판정 **503**, 대기 **0**입니다. #502는 상세 조사하지 않았으며, 원래 #1~#500의 상태 스냅샷은 당시 값으로 보존합니다.

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

- **#1~#503: 원본별 판정 완료(503/503, 제한 검사·한계 명시)**. 원본 처리 완료는 모든 운영 불확실성의 해소를 뜻하지 않는다.
- **#401~#503: 이번 요청에서 판정 완료; Open source는 미완료 제품 작업으로 별도 유지**. 번호순으로 이어간다.
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

대장 전체는 **목록화 완료 / 상세 전수 심사 진행 중(#1~#503 출처 판정 완료; Open 제품 작업은 별도)**입니다. 기존 [주요 결정 인벤토리](../pawcycle-historical-decision-inventory-2026-11-03.md)의 선별 등록을 전체 완료로 계산하지 않습니다. 특히 최초 [#1–#31](001-100.md) 시기에만 승인 입력, Proposed, UX/기술/보안·Harness 선택이 서로 다른 PR에 걸쳐 있으므로, 첫 Batch에서 이를 세분화합니다.


## 정확한 재개 지점

- 다음 신규 후보: **#504**. 존재를 확인하기 전 목록에 추가하지 않는다. 사용자 요청 #401–최신 Closed PR #503은 완료했다.
- 재개 기준: 이 PR 최신 HEAD와 main을 다시 조회하고 [progress.json](progress.json)·대장·연대기를 대조합니다. source가 수정됐다면 과거 판정을 지우지 말고 delta를 덧붙입니다.
- #13의 당시 검토 SHA 맥락/학습 기록 후속, Proposed 문서의 별도 승인, #17/#19 불일치 후속 해결과 실제 앱/운영 증거는 미확인 추적 항목입니다.

- 두 번째 배치는 [PWC-0039](../../decisions/PWC-0039.md)·[PWC-0040](../../decisions/PWC-0040.md) 제안 2개와 [PWL-0012](../../lessons/PWL-0012.md), 기존 기록 후속을 추가했다. #21 JAR binary는 metadata만 확인했고 옛 Windows 실패는 재현하지 않았다. 이전 배치 미확인은 #21–#30, 최신 배치의 추가 미확인은 #31–#40을 따른다.

- 2026-11-04 배치 #31~#40은 신규 Decision 3개(PWC-0041~0043)·Lesson 3개(PWL-0013~0015)와 기존 계약의 구현/QA 후속을 추가했다. source별 112개 파일과 최종 head CI를 확인했다. 배포 로그·수정 후 알림 실제 수신은 미확인으로 남긴다.

- 2026-11-04 [#41~#50 상세 처리](batch-041-050.md): 구독 V1 구현의 도메인/DB 날짜 경계, Frontend CSRF·비동기 인증 경쟁, local-only fixture와 쿠키·readiness 교정, 첫 MVP의 조건부 완료와 후속 접근성 QA, 성능 측정 후보→범위 승인·세부 차단을 복원했다. 누적 50/501, 미완료 451, 다음 #51.

- 2026-11-04 [#51~#60 상세 처리](batch-051-060.md): 성능 세부 승인→순서 이탈 부분 관측→전체 재승인→native stderr/배열 SelfTest 실패→기준선 미확보 종료를 복원하고, 위험 기반 Lean Harness·AWS 준비·동일 SHA release·HTTPS의 준비/운영 경계를 연결했다. 누적 60/501, 미완료 441, 다음 #61.

- 2026-11-04 [#61~#70 상세 처리](batch-061-070.md): HTTPS 실제 발급·갱신/재부팅, S3 격리 복원과 유지보수 예외, 자동 cleanup·IAM gate의 검증 한계, 기능 차이 없는 release rollback, EC2 SNS 수동 알림, 인증 smoke·one-shot 회원 준비와 사전 gate 잔여 지적을 복원했다. 누적 70/501, 미완료 431, 다음 #71.

- 2026-11-04 [#71~#80 상세 처리](batch-071-080.md): 운영 회원 wrapper·실제 회원/세션 증거, Application/Control SHA 분리와 rollback 호환성 교정, candidate DB restore 준비, 운영 안전성 판정 철회·보류와 실제 Control 왕복 검증을 시간순으로 연결했다. 누적 80/501, 미완료 421, 다음 #81.

- 2026-11-04 [#81~#90 상세 처리](batch-081-090.md): 최소운영기준선7항목 Verified의 한계, code/metadata CI 분리·비소급 Lean 전환, MVP2 제품/legacy 정책과 Proposed 기술계약→구현 Delta, 멱등 current-read·reconciliation correction, 운영활성화 후속 Issue와 로컬volume 인증복구를 기록했다. 누적 90/501, 미완료 411, 다음 #91.

- 2026-11-04 [#91~#100 상세 처리](batch-091-100.md): AI 도구 Before 자료의 한계→Connector 대조군 재정의→읽기 capability 계약→외부 측정도구→Codex 실험군을 연결하고, 우발 Issue4개는 독립 정책 없는 사고로 판정했다. cache/중복·schema drift·권한강제 아님·모델 미수집을 보존했다. 누적 100/501, 미완료 401, 다음 #101.

- 2026-11-04 [#101~#110 상세 처리](batch-101-110.md): 실측 기반 N+1 batch 조회, 구독별 reconciliation transaction 격리, 30일 멱등 보관·복구 호환 cleanup과 local 관측성 착수 경계를 복원했다. 병합 후 리뷰와 무효 검증을 구별했다. 누적 110/501, 미완료 391, 다음 #111.

- 2026-11-04 [#111~#120 상세 처리](batch-111-120.md): local metric·scrape 비용 수용, disposable 장애 격리, Prometheus 후보 감지와 Discord 수동 수신을 단계별로 복원했다. 누적 120/501, 미완료 381, 다음 #121.

- 2026-11-04 [#121~#130 상세 처리](batch-121-130.md): 정기 주문의 최초 구현·OFF 배포·정확한 SHA 승인, readiness/OIDC 단계와 실제 AWS 실패를 연결했다. #128의 최종 폐기는 완료와 구별했다. 누적 130/501, 미완료 371, 다음 #131.

- 2026-11-04 [#131~#140 상세 처리](batch-131-140.md): SSM v1~v6의 실패 가설→process trace→exact Git trust→AWS 안전 배포를 복원하고 Catalog·Commerce·인증 책임 변화와 실제 검증 한계를 연결했다. 누적 140/501, 미완료 361, 다음 #141.

- 2026-11-04 [#141~#150 상세 처리](batch-141-150.md): V2책임 분리, AWS관측 bridge독립화와실제검증, Backenddrill의 probe/시간한계, 두호스트read-only진단과독립알림을복원했다. 누적 150/501, 미완료 351, 다음 #151.

- 2026-11-04 [#151~#160 상세 처리](batch-151-160.md): 실양채널알림과자동실행보류, RDS비교·TLS대가·실자원생성, rehearsal미완료/폐기와CRLF·env파싱수정·대체PR을구분했다. 누적 160/501, 미완료 341, 다음 #161.

- 2026-11-04 [#161~#170 상세 처리](batch-161-170.md): Control-only·same-SHA runtime 승인과 RDS preflight수정, Phase8의도구실패/correction/local proxy한계/AWS cgroupOOM·최종closure를복원했다. 누적 170/501, 미완료 331, 다음 #171.

- 2026-11-04 [#171~#180 상세 처리](batch-171-180.md): 승인syntheticmix·실4profile측정과실패/증거회수, SQL병목가설보류, resource재현·collector보존·Tomcat64기각을복원했다. 누적 180/501, 미완료 321, 다음 #181.

- 2026-11-04 [#181~#190 상세 처리](batch-181-190.md): Tomcat128기각→CPU인과성/메모리재병목→1GiB보조효과→transaction축소효과약함→종료수집freshness보강을조건·수치·한계로연결했다. 누적 190/501, 미완료 311, 다음 #191.

- 2026-11-04 [#191~#200 상세 처리](batch-191-200.md): Hikari20기각·CPU2부분인과성·JFR선택과두pre-workload correction을복원했다. #200까지100건완료, 다음#201이며 profiling후속은별도근거로남겼다. 누적 200/501, 미완료 301, 다음 #201.

- 2026-11-04 [#201~#201 상세 처리](batch-201-201.md): Phase 9은 잔여 포화가 있지만 특정 Java hotspot 귀속 증거가 없어 추가 코드 최적화 NO CHANGE로 종료했다. 실제 PH9-011 불완전 JFR과 선행 pre-workload 실패를 구분하고 통합 검증 미실행 correction을 복원했다. 누적 201/502, 미완료 301, 다음 #202.

- 2026-11-04 [#202~#210 상세 처리](batch-202-210.md): Redis 최초 KEEP와 race 교정, 유실된5k와새10k의구분, one-shot identity·durable evidence 및mixed-scrape실패를복원했다. 누적 210/502, 미완료 292, 다음 #211.

- 2026-11-04 [#211~#220 상세 처리](batch-211-220.md): Scheduler 설정After와Phase10 조건부기술선택 종료, MVP4 결합pending/잠금교정·AI안전추천·Frontend연결의미완료경계를복원했다. 누적 220/502, 미완료 282, 다음 #221.

- 2026-11-04 [#221~#230 상세 처리](batch-221-230.md): 독립QA의실패/미병합, Demo/manifest·DB-native탐색권위, UX보조도구/Draftreview와TossTest opt-in의미완성경계를복원했다. 누적 230/502, 미완료 272, 다음 #231.

- 2026-11-04 [#231~#240 상세 처리](batch-231-240.md): Production import의명시승인/프록시경계, Checkout identity와Review/Q&A, V24/V3탐색·가격predicate·실QA의검증gap을복원했다. 누적 240/502, 미완료 262, 다음 #241.

- 2026-11-04 [#241~#250 상세 처리](batch-241-250.md): UI 보정·FOUNDATION 호환성·Admin·개인화/Add-on 계약과 인증 Browser 증거를 복원하고 Provider/운영 미검증 경계를 보존했다. 누적 250/502, 미완료 252, 다음 #251.

- 2026-11-04 [#251~#260 상세 처리](batch-251-260.md): Warm Utility→Warm Routine→Daily Orbit 변경관계, 임시AWS Auto-CD, Canonical Catalog 공통적재 준비를 복원했다. 누적 260/502, 미완료 242, 다음 #261.

- 2026-11-04 [#261~#270 상세 처리](batch-261-270.md): 운영적재adapter/identity실패의원인과동일HEAD대체, Catalog현실성overlay, 익명추천SQL·CompareJDBC교정및배포후QAgate를복원했다. 누적 270/502, 미완료 232, 다음 #271.

- 2026-11-04 [#271~#280 상세 처리](batch-271-280.md): HTTP·JPA리팩터링단계/남은정합성부채, Session검토보류, Seoul→Tokyo·TrialE5변경과미병합OCI준비/TLSgate를복원했다. 누적 280/502, 미완료 222, 다음 #281.

- 2026-11-04 [#281~#290 상세 처리](batch-281-290.md): AWS자동dispatch사건과철거, externalMySQL·HTTPSreloadpending·samehost관측, botreviewfalse-success와exactHEAD/shellgate를복원했다. 누적 290/502, 미완료 212, 다음 #291.

- 2026-11-04 [#291~#300 상세 처리](batch-291-300.md): opc권한·networkpublish·runtimeenv실패교정, edge/ownership/logging보안경계와#300관측준비최종완료·dataset변수분리를복원했다. 누적 300/502, 미완료 202, 다음 #301.

### #201–#300 요청 완료 체크포인트

#201 기존 판정을 유지하고 #202–#300 **99건**을 번호순 10배치로 조사했다. 요청 범위 100건 전체에 상세 처리 결과가 있으며 누적 **300/502 완료·202 미완료·다음 #301**이다. 신규 결정 22개·교훈 6개, 기존 기록 15개를 갱신하고 원본 변경파일 2420개의 경로·blob·수집 가능 patch/한계를 manifest로 남겼다.

Phase10 one-shot identity와 유실 증거, Scheduler KEEP, Catalog·Checkout·Trust, UX 대안/승인 변경, JPA/HTTP 경계, AWS 자동 dispatch 실패와 철거, Tokyo/Trial E5·관측 권한/network·보안 경계, #300 제한된 관측 Production Verified를 연결했다. #256/#281 binary72개는 원본 재검증 없이 manifest/당시 보고로 제한하고, 실제 Provider·운영/복구·원시 성능 artifact 및 병합 뒤 추가 리뷰의 미확인을 유지한다. #300의 #301~#304 언급은 연결 근거이며 독립 전수 처리는 #301부터다.

- 2026-11-04 [#301~#310 상세 처리](batch-301-310.md): 10K정확총량·I0/I10K격리와formalreview증거gap,stagebucket완전성·실image rehearsal실패및2회복구를복원했다. 누적 310/502, 미완료 192, 다음 #311.

- 2026-11-04 [#311~#320 상세 처리](batch-311-320.md): single-stage승인·lifecycle인과성축소·WindowsSSH최소delta와I10K부분실패/최종보류를복원했다. 누적 320/502, 미완료 182, 다음 #321.

- 2026-11-04 [#321~#330 상세 처리](batch-321-330.md): list/count page-first·힌트추가→JOIN_PREFIX제거KEEP의변경관계,provenance재사용·수집preflight·warmup계약과부분증거한계를복원했다. 누적 330/502, 미완료 172, 다음 #331.

## #301–#400 요청 완료 체크포인트

#301–#330의 기존 처리를 보존하고 #331–#400 70건을 번호순으로 추가 조사했다. 요청 범위 100건 전체에 원본별 판정이 있으며 현재 **400 완료 / 103 미완료 / 503 목록, 다음 #401**이다. 이번 재개분은 결정14개(PWC-0108–0121)·교훈5개(PWL-0043–0047)를 신규 등록했다.

Checkout 정확성/무효 측정/NO_CHANGE, Querydsl·topology·typed read 선택, T07 목표 개정, T09 구조 교정, T10 잠금/시간/fixture/CI 실패와 대체 PR, Runtime0 뒤 전체 closure, OCI 알림의 offline/live/health 경계, DTO.from 사용자 선호와 transaction 밖 물질화 한계를 연결했다. 원본 #334의 runner 리뷰 지적, #338/Seoul 실패, #378 Windows 중단 및 최종 reviewer gap, #397/#400 외부 review 부재를 남겼다.

원본 #331–#400의 변경파일747개를 manifest에 대조했다. 누락 patch 중 대형 Python4개는 원문·구조를 보충했고 이미지22개는 픽셀 재검증 없이 metadata/당시 보고로 제한한다. #503은 새 존재·Draft metadata만 추가했으며 상세 처리하지 않았다. 제품·운영·DB·Cloud·Secret·Provider·부하 실행은 없다. 원본 #401 이후의 closure 댓글 링크는 연결 근거이며 그 PR들의 독립 전수 완료를 뜻하지 않는다.

[최신 main·수집 한계·대체 PR 대조](checkpoint-301-400.md).

## #401–#503 요청 완료

#401부터 조회시 최신 Closed PR #503까지 **103개 원본의 판정**을 기록했다. Open 원본은 제안·미병합·잔여 상태로 구분했으며 구현 완료로 바꾸지 않았다. 누적 **503개 목록 / 503개 출처 판정 / 대기0**, 다음 신규 후보 #504(아직 목록 생성하지 않음)다. 신규 결정8개(PWC-0122–0129)·교훈1개(PWL-0048), 기존 기록15개를 갱신했다.

Architecture의 남은 경계와21Adapter KEEP, Cart version/F07/Category/Import/MVC/wire 계약, 시간 호환성·테스트 격리, Desktop R3·입고 취소/응답 불확실성, OCI Release/Host Pull·trust/timer/helper/image/TLS·서비스별 정책 및 최초 실전 STOP, A1 disabled worker/root compartment/단기 조회 Cron 변경을 연결했다.

변경파일706개·전체 제공 patch와 댓글/리뷰/commit/CI metadata를 수집하고 주요 계약·실패를 제한 대조했다. 이미지35개(path 중복 포함)는 픽셀 재검증 없이 metadata/당시 보고만 보존했다. source별 원시 로컬 artifact·실제 인증·Provider·운영/복구·장기 연속성을 새로 검증하지 않았다. #503 병합은 Cloudflare 운영 배포나 외부 Secret 등록이 아니다. 코드 전체의 독립 전수 리뷰라고 주장하지 않는다.

[체크포인트](checkpoint-401-503.md).
