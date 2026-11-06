---
id: PRJ-BACKEND-LEARNING
type: project
project: backend-learning
status: active
created_at: 2026-11-04
updated_at: 2026-11-06
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://github.com/guseoh/large-scale-board/blob/main/README.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/ROADMAP.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/PROJECT_HANDOFF.md
depends_on: []
supersedes: []
related_to: [BLR-0001, BLR-0002, BLR-0003, BLR-0004, BLR-0005, BLR-0006, BLR-0007, AGT-0001, AGK-0001]
---

# Backend learning — cross-project decision snapshot

## Current plan (user-confirmed 2026-11-04)

**Primary objective:** build deep Java/Spring backend development, design, testing and problem-solving ability first. AI-assisted software development and cloud/infrastructure engineering are important but receive **dedicated deeper study later**. Already gained AI/infra experience remains in use; this is not a freeze on deployment or tooling.

The learning tracks have intentionally different formats:

| Track | Method and boundary |
| --- | --- |
| CS | University-style independent subject/chapter learning; revisit when concepts recur in projects. Theory notes and project evidence remain distinct. |
| Java / Spring / OOP | Foundation and direct coding understanding take priority. |
| [Large-scale Board](https://github.com/guseoh/large-scale-board) | Planned ~2 hours/day, user-written Java/Spring code and progressively deeper metrics, performance/concurrency and failure experiments. **Preserve** existing Pure Java → Design Baseline → Spring → Phase 0–13 and source completion criteria. |
| System design books | Study the design reasoning chapter by chapter in **가상 면접 사례로 배우는 대규모 시스템 설계 기초** volumes 1 and 2; not a requirement to implement each chapter. |
| Domain-based design & AI | Separate domain candidates for architectural choices and AI-assisted implementation/verification; logistics, event analytics and video streaming are **candidates**, not a final selection. |
| Sentry | Learning integration planned in Board; portfolio adoption only after comparing trade-offs and actual need. |

## 2026-11-05 clarification — design and AI roles

System-design ability is treated as **CS + Java/Spring + database/operations foundations + domain knowledge applied to actual requirements, constraints, trade-offs and tests**. The two system-design volumes remain a reasoning curriculum, while logistics/streaming-oriented exercises combine hands-on design with AI-assisted implementation and verification. The selection of one fully scoped new system has not been established.

AI coding prompts, task delegation, harness practices, code review and verification are trained in those **existing domain project plans**, rather than in a new duplicate vibe-coding curriculum. [AgentLab](agentlab.md) has a different role: study LLM/Agent internals and Java/Spring AI feature integration using Spring AI and selected Hermes comparisons. This does not replace the backend-first priority or authorize full-time AI-specialist depth.

See [BLR-0005](../decisions/BLR-0005.md), [AGT-0001](../decisions/AGT-0001.md) and [AI adoption Q&A](../knowledge/AGK-0001.md).

## 2026-11-06 — Architecture learning before independent design (user-confirmed)

The architecture/system-design curriculum now starts with **instructor-led concept learning and worked Java/Spring examples**, before requiring independent design exercises. The user will use the public outline of the [Inflearn architecture course](https://www.inflearn.com/course/in-the-age-of-ai-dev?cid=343703) as a topic reference **without purchasing or reproducing its paid materials**.

Six stages: (1) architecture/quality attributes/trade-offs; (2) OOP, modularity and DDD; (3) layered, hexagonal, modular-monolith, microservices and event patterns; (4) API/DB transactions, concurrency, consistency, messaging, resilience and observability; (5) source-grounded reverse engineering, diagrams and ADRs; (6) guided design exercises, later growing into independent decisions.

**Teaching contract:** Explain the underlying reason and prerequisites, then work through concrete Java 21/Spring Boot examples, contrasting flawed/baseline and improved designs, data/state/sequence diagrams, limitations, alternative choices and verification tests. Read actual Korean engineering posts (e.g. Woowa, NAVER D2, Toss, LY Corporation) and other trustworthy Korean technical blogs; link the actual relevant articles and explain their contents inside the lesson rather than supplying URLs without analysis. Prefer relevant Korean-language references, supplement with official documentation, distinguish vendor experience from general rules and verify version-sensitive claims. Do not require quizzes or initial standalone architecture solutions.

This is a **learning-plan decision only**, not a claim that any stage was completed or a project implementation was performed. It **does not supersede** book-based study in [BLR-0004](../decisions/BLR-0004.md), the later domain-based design direction in [BLR-0005](../decisions/BLR-0005.md), or Large-scale Board's actual roadmap. See [BLR-0007](../decisions/BLR-0007.md).

## Accepted decisions

- [BLR-0001](../decisions/BLR-0001.md): CS subject/chapter curriculum with later contextual review.
- [BLR-0002](../decisions/BLR-0002.md): Java/Spring backend-first, later dedicated AI/cloud depth.
- [BLR-0003](../decisions/BLR-0003.md): retain the actual Large-scale Board roadmap, hands-on and incident experiments.
- [BLR-0004](../decisions/BLR-0004.md): chapter-by-chapter system-design reasoning from both volumes.
- [BLR-0005](../decisions/BLR-0005.md): separate user-led domain design plus AI-assisted implementation.
- [BLR-0006](../decisions/BLR-0006.md): learning Sentry vs portfolio-specific trade-off decision.
- [BLR-0007](../decisions/BLR-0007.md): concept-first architecture learning with worked Java/Spring examples and Korean engineering sources.

## Existing project boundaries (not re-authorized or changed here)

- [DevPedia](devpedia.md) remains the user-implemented project with **design-only** Wiki capture; AI may support explanations and reviews but must not claim code authorship.
- [PawCycle](pawcycle.md) retains its existing AI-assisted/harness/reverse-engineering/operations track and **full** Wiki capture policy. Historical audit belongs in [Draft PR #18](https://github.com/guseoh/cs/pull/18), separate from this learning decision set.
- CSForge remains on its existing **full** mode and Dark Todo on **manual** capture; this learning note does not change them.
- Large-scale Board's own repo and [GitHub Wiki](https://github.com/guseoh/large-scale-board/wiki) remain authoritative for its detailed project-specific design evolution and experiments. This central AI Wiki stores the cross-project plan and relevant decisions.

## Open questions and next actions

- Continue the already established Board roadmap; actual next Slice/current code and tests must be checked in the Board repository before teaching or marking progress.
- Practical exercise directions include logistics and streaming; a single production project/domain, detailed design boundaries, concrete AI feature scope and schedule have **not** been fixed.
- Sentry installation milestone, portfolio tool selection and measured benefits are **not verified**.
- Cloud and AI study expansion has no fixed start date. Backend-versus-adjacent-role boundaries may be refined through actual requirements.
- Economic-literacy study appeared in the original planning diagram, but a specific curriculum or schedule was **not confirmed** and is not an accepted decision here.

## Evidence and verification limits

The learning intent and priorities come from the 2026-11-04 discussion plus user clarifications on 2026-11-05. Linked Large-scale Board source documents were checked to preserve the existing order and scope; this does **not** certify actual daily study, completed phases, successful experiments, the existence of a newly built domain service, a Sentry deployment or live portfolio observability. No private conversation transcript or image is published.
