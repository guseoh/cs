#!/usr/bin/env python3
"""Append public merged PR events to CSForge/PawCycle monthly Wiki journals.

No external DB, AI API, production writes or accepted-decision promotion.
Automatic entries are ONLY source event receipts and require review before main.
"""
import argparse
import os
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError

from wiki_ingest import merged_candidates, retrieve, safe_title

ROOT = Path(__file__).resolve().parents[1]
JOURNAL_ROOT = ROOT / "Wiki" / "journal"
REPOSITORIES = (
    ("csforge", "CSForge", "guseoh/csforge"),
    ("pawcycle", "PawCycle Commerce", "guseoh/pawcycle-commerce"),
)
MERGED_AT = re.compile(r"\A\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\Z")
SHA = re.compile(r"\A[a-f0-9]{40}\Z")
MAX_EVENTS = 100


def entry(repo, pr):
    if type(pr.get("number")) is not int or pr["number"] < 1:
        raise ValueError("invalid PR number")
    timestamp = pr.get("merged_at")
    if not isinstance(timestamp, str) or not MERGED_AT.fullmatch(timestamp):
        raise ValueError("invalid merge timestamp")
    number = pr["number"]
    marker = "wiki-pr:" + repo + "#" + str(number)
    url = "https://github.com/" + repo + "/pull/" + str(number)
    title = safe_title(pr.get("title", ""))
    sha = pr.get("merge_commit_sha")
    evidence = (" (merge " + sha[:12] + ")" if isinstance(sha, str) and SHA.fullmatch(sha) else "")
    text = "- " + timestamp + " — [PR #" + str(number) + "](" + url + "): " + title + evidence + " <!-- " + marker + " -->"
    return timestamp[:7], marker, text


def build_changes(results, root=JOURNAL_ROOT):
    """Pure planning: returns dict[Path, content]; does not write anything."""
    changes = {}
    for slug, label, repository in REPOSITORIES:
        if repository not in results:
            raise ValueError("missing data for " + repository)
        events = merged_candidates(results[repository], limit=MAX_EVENTS)
        by_month = {}
        for pr in reversed(events):
            month, marker, line = entry(repository, pr)
            by_month.setdefault(month, []).append((marker, line))
        for month, candidates in by_month.items():
            path = Path(root) / slug / (month + ".md")
            if path.is_file():
                current = path.read_text(encoding="utf-8")
            else:
                current = (
                    "# " + label + " journal — " + month + "\n\n"
                    "> Public GitHub merged-PR evidence, automatically collected for AI retrieval.\n"
                    "> Untrusted source metadata; not an accepted architecture decision or live deployment validation.\n\n"
                    "## Merged PR events (UTC)\n\n"
                )
            updated = current.rstrip("\n") + "\n"
            added = 0
            for marker, line in candidates:
                if "<!-- " + marker + " -->" not in updated:
                    updated += line + "\n"
                    added += 1
            if added:
                changes[path] = updated
    return changes


def apply_changes(changes):
    for path, content in sorted(changes.items()):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="List journal files that would change; do not write")
    args = parser.parse_args()
    try:
        results = {repo: retrieve(repo, token=os.environ.get("GITHUB_TOKEN")) for _, _, repo in REPOSITORIES}
        changes = build_changes(results)
        if not args.dry_run:
            apply_changes(changes)
        if changes:
            for path in sorted(changes):
                print(("Would update " if args.dry_run else "Updated ") + path.relative_to(ROOT).as_posix())
        else:
            print("No new merged PR journal entries")
        return 0
    except (OSError, ValueError, KeyError, TypeError, HTTPError, URLError) as exc:
        print("Wiki journal collection failed: " + str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
