# GitHub PR intake — review queue

> Initial placeholder. The source-only intake script generates a deterministic list of the last merged PRs for the two full-mode public project repositories (CSForge and PawCycle).
> No decisions are automatically approved, and no production state is inferred from this placeholder.

The scheduled intake is active after the full-mode workflow is merged to main. It runs daily and creates a review PR only when public PR events changed. For manual local preview, run:

    python scripts/wiki_ingest.py --dry-run

For a reviewed update, see [inbox instructions](README.md).
