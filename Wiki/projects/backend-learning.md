---
id: PRJ-BACKEND-LEARNING
type: project
project: backend-learning
status: active
created_at: 2026-11-04
updated_at: 2026-11-08
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://github.com/guseoh/large-scale-board/blob/main/README.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/ROADMAP.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/PROJECT_HANDOFF.md
depends_on: []
supersedes: []
related_to: [BLR-0001, BLR-0002, BLR-0003, BLR-0004, BLR-0005, BLR-0006, BLR-0007, BLR-0008, BLR-0009, BLR-0010, BLK-0001, BLK-0002, AGT-0001, AGK-0001]
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
| Ubuntu / Linux / web server | First-phase scope: Linux fundamentals, web-server architecture, single Ubuntu server operations. Theory plus direct hands-on practice; learn commands in context, not by memorizing all commands. |

## 2026-11-05 clarification — design and AI roles

System-design ability is treated as **CS + Java/Spring + database/operations foundations + domain knowledge applied to actual requirements, constraints, trade-offs and tests**. The two system-design volumes remain a reasoning curriculum, while logistics/streaming-oriented exercises combine hands-on design with AI-assisted implementation and verification. The selection of one fully scoped new system has not been established.

AI coding prompts, task delegation, harness practices, code review and verification are trained in those **existing domain project plans**, rather than in a new duplicate vibe-coding curriculum. [AgentLab](agentlab.md) has a different role: study LLM/Agent internals and Java/Spring AI feature integration using Spring AI and selected Hermes comparisons. This does not replace the backend-first priority or authorize full-time AI-specialist depth.

See [BLR-0005](../decisions/BLR-0005.md), [AGT-0001](../decisions/AGT-0001.md) and [AI adoption Q&A](../knowledge/AGK-0001.md).

## 2026-11-08 — bounded Ubuntu / Linux learning scope

The user confirmed a first phase covering **Linux fundamentals, the web-server request path and operation of a single Ubuntu server**. The delivery format combines **conceptual explanation and hands-on Ubuntu practice**, without rote memorization of an exhaustive command list. This supplements the Java/Spring-first plan rather than changing the separate in-depth cloud study priority.

The user reviewed the full Windows-host/WSL2-to-Ubuntu-VM curriculum and requested that the direction and roadmap be recorded and used for the immediate start. The chosen practice path is **no app project for early Linux fundamentals -> Nginx static HTML -> minimal Java/Spring Boot API -> single-server operational and failure-recovery exercises**. The cross-cutting learning spine is the request lifecycle through naming, TCP/ports, TLS, Nginx proxy, the Java process and HTTP response, with OS/socket/systemd/log evidence and layered incident diagnosis. This builds web-service operating-environment literacy, **not complete infrastructure/network/kernel specialization**. Preserve advanced cloud and multi-node subjects as deferred. See [BLR-0007](../decisions/BLR-0007.md), [BLR-0008](../decisions/BLR-0008.md), and [BLK-0001 roadmap](../knowledge/BLK-0001.md). **No lab setup or phase completion has yet been verified.**

## 2026-11-08 — selective Spring Framework / Spring Boot curriculum method

The user confirmed a Spring-first learning approach using the seven selected Kim Young-han course tracks **only as a progression scaffold**, with supplied PDFs and sample code as references. The learning output is a standalone, causally connected Spring explanation centered on modern REST API backend coding, component behavior, IoC/DI, MVC, transactions, AOP, Boot configuration and operations. Depth varies with engineering value rather than lecture length.

A full lecture-by-lecture summary is rejected: omit XML-configuration exercises, Thymeleaf template syntax and repeated teaching-domain implementation when not needed; preserve just enough handwritten Servlet/MVC evolution to explain Spring MVC. Do not infer these technologies are unsupported. Add current essential Spring behavior missing from a PDF, using official sources, and avoid duplicating the separate JPA, database, HTTP and Security tracks. No mandatory quizzes or new test exercises.

**Planning boundary:** the precise filtered syllabus, per-topic depth and additional topics remain **unverified/proposed** until the user-directed full-source review in ChatGPT Work. The supplied `Spring.zip` archive listing (72 PDFs plus example project files) was inspected, but the PDF contents were not comprehensively evaluated in this Wiki task. See [BLR-0009](../decisions/BLR-0009.md). No course completion, new source code or curriculum approval is implied.

## 2026-11-08 — draft Spring Core/Boot 34-unit learning syllabus

A follow-up assistant design proposed [BLK-0002](../knowledge/BLK-0002.md), a **draft** with **7 course tracks, 34 selected learning units and 17 priority deep-dive units**. It incorporates 15 Spring Advanced PDFs in addition to the original 72-PDF archive, and lists proposed omissions, consolidation, and modern Spring API/operations additions. The plan centers on current REST API backend work and reuses [the accepted teaching method](../decisions/BLR-0009.md). This is a proposed **topic map**, not 34 mandatory long essays.

