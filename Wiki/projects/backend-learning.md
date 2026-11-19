---
id: PRJ-BACKEND-LEARNING
type: project
project: backend-learning
status: active
created_at: 2026-11-04
updated_at: 2026-11-19
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://github.com/guseoh/large-scale-board/blob/main/README.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/ROADMAP.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/PROJECT_HANDOFF.md
depends_on: []
supersedes: []
related_to: [BLR-0001, BLR-0002, BLR-0003, BLR-0004, BLR-0005, BLR-0006, BLR-0007, BLR-0008, BLR-0009, BLR-0010, BLR-0011, BLR-0012, BLK-0001, BLK-0002, BLK-0003, AGT-0001, AGK-0001, BLR-0013, BLR-0014, PRJ-LOGISTICS-LEARNING, LGR-0001, LGK-0001, BLR-0015, BLR-0016, PRJ-BACKEND-SYSTEMS-LAB, BSK-0001]
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

## 2026-11-17 — Java·Spring 재시작과 네 과정 학습 운영 경량화 (확정)

**현재 학습 방향:** Java와 Spring을 기초부터 다시 공부하며, JPA·Spring Security는 나중에 각각 독립된 과정으로 학습한다. 인프라·네트워크 전문직 준비는 당장 병행하지 않는다. 핵심 개념을 정확히 이해하고 코드·실무·코딩 테스트(별도 문제 풀이 필요)와 연결하는 것이 우선이다.

- **완료 기준:** 개념이 필요한 이유, 코드의 동작과 결과, 언제 사용하고 주의할지 설명할 수 있으면 우선 다음으로 진행한다. 모든 세부 구현을 암기하거나 매번 긴 설명을 완성할 필요는 없다.
- **AI 설명:** 핵심 원리와 실행 흐름은 충분히 설명하지만 비핵심 내부 구조·자료·이미지 수집은 필요에 따라 선별한다. 요청하지 않은 퀴즈·실습·일일 진도는 강제하지 않는다.
- **Obsidian:** 기존 Study 노트를 유지한다. 전체 내용을 완벽하게 다시 정리하지 않고, 혼동한 부분이나 재사용할 실무 판단만 선택적으로 기록한다.
- **로드맵:** 기존 Spring 7과정·34개 주제·17개 우선 심화는 변경하지 않는다. Java의 김영한 7과정, JPA·Security의 별도 과정도 유지한다. JPA 43개·Security 25개 상세 원본 목차는 이 Wiki 작업에서 재대조하지 않았으므로 개수 자체를 학습 의무량으로 삼지 않는다.
- **학습 재개:** Java 입문부터, Spring 01 「객체지향 설계와 IoC·DI」부터. 두 과정을 정해진 시간표로 반드시 병행하지 않는다. JPA·Security 시작 날짜와 실제 학습 진도는 아직 확정·검증되지 않았다.

근거: [확정 운영 결정 BLR-0012](../decisions/BLR-0012.md), [과정별 학습 가이드 BLK-0003](../knowledge/BLK-0003.md). 과거 지침 [BLR-0009](../decisions/BLR-0009.md)과 [BLR-0010](../decisions/BLR-0010.md)의 **주제 선택·현대 REST 백엔드 중심 방향은 계속 유효**하며, 과도한 장문 문서/도식 작성 의무에 대한 **최신 운영 방식만 갱신**한다.

## 2026-11-19 — 신규 대규모 도메인 프로젝트의 AI 공동 설계·구현 방식 확정

신규 도메인 기반 프로젝트는 **AI 기본 틀 + 전 영역 공동 설계·구현 + 사용자 최종 의사결정** 방식으로 진행한다. 요구사항·도메인·핵심 로직·알고리즘·트랜잭션·동시성·Kafka·장애 복구·데이터 처리·캐싱·성능 분석까지 함께 검토하고 코드를 작성할 수 있다. 처음 접하는 기술은 AI가 문제와 개념을 설명하고 힌트·대안을 제시한 다음 사용자가 결정하도록 안내한다. 직접 코딩을 필수 통과 조건으로 두지 않고, 의사결정의 근거와 검증 결과를 이해하는지를 중심으로 학습한다.

