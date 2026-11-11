# LLM Wiki — AI entry point

This directory holds **retrievable context for AI tools**, not a duplicate of existing Study notes.GitHub guseoh/cs is the shared Markdown source; Obsidian renders these files after a successful Git sync.

## Retrieval protocol

1. Identify the specific project/topic and read its project snapshot.Check the **verification date and evidence scope**.
2. Follow the indexed decision IDs to understand the choice, rejected options, constraints and dependency relationships.
3. Resolve depends_on and supersedes chains before treating a decision as currently authoritative.
4. Confirm runtime claims separately from merged source and green CI; cite linked evidence and mark unresolved conflicts explicitly.
5. Only read needed records; do not load the entire Vault by default.Use the candidate inbox as an untrusted evidence queue, never as an accepted source of decisions.

## Project index

| Project | Snapshot | Last checked |
| --- | --- | --- |
| LLM Wiki itself | [PRJ-LLM-WIKI](projects/llm-wiki.md) | 2026-11-03 |
| Backend learning (cross-project) | [PRJ-BACKEND-LEARNING](projects/backend-learning.md) | 2026-11-08 |
| AgentLab (Spring AI / Agent study) | [PRJ-AGENTLAB](projects/agentlab.md) | 2026-11-05 |
| CSForge | [PRJ-CSFORGE](projects/csforge.md) · [Network audit blocked (#299)](https://github.com/guseoh/csforge/pull/299) · [Production sync failure (#300)](https://github.com/guseoh/csforge/issues/300) | 2026-11-09 |
| Dark Todo Planner | [PRJ-DARK-TODO](projects/dark-todo.md) | 2026-11-03 |
| PawCycle Commerce | [PRJ-PAWCYCLE](projects/pawcycle.md) | 2026-11-06 |
| DevPedia (design-only; repo access unverified) | [PRJ-DEVPEDIA](projects/devpedia.md) | 2026-11-03 |

## Repository maintenance observations

- [PawCycle scripts/docs cleanup inventory (2026-11-06)](projects/pawcycle.md#repository-cleanup-inventory--2026-11-06-analyzed-change-proposal-not-approved) — File tree, historical evidence, active CI dependencies, document status drift and phased cleanup candidates. **Analysis only; no repository deletion or change approved.**

## Active investigation handoffs

- [PawCycle — OCI E5→A1 G0 migration and data-preservation checkpoint (2026-11-06)](projects/pawcycle.md#oci-g0-session-handoff--2026-11-06-user-reported-cloud-observations-no-operations-approval): **NO-GO for cutover**, separately approved DB access/backup/restore gates, A1 monitor activation variable reported true but current run health unverified; 2026-11-06 strategy update: **OCI A1 acquisition, data backup/network/ARM64 readiness and local backend refactor/frontend design/reverse engineering proceed actively in parallel, not with local-first priority**; **AWS remains the main operations/deployment learning environment**. G0-R2.3 deeper backup Export study was paused (token limit), **backup replacement/safety remains unverified**, and Production cutover is still NO-GO. Network forms and security-rule matching only; Cloud Shell VNIC activation/IP/IAM and MySQL connection remain unverified. This summarizes user-supplied OCI observations, not independent production verification.

## Decision index

| ID | State | Decision | Project |
| --- | --- | --- | --- |
| [WIKI-0001](decisions/WIKI-0001.md) | accepted | Separate AI Wiki from Study | llm-wiki |
| [WIKI-0002](decisions/WIKI-0002.md) | accepted | Existing GitHub Markdown as common source | llm-wiki |
| [WIKI-0003](decisions/WIKI-0003.md) | accepted | PawCycle AI Project Memory: exhaustive source dispositions and continuous capture | llm-wiki |
| [CSF-0001](decisions/CSF-0001.md) | accepted | Guard canonical content sync to preserve history | csforge |
| [CSF-0002](decisions/CSF-0002.md) | accepted | Java editorial diagram semantics | csforge |
| [CSF-0003](decisions/CSF-0003.md) | accepted | Textbook-style static SVG first; three benchmark visuals before CSForge adoption | csforge |
| [CSF-0004](decisions/CSF-0004.md) | accepted | Network Pilot Pack: five concept-sized diagram units beginning with TCP handshake | csforge |
| [CSF-0005](decisions/CSF-0005.md) | accepted | Complete Network N-01–N-05 together, then consolidate QA without per-diagram approvals | csforge |
| [DTD-0001](decisions/DTD-0001.md) | accepted | Neutral content-first UI | dark-todo |
| [DTD-0002](decisions/DTD-0002.md) | accepted | Remove Inbox UI without deleting legacy data | dark-todo |
| [DTD-0003](decisions/DTD-0003.md) | accepted | Today reorder and compact Calendar detail | dark-todo |
| [PWC-0001](decisions/PWC-0001.md) | accepted | Separate CD readiness from production activation | pawcycle |
| [PWC-0002](decisions/PWC-0002.md) | accepted | Guard and time-bound OCI A1 acquisition | pawcycle |
| [PWC-0130](decisions/PWC-0130.md) | accepted | Parallel OCI A1 acquisition/readiness and local backend/frontend development | pawcycle |
| [PWC-0131](decisions/PWC-0131.md) | accepted | AWS-first operations/deployment learning, OCI conditional hosting | pawcycle |
| [BLR-0001](decisions/BLR-0001.md) | accepted | CS: academic chapter study, revisit through projects | backend-learning |
| [BLR-0002](decisions/BLR-0002.md) | accepted | Prioritize Java/Spring backend before dedicated AI/cloud study | backend-learning |
| [BLR-0003](decisions/BLR-0003.md) | accepted | Preserve Large-scale Board roadmap and direct failure experiments | backend-learning |
| [BLR-0004](decisions/BLR-0004.md) | accepted | Study both system design volumes chapter by chapter | backend-learning |
| [BLR-0005](decisions/BLR-0005.md) | accepted | Separate domain architecture and AI-assisted implementation track | backend-learning |
| [BLR-0006](decisions/BLR-0006.md) | accepted | Sentry learning in Board; portfolio requires trade-off review | backend-learning |
| [BLR-0007](decisions/BLR-0007.md) | accepted | Ubuntu phase 1: Linux basics, web-server architecture, single-server operation with theory + practice | backend-learning |
| [BLR-0008](decisions/BLR-0008.md) | accepted | End-to-end web lifecycle links OS, network, Nginx, Java and layer-by-layer incident diagnosis | backend-learning |
| [BLR-0009](decisions/BLR-0009.md) | accepted | Select Spring Core/Boot concepts from PDFs for proportional backend-focused study; full redesign pending | backend-learning |
| [BLR-0010](decisions/BLR-0010.md) | accepted | Approve the 7-track 34-unit Spring curriculum and restart at unit 01 | backend-learning |
| [BLR-0011](decisions/BLR-0011.md) | accepted | Explain project reverse engineering for backend job seekers | backend-learning |
| [AGT-0001](decisions/AGT-0001.md) | accepted | AgentLab: backend-focused Agent fundamentals and 13-stage roadmap | agentlab |
| [AGT-0002](decisions/AGT-0002.md) | accepted | AgentLab stage-bounded, theory-rich, evidence-aware teaching | agentlab |
| [PWC-0003](decisions/PWC-0003.md) | accepted | First MVP: narrow SKU subscription scope | pawcycle |
| [PWC-0004](decisions/PWC-0004.md) | accepted | Second MVP: Pet/PlanVersion and immutable snapshots | pawcycle |
| [PWC-0005](decisions/PWC-0005.md) | accepted | Per-target subscription order automation consistency | pawcycle |
| [PWC-0006](decisions/PWC-0006.md) | accepted | Subscription V2 runtime boundaries (historical) | pawcycle |
| [PWC-0007](decisions/PWC-0007.md) | accepted | Approved session authentication contract | pawcycle |
| [PWC-0008](decisions/PWC-0008.md) | accepted | Commerce runtime responsibility separation (historical) | pawcycle |
| [PWC-0009](decisions/PWC-0009.md) | accepted | Redis product-list cache and measured read-scale KEEP | pawcycle |
| [PWC-0010](decisions/PWC-0010.md) | accepted | Server-owned AI recommendation safety boundary | pawcycle |
| [PWC-0011](decisions/PWC-0011.md) | superseded | Historical AWS private RDS Single-AZ choice | pawcycle |
| [PWC-0012](decisions/PWC-0012.md) | accepted | Phase 10 scheduler tuning KEEP; Queue/Kafka not selected | pawcycle |
| [PWC-0013](decisions/PWC-0013.md) | accepted | Transition long-running operations from AWS to OCI Always Free | pawcycle |
| [PWC-0014](decisions/PWC-0014.md) | accepted | Preserve Subscription locks, version CAS and unique constraints | pawcycle |
| [PWC-0015](decisions/PWC-0015.md) | accepted | Historical AWS vs OCI same-host Observability | pawcycle |
| [PWC-0016](decisions/PWC-0016.md) | accepted | Payment PROCESSING query-only manual recovery policy | pawcycle |
| [PWC-0017](decisions/PWC-0017.md) | accepted | Shared-SKU Inventory locking read with CAS | pawcycle |
| [PWC-0018](decisions/PWC-0018.md) | accepted | Alert delivery verified; scheduling/dedupe deferred | pawcycle |
| [PWC-0019](decisions/PWC-0019.md) | accepted | AuthenticationProvider owns credentials | pawcycle |
| [PWC-0020](decisions/PWC-0020.md) | accepted | AI external call outside DB transaction and stale guard | pawcycle |
| [PWC-0021](decisions/PWC-0021.md) | accepted | New UTC data with accepted legacy time reinterpretation | pawcycle |
| [PWC-0022](decisions/PWC-0022.md) | accepted | Payment reconciliation Cart version increments once | pawcycle |
| [PWC-0023](decisions/PWC-0023.md) | accepted | Runtime direct JdbcTemplate zero with justified Native SQL KEEP | pawcycle |
| [PWC-0024](decisions/PWC-0024.md) | accepted | Explicit Production Catalog one-shot validation/import | pawcycle |
| [PWC-0025](decisions/PWC-0025.md) | accepted | OCI Release identity, capacity and fail-closed recovery | pawcycle |
| [PWC-0026](decisions/PWC-0026.md) | accepted | OCI Host Pull service-scoped guarded CD | pawcycle |
| [PWC-0027](decisions/PWC-0027.md) | accepted | Early MVP PS-003 four UX product decisions and rejected options | pawcycle |
| [PWC-0028](decisions/PWC-0028.md) | accepted | Historical initial role-branch Harness and user merge authority | pawcycle |
| [PWC-0029](decisions/PWC-0029.md) | accepted | ARCH-006 narrowly approved initial Backend implementation scope | pawcycle |
| [PWC-0030](decisions/PWC-0030.md) | accepted | API-002 public product D1-D7 decisions and alternatives | pawcycle |
| [PWC-0031](decisions/PWC-0031.md) | accepted | API-003 first subscription D1-D8 contract and idempotency defer | pawcycle |
| [PWC-0032](decisions/PWC-0032.md) | proposed | FOUNDATION-000 technology-version candidate, not wholesale approval | pawcycle |
| [PWC-0033](decisions/PWC-0033.md) | accepted | First MVP DOMAIN-001 value objects and subscription calculation responsibility | pawcycle |
| [PWC-0034](decisions/PWC-0034.md) | accepted | Historical Korean AI review and human selection authority | pawcycle |
| [PWC-0035](decisions/PWC-0035.md) | proposed | ARCH-001 responsibility-boundary proposal | pawcycle |
| [PWC-0036](decisions/PWC-0036.md) | proposed | DATA-001 minimal schema and constraint candidates | pawcycle |
| [PWC-0037](decisions/PWC-0037.md) | proposed | API-001 first endpoint/error/date proposal | pawcycle |
| [PWC-0038](decisions/PWC-0038.md) | proposed | AUTH-001 identity and safe-return proposal | pawcycle |
| [PWC-0039](decisions/PWC-0039.md) | proposed | First Backend prerequisite and alternative proposal chain | pawcycle |
| [PWC-0040](decisions/PWC-0040.md) | proposed | AUTH-002 API/CSRF/credential candidate contract | pawcycle |
| [PWC-0041](decisions/PWC-0041.md) | accepted | Historical MySQL 8.4 mutable CI image policy | pawcycle |
| [PWC-0042](decisions/PWC-0042.md) | accepted | Historical public Product batch query and read model | pawcycle |
| [PWC-0043](decisions/PWC-0043.md) | accepted | Trusted notification code and original CI SHA provenance | pawcycle |
| [PWC-0044](decisions/PWC-0044.md) | accepted | 첫 구독은 도메인의 정확한 날짜 등식과 DB의 날짜 순서 제약을 구분했다 | pawcycle |
| [PWC-0045](decisions/PWC-0045.md) | accepted | Frontend는 CSRF 실패 POST를 재실행하지 않고 인증 응답의 세대를 검증한다 | pawcycle |
| [PWC-0046](decisions/PWC-0046.md) | accepted | 로컬 QA fixture는 이중 활성화·충돌 실패·회원 한정 reset과 단일 인스턴스로 제한한다 | pawcycle |
| [PWC-0047](decisions/PWC-0047.md) | accepted | 최초 로컬 성능 측정은 다섯 cohort와 통제된 표본·집계 증거로 범위를 승인했다 | pawcycle |
| [PWC-0048](decisions/PWC-0048.md) | accepted | 초기 Lean Harness는 위험 등급별 증거와 실제 소비자 기준 인수인계를 선택했다 | pawcycle |
| [PWC-0049](decisions/PWC-0049.md) | accepted | 역사적 AWS 운영 기반은 비용 알림·T3 standard·SSM과 제한된 네트워크로 준비했다 | pawcycle |
| [PWC-0050](decisions/PWC-0050.md) | accepted | 역사적 AWS 단일 release는 동일 SHA·digest·런타임 비밀 원자 전환과 DB 보존 rollback을 사용했다 | pawcycle |
| [PWC-0051](decisions/PWC-0051.md) | accepted | 역사적 HTTPS 활성화는 발급·인증서 검증 이후에만 hostname을 승인했다 | pawcycle |
| [PWC-0052](decisions/PWC-0052.md) | accepted | AWS 백업은 같은 dump snapshot의 manifest와 S3 격리 복원으로 검증했다 | pawcycle |
| [PWC-0053](decisions/PWC-0053.md) | accepted | 최초 EC2 장애 알림은 상태 지표의 SNS email 전이만 최소 검증했다 | pawcycle |
| [PWC-0054](decisions/PWC-0054.md) | accepted | 운영 인증 smoke와 전용 회원 생성은 비밀 전달·one-shot·실행 승인 경계를 분리했다 | pawcycle |
| [PWC-0055](decisions/PWC-0055.md) | accepted | AWS Application Release와 Production Control은 별도 SHA로 승인하고 호환성을 검사한다 | pawcycle |
| [PWC-0056](decisions/PWC-0056.md) | accepted | Production DB 복원은 source 보존·candidate 검증·트래픽 차단 후 전환으로 준비했다 | pawcycle |
| [PWC-0057](decisions/PWC-0057.md) | accepted | PCC V3는 조건부 기록과 경로별 병렬 CI를 선택하고 metadata 성공을 code 검증과 분리했다 | pawcycle |
| [PWC-0058](decisions/PWC-0058.md) | accepted | MVP2 legacy 가격·종 이행은 손실 없는 전체 사전 검증과 현재 시점 snapshot으로 제한했다 | pawcycle |
| [PWC-0059](decisions/PWC-0059.md) | proposed | MVP2 API·데이터·정합성 계약은 Proposed로 출발하고 후속 구현과의 차이를 남겼다 | pawcycle |
| [PWC-0060](decisions/PWC-0060.md) | accepted | AI 도구 비교는 역사 PR 시간 대신 고정 시나리오·독립 arm·미측정 null을 사용한다 | pawcycle |
| [PWC-0061](decisions/PWC-0061.md) | accepted | GitHub MCP 읽기 단계는 실제 권한과 Tool·저장소 allowlist를 구별해 통제했다 | pawcycle |
| [PWC-0062](decisions/PWC-0062.md) | accepted | 동일 fixture 실측 후 현재 page의 연관 row를 batch 조회한다 | pawcycle |
| [PWC-0063](decisions/PWC-0063.md) | accepted | 구독 reconciliation은 구독별 독립 transaction으로 실패를 격리한다 | pawcycle |
| [PWC-0064](decisions/PWC-0064.md) | accepted | 멱등 성공 결과는 최초 완료부터 30일 보관하고 bounded 정리한다 | pawcycle |
| [PWC-0065](decisions/PWC-0065.md) | accepted | 관측 metric은 commit 결과를 따르고 scrape DB 비용을 별도 평가한다 | pawcycle |
| [PWC-0066](decisions/PWC-0066.md) | accepted | 장애 후보 감지와 알림 전달의 검증 단계를 분리한다 | pawcycle |
| [PWC-0067](decisions/PWC-0067.md) | accepted | 자동화 배포는 OFF로 시작하고 contract·migration 경계는 별도 승인한다 | pawcycle |
| [PWC-0068](decisions/PWC-0068.md) | accepted | readiness·알림·OIDC 배포는 서로 다른 증거와 승인 단계다 | pawcycle |
| [PWC-0069](decisions/PWC-0069.md) | accepted | Admin Catalog는 RBAC·상태 전이·공개 SKU와 구독 적격성을 분리한다 | pawcycle |
| [PWC-0070](decisions/PWC-0070.md) | accepted | Commerce는 공통 주문 snapshot·재고 예약·미확정 결제와 명시 복구를 연결한다 | pawcycle |
| [PWC-0071](decisions/PWC-0071.md) | accepted | 운영 진단은 두 호스트의 읽기 신호를 결합하고 알림 실패와 분리한다 | pawcycle |
| [PWC-0072](decisions/PWC-0072.md) | accepted | 성능 측정은 시간창·유입률·환경별 실패 경계를 보존하고 튜닝과 분리한다 | pawcycle |
| [PWC-0073](decisions/PWC-0073.md) | accepted | Commerce 성능은 승인된 합성 mix와 bounded write로 격리 측정한다 | pawcycle |
| [PWC-0074](decisions/PWC-0074.md) | accepted | Phase 9는 resource envelope를 재현한 뒤 단일 변수 후보를 채택·기각한다 | pawcycle |
| [PWC-0075](decisions/PWC-0075.md) | accepted | 상품 목록은 짧은 scalar read transaction과 DTO 조립을 분리했으나 성능 효과는 약했다 | pawcycle |
| [PWC-0076](decisions/PWC-0076.md) | accepted | JFR 진단은 내장 기능·정확한 runtime·artifact 품질·복구 Gate를 분리한다 | pawcycle |
| [PWC-0077](decisions/PWC-0077.md) | accepted | Phase 9은 특정 코드 hotspot을 입증하지 못해 추가 최적화 NO CHANGE로 종료한다 | pawcycle |
| [PWC-0078](decisions/PWC-0078.md) | accepted | One-shot 결과는 실제 시작·역사 identity·durable evidence를 함께 결합한다 | pawcycle |
| [PWC-0079](decisions/PWC-0079.md) | accepted | 정기배송 직접 관리는 하나의 결합 pending과 기존 주문 transaction으로 적용한다 | pawcycle |
| [PWC-0080](decisions/PWC-0080.md) | accepted | 판매 Catalog는 manifest와 DB 권위를 분리하고 검증 fixture를 고객 데이터와 격리한다 | pawcycle |
| [PWC-0081](decisions/PWC-0081.md) | accepted | UX 보조 Skill과 Draft 리뷰는 기존 설계 권위를 유지하며 도입한다 | pawcycle |
| [PWC-0082](decisions/PWC-0082.md) | accepted | Toss Test는 명시 opt-in과 서버 금액 대조로 준비하며 실결제와 구분한다 | pawcycle |
| [PWC-0083](decisions/PWC-0083.md) | accepted | Checkout은 최초 요청 identity를 replay하고 서버 재주문은 Cart와 함께 원자 처리한다 | pawcycle |
| [PWC-0084](decisions/PWC-0084.md) | accepted | Review와 Q&A는 서버 자격·소유권·moderation·동시성으로 공개 신뢰를 보호한다 | pawcycle |
| [PWC-0085](decisions/PWC-0085.md) | accepted | Catalog 확장은 DB의 상품 관계·동일 SKU predicate와 공개 탐색 metadata를 기준으로 한다 | pawcycle |
| [PWC-0086](decisions/PWC-0086.md) | accepted | Admin Catalog는 기존 API의 변경 필드 PATCH와 명시적 할당으로 관리한다 | pawcycle |
| [PWC-0087](decisions/PWC-0087.md) | accepted | 다음 배송 Add-on은 주문·결제·재고와 원자적으로 처리하고 HELD 액션을 제한한다 | pawcycle |
| [PWC-0088](decisions/PWC-0088.md) | accepted | Warm Utility·Warm Routine을 거쳐 A/R1 Daily Orbit 시각 방향을 채택한다 | pawcycle |
| [PWC-0089](decisions/PWC-0089.md) | accepted | AWS 임시 Auto-CD는 성공한 main image SHA를 기존 Production Deploy에 전달한다 | pawcycle |
| [PWC-0090](decisions/PWC-0090.md) | accepted | Catalog 현실성 보정은 stable key와 예상 이전값으로 제한한 원자적 overlay를 쓴다 | pawcycle |
| [PWC-0091](decisions/PWC-0091.md) | accepted | Backend 구조 리팩터링은 typed 경계에서 JPA semantic repository로 단계별 수렴한다 | pawcycle |
| [PWC-0092](decisions/PWC-0092.md) | accepted | OCI 초기 계획은 가입·용량 근거에 따라 Tokyo와 Trial E5 bootstrap으로 바뀐다 | pawcycle |
| [PWC-0093](decisions/PWC-0093.md) | accepted | HTTP validation·status·partial PATCH와 Frontend transport를 함께 검증한다 | pawcycle |
| [PWC-0094](decisions/PWC-0094.md) | accepted | Lean Harness는 실행 위험의 근거를 남기고 정책·절차·리뷰 상태를 분리한다 | pawcycle |
| [PWC-0095](decisions/PWC-0095.md) | accepted | 인증서 renewal과 Nginx reload 사이 실패는 영속 pending 상태로 복구한다 | pawcycle |
| [PWC-0096](decisions/PWC-0096.md) | accepted | 공개 login 방어는 Nginx per-IP rate limit과 공통 Security Header로 제한한다 | pawcycle |
| [PWC-0097](decisions/PWC-0097.md) | accepted | 회원 소유권과 resource ID를 같은 비관적 잠금 조건에 넣는다 | pawcycle |
| [PWC-0098](decisions/PWC-0098.md) | accepted | OCI 성능 재기준선 전에 관측 READY/NORMAL과 same-host overhead를 검증한다 | pawcycle |
| [PWC-0099](decisions/PWC-0099.md) | accepted | Scale Dataset의 cardinality와 discovery·engagement 현실성은 독립 변수로 둔다 | pawcycle |
| [PWC-0100](decisions/PWC-0100.md) | accepted | OCI Catalog 규모 비교는 별도 schema·계정·loopback Backend의 I0↔I10K로 격리한다 | pawcycle |
| [PWC-0101](decisions/PWC-0101.md) | accepted | 격리 성능 stage는 같은 UTC 구간의 수집과 OCI expected bucket 완전성을 요구한다 | pawcycle |
| [PWC-0102](decisions/PWC-0102.md) | accepted | 격리 부하는 evidence 경로를 유지한 single-stage로 승인 단위를 통제한다 | pawcycle |
| [PWC-0103](decisions/PWC-0103.md) | accepted | Catalog 지연은 aggregate 차이 대신 opt-in phase·TX/JDBC lifecycle로 분해한다 | pawcycle |
| [PWC-0104](decisions/PWC-0104.md) | accepted | Windows 성능 실행은 Bash SSOT를 유지하고 SSH executable·identity argv만 명시한다 | pawcycle |
| [PWC-0105](decisions/PWC-0105.md) | accepted | Catalog page-first와 optimizer hint는 list·count별 실제 plan·동일 조건 증거로 갱신한다 | pawcycle |
| [PWC-0106](decisions/PWC-0106.md) | accepted | Dataset immutable origin과 현재 exact source·DB 호환을 별도로 검증한다 | pawcycle |
| [PWC-0107](decisions/PWC-0107.md) | accepted | 고부하 warm-up과 measurement를 분리하되 측정 error·drop gate는 보존한다 | pawcycle |

## Knowledge index

| ID | Status | Knowledge | Project |
| --- | --- | --- | --- |
| [PWK-0001](knowledge/PWK-0001.md) | published | PawCycle 전체 시스템·아키텍처·설계 이력·운영 리버스 엔지니어링 가이드 (2026-11-05) | pawcycle |
| [PWK-0002](knowledge/PWK-0002.md) | published | JVM JIT warmup and CRaC restoration: 330s to 2–3s case study | shared |
| [AGK-0001](knowledge/AGK-0001.md) | published | Backend AI adoption, Agent roles and learning FAQ (2026-11-05) | agentlab |
| [BLK-0001](knowledge/BLK-0001.md) | published | Ubuntu/Linux/web-server 0–7 stage roadmap with evidence-based exercise gates | backend-learning |
| [BLK-0002](knowledge/BLK-0002.md) | published | Approved Spring Core/Boot 7-course / 34-unit curriculum; 17 priority deep dives | backend-learning |

## Lesson index

| ID | Lesson | Project |
| --- | --- | --- |
| [PWL-0001](lessons/PWL-0001.md) | Docker internal-network localhost publish failure | pawcycle |
| [PWL-0002](lessons/PWL-0002.md) | Invalid JFR artifact cannot attribute a Java hotspot | pawcycle |
| [PWL-0003](lessons/PWL-0003.md) | External Provider/DB commit PROCESSING failure gap | pawcycle |
| [PWL-0004](lessons/PWL-0004.md) | InnoDB missing-row lock deadlock | pawcycle |
| [PWL-0005](lessons/PWL-0005.md) | Hikari pending is not a pool-size diagnosis | pawcycle |
| [PWL-0006](lessons/PWL-0006.md) | Dropped/fixture/image invalid load evidence | pawcycle |
| [PWL-0007](lessons/PWL-0007.md) | Frontend HTTP 200 does not prove backend health | pawcycle |
| [PWL-0008](lessons/PWL-0008.md) | OCI first transition stopped before service mutation on Python method shadowing | pawcycle |
| [PWL-0009](lessons/PWL-0009.md) | First Obsidian PR recording failed on untracked detection and slug compatibility | pawcycle |
| [PWL-0010](lessons/PWL-0010.md) | Early Discord false-green, HTTP 403 and Korean PR body corruption boundaries | pawcycle |
| [PWL-0011](lessons/PWL-0011.md) | Review corrections can leave body/handoff semantic drift | pawcycle |
| [PWL-0012](lessons/PWL-0012.md) | Historical build environment and CI verification limits | pawcycle |
| [PWL-0013](lessons/PWL-0013.md) | DB CHECK rejection and Spring exception assertion mismatch | pawcycle |
| [PWL-0014](lessons/PWL-0014.md) | Generic credential responses do not equalize BCrypt work | pawcycle |
| [PWL-0015](lessons/PWL-0015.md) | QA claims must match array/log/redaction evidence | pawcycle |
| [PWL-0016](lessons/PWL-0016.md) | Webhook HTTP 성공은 실제 메시지의 카드 계약 성공을 증명하지 않는다 | pawcycle |
| [PWL-0017](lessons/PWL-0017.md) | 실행 runner를 막아도 함께 로드되는 profile의 쿠키 완화는 남을 수 있다 | pawcycle |
| [PWL-0018](lessons/PWL-0018.md) | MySQL 프로세스 응답과 실제 애플리케이션 계정의 readiness는 다르다 | pawcycle |
| [PWL-0019](lessons/PWL-0019.md) | 최초 성능 기준선은 계측 실패와 승인 순서 이탈로 끝내 확보되지 않았다 | pawcycle |
| [PWL-0020](lessons/PWL-0020.md) | 운영 문서의 fail-closed·cleanup 보장은 실제 검사 시점과 대상을 확인해야 한다 | pawcycle |
| [PWL-0021](lessons/PWL-0021.md) | Spring Context 이전 gate는 자신이 보지 못하는 외부 설정 경로까지 고려해야 한다 (draft) | pawcycle |
| [PWL-0022](lessons/PWL-0022.md) | 운영 기준선은 실제 검증한 Control 버전에 묶이며 후속 변경에 자동 승계되지 않는다 | pawcycle |
| [PWL-0023](lessons/PWL-0023.md) | 멱등 경합 재조회는 MySQL snapshot 가시성과 응답·reconciliation commit 경계를 함께 검증해야 한다 | pawcycle |
| [PWL-0024](lessons/PWL-0024.md) | MySQL 초기화 환경 변수를 바꿔도 기존 named volume의 계정은 바뀌지 않는다 | pawcycle |
| [PWL-0025](lessons/PWL-0025.md) | Benchmark의 cache·중복 arm·schema drift를 숨기면 비교 수치가 달라진다 | pawcycle |
| [PWL-0026](lessons/PWL-0026.md) | migration predicate 밖의 row와 insert도 locking scan에 막힐 수 있다 | pawcycle |
| [PWL-0027](lessons/PWL-0027.md) | 환경 baseline 실패와 코드 회귀를 분리하고 DDL rollback 호환을 검증한다 | pawcycle |
| [PWL-0028](lessons/PWL-0028.md) | 장애 재현은 disposable 자원·실제 lock·복구 신호까지 확인한다 | pawcycle |
| [PWL-0029](lessons/PWL-0029.md) | 수동 sudo와 SSM Agent root는 Git 신뢰 환경이 다르다 | pawcycle |
| [PWL-0030](lessons/PWL-0030.md) | 운영 도구는 실제 출력·materializer 형식과 실패 경로를 함께 검증한다 | pawcycle |
| [PWL-0031](lessons/PWL-0031.md) | 빠른 502와 TIME_WAIT 압력은 정상 처리량으로 계산하지 않는다 | pawcycle |
| [PWL-0032](lessons/PWL-0032.md) | AWS 250 RPS 실패는 heap 한계가 아닌 container cgroup OOM이었다 | pawcycle |
| [PWL-0033](lessons/PWL-0033.md) | 측정 실패·수집 실패·표본 부재를 구분하고 시작 후 증거를 보존한다 | pawcycle |
| [PWL-0034](lessons/PWL-0034.md) | 검증 값의 freshness는 query 시각이 아니라 실제 scrape 시각으로 판정한다 | pawcycle |
| [PWL-0035](lessons/PWL-0035.md) | 서로 다른 scrape 세대의 counter와 timer를 한 snapshot으로 해석하지 않는다 | pawcycle |
| [PWL-0036](lessons/PWL-0036.md) | Smoke·CI 성공과 전체 사용자 Journey 판정은 다르다 | pawcycle |
| [PWL-0037](lessons/PWL-0037.md) | 같은 fresh DB 기준선으로 환경 실패·공유 상태·제품 회귀를 구분한다 | pawcycle |
| [PWL-0038](lessons/PWL-0038.md) | 자동화 check 성공은 실제 리뷰·배포·안전 종료의 성공 근거가 아니다 | pawcycle |
| [PWL-0039](lessons/PWL-0039.md) | 읽기 전용 archive 권한은 실제 container user의 traverse·read로 검증한다 | pawcycle |
| [PWL-0040](lessons/PWL-0040.md) | 민감 로그 AST 검사는 직접 인자 계약이며 taint·일반 redaction을 보장하지 않는다 | pawcycle |
| [PWL-0041](lessons/PWL-0041.md) | fake lifecycle 통과 뒤에도 실제 승인 image의 main bootstrap 경로를 rehearsal해야 한다 | pawcycle |
| [PWL-0042](lessons/PWL-0042.md) | Hikari queue 증폭 경로와 최초 포화 trigger는 다른 인과 주장이다 | pawcycle |


## 2026-11-04 재개분의 신규 기록

| ID | 유형 | 내용 |
| --- | --- | --- |
| [PWC-0108](decisions/PWC-0108.md) | 결정 | Checkout capacity는 고정 VU 단계 부하와 workload별 경계로 판정한다 |
| [PWC-0109](decisions/PWC-0109.md) | 결정 | Order read와 Quick Reorder command persistence의 책임을 먼저 분리한다 |
| [PWC-0110](decisions/PWC-0110.md) | 결정 | Querydsl은 복잡한 mapped read에 한정하고 compiled dependency guard를 유지한다 |
| [PWC-0111](decisions/PWC-0111.md) | 결정 | Package topology 이동은 결합 제거와 재분류를 구분해 검증한다 |
| [PWC-0112](decisions/PWC-0112.md) | 결정 | Read model은 query 성격과 시간·결과 동등성으로 persistence를 선택한다 |
| [PWC-0113](decisions/PWC-0113.md) | 결정 | Subscription read는 feature별 typed 경계로 나누고 command facade를 보존한다 |
| [PWC-0114](decisions/PWC-0114.md) | 결정 | Subscription command는 실제 잠금·CAS를 보존하고 Entity를 독립 파일로 둔다 |
| [PWC-0115](decisions/PWC-0115.md) | 결정 | Billing persistence 전환에서도 claim·외부 호출·completion 트랜잭션을 나눈다 |
| [PWC-0116](decisions/PWC-0116.md) | 결정 | 필수 MySQL 물리 잠금 회귀는 실제 JUnit 실행을 fail-closed로 검사한다 |
| [PWC-0117](decisions/PWC-0117.md) | 결정 | Cleanup vendor DML과 격리 유지보수 JDBC는 실행 의미로 유지한다 |
| [PWC-0118](decisions/PWC-0118.md) | 결정 | OCI A1 capacity 조회·전이 알림·감시 건강·VM 생성을 분리한다 |
| [PWC-0119](decisions/PWC-0119.md) | 결정 | Quick Reorder의 순수 정책과 durable replay codec만 분리한다 |
| [PWC-0120](decisions/PWC-0120.md) | 결정 | Subscription 내부 실패는 domain 의미로 전달하고 HTTP는 API가 결정한다 |
| [PWC-0121](decisions/PWC-0121.md) | 결정 | HTTP 입력·응답 변환은 API가 소유하고 내부에는 중립 Command와 완성된 View를 전달한다 |
| [PWL-0043](lessons/PWL-0043.md) | 교훈 | RowMapper와 RowCallbackHandler의 cursor를 다시 이동하면 null 실패나 첫 행 누락이 생긴다 |
| [PWL-0044](lessons/PWL-0044.md) | 교훈 | UTC DATETIME은 Timestamp 변환과 JDBC Calendar 경계까지 비교해야 한다 |
| [PWL-0045](lessons/PWL-0045.md) | 교훈 | 잠금 footprint 비교는 동일한 MVCC 물리 이력과 read-view 수명을 고정해야 한다 |
| [PWL-0046](lessons/PWL-0046.md) | 교훈 | 커밋한 통합 테스트 fixture는 실패·권한 중단 뒤에도 소유 범위에서 정리해야 한다 |
| [PWL-0047](lessons/PWL-0047.md) | 교훈 | 공유 Hikari active 수치 대신 해당 요청의 연결 반환과 트랜잭션 정리를 검증한다 |


## #401–#503 신규 기록

| ID | 내용 |
| --- | --- |
| [PWC-0122](decisions/PWC-0122.md) | Category 최대2단계는 부모 선행·정렬된 행 잠금과 최상위 transaction에서 보호한다 |
| [PWC-0123](decisions/PWC-0123.md) | Catalog Import는 중립 Command를 직접 검증하고 실제 apply·rollback을 별도로 확인한다 |
| [PWC-0124](decisions/PWC-0124.md) | MVC 입력 오류와 Frontend 도메인 오류는 실제 wire 경계에서 보호한다 |
| [PWC-0125](decisions/PWC-0125.md) | Order 반품 wire와 화면 모델 차이는 전용 consumer adapter에서 정규화한다 |
| [PWC-0126](decisions/PWC-0126.md) | 분석·설계·저장소 변경·운영 실행은 서로 다른 완료와 권한 경계를 가진다 |
| [PWC-0127](decisions/PWC-0127.md) | 반품 입고는 재고 복원·비복원·취소와 결과 불확실성을 분리한다 |
| [PWC-0128](decisions/PWC-0128.md) | Desktop UI는 승인된 시안 변화와 fixture·실인증 검증 범위를 함께 남긴다 |
| [PWC-0129](decisions/PWC-0129.md) | A1 단기 스케줄러는 조회 호출만 옮기고 실제 실행 연속성을 별도로 검증한다 |
| [PWL-0048](lessons/PWL-0048.md) | 같은 HEAD의 후속 성공은 최초 물리 잠금 실패의 원인 규명이 아니다 |

## Cross-project learning

- [Backend learning snapshot](projects/backend-learning.md): current Java/Spring priority, academic CS curriculum, Large-scale Board contract, system-design reading, separate domain/AI practice, and Sentry adoption boundary.
- Do not mistake a **planned learning activity** for an implemented feature, completed experiment or production validation. The source project ROADMAP remains authoritative.

## Record creation and maintenance

- [Wiki/AGENTS.md](AGENTS.md): AI retrieval, review and write safeguards
- [Project capture modes](capture-policy.md): PawCycle/CSForge full logs, DevPedia design-only, Dark Todo manual
- [DevPedia AGENTS.md template](templates/devpedia-agent-section.md): ready to apply when that repository is accessible
- [Full-mode project journals](journal/README.md): merged-PR event receipts and task-end notes
- [Cross-client handoff contract](handoff.md): ChatGPT, Work and Codex decision submission
- [Wiki/schema.md](schema.md): canonical frontmatter / relation ID contract
- [GitHub PR evidence inbox](inbox/README.md): untrusted automated capture and promotion steps
- [Merged PR candidate queue](inbox/merged-pr-candidates.md): auto-generated candidate snapshot (may be empty before first run)
- [2026-11 history](history/2026-11.md): change-log; not a chat transcript
- [PawCycle historical decision inventory](history/pawcycle-historical-decision-inventory-2026-11-03.md): verified backfills and unresolved candidate decisions
- [PawCycle complete PR/Issue source ledger](history/pawcycle-source-ledger/README.md): all #1–#501 sources indexed; **not yet comprehensively reviewed**
- [Obsidian sync policy](../.github/OBSIDIAN_SYNC.md): multi-device safety

All records have stable IDs and links.Updating a project snapshot must not silently rewrite an accepted decision.Intake never writes decisions automatically.

## Coverage limits

Historical seeded decisions are not an exhaustive source audit: PawCycle #1–#503 have source dispositions with bounded inspection and explicit limitations; open sources remain open work, not implemented outcomes.There has been no comprehensive import of private ChatGPT, Work or Codex conversations.A missing record does not prove a historical decision never occurred.Projects may change after their last verification timestamp.GitHub branches and pull requests do not prove current cloud or database state.


- Sequential audit: [#11–#20 evidence and dispositions](history/pawcycle-source-ledger/batch-011-020.md), [July timeline](journal/pawcycle/2026-07.md), [next newly verified source #504](history/pawcycle-source-ledger/progress.json). Current count: **503 dispositions / 0 pending source audits / 503 inventoried**.


- Next sequential batch: [#21–#30 evidence](history/pawcycle-source-ledger/batch-021-030.md); scaffold and CI are separate from DB/Auth implementation approval.

- 2026-11-04 sequential batch: [#31–#40 dispositions](history/pawcycle-source-ledger/batch-031-040.md), [exact source/CI manifest](history/pawcycle-source-ledger/batch-031-040.sources.json). Batch-end resume was #41; authentication QA remained conditional within its evidence scope.

### PawCycle 상세 처리 #41~#50 (2026-11-04)

구독 V1 구현의 도메인/DB 날짜 경계, Frontend CSRF·비동기 인증 경쟁, local-only fixture와 쿠키·readiness 교정, 첫 MVP의 조건부 완료와 후속 접근성 QA, 성능 측정 후보→범위 승인·세부 차단을 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-041-050.md). 최신 누적 50/501, 미완료 451, 다음 #51.

### PawCycle 상세 처리 #51~#60 (2026-11-04)

성능 세부 승인→순서 이탈 부분 관측→전체 재승인→native stderr/배열 SelfTest 실패→기준선 미확보 종료를 복원하고, 위험 기반 Lean Harness·AWS 준비·동일 SHA release·HTTPS의 준비/운영 경계를 연결했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-051-060.md). 최신 누적 60/501, 미완료 441, 다음 #61.

### PawCycle 상세 처리 #61~#70 (2026-11-04)

HTTPS 실제 발급·갱신/재부팅, S3 격리 복원과 유지보수 예외, 자동 cleanup·IAM gate의 검증 한계, 기능 차이 없는 release rollback, EC2 SNS 수동 알림, 인증 smoke·one-shot 회원 준비와 사전 gate 잔여 지적을 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-061-070.md). 최신 누적 70/501, 미완료 431, 다음 #71.

### PawCycle 상세 처리 #71~#80 (2026-11-04)

운영 회원 wrapper·실제 회원/세션 증거, Application/Control SHA 분리와 rollback 호환성 교정, candidate DB restore 준비, 운영 안전성 판정 철회·보류와 실제 Control 왕복 검증을 시간순으로 연결했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-071-080.md). 최신 누적 80/501, 미완료 421, 다음 #81.

### PawCycle 상세 처리 #81~#90 (2026-11-04)

최소운영기준선7항목 Verified의 한계, code/metadata CI 분리·비소급 Lean 전환, MVP2 제품/legacy 정책과 Proposed 기술계약→구현 Delta, 멱등 current-read·reconciliation correction, 운영활성화 후속 Issue와 로컬volume 인증복구를 기록했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-081-090.md). 최신 누적 90/501, 미완료 411, 다음 #91.

### PawCycle 상세 처리 #91~#100 (2026-11-04)

AI 도구 Before 자료의 한계→Connector 대조군 재정의→읽기 capability 계약→외부 측정도구→Codex 실험군을 연결하고, 우발 Issue4개는 독립 정책 없는 사고로 판정했다. cache/중복·schema drift·권한강제 아님·모델 미수집을 보존했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-091-100.md). 최신 누적 100/501, 미완료 401, 다음 #101.

### PawCycle 상세 처리 #101~#110 (2026-11-04)

실측 기반 N+1 batch 조회, 구독별 reconciliation transaction 격리, 30일 멱등 보관·복구 호환 cleanup과 local 관측성 착수 경계를 복원했다. 병합 후 리뷰와 무효 검증을 구별했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-101-110.md). 최신 누적 110/501, 미완료 391, 다음 #111.

