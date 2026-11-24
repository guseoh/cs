# AI Wiki capture policy — by project

This file defines **standing capture preferences**, not unrestricted access to chat histories, secrets, third-party repositories or cloud resources. The user authorized differentiated Wiki recording on 2026-11-03. Original project design and implementation evidence remains authoritative; the public Wiki is a **retrieval layer**, not a replacement.

## Capture matrix

| Project | Mode | Always evaluate at task end | Background GitHub PR journal | Canonical decision and lesson |
| --- | --- | --- | --- | --- |
| `pawcycle` | `full` | Yes — design, implementation, minor UI edits, testing, failed attempts, CI and operational constraints | Yes — public merged PR metadata only | Confirmed decisions/constraints and reusable lessons |
| `backend-systems-lab` | `full` | Yes — common monorepo decisions, six independent learning apps, two-volume design studies, progress/verified results | **No — repository not yet created**; explicit chat-task handoff only until configured | Cross-domain architecture, decisions, book study progress, verified results and learning outcomes |
| `logistics-learning` | `full` (child track) | Yes — logistics-specific design, implementation reports, experiments, failures and next actions | **No — repository not yet created** | Logistics-specific decisions and experiments; link parent records instead of duplicating |
| `csforge` | `full` | Yes — code, curriculum, Java diagrams, QA, refactor, CI and design exploration | Yes — public merged PR metadata only | Confirmed decisions/constraints and reusable lessons |
| `devpedia` | `design-only` | Yes — assess design decisions and tradeoffs, **not** ordinary implementation activity | **No** | Requirements, domain/API/DB/architecture decisions, alternatives, rationale, constraints |
| `dark-todo` | `manual` | Existing rules; not enrolled in the new always-on Journal | **No** new full Journal | Previously recorded decisions and snapshot retained |
| `llm-wiki` | `manual` | Change log only when Wiki policy/schema changes | No | Wiki architecture decisions |

## PawCycle AI Project Memory and exhaustive historical coverage (user-confirmed 2026-11-03)

PawCycle Wiki is a **retrieval substrate for ChatGPT and Codex**. The user need not read the Wiki directly: on a question such as “why was this chosen?” or “find portfolio-worthy failures”, AI clients should search indexed records, follow the prior decision → alternative → failed attempt → correction/supersession links, check GitHub/other authorized originals and explain the chain in Korean. Absence from the Wiki is **not proof** of no prior decision.

- Backfill is source-complete, not theme-sampled. For each numbered historical PR/Issue, retain an explicit processing verdict and a record/link explaining whether it supplied an independent decision, updated an existing one, an experiment/failure/deferral, or no standalone record. Preserve exact uncertainty and time of observation.
- New PawCycle work is **process-captured by default**, including design explorations, alternatives not selected, implementation/testing, failed or stopped work, and user approvals. Emit concise source-linked Journal/source entries for small items and Decision/Lesson records for durable reasoning, rather than verbose duplicates.
- A GitHub connector or explicit handoff must actually **read/write** the public-safe record. Neither Obsidian nor agents have passive cross-session memory or access to all private chat transcripts. Follow the existing reviewed-PR and permission gates; do not turn policy into automatic GitHub writes without authorized workflow.
- Source-of-truth order remains current user instruction → approved latest PawCycle contracts → actual code/tests/runtime evidence. Historical Wiki records are evidence of past **reasoning**, not automatic proof of present production state.

See [WIKI-0003](decisions/WIKI-0003.md) and [the source ledger](history/pawcycle-source-ledger/README.md).

## Two distinct capture mechanisms

**(A) AI task-end handoff.** In an AI-assisted session, review the work completed even when nobody says "save this to Wiki". For `full` projects, every completed, meaningful work unit — including small code/layout adjustments and failed verification — becomes an appropriately brief Journal entry when public-safe; for logistics-learning, record explicitly reported work and findings in the central Wiki now and in the project Wiki only after that repository/wiki actually exists and is writable; consequential design choices also become one decision per record. For `design-only` DevPedia, only *design decisions, considered alternatives, architectural rationale, requirements and unresolved design questions* qualify. Ignore ordinary commits, bug fixes, implementation diaries and routine test reports for DevPedia. Proposed designs must remain `proposed` until actually confirmed.

**(B) Repository event collection.** The GitHub Actions workflow can check **public merged PRs from CSForge and PawCycle**, storing metadata-only Journal lines and a separate untrusted candidate queue through a reviewed PR. It does not read chat transcripts or detect unsaved local code edits, non-merged discussions or every independent test invocation. Journal merges are **source events**, not assertions that deployments or business logic are correct.

## Record hierarchy and deduplication

1. `Wiki/projects/*.md` contains the most recently verified current state, scoped evidence, outstanding questions, and relevant decision IDs. It must **never** call a merged PR or green CI "Production Verified" by default.
2. `Wiki/journal/<project>/YYYY-MM.md` contains concise time-ordered events for full-mode projects. Every automatic PR event has a stable `repository#PR` key; re-processing must not append duplicates.
3. `Wiki/decisions/*.md` stores a confirmed architectural, technical or workflow decision with causality and tradeoffs. A minor styling adjustment alone does not become an ADR.
4. `Wiki/lessons/*.md` stores reusable failure analysis, not copies of all transient errors.
5. For `devpedia` **no auto Journal, no PR-event ingestion, no low-level implementation recaps**. Keep reasons, constraints, chosen and rejected options. Do not claim the AI authored any user-written code.

