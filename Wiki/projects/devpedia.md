---
id: PRJ-DEVPEDIA
type: project
project: devpedia
status: active
created_at: 2026-11-03
updated_at: 2026-11-03
evidence_level: user-confirmed
capture_mode: design-only
sources: []
depends_on: []
supersedes: []
related_to: []
---

# DevPedia — design-only AI Wiki snapshot

## Current state (as of 2026-11-03)

The user describes DevPedia as a **self-implemented development project** in which AI is an adviser. AI may help compare approaches, review reasoning, clarify tradeoffs and design boundaries, but should not claim authorship of the application implementation.

**Source access limit:** the linked GitHub connection could not read `guseoh/DevPedia` on 2026-11-03 (repository not found or inaccessible). No current code, CI, README, deployment, PR or implementation status is independently verified here.

## Capturable design context

- Requirements and domain policies confirmed by the user.
- Domain modeling, aggregate boundaries and transaction consistency tradeoffs.
- Architecture, database schema, API contract choices and their rejected alternatives.
- Security, concurrency, scaling and deployment **design decisions**, when confirmed.
- Durable open design questions clearly labeled as undecided.

## Explicit exclusions

- Routine Article CRUD or implementation step-by-step logs.
- AI-generated claims that the user has implemented, tested or deployed code without source evidence.
- Automatic merged-PR Journal ingestion.
- Private source fragments or unpublished decisions in this public Wiki.

## Decision references

No DevPedia decisions have been migrated or independently verified yet. Add approved `DVP-####` records one by one and link them from [Wiki/index.md](../index.md). Do not backfill guessed choices.

## Next action

When the DevPedia repository is accessible with the required permissions, add a short local `AGENTS.md` reference to [the capture policy](../capture-policy.md) without changing the development ownership model or committing work automatically.

## Evidence and verification limits

Project development/AI-role preference was confirmed by the user; repo status and code are unverified. These statements document capture policy, not implementation or production readiness.