### PawCycle 상세 처리 #111~#120 (2026-11-04)

local metric·scrape 비용 수용, disposable 장애 격리, Prometheus 후보 감지와 Discord 수동 수신을 단계별로 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-111-120.md). 최신 누적 120/501, 미완료 381, 다음 #121.

### PawCycle 상세 처리 #121~#130 (2026-11-04)

정기 주문의 최초 구현·OFF 배포·정확한 SHA 승인, readiness/OIDC 단계와 실제 AWS 실패를 연결했다. #128의 최종 폐기는 완료와 구별했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-121-130.md). 최신 누적 130/501, 미완료 371, 다음 #131.

### PawCycle 상세 처리 #131~#140 (2026-11-04)

SSM v1~v6의 실패 가설→process trace→exact Git trust→AWS 안전 배포를 복원하고 Catalog·Commerce·인증 책임 변화와 실제 검증 한계를 연결했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-131-140.md). 최신 누적 140/501, 미완료 361, 다음 #141.

### PawCycle 상세 처리 #141~#150 (2026-11-04)

V2책임 분리, AWS관측 bridge독립화와실제검증, Backenddrill의 probe/시간한계, 두호스트read-only진단과독립알림을복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-141-150.md). 최신 누적 150/501, 미완료 351, 다음 #151.

