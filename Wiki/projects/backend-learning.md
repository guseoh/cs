---
id: PRJ-BACKEND-LEARNING
type: project
project: backend-learning
status: active
created_at: 2026-11-04
updated_at: 2026-11-25
evidence_level: user-confirmed
capture_mode: manual
sources:
  - https://github.com/guseoh/large-scale-board/blob/main/README.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/ROADMAP.md
  - https://github.com/guseoh/large-scale-board/blob/main/docs/PROJECT_HANDOFF.md
depends_on: []
supersedes: []
related_to: [BLR-0001, BLR-0002, BLR-0003, BLR-0004, BLR-0005, BLR-0006, BLR-0007, BLR-0008, BLR-0009, BLR-0010, BLR-0011, BLR-0012, BLK-0001, BLK-0002, BLK-0003, AGT-0001, AGK-0001, BLR-0013, BLR-0014, BLR-0015, BLR-0016, BLR-0017, PRJ-LOGISTICS-LEARNING, LGR-0001, LGK-0001, PRJ-BACKEND-SYSTEMS-LAB, BSL-0001, BSL-0002, BSL-0003, BSK-0001]
---

# 백엔드 학습 — 프로젝트 공통 현황

## 2026-11-25 — Obsidian 학습 도식화 저장 방식 개선