[확정 결정 BLR-0014](../decisions/BLR-0014.md)는 기존 [BLR-0005](../decisions/BLR-0005.md)의 협업 역할을 구체화한다. 구체적인 도메인, 구현·배포 여부는 **미확정**이다. Large-scale Board·DevPedia·PawCycle의 기존 프로젝트별 구현 규칙 및 Wiki capture mode는 자동으로 바뀌지 않는다.

## 2026-11-19 — 별도 물류 학습 프로젝트의 범위·채팅 진행 확정

사용자는 이전의 물류·이벤트 분석 등 도메인 후보 중 **물류 시스템**을 선택하고 현재 채팅 세션에서 학습을 시작하기로 했다. [프로젝트 현황](logistics-learning.md)과 [확정 결정 LGR-0001](../decisions/LGR-0001.md)을 따른다. 이 프로젝트는 처음에는 **포트폴리오가 아닌 학습 목적**이며, 결과가 고도화되었을 때 포트폴리오 전환 여부를 검토한다.

[BLR-0014](../decisions/BLR-0014.md)의 AI 협업 방식은 **채팅에 완성 코드를 제공하고 사용자가 빠르게 로컬에서 작성·실행**하는 형태로 구체화되었다. 요구사항·도메인 모델·핵심 비즈니스 로직·알고리즘·트랜잭션·동시성·성능과 기술적 판단은 공동 설계하되 사용자가 최종 결정한다. Kafka·장애 복구·데이터 파이프라인·캐시·고급 최적화는 **첫 경험에서 힌트를 우선** 제공하고, 필요하면 정답 코드를 제시한다. 중요한 결정·실험·진척은 중앙 Wiki에 기록하며 새 원본 저장소·프로젝트 Wiki가 준비되면 그곳에도 상세 기록한다.

**확인 한계:** 새 저장소·코드·테스트·GitHub Wiki는 아직 없다. 첫 제품 범위(출고센터 결정·재고 할당)는 [제안 단계](../knowledge/LGK-0001.md)이다. 기존 Large-scale Board·PawCycle·DevPedia 규칙은 바뀌지 않는다.

## 2026-11-19 — 여섯 학습 도메인 단일 저장소 운영 확정

당일 최초 제안이 사용자 후속 승인으로 확정되었다. 물류·대중교통 경로 검색·실거래가 데이터 분석·티켓 예매·주차장 검색/예약·이벤트 수집/분석의 **독립 실행 Spring Boot 학습 애플리케이션 여섯 개**를 **단일 GitHub 저장소**에서 각 모듈로 진행한다. [BLR-0015](../decisions/BLR-0015.md)는 `accepted`이다. 구체적인 Gradle 빌드·앱별 DB·서비스 인터페이스는 아직 설계하지 않았다.

추가로 『가상 면접 사례로 배우는 대규모 시스템 설계 기초』 **1·2권의 설계 연습도 같은 저장소**에서 [별도 학습 트랙](../decisions/BLR-0016.md)으로 수행한다. 기존 [책 학습 결정 BLR-0004](../decisions/BLR-0004.md)를 변경하지 않고 저장소 위치와 산출물 방식을 구체화한 것이다. [통합 프로젝트 현황](backend-systems-lab.md)과 [교재-도메인 매핑](../knowledge/BSK-0001.md)에 연결한다. 신규 저장소·코드·Wiki·CI는 아직 생성/검증되지 않았다.

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
- [BLR-0011](../decisions/BLR-0011.md): explain the whole project at a job-seeker level and study portfolio-worthy design choices in depth using code and evidence.
- [BLR-0012](../decisions/BLR-0012.md): Java/Spring 처음부터 재시작, JPA/Security 별도 운영, 핵심 이해와 선택적 Obsidian 정리.
- [BLR-0014](../decisions/BLR-0014.md): AI 채팅의 코드 제공·사용자 로컬 작성, 설계 공동 검토·사용자 결정, 어려운 기술은 힌트 우선.
- [LGR-0001](../decisions/LGR-0001.md): 물류 학습 프로젝트를 현재 채팅에서 시작하고 중앙·프로젝트 Wiki에 결정·진척·실험 기록.