### PawCycle 상세 처리 #151~#160 (2026-11-04)

실양채널알림과자동실행보류, RDS비교·TLS대가·실자원생성, rehearsal미완료/폐기와CRLF·env파싱수정·대체PR을구분했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-151-160.md). 최신 누적 160/501, 미완료 341, 다음 #161.

### PawCycle 상세 처리 #161~#170 (2026-11-04)

Control-only·same-SHA runtime 승인과 RDS preflight수정, Phase8의도구실패/correction/local proxy한계/AWS cgroupOOM·최종closure를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-161-170.md). 최신 누적 170/501, 미완료 331, 다음 #171.

### PawCycle 상세 처리 #171~#180 (2026-11-04)

승인syntheticmix·실4profile측정과실패/증거회수, SQL병목가설보류, resource재현·collector보존·Tomcat64기각을복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-171-180.md). 최신 누적 180/501, 미완료 321, 다음 #181.

### PawCycle 상세 처리 #181~#190 (2026-11-04)

Tomcat128기각→CPU인과성/메모리재병목→1GiB보조효과→transaction축소효과약함→종료수집freshness보강을조건·수치·한계로연결했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-181-190.md). 최신 누적 190/501, 미완료 311, 다음 #191.

### PawCycle 상세 처리 #191~#200 (2026-11-04)

