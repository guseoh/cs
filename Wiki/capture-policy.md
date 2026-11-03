# AI Wiki capture policy — by project

This file defines **standing capture preferences**, not unrestricted access to chat histories, secrets, third-party repositories or cloud resources. The user authorized differentiated Wiki recording on 2026-11-03. Original project design and implementation evidence remains authoritative; the public Wiki is a **retrieval layer**, not a replacement.

## Capture matrix

| Project | Mode | Always evaluate at task end | Background GitHub PR journal | Canonical decision and lesson |
| --- | --- | --- | --- | --- |
| `pawcycle` | `full` | Yes — design, implementation, minor UI edits, testing, failed attempts, CI and operational constraints | Yes — public merged PR metadata only | Confirmed decisions/constraints and reusable lessons |
| `csforge` | `full` | Yes — code, curriculum, Java diagrams, QA, refactor, CI and design exploration | Yes — public merged PR metadata only | Confirmed decisions/constraints and reusable lessons |
| `devpedia` | `design-only` | Yes — assess design decisions and tradeoffs, **not** ordinary implementation activity | **No** | Requirements, domain/API/DB/architecture decisions, alternatives, rationale, constraints |
| `dark-todo` | `manual` | Existing rules; not enrolled in the new always-on Journal | **No** new full Journal | Previously recorded decisions and snapshot retained |
| `llm-wiki` | `manual` | Change log only when Wiki policy/schema changes | No | Wiki architecture decisions |

## Two distinct capture mechanisms

**(A) AI task-end handoff.** In an AI-assisted session, review the work completed even when nobody says "save this to Wiki". For `full` projects, every completed, meaningful work unit — including small code/layout adjustments and failed verification — becomes an appropriately brief Journal entry when public-safe; consequential design choices also become one decision per record. For `design-only` DevPedia, only *design decisions, considered alternatives, architectural rationale, requirements and unresolved design questions* qualify. Ignore ordinary commits, bug fixes, implementation diaries and routine test reports for DevPedia. Proposed designs must remain `proposed` until actually confirmed.

**(B) Repository event collection.** The GitHub Actions workflow can check **public merged PRs from CSForge and PawCycle**, storing metadata-only Journal lines and a separate untrusted candidate queue through a reviewed PR. It does not read chat transcripts or detect unsaved local code edits, non-merged discussions or every independent test invocation. Journal merges are **source events**, not assertions that deployments or business logic are correct.

## Record hierarchy and deduplication

1. `Wiki/projects/*.md` contains the most recently verified current state, scoped evidence, outstanding questions, and relevant decision IDs. It must **never** call a merged PR or green CI "Production Verified" by default.
2. `Wiki/journal/<project>/YYYY-MM.md` contains concise time-ordered events for full-mode projects. Every automatic PR event has a stable `repository#PR` key; re-processing must not append duplicates.
3. `Wiki/decisions/*.md` stores a confirmed architectural, technical or workflow decision with causality and tradeoffs. A minor styling adjustment alone does not become an ADR.
4. `Wiki/lessons/*.md` stores reusable failure analysis, not copies of all transient errors.
5. For `devpedia` **no auto Journal, no PR-event ingestion, no low-level implementation recaps**. Keep reasons, constraints, chosen and rejected options. Do not claim the AI authored any user-written code.

## Authorization, accuracy, and privacy

- These rules are standing preferences to **evaluate and propose** Wiki deltas at the end of AI tasks. They are not authorization to override project AGENTS.md, existing review gates, or a current user instruction. A client may create a narrowly scoped **review PR** for sanitized records if it has authorized GitHub write access and the task’s authority permits this. If not, return a compact pending delta; do not claim it was saved.
- This Wiki repository is **public**. Never publish raw AI conversations, user identifiers, credentials, private repo details, production account details, unpublished design or sensitive implementation data. Heuristic secret scans do not guarantee privacy. Verify public-safe content *before* creating a GitHub Issue or PR.
- A design discussion that has not reached a confirmed choice may appear in a Journal with `unverified/proposed` wording on full-mode projects; for DevPedia store only high-value open design questions with explicit status.
- Do not duplicate source-project ADRs or README sections. Link them; the source repo wins when facts conflict. Re-verify links and timestamps whenever source changes.
- Changes to one project's Wiki capture mode require explicit user confirmation. Do not infer consent from a project appearing in an old Wiki snapshot.

## Working examples

- PawCycle: a 2px checkout button tweak → one brief Journal line when the work is completed; a revised idempotency/transaction choice → Decision plus Journal source reference.
- CSForge: Java diagram CSS correction → Journal; decision to restrict interactivity to meaningful state transitions → Decision, plus links to PR/QA.
- DevPedia: the user chooses a domain aggregate boundary after comparing transaction consistency and coupling → Decision with alternatives and consequences; the user manually implements Article CRUD → **no routine Wiki entry**.

## Implementation boundary

The rules in this file are consumed by AI clients that explicitly retrieve them. GitHub Actions collects public repository events separately. Neither `AGENTS.md` nor a scheduled workflow can autonomously access all ChatGPT/Work/Codex session contents. The direct PR route and optional reviewed handoff format are documented in [handoff.md](handoff.md).
