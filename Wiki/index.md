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
| PawCycle Commerce | [PRJ-PAWCYCLE](projects/pawcycle.md) | 2026-11-03 |
| DevPedia (design-only; repo access unverified) | [PRJ-DEVPEDIA](projects/devpedia.md) | 2026-11-03 |

## Decision index

| ID | State | Decision | Project |
| --- | --- | --- | --- |
| [WIKI-0001](decisions/WIKI-0001.md) | accepted | Separate AI Wiki from Study | llm-wiki |
| [WIKI-0002](decisions/WIKI-0002.md) | accepted | Existing GitHub Markdown as common source | llm-wiki |
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
- [PawCycle complete PR/Issue source ledger](history/pawcycle-source-ledger/README.md): all #1–#500 sources indexed; **not yet comprehensively reviewed**
- [Obsidian sync policy](../.github/OBSIDIAN_SYNC.md): multi-device safety

All records have stable IDs and links. Updating a project snapshot must not silently rewrite an accepted decision. Intake never writes decisions automatically.

## Coverage limits

Only selected high-value, source-verified project decisions were seeded. There has been no comprehensive import of private ChatGPT, Work or Codex conversations. A missing record does not prove a historical decision never occurred. Projects may change after their last verification timestamp. GitHub branches and pull requests do not prove current cloud or database state.