Hikari20기각·CPU2부분인과성·JFR선택과두pre-workload correction을복원했다. #200까지100건완료, 다음#201이며 profiling후속은별도근거로남겼다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-191-200.md). 최신 누적 200/501, 미완료 301, 다음 #201.

### PawCycle 상세 처리 #201~#201 (2026-11-04)

Phase 9은 잔여 포화가 있지만 특정 Java hotspot 귀속 증거가 없어 추가 코드 최적화 NO CHANGE로 종료했다. 실제 PH9-011 불완전 JFR과 선행 pre-workload 실패를 구분하고 통합 검증 미실행 correction을 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-201-201.md). 최신 누적 201/502, 미완료 301, 다음 #202.

### PawCycle 상세 처리 #202~#210 (2026-11-04)

Redis 최초 KEEP와 race 교정, 유실된5k와새10k의구분, one-shot identity·durable evidence 및mixed-scrape실패를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-202-210.md). 최신 누적 210/502, 미완료 292, 다음 #211.

### PawCycle 상세 처리 #211~#220 (2026-11-04)

Scheduler 설정After와Phase10 조건부기술선택 종료, MVP4 결합pending/잠금교정·AI안전추천·Frontend연결의미완료경계를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-211-220.md). 최신 누적 220/502, 미완료 282, 다음 #221.

