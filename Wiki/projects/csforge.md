---
id: PRJ-CSFORGE
type: project
project: csforge
status: active
created_at: 2026-11-03
updated_at: 2026-11-08
evidence_level: source-verified
capture_mode: full
sources:
  - https://github.com/guseoh/csforge/pull/298
  - https://github.com/guseoh/agent-skills/pull/3
  - https://github.com/guseoh/csforge/pull/293
  - https://github.com/guseoh/csforge/pull/295
  - https://github.com/guseoh/csforge/pull/288
  - https://github.com/guseoh/csforge/blob/main/.github/workflows/content-sync.yml
depends_on: []
supersedes: []
related_to: [CSF-0001, CSF-0002, CSF-0003, CSF-0004, CSF-0005]
---
# CSForge — source-verified project snapshot

## Current state (latest merge checks 2026-11-08; earlier entries noted separately)
- Latest verified main: [5a675754](https://github.com/guseoh/csforge/commit/5a6757545a0ee16b845c5a83924e4b1b9e7840e9) (squash merge of pilot PR #297 on 2026-11-08). Previously observed main 5f7f5593 was 2026-10-31.
- Java G3 editorial diagrams: [PR #293](https://github.com/guseoh/csforge/pull/293) merged into main on 2026-10-31.
- Follow-up Java G3 P2 quality polish: [PR #295](https://github.com/guseoh/csforge/pull/295) remains **OPEN/unmerged**, even though isolated Chromium QA and PR validation passed for head 997393f.
- Cross-area Topic/Concept/Question guarded canonical sync implementation: [PR #288](https://github.com/guseoh/csforge/pull/288) merged; actual runtime sync is gated by role and repository variables in the content-sync workflow.
- Source evidence does not prove current production canonical DB alignment, active sync flags, Vercel deployment SHA, authenticated Reader usage or latest production data state.

- [CSForge Draft PR #298](https://github.com/guseoh/csforge/pull/298): **Network Curriculum 127 Concept 중 DIAGRAM 53/53 구현 및 격리 QA 완료**. 추가 HTTP/TCP 시각화 1개는 TEXT 분류. 검증 HEAD [`8c8355c3`](https://github.com/guseoh/csforge/commit/8c8355c3b61695832548feea049cd1b952c65da0)에서 [Repository Validation #42479815423](https://github.com/guseoh/csforge/actions/runs/42479815423)와 [Reader Chromium #42479815419](https://github.com/guseoh/csforge/actions/runs/42479815419) 모두 통과: 신규 SVG 196건, Pilot 20건, 실제 React Reader 라우트 Guest 212건·Owner 대표 4건. 격리 PostgreSQL 16.4 테스트는 **합성 도식 이전 상태**에서 53 UPDATED → 전체 Network Pack 재import UNCHANGED를 검증하며 9종 개인 이력, Concept/Question ID, Reference·관계 보존 및 53건 실제 Spring Concept HTTP 조회를 확인. 데스크톱 Reader 오른쪽 도식 가림/가로 스크롤도 교정해 시각 검증했다. **Production DB 동기화·실운영 인증 Reader 및 실제 운영 프런트/백엔드 연결 E2E는 미검증**, 전체 127 Concept/Question 내용 최종 감사(#278)도 별도다. PR은 Draft/미병합, 운영 쓰기·배포 없음. [최종 QA 근거](https://github.com/guseoh/csforge/pull/298#issuecomment-6721491434).
- [CSForge Issue #278, Network content audit checkpoint](https://github.com/guseoh/csforge/pull/298#issuecomment-6722386067): 127 Network Concept와 383 Question(객관식 129·서술형 127·시나리오 127)의 구조·핵심 기술 품질을 살펴보는 과정에서 **TLS ECDHE 연산 그림 `a + B`/`b + A` 오류**를 발견해 스칼라 곱셈 `a·B=b·A=ab·G`로 고쳤다. 기존 7개 Question은 ID·정답 키·유형을 그대로 유지하고 DNS 권한 데이터 동기화, 위험한 GET 자동호출, TCP rwnd/cwnd, MITM 연결 분리를 중심으로 시나리오·해설을 수정했다. 새 `NetworkContentAuditContractTest`는 127/383 inventory, Concept·Question 연결·정답 구조와 ECDHE 재발 방지를 검사한다. PR #298 1차 감사 HEAD [`34f470e1`](https://github.com/guseoh/csforge/commit/34f470e1773a9a7dbef15c771e82b7846ba0bf38), [Repository Validation #42486768738](https://github.com/guseoh/csforge/actions/runs/42486768738)와 Network/TCP/Heap QA PASS. [검토 보고서](https://github.com/guseoh/csforge/blob/34f470e1773a9a7dbef15c771e82b7846ba0bf38/docs/content-audit/issue-278/network-full-area-review.md)는 **254개 서술·시나리오 모범답안 각각의 독립 1차 자료 대조와 현행 Reference 링크↔주장 전수 검증이 미완료**라고 기록한다. 전체 127개 Concept의 기술 내용 최종 승인, 실제 운영 동기화·배포·배포 Reader E2E를 완료했다고 주장하지 않는다. Issue #278은 Java 범위를 포함하며 OPEN, PR #298은 Draft/미병합, 운영 쓰기 없음.
- [CSForge Issue #278, Network 심화 정확성 감사](https://github.com/guseoh/csforge/blob/bbf2590dcf0c6184af3addea04089d550773b50b/docs/content-audit/issue-278/network-full-area-review.md): 후속 RFC 9110·9112·9113·9846 대조로 **기존 Question 총 14개**의 모범답안·시나리오·선택지 해설을 국소 개선하고, 관련 Concept의 GET/HEAD, ETag 동시 수정, HTTP/2 윈도, TLS KeyShare, HTTP/1.1 본문 완전성 설명을 보강했다. **RFC 9846 §4.3.8**은 TLS 양 끝이 연결 간 KeyShare를 재사용하지 못하게 하지만 이전 구현을 위한 수신 호환성은 허용해야 한다. **RFC 9112 §8** 기준 `Content-Length` 1000/수신 600의 정상 FIN은 여전히 불완전 HTTP 응답이고, **RFC 9113 §5.2·§6.9.1**은 스트림·연결 양쪽 윈도를 요구한다. 세 Cookie Concept에 남아 있던 오래된 6265bis 초안 확인 시점도 2026-11-08 기준으로 정리했다. [최신 소스 HEAD `bbf2590d`](https://github.com/guseoh/csforge/commit/bbf2590dcf0c6184af3addea04089d550773b50b). 새 회귀 테스트에는 Reference URL 존재/HTTPS/URI 문법, 정규화된 질문 문장 중복 검사가 포함된다. **이 Wiki 기록 시점의 새 HEAD CI는 진행 중(미검증)**. 254개 모든 서술·시나리오 답안의 개별 RFC 주장 대조와 현재 Reference 전 링크 접근성 검증은 아직 미완료이며 Production 동기화·배포·병합 없음.
- [CSForge Network RFC 9112 공유 Reference 장애 복구, 2026-11-08](https://github.com/guseoh/csforge/pull/298#issuecomment-6722929612): 신규 TCP Concept가 이미 여러 HTTP Concept과 공유하는 RFC 9112 URL의 `title`·`depth`·`recommendation`을 서로 다르게 지정해 전체 Canonical 재import의 5항목이 반복 `UPDATED`로 남고 [초기 CI #42490320835](https://github.com/guseoh/csforge/actions/runs/42490320835)가 실패했다. 공통 메타데이터를 기존 canonical 값과 일치시키고 §8 전용 설명은 Concept별 `relationNote`로 분리해 해결했다. 최신 소스 [`ef1acef6`](https://github.com/guseoh/csforge/commit/ef1acef60618de25e499b24b5c636d67aac13252), [전체 Validation #42491023202](https://github.com/guseoh/csforge/actions/runs/42491023202)와 [Network Reader #42491023289](https://github.com/guseoh/csforge/actions/runs/42491023289)·TCP·Heap QA **PASS**. 감사에서 정리된 Question 수정 총 14개, 원래 contentKey·정답·개인 이력 보호. **254개 답안별 규격 대조 및 Reference 실시간 링크/주장 전수 확인은 미완료**, PR #298 Draft, Issue #278 Open, 운영 DB/배포/병합 없음.
- [CSForge Network Reference/Question deep audit — 2026-11-08](https://github.com/guseoh/csforge/blob/0275ff1f17b1cf58fbfe7163ddb021ddba61f2b6/docs/content-audit/issue-278/network-full-area-review.md): `guseoh/csforge` [Draft PR #298](https://github.com/guseoh/csforge/pull/298) HEAD [`0275ff1f`](https://github.com/guseoh/csforge/commit/0275ff1f17b1cf58fbfe7163ddb021ddba61f2b6)에서 **기존 Question 15개**(ID·유형·난도·정답 키·Concept 연결 보존)를 정확성·중복 학습 목표 기준으로 교정했다. 마지막 추가 교정은 `cache-control.q3`의 **Authorization+public**과 `private-shared-cache.q3`의 **Set-Cookie+개인화된 CDN 응답** 사례를 분리한 것이다([RFC 9111 §7.3](https://www.rfc-editor.org/rfc/rfc9111.html#section-7.3)). [RFC 9113 §6.9.1](https://www.rfc-editor.org/rfc/rfc9113.html#section-6.9.1)의 **흐름 제어 윈도 0에서도 0바이트 END_STREAM DATA 허용** 예외를 본문·시나리오와 회귀 검사에 반영했다. 동일 URL의 Reference 공통 메타데이터를 Canonical 전체 재import 전에 검사하도록 127 Concept 범위의 빠른 회귀 검사도 추가했다. 15 Topic의 254개 서술·시나리오 모범답안을 읽고 고위험 차이를 검토했으나 **254개 각각의 모든 주장에 대한 독립 RFC 조항 확인은 미완료**다. 과거 manifest의 56개 고유 Reference URL 중 16개를 직접 조회하여 13개는 접근 확인·3개는 HTTP 429 rate limit으로 미확인, 다른 URL 접근성·claim relevance 전수 검증도 미완료. [이전 전체 PASS CI #42491023202](https://github.com/guseoh/csforge/actions/runs/42491023202)는 보존된 근거이고, `0275ff1f` 기준 상태는 **latest source HEAD fully PASS — [Repository Validation #42493209664](https://github.com/guseoh/csforge/actions/runs/42493209664), [Network Reader #42493209538](https://github.com/guseoh/csforge/actions/runs/42493209538), [TCP #42493209688](https://github.com/guseoh/csforge/actions/runs/42493209688), [Heap #42493209704](https://github.com/guseoh/csforge/actions/runs/42493209704) all SUCCESS; Cloud Run deploy skipped**. PR Draft, Issue #278 Open, 운영 DB/배포/병합 없음.

## Accepted decisions
- [CSF-0005](../decisions/CSF-0005.md): build and review N-01–N-05 together without serial user approval checkpoints.
- [CSF-0004](../decisions/CSF-0004.md): prioritize five compact Network diagram units beginning with N-01.
- [CSF-0003](../decisions/CSF-0003.md): user-approved textbook-style SVG-first visualization approach and three pilot quality gates, separate from Reader deployment.
- [CSF-0001](../decisions/CSF-0001.md): protected canonical content sync.
- [CSF-0002](../decisions/CSF-0002.md): semantically appropriate Java editorial visualization.

## Constraints
- Preserve personal learning progress and history-bearing question semantics.
- Do not treat merged code, green CI, and live data synchronization as equivalent.
- PR #295 excludes Reader typography issue #294; it requires separate resolution.

## Open questions and next actions
- [agent-skills PR #3](https://github.com/guseoh/agent-skills/pull/3) merged after explicit security hardening and [final Skill validation #42448379475](https://github.com/guseoh/agent-skills/actions/runs/42448379475). ChatGPT plugin installation/usage and separate plugin SVG fixture browser QA remain **unverified**.
- [CSForge PR #297](https://github.com/guseoh/csforge/pull/297) merged into main as [5a675754](https://github.com/guseoh/csforge/commit/5a6757545a0ee16b845c5a83924e4b1b9e7840e9). The user confirmed the Heap preview's design direction; Java/TCP before/after views and the standalone three-example preview were added. Final branch [Chromium QA #42447737670](https://github.com/guseoh/csforge/actions/runs/42447737670) and Repository Validation passed. **Actual Reader integration/deployment and user acceptance of the final Java revision remain pending.**
- Review PR #295; actual authenticated Reader/PWA checks remain unverified by its PR description.
- Inspect current production content-sync runs and data audit before claiming alignment.
- Confirm live backend/frontend revisions when a production-specific question arises.

- Final design-pilot evidence: [CSForge Java coordinate-fix QA #42447737670](https://github.com/guseoh/csforge/actions/runs/42447737670) and [agent-skills security/skill QA #42448379475](https://github.com/guseoh/agent-skills/actions/runs/42448379475) passed. Both implementation PRs are merged; plugin installation, visual acceptance beyond approved Heap direction, and Reader integration remain outside completed checks.

## Evidence and verification limits
GitHub PR HEAD/main and verification workflows for #297, #298 and agent-skills #3 rechecked 2026-11-08; older project context remains sourced to 2026-11-03. The #298 evidence now also covers Testcontainers isolated full-pack import/reimport and mocked-API Chromium actual React Reader routes, plus real Spring Concept GET with the isolated DB; it does not verify a single live frontend-to-DB environment, authenticated production Reader, actual production DB/digest or cloud-control-plane state. CI success does not prove production canonical DB alignment.
