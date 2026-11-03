# DevPedia AGENTS.md section — design-only Wiki capture

This template is **not applied to the DevPedia repository** until its actual `AGENTS.md` can be read and preserved. Use it as an additive section; do not replace existing instructions.

```markdown
## LLM Wiki — design-only AI memory

Central Wiki: https://github.com/guseoh/cs/tree/main/Wiki
Capture policy: https://github.com/guseoh/cs/blob/main/Wiki/capture-policy.md

This project is implemented by the user. AI is a design adviser, not the code author.

- At each substantial **design discussion**, check whether a requirement, domain/aggregate boundary, API/DB model, transaction or architecture decision was confirmed or whether a material tradeoff/open design question arose.
- Capture the context, compared options, why alternatives were rejected, implications/constraints and user confirmation. Record a proposed design as proposed, not accepted.
- Do **not** automatically journal ordinary CRUD coding steps, commits, implementation details, test runs, cosmetic bug fixes or unrelated PR activity.
- Before writing to the public Wiki, remove private project details and verify the exact source/approval. Never publish private code, credentials, internal URLs, private PRs or entire AI conversations.
- Check existing Wiki decisions to avoid duplicates. If authorized GitHub access is available, submit a small **review PR** for public-safe design decisions; otherwise report a pending decision record instead of claiming it was saved.
- Do not modify, commit, merge or deploy application code because of Wiki capture. The user's design and implementation decisions remain authoritative.
```

The [Wiki project snapshot](../projects/devpedia.md) intentionally records no DevPedia code status because the repository was not accessible at initial setup.