### PawCycle 상세 처리 #221~#230 (2026-11-04)

독립QA의실패/미병합, Demo/manifest·DB-native탐색권위, UX보조도구/Draftreview와TossTest opt-in의미완성경계를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-221-230.md). 최신 누적 230/502, 미완료 272, 다음 #231.

### PawCycle 상세 처리 #231~#240 (2026-11-04)

Production import의명시승인/프록시경계, Checkout identity와Review/Q&A, V24/V3탐색·가격predicate·실QA의검증gap을복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-231-240.md). 최신 누적 240/502, 미완료 262, 다음 #241.

### PawCycle 상세 처리 #241~#250 (2026-11-04)

UI 보정·FOUNDATION 호환성·Admin·개인화/Add-on 계약과 인증 Browser 증거를 복원하고 Provider/운영 미검증 경계를 보존했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-241-250.md). 최신 누적 250/502, 미완료 252, 다음 #251.

### PawCycle 상세 처리 #251~#260 (2026-11-04)

Warm Utility→Warm Routine→Daily Orbit 변경관계, 임시AWS Auto-CD, Canonical Catalog 공통적재 준비를 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-251-260.md). 최신 누적 260/502, 미완료 242, 다음 #261.

### PawCycle 상세 처리 #261~#270 (2026-11-04)