## Existing project boundaries (not re-authorized or changed here)

- [DevPedia](devpedia.md) remains the user-implemented project with **design-only** Wiki capture; AI may support explanations and reviews but must not claim code authorship.
- [PawCycle](pawcycle.md) retains its existing AI-assisted/harness/reverse-engineering/operations track and **full** Wiki capture policy. Historical audit belongs in [merged PR #18](https://github.com/guseoh/cs/pull/18), separate from this learning decision set.
- CSForge remains on its existing **full** mode and Dark Todo on **manual** capture; this learning note does not change them.
- Large-scale Board's own repo and [GitHub Wiki](https://github.com/guseoh/large-scale-board/wiki) remain authoritative for its detailed project-specific design evolution and experiments. This central AI Wiki stores the cross-project plan and relevant decisions.

## Open questions and next actions

- **Spring curriculum:** start the [approved BLK-0002 curriculum](../knowledge/BLK-0002.md) in a new ChatGPT session from **unit 01**. At each unit, check the supplied PDF against current official Spring reference material where necessary; avoid marking any unit complete solely because an earlier draft explanation exists.

- **Ubuntu track:** start [BLK-0001 phase 0](../knowledge/BLK-0001.md) by discovering the actual Windows/WSL installation state, then proceed only from observed outputs. The local Ubuntu version, VM product, installed tools, completed exercises and real configuration are **not yet verified**.

- Continue the already established Board roadmap; actual next Slice/current code and tests must be checked in the Board repository before teaching or marking progress.
- **신규 통합 학습 프로젝트는 여섯 독립 앱 및 교재 1·2권 설계 트랙으로 확정**했다. 첫 집중 분야는 물류이며 여섯 도메인의 구체 기능 범위·기술 스택·새 저장소·코드·일정은 아직 정하지 않았다.
- Sentry installation milestone, portfolio tool selection and measured benefits are **not verified**.
- Cloud and AI study expansion has no fixed start date. Backend-versus-adjacent-role boundaries may be refined through actual requirements.
- Economic-literacy study appeared in the original planning diagram, but a specific curriculum or schedule was **not confirmed** and is not an accepted decision here.

## Evidence and verification limits

The learning intent and priorities come from the 2026-11-04 discussion plus user clarifications on 2026-11-05. Linked Large-scale Board source documents were checked to preserve the existing order and scope; this does **not** certify actual daily study, completed phases, successful experiments, the existence of a newly built domain service, a Sentry deployment or live portfolio observability. No private conversation transcript or image is published.


## 2026-11-06 학습 운영 결정 보존 — 2026-11-19 ID 충돌 조정

- [BLR-0013](../decisions/BLR-0013.md): 독립적 시스템 설계 이전에 설명형 아키텍처 학습과 Java/Spring 실행 예제, 국내 기술 사례, 역설계 및 점진적 가이드 설계를 결합합니다. 공개 강의의 8개 섹션·59개 주제는 주제 목차의 참고 근거이고, 6단계 교수법 구성은 별도의 미확정 세부 제안입니다.
- 원래 [#35](https://github.com/guseoh/cs/pull/35)·[#36](https://github.com/guseoh/cs/pull/36)은 이 결정을 `BLR-0007`로 기록하려 했으나 해당 ID는 Ubuntu 학습 결정과 충돌합니다. 기존 Ubuntu 기록은 수정하지 않았습니다.
- [BLR-0012](../decisions/BLR-0012.md)의 Java/Spring 핵심 집중·선택적 심화 원칙을 우선해 적용하며, 실제 강의 수강/개별 예제 실행/학습 완료 여부는 별도입니다.
