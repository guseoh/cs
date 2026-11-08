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
- [CSForge Issue #278, Network content audit checkpoint](https://github.com/guseoh/csforge/pull/298#issuecomment-6722386067): 127 Network Concept와 383 Question(객관식 129·서술형 127·시나리오 127)의 구조·핵심 기술 품질을 살펴보는 과정에서 **TLS ECDHE 연산 그림 `a + B`/`b + A` 오류**를 발견해 스칼라 곱셈 `a·B=b·A=ab·G`로 고쳤다. 기존 7개 Question은 ID·정답 키·유형을 그대로 유지하고 DNS 권한 데이터 동기화, 위험한 GET 자동호출, TCP rwnd/cwnd, MITM 연결 분리를 중심으로 시나리오·해설을 수정했다. 새 `NetworkContentAuditContractTest`는 127/383 inventory, Concept·Question 연결·정답 구조와 ECDHE 재발 방지를 검사한다. PR #298 최종 감사 HEAD [`34f470e1`](https://github.com/guseoh/csforge/commit/34f470e1773a9a7dbef15c771e82b7846ba0bf38), [Repository Validation #42486768738](https://github.com/guseoh/csforge/actions/runs/42486768738)와 Network/TCP/Heap QA PASS. [검토 보고서](https://github.com/guseoh/csforge/blob/34f470e1773a9a7dbef15c771e82b7846ba0bf38/docs/content-audit/issue-278/network-full-area-review.md)는 **254개 서술·시나리오 모범답안 각각의 독립 1차 자료 대조와 현행 Reference 링크↔주장 전수 검증이 미완료**라고 기록한다. 전체 127개 Concept의 기술 내용 최종 승인, 실제 운영 동기화·배포·배포 Reader E2E를 완료했다고 주장하지 않는다. Issue #278은 Java 범위를 포함하며 OPEN, PR #298은 Draft/미병합, 운영 쓰기 없음.

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