운영적재adapter/identity실패의원인과동일HEAD대체, Catalog현실성overlay, 익명추천SQL·CompareJDBC교정및배포후QAgate를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-261-270.md). 최신 누적 270/502, 미완료 232, 다음 #271.

### PawCycle 상세 처리 #271~#280 (2026-11-04)

HTTP·JPA리팩터링단계/남은정합성부채, Session검토보류, Seoul→Tokyo·TrialE5변경과미병합OCI준비/TLSgate를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-271-280.md). 최신 누적 280/502, 미완료 222, 다음 #281.

### PawCycle 상세 처리 #281~#290 (2026-11-04)

AWS자동dispatch사건과철거, externalMySQL·HTTPSreloadpending·samehost관측, botreviewfalse-success와exactHEAD/shellgate를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-281-290.md). 최신 누적 290/502, 미완료 212, 다음 #291.

### PawCycle 상세 처리 #291~#300 (2026-11-04)

opc권한·networkpublish·runtimeenv실패교정, edge/ownership/logging보안경계와#300관측준비최종완료·dataset변수분리를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-291-300.md). 최신 누적 300/502, 미완료 202, 다음 #301.

### PawCycle 상세 처리 #301~#310 (2026-11-04)

10K정확총량·I0/I10K격리와formalreview증거gap,stagebucket완전성·실image rehearsal실패및2회복구를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-301-310.md). 최신 누적 310/502, 미완료 192, 다음 #311.