**Authority boundary:** the specific 34-unit split, depth choices, additional Spring topics and original-PDF mappings are **not yet explicitly approved by the user**. The prior assistant reported 87 PDFs/2,206 pages, but this Wiki update did not re-audit every PDF or execute code against Spring Boot 4. File contents and up-to-date API differences must be checked before presenting uncertain mappings as verified facts. Do not replace the accepted [BLR-0009](../decisions/BLR-0009.md) learning-method decision with the draft.

## 2026-11-08 — approved Spring Core/Boot 34-unit learning syllabus

The user **approved the detailed curriculum** documented in [BLK-0002](../knowledge/BLK-0002.md): seven tracks, 34 concept units, 17 priority deep dives and targeted exclusions/additions. The earlier draft record has become **published / user-confirmed**, with a separate acceptance decision [BLR-0010](../decisions/BLR-0010.md). The older draft discussion remains in historical sections only.

**Reset for a new ChatGPT session:** start again from **topic 01 (object-oriented design and IoC/DI)**, even though an earlier explanation exists. Do not mark topic 01 or any other unit completed from prior draft writing. The syllabus is approved, but PDF-to-topic evidence and exact Spring Boot version-specific behavior require topic-local source verification; user approval is not an execution or PDF-audit claim.

## Accepted decisions

- [BLR-0001](../decisions/BLR-0001.md): CS subject/chapter curriculum with later contextual review.
- [BLR-0002](../decisions/BLR-0002.md): Java/Spring backend-first, later dedicated AI/cloud depth.
- [BLR-0003](../decisions/BLR-0003.md): retain the actual Large-scale Board roadmap, hands-on and incident experiments.
- [BLR-0004](../decisions/BLR-0004.md): chapter-by-chapter system-design reasoning from both volumes.
- [BLR-0005](../decisions/BLR-0005.md): separate user-led domain design plus AI-assisted implementation.
- [BLR-0006](../decisions/BLR-0006.md): learning Sentry vs portfolio-specific trade-off decision.
- [BLR-0007](../decisions/BLR-0007.md): bounded Ubuntu/Linux/web-server fundamentals with theory and direct practice.
- [BLR-0008](../decisions/BLR-0008.md): whole web request path as the cross-layer learning spine; advanced infra is deferred.
- [BLR-0009](../decisions/BLR-0009.md): selectively study modern Spring concepts from PDFs; this method decision preceded the detailed syllabus approval.
- [BLR-0010](../decisions/BLR-0010.md): accept the 7-track / 34-unit Spring learning curriculum and restart from topic 01.

## Existing project boundaries (not re-authorized or changed here)

- [DevPedia](devpedia.md) remains the user-implemented project with **design-only** Wiki capture; AI may support explanations and reviews but must not claim code authorship.
- [PawCycle](pawcycle.md) retains its existing AI-assisted/harness/reverse-engineering/operations track and **full** Wiki capture policy. Historical audit belongs in [Draft PR #18](https://github.com/guseoh/cs/pull/18), separate from this learning decision set.
- CSForge remains on its existing **full** mode and Dark Todo on **manual** capture; this learning note does not change them.
- Large-scale Board's own repo and [GitHub Wiki](https://github.com/guseoh/large-scale-board/wiki) remain authoritative for its detailed project-specific design evolution and experiments. This central AI Wiki stores the cross-project plan and relevant decisions.

## Open questions and next actions

- **Spring curriculum:** start the [approved BLK-0002 curriculum](../knowledge/BLK-0002.md) in a new ChatGPT session from **unit 01**. At each unit, check the supplied PDF against current official Spring reference material where necessary; avoid marking any unit complete solely because an earlier draft explanation exists.

- **Ubuntu track:** start [BLK-0001 phase 0](../knowledge/BLK-0001.md) by discovering the actual Windows/WSL installation state, then proceed only from observed outputs. The local Ubuntu version, VM product, installed tools, completed exercises and real configuration are **not yet verified**.

- Continue the already established Board roadmap; actual next Slice/current code and tests must be checked in the Board repository before teaching or marking progress.
- Practical exercise directions include logistics and streaming; a single production project/domain, detailed design boundaries, concrete AI feature scope and schedule have **not** been fixed.
- Sentry installation milestone, portfolio tool selection and measured benefits are **not verified**.
- Cloud and AI study expansion has no fixed start date. Backend-versus-adjacent-role boundaries may be refined through actual requirements.
- Economic-literacy study appeared in the original planning diagram, but a specific curriculum or schedule was **not confirmed** and is not an accepted decision here.

## Evidence and verification limits

The learning intent and priorities come from the 2026-11-04 discussion plus user clarifications on 2026-11-05. Linked Large-scale Board source documents were checked to preserve the existing order and scope; this does **not** certify actual daily study, completed phases, successful experiments, the existence of a newly built domain service, a Sentry deployment or live portfolio observability. No private conversation transcript or image is published.
