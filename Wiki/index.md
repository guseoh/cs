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
| [CSF-0001](decisions/CSF-0001.md) | accepted | Guard canonical content sync to preserve history | csforge |
| [CSF-0002](decisions/CSF-0002.md) | accepted | Java editorial diagram semantics | csforge |
| [DTD-0001](decisions/DTD-0001.md) | accepted | Neutral content-first UI | dark-todo |
| [DTD-0002](decisions/DTD-0002.md) | accepted | Remove Inbox UI without deleting legacy data | dark-todo |
| [DTD-0003](decisions/DTD-0003.md) | accepted | Today reorder and compact Calendar detail | dark-todo |
| [PWC-0001](decisions/PWC-0001.md) | accepted | Separate CD readiness from production activation | pawcycle |
| [PWC-0002](decisions/PWC-0002.md) | accepted | Guard and time-bound OCI A1 acquisition | pawcycle |
| [PWC-0900](decisions/PWC-0900.md) | accepted | OCI A1 alert-only monitoring and manual provisioning boundary | pawcycle |
| [PWC-0901](decisions/PWC-0901.md) | proposed | Separate 5-minute scheduling, real OCI check and independent failure detection | pawcycle |

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
- [Obsidian sync policy](../.github/OBSIDIAN_SYNC.md): multi-device safety

All records have stable IDs and links. Updating a project snapshot must not silently rewrite an accepted decision. Intake never writes decisions automatically.

## Coverage limits

Only selected high-value, source-verified project decisions were seeded. There has been no comprehensive import of private ChatGPT, Work or Codex conversations. A missing record does not prove a historical decision never occurred. Projects may change after their last verification timestamp. GitHub branches and pull requests do not prove current cloud or database state.