## Authorization, accuracy, and privacy

- These rules are standing preferences to **evaluate and propose** Wiki deltas at the end of AI tasks. The user explicitly selected logistics-learning for task-by-task capture on 2026-11-19, but no automatic GitHub Wiki write capability is assumed. They are not authorization to override project AGENTS.md, existing review gates, or a current user instruction. A client may create a narrowly scoped **review PR** for sanitized records if it has authorized GitHub write access and the task’s authority permits this. If not, return a compact pending delta; do not claim it was saved.
- This Wiki repository is **public**. Never publish raw AI conversations, user identifiers, credentials, private repo details, production account details, unpublished design or sensitive implementation data. Heuristic secret scans do not guarantee privacy. Verify public-safe content *before* creating a GitHub Issue or PR.
- A design discussion that has not reached a confirmed choice may appear in a Journal with `unverified/proposed` wording on full-mode projects; for DevPedia store only high-value open design questions with explicit status.
- Do not duplicate source-project ADRs or README sections. Link them; the source repo wins when facts conflict. Re-verify links and timestamps whenever source changes.
- Changes to one project's Wiki capture mode require explicit user confirmation. Do not infer consent from a project appearing in an old Wiki snapshot.

## Working examples

- PawCycle: a 2px checkout button tweak → one brief Journal line when the work is completed; a revised idempotency/transaction choice → Decision plus Journal source reference.
- CSForge: Java diagram CSS correction → Journal; decision to restrict interactivity to meaningful state transitions → Decision, plus links to PR/QA.
- DevPedia: the user chooses a domain aggregate boundary after comparing transaction consistency and coupling → Decision with alternatives and consequences; the user manually implements Article CRUD → **no routine Wiki entry**.

## 통합 백엔드 시스템 연구실과 물류 하위 모듈의 이중 Wiki 기록 (2026-11-19 사용자 확정)

- 신규 프로젝트는 처음에는 **학습용**이며, 현재 채팅에서 AI가 정답 코드를 제공하고 사용자가 로컬에서 작성·실행한다. Kafka·장애 복구·데이터 파이프라인·캐시·고급 최적화의 첫 구현은 개념과 힌트를 먼저 제공한다. [확정 협업 결정](decisions/BLR-0014.md).
- 최초 확정 도메인은 물류였으나 후속 확정으로 **여섯 독립 실행 Spring Boot 앱 + 교재 1·2권 설계 트랙**이 하나의 통합 저장소 안에 배치된다. 신규 저장소·Wiki 생성 전에는 `Wiki/projects/backend-systems-lab.md`, `Wiki/decisions/BSL-0001.md`·`BSL-0002.md`, `Wiki/journal/backend-systems-lab/YYYY-MM.md`를 공통 기록으로 유지하고, 물류 세부 내용은 기존 `Wiki/projects/logistics-learning.md`·`Wiki/journal/logistics-learning/YYYY-MM.md`·`Wiki/knowledge/LGK-0001.md`에 보존한다. 교재별 학습 매핑 초안은 `Wiki/knowledge/BSK-0001.md`를 따른다.
- 통합 저장소를 생성한 뒤 GitHub Wiki의 존재·접근·쓰기 권한을 확인한다. **프로젝트 Wiki 상세 원본**에는 6개 앱·교재 1·2권을 별도 색인/설계/실험 페이지로 관리하고 **중앙 Wiki**에는 공통 결정·중요 진행/학습 결과·상세 원본 링크를 남긴다. 양쪽 성공 여부를 각각 확인하고 부분 실패를 알린다. 자동 반영·GitHub Wiki 별도 이벤트 수집은 활성화되었다고 추정하지 않는다.
- 제안/확정/작성/실행/성능 검증을 엄격히 구분하며 공개 Wiki에는 민감 정보나 채팅 원문을 싣지 않는다. 프로젝트 원본의 도메인 계약·코드·실험 증거가 중앙 기록보다 우선한다.

## Implementation boundary

The rules in this file are consumed by AI clients that explicitly retrieve them. GitHub Actions collects public repository events separately. Neither `AGENTS.md` nor a scheduled workflow can autonomously access all ChatGPT/Work/Codex session contents. The direct PR route and optional reviewed handoff format are documented in [handoff.md](handoff.md).

## Wiki 기록 완료 기준 (2026-11-24 사용자 확정)

검토 및 승인된 Wiki PR의 병합 후 [브랜치 정리 규칙](AGENTS.md)을 수행한다. 병합된 일회성 원격 브랜치의 실제 삭제까지 확인하며, 열린 PR·보호·장기 운영·미반영 브랜치는 보존한다. 권한 또는 기능 부족으로 삭제하지 못하면 별도 미완료 상태로 보고한다. 기존 프로젝트별 capture mode와 검토·병합 승인 절차는 변경하지 않는다.