### PawCycle 상세 처리 #311~#320 (2026-11-04)

single-stage승인·lifecycle인과성축소·WindowsSSH최소delta와I10K부분실패/최종보류를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-311-320.md). 최신 누적 320/502, 미완료 182, 다음 #321.

### PawCycle 상세 처리 #321~#330 (2026-11-04)

list/count page-first·힌트추가→JOIN_PREFIX제거KEEP의변경관계,provenance재사용·수집preflight·warmup계약과부분증거한계를복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-321-330.md). 최신 누적 330/502, 미완료 172, 다음 #331.

## #301–#400 요청 완료 — 2026-11-04

#301–#330의 기존 처리를 보존하고 #331–#400 70건을 번호순으로 추가 조사했다. 요청 범위 100건 전체에 원본별 판정이 있으며 현재 **400 완료 / 103 미완료 / 503 목록, 다음 #401**이다. 이번 재개분은 결정14개(PWC-0108–0121)·교훈5개(PWL-0043–0047)를 신규 등록했다.

Checkout 정확성/무효 측정/NO_CHANGE, Querydsl·topology·typed read 선택, T07 목표 개정, T09 구조 교정, T10 잠금/시간/fixture/CI 실패와 대체 PR, Runtime0 뒤 전체 closure, OCI 알림의 offline/live/health 경계, DTO.from 사용자 선호와 transaction 밖 물질화 한계를 연결했다. 원본 #334의 runner 리뷰 지적, #338/Seoul 실패, #378 Windows 중단 및 최종 reviewer gap, #397/#400 외부 review 부재를 남겼다.

