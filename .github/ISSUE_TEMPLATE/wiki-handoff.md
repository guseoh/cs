---
name: AI Wiki handoff
about: Submit a short public-safe, owner-confirmed context record for review
title: "[wiki] "
labels: []
assignees: []
---

**Warning: this Issue is PUBLIC immediately. Never paste full AI conversations, secrets, or private data.**

Replace this entire body with one JSON object matching the [Wiki handoff contract](../../Wiki/handoff.md). The sample is deliberately not approved.

```json
{
  "project": "csforge",
  "client": "chatgpt",
  "kind": "decision",
  "summary": "Brief confirmed decision title",
  "context": "Why the question arose, without private details.",
  "decision": "What was explicitly decided.",
  "rejected_alternatives": "What was ruled out and why.",
  "constraints": "What later AI agents must respect.",
  "source_urls": [],
  "confirmed": false,
  "public_safe": false
}
```

Change `confirmed` and `public_safe` to true only if both statements are accurate. Automated intake rejects false values. The resulting PR is **a review candidate**, not accepted Wiki memory.