Java 학습 노트에서 인라인 SVG 6개의 편집 모드 잔상·색상·크기 조절 문제를 확인 대상으로 삼고, 독립 SVG 첨부와 폭 지정 링크로 전환하는 방향을 적용한다. 원격 원본에서 인라인 데이터와 관련 CSS는 확인했으나 실제 로컬 렌더링 검증은 미완료다. 수동 파일 저장 없이 기존 복사·붙여넣기를 유지하기 위해 Vault 전용 자동 SVG 첨부 플러그인을 추가한다. SHA-256 중복 방지, 실패 시 원문 유지, 현재 노트 변환 명령을 제공하며 실제 Obsidian 이벤트 동작은 미검증이다. [학습 운영 가이드](../knowledge/BLK-0003.md#학습-도식화의-저장-방식-2026-11-25)를 따른다. 기존 학습 범위와 진도 판정은 바꾸지 않는다.

## 2026-11-21 — Large-scale Board의 REST API 기본기 우선순위 확정

사용자는 `large-scale-board`가 Spring REST API의 기본 구현 전에 Snowflake·대용량 데이터 생성·장애 훈련·정교한 예외 처리 및 인프라 구성을 먼저 진행해, 학습의 중심이 바뀌었다고 판단했습니다. **앞으로는 Article REST API의 HTTP 요청·응답, DTO/Validation, JPA CRUD, 트랜잭션, 목록·페이징, 최소 예외·테스트부터 학습**합니다. [최신 결정 BLR-0017](../decisions/BLR-0017.md)과 [소스 PR #7](https://github.com/guseoh/large-scale-board/pull/7)을 따릅니다.

- **새 진행 원칙:** 먼저 작동하는 작은 API를 만들고, 실제 요구사항이나 관측된 실패가 생긴 뒤 고급 기술을 도입합니다. Pure Java J01~J05는 필요 시 복습하며 전체 설계 문서·미래 아키텍처를 선행 조건으로 두지 않습니다. S06 인증은 필요한 기능 단계에서 진행합니다.
- **보존:** 기존 Phase 0~13의 로드맵과 완료된 DB 적재·장애 실험 및 Snowflake·`BaseEntity`·모니터링 관련 코드·ADR은 폐기하지 않습니다. 실패/성능 테스트의 확인된 근거를 무효화하거나 자동 재실행하지 않습니다.
- **안전 경계:** 입력 검증, DB 무결성, 필요 인증·인가, 트랜잭션, 정보 노출 방지는 필수입니다. 대신 계약·문제 증거 없이 방어 코드·오류 분류·추상화를 늘리지 않습니다.
- **역할 유지:** [BLR-0015](../decisions/BLR-0015.md)의 사용자 `src/main` 직접 구현과 AI의 테스트/도구 지원은 변경하지 않았습니다. 이번 작업은 문서만 수정하며 코드 완성이나 실행 결과를 주장하지 않습니다.
- **원격 확인:** 2026-11-21 기준 `main`에는 Article CRUD가 확인되지 않았고, 2026-11-19 `main` CI가 성공했습니다. 별도 `phase/1b-signup` 작업과 미완료 테스트는 기본 REST API 완료로 간주하지 않습니다.
- **다음:** 환경(S01) 간단 확인 후 **S02 Article Controller와 HTTP API**를 시작합니다. `guseoh/large-scale-board`의 최신 `README.md`/`AGENTS.md`/`docs/PROJECT_HANDOFF.md`를 진행 기준으로 사용합니다.

기존 [BLR-0003](../decisions/BLR-0003.md)의 *초기 필수 순서*만 후속 결정으로 대체되고, 기존 Phase 로드맵 보존 및 실험 중심 학습의 근거는 역사적 기록으로 유지됩니다.

## 2026-11-20 — Spring 개념 학습 형식 개편 (사용자 확정)

[BLR-0016](../decisions/BLR-0016.md): **장문의 설명글 중심에서 구조화된 개념 정리·문제 해결·점진적 코드 개선 중심으로 전환**한다. 문제 코드의 원인과 개선 이유를 먼저 보여주고, 불필요하게 오래된 코드를 반복하지 않으면서 이전 방식 → 개선된 방식 → 공식 문서로 검증한 현행 Spring 구현으로 연결한다. PDF 코드·도식을 적극 활용하고 한글 기술 블로그와 국내 IT 기업 기술 블로그를 참고하며, 버전 차이는 Spring 공식 문서로 검증한다. 글머리 기호·표·그림을 적극 사용하되 필수 동작 원리는 생략하지 않는다.

[확정 7과정·34주제·17개 우선 심화](../knowledge/BLK-0002.md)는 변경하지 않는다. 이전 01·02번 설명은 학습 완료로 처리하지 않고 다시 01부터 진행한다. Obsidian 문서 완성, 일괄 심화, 자동 퀴즈·실습은 요구하지 않는다. 학습법만 확정했으며 개별 PDF의 모든 코드에 대한 현행 버전 호환성, 실제 예제 실행·학습 완료는 미검증이다. Java·JPA·Security의 별도 학습 방식과 다른 프로젝트의 작업 계약도 변경하지 않는다.

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

## 2026-11-19 — Large-scale Board 1단계 1-A 완료, 1-B 진행 중

**확인된 상태(저장소 근거):** [large-scale-board PR #5](https://github.com/guseoh/large-scale-board/pull/5)를 병합했다(`main` `5631212`, 테스트 72개 통과). 0단계는 이미 완료([PR #4](https://github.com/guseoh/large-scale-board/pull/4)). 1단계(회원과 인증)는 6개 묶음(1-A~1-F) 중 **1-A와 1-B-3이 완료, 1-B-1/1-B-2는 사용자의 main 코드 작성 대기**다.

| 스텝 | 결과 | 근거 |
| --- | --- | --- |
| 1-A-1 시간 탐침 | `Instant` + UTC `DATETIME(6)` 채택. `LocalDateTime`은 KST JVM에서 DB 값이 9시간 어긋나는데 같은 JVM에서 읽으면 정상처럼 보인다(변환 상쇄) | [ADR-008](https://github.com/guseoh/large-scale-board/wiki/ADR-008-Instant-and-UTC-Datetime) |
| 1-A-2 `BaseEntity` | 직접 할당 ID의 `save()`는 SQL 2번(SELECT+INSERT), `Persistable` 구현 후 1번. JPA Auditing을 `Clock` 기반으로 사용 | [ADR-009](https://github.com/guseoh/large-scale-board/wiki/ADR-009-BaseEntity-Persistable-Auditing) |
| 1-A-3 `Member` | 직접 쓴 DDL과 Hibernate 생성 DDL이 같아지려면 enum을 `VARCHAR`로 고정하고 유니크 제약에 이름을 붙여야 한다 | [Step-1-Plan §11.3](https://github.com/guseoh/large-scale-board/wiki/Step-1-Plan) |
| 1-A-4 ID 문자열화 | 응답 DTO의 ID는 `String`, ArchUnit R7로 누락을 막는다 | ADR-005, R7 |
| 1-B-2 안티패턴 | UNIQUE 없이 선조회하면 동시 요청 두 개가 모두 통과해 중복 행이 생긴다(테스트로 재현) | `CheckThenActAntiPatternTest` |
| 1-B-3 트랜잭션 실험 | self-invocation·private·체크 예외 커밋·삼킨 예외의 `UnexpectedRollbackException`·`REQUIRES_NEW` 8가지를 테스트로 고정 | `TransactionTrapTest` |

**운영 방식:** [BLR-0015](../decisions/BLR-0015.md) — 사용자는 `src/main`, AI는 테스트·스크립트·측정 도구를 작성한다.

**다음 작업(다른 PC에서 1-B부터 이어서 진행하기로 함, 2026-11-19):** 사용자가 1-B 가입 API main 코드(7개 중 5개 남음)를 작성하고 보류된 테스트 4개로 검증한 뒤, 1-C(Spring Security 필터 체인, 401/403 통일) → 1-D(JWT·Refresh 회전) → 1-E(인가) → 1-F(100만 건 데이터, BCrypt·인덱스 실험, 장애 훈련 2건). 이어갈 정확한 지점과 정답 코드는 Board Wiki의 [Handoff §4](https://github.com/guseoh/large-scale-board/wiki/Handoff-Continue-On-Another-PC)와 [Step-1-Plan §11](https://github.com/guseoh/large-scale-board/wiki/Step-1-Plan)이 정본이다.

**미검증:** 로그인·JWT·Security는 아직 구현되지 않았다. BCrypt 강도·인덱스·부하 실험 수치는 없다. 위 테스트 결과는 사용자 PC(Windows, Testcontainers MySQL 8.4)에서의 실행 기준이며 배포 환경 검증이 아니다.

## 2026-11-19 — 여섯 도메인과 설계 교재 1·2권의 통합 저장소 운영 확정

사용자는 물류·대중교통 경로 검색·실거래가 분석·티켓팅·주차장·이벤트 분석을 **서로 독립 실행할 수 있는 여섯 Spring Boot 앱**으로 개발하되 **하나의 신규 GitHub 저장소**에서 모듈별로 관리하기로 확정했다. [통합 학습 프로젝트 현황](backend-systems-lab.md), [6개 앱 결정 BSL-0001](../decisions/BSL-0001.md).

기존 [두 권의 시스템 설계 학습 결정 BLR-0004](../decisions/BLR-0004.md)는 유지한다. 두 권의 장별 설계 실습도 **같은 저장소의 별도 설계 트랙**으로 배치하며 매 장을 개별 애플리케이션으로 구현할 의무는 없다. [교재 통합 결정 BSL-0002](../decisions/BSL-0002.md), [교재-도메인 대응 초안](../knowledge/BSK-0001.md).

이 통합 학습 프로젝트는 AI 채팅의 정답 코드 제공·사용자 로컬 작성과 어려운 기술의 힌트 우선 방식을 따른다. 물류는 [기존 세부 학습 기록](logistics-learning.md)을 보존한 **첫 도메인 앱**이다. 다른 [Large-scale Board의 1단계 역할 분담 결정 BLR-0015](../decisions/BLR-0015.md)는 별개이며 **변경하지 않는다**.

**검증 경계:** 저장소 이름 `backend-systems-lab`은 가칭이다. 새 저장소, GitHub Wiki, Gradle 멀티 프로젝트, 6개 실행 앱, 교재 장별 실습/테스트는 아직 생성·검증되지 않았다.

## 2026-11-19 — 백엔드·시스템 설계·RAG 중심으로 학습 축 구체화

신규 통합 연구실의 현재 중심은 **Backend Engineering(Java/Spring) + System Design + RAG**로 사용자 확정되었다. 여섯 개 독립 실행 도메인 앱은 유지하면서 RAG 검색·임베딩·벡터/하이브리드 검색·평가를 새로운 학습 대상으로 추가한다. RAG 구현 위치(별도 앱 또는 실험)는 아직 선택되지 않았다.

두 권의 시스템 설계 교재는 **같은 저장소에서 공부하기로 한 과거 결정은 유지하되 즉시 착수하지 않는 후순위 항목**으로 변경했다. 프로젝트/저장소 명칭은 `backend-systems-lab` 등이 **추천 후보**이고 아직 선택되지 않았다. [최신 학습 운영 결정 BSL-0003](../decisions/BSL-0003.md) 및 [통합 학습 프로젝트 현황](backend-systems-lab.md)을 참조한다.

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
- [BLR-0015](../decisions/BLR-0015.md): Large-scale Board 1단계 — 사용자는 main 코드, AI는 테스트·스크립트·측정 도구, 정답 코드 우선 제시.
- [LGR-0001](../decisions/LGR-0001.md): 물류 학습 프로젝트를 현재 채팅에서 시작하고 중앙·프로젝트 Wiki에 결정·진척·실험 기록.

## Existing project boundaries (not re-authorized or changed here)

- [DevPedia](devpedia.md) remains the user-implemented project with **design-only** Wiki capture; AI may support explanations and reviews but must not claim code authorship.
- [PawCycle](pawcycle.md) retains its existing AI-assisted/harness/reverse-engineering/operations track and **full** Wiki capture policy. Historical audit belongs in [merged PR #18](https://github.com/guseoh/cs/pull/18), separate from this learning decision set.
- CSForge remains on its existing **full** mode and Dark Todo on **manual** capture; this learning note does not change them.
- Large-scale Board's own repo and [GitHub Wiki](https://github.com/guseoh/large-scale-board/wiki) remain authoritative for its detailed project-specific design evolution and experiments. This central AI Wiki stores the cross-project plan and relevant decisions.

## Open questions and next actions

- **Spring curriculum:** start the [approved BLK-0002 curriculum](../knowledge/BLK-0002.md) in a new ChatGPT session from **unit 01**. At each unit, check the supplied PDF against current official Spring reference material where necessary; avoid marking any unit complete solely because an earlier draft explanation exists.

- **Ubuntu track:** start [BLK-0001 phase 0](../knowledge/BLK-0001.md) by discovering the actual Windows/WSL installation state, then proceed only from observed outputs. The local Ubuntu version, VM product, installed tools, completed exercises and real configuration are **not yet verified**.

- Large-scale Board: **1단계 1-B(가입 API) 마무리 → 1-C**부터 이어간다(위 2026-11-19 항목). 실제 코드·테스트 상태는 항상 Board 저장소와 Wiki 진행표에서 다시 확인한다.
- **새 통합 학습 프로젝트는 여섯 독립 앱 및 설계 교재 1·2권 트랙으로 확정**했다. 첫 집중 분야는 물류이며 실제 저장소·코드·세부 기술 스택과 각 영역의 일정/완료 기준은 아직 미정이다.
- Sentry installation milestone, portfolio tool selection and measured benefits are **not verified**.
- Cloud and AI study expansion has no fixed start date. Backend-versus-adjacent-role boundaries may be refined through actual requirements.
- Economic-literacy study appeared in the original planning diagram, but a specific curriculum or schedule was **not confirmed** and is not an accepted decision here.

## Evidence and verification limits

The learning intent and priorities come from the 2026-11-04 discussion plus user clarifications on 2026-11-05. Linked Large-scale Board source documents were checked to preserve the existing order and scope; this does **not** certify actual daily study, completed phases, successful experiments, the existence of a newly built domain service, a Sentry deployment or live portfolio observability. No private conversation transcript or image is published.


## 2026-11-06 학습 운영 결정 보존 — 2026-11-19 ID 충돌 조정

- [BLR-0013](../decisions/BLR-0013.md): 독립적 시스템 설계 이전에 설명형 아키텍처 학습과 Java/Spring 실행 예제, 국내 기술 사례, 역설계 및 점진적 가이드 설계를 결합합니다. 공개 강의의 8개 섹션·59개 주제는 주제 목차의 참고 근거이고, 6단계 교수법 구성은 별도의 미확정 세부 제안입니다.
- 원래 [#35](https://github.com/guseoh/cs/pull/35)·[#36](https://github.com/guseoh/cs/pull/36)은 이 결정을 `BLR-0007`로 기록하려 했으나 해당 ID는 Ubuntu 학습 결정과 충돌합니다. 기존 Ubuntu 기록은 수정하지 않았습니다.
- [BLR-0012](../decisions/BLR-0012.md)의 Java/Spring 핵심 집중·선택적 심화 원칙을 우선해 적용하며, 실제 강의 수강/개별 예제 실행/학습 완료 여부는 별도입니다.
