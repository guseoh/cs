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

- [CSForge Draft PR #298](https://github.com/guseoh/csforge/pull/298): Network 127개 Concept 중 Curriculum의 **DIAGRAM 53개 구현과 자동화 통합 QA를 완료**했다. 4개 기존 DIAGRAM 파일럿과 신규 49개 고정 예제를 연결했고, 추가 HTTP-over-TCP 파일럿 1개는 현재 TEXT 분류에 속한다. 독립 Curriculum 대조 결과 53개 `contentKey` 집합이 inventory와 정확히 일치한다. 최종 검증 HEAD [`c222d57c`](https://github.com/guseoh/csforge/commit/c222d57c9cca55f2602dec145598fb93e6e3c9f9)에서 신규 196개(49 × dark/light × 1280/1440), 기존 파일럿 20개 브라우저 시각 QA 및 Repository Validation·Heap·TCP 회귀가 모두 PASS했다([QA 근거](https://github.com/guseoh/csforge/pull/298#issuecomment-6720898852)). 가독성 캡션·여백을 다듬고 ARP 도식 주소를 원본 본문과 동일한 `192.0.2.10`으로 교정했다. **격리 PostgreSQL 전체 팩 Apply/재import UNCHANGED·개인 이력 보존과 실제 Reader API/DB E2E는 미검증**이며 이 PR은 Draft/미병합, Production 반영도 미완료다.

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
GitHub PR HEAD/main and verification workflows for #297, #298 and agent-skills #3 rechecked 2026-11-08; older project context remains sourced to 2026-11-03. The #298 QA evidence covers component/preview Chromium and source/static validation, not authenticated production Reader, isolated full-pack Import or cloud-control-plane state. CI success does not prove production canonical DB alignment.