원본 #331–#400의 변경파일747개를 manifest에 대조했다. 누락 patch 중 대형 Python4개는 원문·구조를 보충했고 이미지22개는 픽셀 재검증 없이 metadata/당시 보고로 제한한다. #503은 새 존재·Draft metadata만 추가했으며 상세 처리하지 않았다. 제품·운영·DB·Cloud·Secret·Provider·부하 실행은 없다. 원본 #401 이후의 closure 댓글 링크는 연결 근거이며 그 PR들의 독립 전수 완료를 뜻하지 않는다.

[요청 체크포인트](history/pawcycle-source-ledger/checkpoint-301-400.md).

## #401–최신 Closed PR #503 완료

#401부터 조회시 최신 Closed PR #503까지 **103개 원본의 판정**을 기록했다. Open 원본은 제안·미병합·잔여 상태로 구분했으며 구현 완료로 바꾸지 않았다. 누적 **503개 목록 / 503개 출처 판정 / 대기0**, 다음 신규 후보 #504(아직 목록 생성하지 않음)다. 신규 결정8개(PWC-0122–0129)·교훈1개(PWL-0048), 기존 기록15개를 갱신했다.

Architecture의 남은 경계와21Adapter KEEP, Cart version/F07/Category/Import/MVC/wire 계약, 시간 호환성·테스트 격리, Desktop R3·입고 취소/응답 불확실성, OCI Release/Host Pull·trust/timer/helper/image/TLS·서비스별 정책 및 최초 실전 STOP, A1 disabled worker/root compartment/단기 조회 Cron 변경을 연결했다.

변경파일706개·전체 제공 patch와 댓글/리뷰/commit/CI metadata를 수집하고 주요 계약·실패를 제한 대조했다. 이미지35개(path 중복 포함)는 픽셀 재검증 없이 metadata/당시 보고만 보존했다. source별 원시 로컬 artifact·실제 인증·Provider·운영/복구·장기 연속성을 새로 검증하지 않았다. #503 병합은 Cloudflare 운영 배포나 외부 Secret 등록이 아니다. 코드 전체의 독립 전수 리뷰라고 주장하지 않는다.

[근거·동적 상태·재개점](history/pawcycle-source-ledger/checkpoint-401-503.md).

## Issue 본문·댓글 보완 — 2026-11-04

- [PWL-0049 · 파일 복원과 exact SHA 실행 승인](lessons/PWL-0049.md)

독립 Issue **133개·댓글444개**를 본문과 함께 재검토했다. 댓글 링크444개는 기존 URL 인덱스에 이미 있었다. 이번에는 판단 전환의 설명과 승인 범위를 보완했으며 기존 분석에 같은 의미가 있으면 해당 기록을 갱신했다. Open Issue는 #399·#417·#460·#461·#470의5개다.

UTC 승인/STOP/재승인, F07 query-only, lease 범위 종료, 최종 HEAD review 정정, 운영 추적 통합을 기존8개 기록에 보완했다. exact SHA 승인에 관한 PWL-0049만 신규 등록했다. 번호별503개 출처 판정은 별도 유지한다. [Issue 재검토 대장](history/pawcycle-issue-ledger/README.md).
