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
related_to: [BLR-0001, BLR-0002, BLR-0003, BLR-0004, BLR-0005, BLR-0006, BLR-0007, BLR-0008, BLK-0001, AGT-0001, AGK-0001]
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

The user reviewed the full Windows-host/WSL2-to-Ubuntu-VM curriculum and requested that the direction and roadmap be recorded and used for the immediate start. The chosen practice path is **no app project for early Linux fundamentals -> Nginx static HTML -> minimal Java/Spring Boot API -> single-server operational and failure-recovery exercises**. The cross-cutting learning spine is the request lifecycle through naming, TCP/ports, TLS, Nginx proxy, the Java process and HTTP response, with OS/socket/systemd/log evidence and layered incident diagnosis. This builds web-service operating-environment literacy, **not complete infrastructure/network/kernel specialization**. Preserve advanced cloud and multi-node subjects as deferred. See [BLR-0007](../decisions/BLR-0007.md), [BLR-0008](../decisions/BLR-0008.md), and [BLK-0001 roadmap](../knowledge/BLK-0001.md). **Phase 0 was subsequently completed based on user-supplied terminal output** (Ubuntu 24.04.4 LTS inside WSL2, Linux WSL2 kernel, Bash and Linux home path). This does not imply independent access or validation by the assistant. Phase 1 file/shell and Phase 2 permission/process exercises were **completed on user-provided command-output evidence**. The missing-file `ls` was rerun with immediate exit status `2`, `chmod 000`/`600` showed denied/read-restored, and a background `sleep` process was observed, terminated via SIGTERM (wait status `143`) and no longer found by `ps`. Phase 3's WSL2 read-only package/systemd/journal/resource observation and a new lab-specific heartbeat service were **completed on user-shared terminal evidence**: start/stop/restart and enable/disable toggled expected states and symlinks; final state disabled/inactive. This is not independent execution and does **not** prove a separate Ubuntu Server VM boot/reboot lifecycle, Nginx, or production readiness. User requested a first theory-based consolidation of stages 0–3 before stage 4. The user refined delivery to short essential theory followed by fast, direct lab work, with deeper concept notes deferred to after the exercises.

## Accepted decisions

- [BLR-0001](../decisions/BLR-0001.md): CS subject/chapter curriculum with later contextual review.
- [BLR-0002](../decisions/BLR-0002.md): Java/Spring backend-first, later dedicated AI/cloud depth.
- [BLR-0003](../decisions/BLR-0003.md): retain the actual Large-scale Board roadmap, hands-on and incident experiments.
- [BLR-0004](../decisions/BLR-0004.md): chapter-by-chapter system-design reasoning from both volumes.
- [BLR-0005](../decisions/BLR-0005.md): separate user-led domain design plus AI-assisted implementation.
- [BLR-0006](../decisions/BLR-0006.md): learning Sentry vs portfolio-specific trade-off decision.
- [BLR-0007](../decisions/BLR-0007.md): bounded Ubuntu/Linux/web-server fundamentals with theory and direct practice.
- [BLR-0008](../decisions/BLR-0008.md): whole web request path as the cross-layer learning spine; advanced infra is deferred.

## Existing project boundaries (not re-authorized or changed here)

- [DevPedia](devpedia.md) remains the user-implemented project with **design-only** Wiki capture; AI may support explanations and reviews but must not claim code authorship.
- [PawCycle](pawcycle.md) retains its existing AI-assisted/harness/reverse-engineering/operations track and **full** Wiki capture policy. Historical audit belongs in [Draft PR #18](https://github.com/guseoh/cs/pull/18), separate from this learning decision set.
- CSForge remains on its existing **full** mode and Dark Todo on **manual** capture; this learning note does not change them.
- Large-scale Board's own repo and [GitHub Wiki](https://github.com/guseoh/large-scale-board/wiki) remain authoritative for its detailed project-specific design evolution and experiments. This central AI Wiki stores the cross-project plan and relevant decisions.

## Open questions and next actions

- **Ubuntu track:** Phase 0 is complete **on user-provided evidence**, not independent system inspection. Phase 1 and Phase 2 are complete based on user-shared terminal evidence. Consolidate stages 0–3 into a concept-learning note grounded in actual terminal evidence, and then resume Phase 4 network/HTTP/Nginx practice. WSL2 service work is complete; the standalone VM reboot persistence gate remains open. VM selection, Nginx, Spring Boot and later labs remain pending.

- Continue the already established Board roadmap; actual next Slice/current code and tests must be checked in the Board repository before teaching or marking progress.
- Practical exercise directions include logistics and streaming; a single production project/domain, detailed design boundaries, concrete AI feature scope and schedule have **not** been fixed.
- Sentry installation milestone, portfolio tool selection and measured benefits are **not verified**.
- Cloud and AI study expansion has no fixed start date. Backend-versus-adjacent-role boundaries may be refined through actual requirements.
- Economic-literacy study appeared in the original planning diagram, but a specific curriculum or schedule was **not confirmed** and is not an accepted decision here.

## Evidence and verification limits

The learning intent and priorities come from the 2026-11-04 discussion plus user clarifications on 2026-11-05. Linked Large-scale Board source documents were checked to preserve the existing order and scope; this does **not** certify actual daily study, completed phases, successful experiments, the existence of a newly built domain service, a Sentry deployment or live portfolio observability. No private conversation transcript or image is published.
