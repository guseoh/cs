# LLM Wiki — AI entry point

This directory holds **retrievable context for AI tools**, not a duplicate of existing Study notes. GitHub guseoh/cs is the shared Markdown source; Obsidian renders these files after a successful Git sync.

## Retrieval protocol

1. Identify the specific project/topic and read its project snapshot. Check the **verification date and evidence scope**.
2. Follow the indexed decision IDs to understand the choice, rejected options, constraints and dependency relationships.
3. Resolve depends_on and supersedes chains before treating a decision as currently authoritative.
4. Confirm runtime claims separately from merged source and green CI; cite linked evidence and mark unresolved conflicts explicitly.
5. Only read needed records; do not load the entire Vault by default. Use the candidate inbox as an untrusted evidence queue, never as an accepted source of decisions.

## Project index

| Project | Snapshot | Last checked |
| --- | --- | --- |
| LLM Wiki itself | [PRJ-LLM-WIKI](projects/llm-wiki.md) | 2026-11-03 |
| CSForge | [PRJ-CSFORGE](projects/csforge.md) | 2026-11-03 |
| Dark Todo Planner | [PRJ-DARK-TODO](projects/dark-todo.md) | 2026-11-03 |
| PawCycle Commerce | [PRJ-PAWCYCLE](projects/pawcycle.md) | 2026-11-04 |
| DevPedia (design-only; repo access unverified) | [PRJ-DEVPEDIA](projects/devpedia.md) | 2026-11-03 |

## Decision index

| ID | State | Decision | Project |
| --- | --- | --- | --- |
| [WIKI-0001](decisions/WIKI-0001.md) | accepted | Separate AI Wiki from Study | llm-wiki |
| [WIKI-0002](decisions/WIKI-0002.md) | accepted | Existing GitHub Markdown as common source | llm-wiki |
| [WIKI-0003](decisions/WIKI-0003.md) | accepted | PawCycle AI Project Memory: exhaustive source dispositions and continuous capture | llm-wiki |
| [CSF-0001](decisions/CSF-0001.md) | accepted | Guard canonical content sync to preserve history | csforge |
| [CSF-0002](decisions/CSF-0002.md) | accepted | Java editorial diagram semantics | csforge |
| [DTD-0001](decisions/DTD-0001.md) | accepted | Neutral content-first UI | dark-todo |
| [DTD-0002](decisions/DTD-0002.md) | accepted | Remove Inbox UI without deleting legacy data | dark-todo |
| [DTD-0003](decisions/DTD-0003.md) | accepted | Today reorder and compact Calendar detail | dark-todo |
| [PWC-0001](decisions/PWC-0001.md) | accepted | Separate CD readiness from production activation | pawcycle |
| [PWC-0002](decisions/PWC-0002.md) | accepted | Guard and time-bound OCI A1 acquisition | pawcycle |
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

## Knowledge index

| ID | Status | Knowledge | Project |
| --- | --- | --- | --- |
| [PWK-0001](knowledge/PWK-0001.md) | published | PawCycle code, design and operations reverse-engineering learning guide | pawcycle |

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
| [PWL-0021](lessons/PWL-0021.md) | draft | Spring Context 이전 gate는 자신이 보지 못하는 외부 설정 경로까지 고려해야 한다 | pawcycle |
| [PWL-0022](lessons/PWL-0022.md) | 운영 기준선은 실제 검증한 Control 버전에 묶이며 후속 변경에 자동 승계되지 않는다 | pawcycle |

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

All records have stable IDs and links. Updating a project snapshot must not silently rewrite an accepted decision. Intake never writes decisions automatically.

## Coverage limits

Historical seeded decisions are not an exhaustive source audit: PawCycle #1–#80 have individual detailed dispositions; #81–#501 remain to be triaged despite existing partial topic-level records. There has been no comprehensive import of private ChatGPT, Work or Codex conversations. A missing record does not prove a historical decision never occurred. Projects may change after their last verification timestamp. GitHub branches and pull requests do not prove current cloud or database state.


- Sequential audit: [#11–#20 evidence and dispositions](history/pawcycle-source-ledger/batch-011-020.md), [July timeline](journal/pawcycle/2026-07.md), [next source #81](history/pawcycle-source-ledger/progress.json). Current count: **80 complete / 421 pending / 501 inventoried**.


- Next sequential batch: [#21–#30 evidence](history/pawcycle-source-ledger/batch-021-030.md); scaffold and CI are separate from DB/Auth implementation approval.

- 2026-11-04 sequential batch: [#31–#40 dispositions](history/pawcycle-source-ledger/batch-031-040.md), [exact source/CI manifest](history/pawcycle-source-ledger/batch-031-040.sources.json). Next #41; authentication QA remains conditional within its evidence scope.

### PawCycle 상세 처리 #41~#50 (2026-11-04)

구독 V1 구현의 도메인/DB 날짜 경계, Frontend CSRF·비동기 인증 경쟁, local-only fixture와 쿠키·readiness 교정, 첫 MVP의 조건부 완료와 후속 접근성 QA, 성능 측정 후보→범위 승인·세부 차단을 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-041-050.md). 최신 누적 50/501, 미완료 451, 다음 #51.

### PawCycle 상세 처리 #51~#60 (2026-11-04)

성능 세부 승인→순서 이탈 부분 관측→전체 재승인→native stderr/배열 SelfTest 실패→기준선 미확보 종료를 복원하고, 위험 기반 Lean Harness·AWS 준비·동일 SHA release·HTTPS의 준비/운영 경계를 연결했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-051-060.md). 최신 누적 60/501, 미완료 441, 다음 #61.

### PawCycle 상세 처리 #61~#70 (2026-11-04)

HTTPS 실제 발급·갱신/재부팅, S3 격리 복원과 유지보수 예외, 자동 cleanup·IAM gate의 검증 한계, 기능 차이 없는 release rollback, EC2 SNS 수동 알림, 인증 smoke·one-shot 회원 준비와 사전 gate 잔여 지적을 복원했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-061-070.md). 최신 누적 70/501, 미완료 431, 다음 #71.

### PawCycle 상세 처리 #71~#80 (2026-11-04)

운영 회원 wrapper·실제 회원/세션 증거, Application/Control SHA 분리와 rollback 호환성 교정, candidate DB restore 준비, 운영 안전성 판정 철회·보류와 실제 Control 왕복 검증을 시간순으로 연결했다. [원본 대장](history/pawcycle-source-ledger/README.md) · [배치](history/pawcycle-source-ledger/batch-071-080.md). 최신 누적 80/501, 미완료 421, 다음 #81.
