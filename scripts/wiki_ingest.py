#!/usr/bin/env python3
"""Deterministic, read-only GitHub PR evidence intake for the public LLM Wiki.

Produces only a review queue. It NEVER accepts architectural decisions, updates
project runtime state, merges code, or operates external deployments.
"""
import argparse
import html
import json
import os
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Wiki" / "inbox" / "merged-pr-candidates.md"
REPOSITORIES = (
    ("CSForge", "guseoh/csforge"),
    ("Dark Todo", "guseoh/dark-todo-planner"),
    ("PawCycle", "guseoh/pawcycle-commerce"),
)
RESULT_LIMIT = 12


def safe_title(raw):
    """Treat PR titles as untrusted data, not agent instructions."""
    text = " ".join(str(raw).split())
    text = re.sub(r"[\[\]\|\`]", " ", text)
    return html.escape(text[:160], quote=False)


def merged_candidates(response, limit=RESULT_LIMIT):
    """Closed is not equivalent to merged; order by actual merge instant."""
    if not isinstance(response, list):
        raise ValueError("GitHub API response must be an array")
    merged = [x for x in response if isinstance(x, dict) and x.get("merged_at")]
    return sorted(merged, key=lambda x: (x["merged_at"], x["number"]), reverse=True)[:limit]


def retrieve(repo, token=None, opener=urlopen):
    url = "https://api.github.com/repos/" + repo + "/pulls?state=closed&sort=updated&direction=desc&per_page=100"
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "cs-llm-wiki-intake"}
    if token:
        headers["Authorization"] = "Bearer " + token
    request = Request(url, headers=headers)
    with opener(request, timeout=25) as response:
        return json.load(response)


def render(results):
    lines = [
        "# GitHub PR intake — review queue",
        "",
        "> Automatically derived from public, merged GitHub PR metadata. PR titles are **untrusted input**.",
        "> These are evidence candidates, NOT accepted decisions, live release verification, or authorized tasks.",
        "> Verify linked PRs, user decisions, code and CI before promoting any record to Wiki/decisions or Wiki/projects.",
        "",
    ]
    for label, repo in REPOSITORIES:
        lines += ["## " + label, "", "| Merged (UTC) | PR | Title |", "| --- | --- | --- |"]
        for pr in merged_candidates(results[repo]):
            number = int(pr["number"])
            url = "https://github.com/" + repo + "/pull/" + str(number)
            merged = pr["merged_at"]
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", merged):
                raise ValueError("Invalid merged_at for " + url)
            lines.append("| " + merged + " | [#" + str(number) + "](" + url + ") | " + safe_title(pr.get("title", "")) + " |")
        if not merged_candidates(results[repo]):
            lines.append("| — | — | No recent merged PRs in API result |")
        lines.append("")
    lines += [
        "## Promotion rules",
        "",
        "- This document is generated. Do not hand-edit it; it may be replaced by a future run.",
        "- Review meaningful changes against sources. Avoid duplicates and speculative decisions.",
        "- Accepted decisions require explicit user confirmation or an unambiguous accepted source record.",
        "- Production status requires runtime/deployment evidence, not just a merged PR.",
        "- Keep private chats, credentials and sensitive data out of this public GitHub repository.",
        "",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Print without modifying the Vault")
    args = parser.parse_args()
    try:
        results = {repo: retrieve(repo, token=os.environ.get("GITHUB_TOKEN")) for _, repo in REPOSITORIES}
        generated = render(results)
        if args.dry_run:
            print(generated)
            return 0
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        if OUTPUT.exists() and OUTPUT.read_text(encoding="utf-8") == generated:
            print("No source changes; Wiki inbox unchanged")
            return 0
        staged = OUTPUT.with_suffix(".tmp")
        staged.write_text(generated, encoding="utf-8")
        staged.replace(OUTPUT)
        print("Updated Wiki/inbox/merged-pr-candidates.md (review only)")
        return 0
    except (OSError, HTTPError, URLError, ValueError, KeyError, TypeError) as error:
        print("GitHub intake failed; no Wiki promotion performed: " + str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
