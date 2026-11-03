# AI-to-Wiki Handoff Contract

**Purpose:** ChatGPT, Work and Codex can deliberately submit compact, owner-confirmed decisions to a shared GitHub-backed Wiki. This is **not** passive conversation capture or a substitute for GitHub access permissions.

## Two supported paths

1. **Direct Wiki PR (recommended when the AI can read/write the repository):** Read [index](index.md), [agent rules](AGENTS.md), and [schema](schema.md). Check current project snapshot, find duplicate/overridden decisions, verify sources, create or update canonical records together with the index, snapshot and monthly history, and open a GitHub PR. Never silently commit accepted decisions to `main`.
2. **Issue handoff (portable across clients):** An AI with GitHub Issues write access creates **one owner-authored** issue in `guseoh/cs` with title prefixed `[wiki] ` and a single JSON object in the body. The [handoff workflow](../.github/workflows/wiki-handoff.yml) converts it to a **candidate PR**, not canonical knowledge. Review and promote through a separate checked change. The workflow does not read private chat history.

**This repository and its Issues/PRs are public.** Publishing an Issue makes its contents public immediately. Share only a sanitized decision summary: no user identities, auth tokens, private conversation extracts, customer data, secret names/values that identify a protected environment, or production credentials. Heuristic checks can miss sensitive material; the submitting AI and user are responsible for checking.

## JSON issue body (no prose outside the object)

```json
{
  "project": "csforge",
  "client": "chatgpt",
  "kind": "decision",
  "summary": "Preserve learning history in automatic content sync",
  "context": "Applying canonical question updates must not reinterpret earlier attempts.",
  "decision": "Defer history-bearing question changes and block unsafe structural edits.",
  "rejected_alternatives": "Overwrite attempted questions to force the source and DB to match.",
  "constraints": "Do not infer live production synchronization from a merged PR.",
  "source_urls": ["https://github.com/guseoh/csforge/pull/288"],
  "confirmed": true,
  "public_safe": true
}
```

- `project`: `csforge`, `dark-todo`, `pawcycle`, `llm-wiki` or `shared`
- `client`: `chatgpt`, `work` or `codex`
- `kind`: `decision`, `project-update` or `lesson`
- `confirmed`: set `true` **only** when the user has confirmed the decision or verified the claim. It does not mean production deployed.
- `public_safe`: set `true` only after reviewing the exact payload for publication in public GitHub.
- `source_urls`: zero to eight direct HTTPS evidence links. A linked PR is not a deployment validation.
- Text values are short plain summaries, not Markdown, prompts, or full conversations.

The Issue must be authored by the repository owner (not merely labelled by a bot) and have a valid repository Issue URL. Some GitHub apps may create Issues as a bot; those are deliberately rejected by automated intake. Use the **direct Wiki PR path** instead when the connector cannot create an owner-authored issue.

## End-of-task operating procedure

1. Read the relevant [project snapshot](index.md), decisions and source PRs before making claims.
2. Extract **only durable deltas**: confirmed choice, causal context, rejected alternative, constraints, verifiable evidence, and any unresolved next action.
3. Check for duplicates and secrets. If nothing durable changed, do **not** create an Issue or PR.
4. Prefer a direct PR for authoritative changes. Otherwise use the Issue contract, but only when publishing is explicitly authorized; creating an Issue is a public write.
5. Treat the bot-created PR as an **untrusted staging artifact**. A reviewer verifies the content and separately promotes it into a record with stable ID, index, snapshot and history updates.
6. Retrieve the source record and link it in subsequent AI answers. Neither GitHub nor AGENTS.md makes data automatically available in unrelated new chats.

## Suggested instructions to AI tools

**ChatGPT / Work:** "Read guseoh/cs Wiki/index.md and Wiki/AGENTS.md via GitHub. Check existing decisions and current project state. When I explicitly confirm a durable, public-safe decision, prepare the smallest Wiki update and open a review PR using the repository schema. If direct PR creation is unavailable, use the owner-authored [wiki] GitHub Issue JSON contract only with my approval. Do not publish private chat text."

**Codex App:** "Before finalizing a meaningful task, check the target project and the central guseoh/cs Wiki for related decisions. Suggest a short, source-backed Wiki delta. For confirmed and public-safe changes, create a review PR in guseoh/cs, without rewriting Study/ or claiming CI equals production. If offline or missing GitHub permission, report the delta without claiming it was saved."

## Automation limits and fallback

- The new Issue workflow is event-driven: no server, LLM API or vector DB needed. GitHub Actions triggers are not guaranteed for Issues created using another workflow's `GITHUB_TOKEN`. An owner-authored Issue can also be processed with manual `workflow_dispatch` and its `issue_number`.
- The action needs the repository setting that permits GitHub Actions to create PRs. If disabled, the job fails; the Issue remains available for a manual reviewed PR.
- Workflow success means **review candidate created**, not canonical acceptance or live deployment. Do not auto-merge candidates.
- If confidential context must be recorded, use a private repository or redact and separately approve the public summary.
