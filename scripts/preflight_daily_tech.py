#!/usr/bin/env python3
"""Fail-closed preflight for PR-free, additions-only daily-tech staging.

Run on daily-tech after fetching the latest origin/main.
This does not write to Git, change branches, or access the network.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import subprocess
import sys

try:
    from scripts.validate_daily_tech import ARTICLES, ROOT, validate_archive
except ModuleNotFoundError:
    from validate_daily_tech import ARTICLES, ROOT, validate_archive

ARTICLE_PATH = re.compile(
    r"^References/Tech Articles/Articles/[0-9]{4}/[0-9]{4}-[0-9]{2}-[0-9]{2}-.+\.md$"
)


def git(root: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", "-c", "core.quotePath=false", *args],
        cwd=root, capture_output=True, text=True, check=check,
    )


def validate_staged_batch(root: Path = ROOT, base_ref: str = "origin/main") -> tuple[list[str], list[str]]:
    """Check that HEAD adds only valid new article files on top of current main."""
    errors: list[str] = []
    try:
        base = git(root, "rev-parse", "--verify", f"{base_ref}^{{commit}}").stdout.strip()
        head = git(root, "rev-parse", "--verify", "HEAD^{commit}").stdout.strip()
    except (OSError, subprocess.CalledProcessError) as exc:
        return [], [f"cannot resolve git refs: {exc}"]

    if base == head:
        return [], ["no staged changes"]
    if git(root, "merge-base", "--is-ancestor", base, head, check=False).returncode != 0:
        return [], ["staging HEAD is not based on current main; stop instead of rebasing automatically"]
    if git(root, "status", "--porcelain", "--untracked-files=no").stdout.strip():
        errors.append("tracked worktree is dirty")

    diff = git(root, "diff", "--no-renames", "--name-status", base, head).stdout.splitlines()
    additions: list[str] = []
    for line in diff:
        status, sep, path = line.partition("\t")
        if not sep or status != "A" or not ARTICLE_PATH.fullmatch(path):
            errors.append(f"change outside allowed new article files: {line}")
            continue
        full_path = root / path
        if full_path.is_symlink() or not full_path.is_file():
            errors.append(f"article must be a regular file: {path}")
            continue
        mode = git(root, "ls-files", "-s", "--", path).stdout.strip()
        if not mode.startswith("100644 ") and not mode.startswith("100755 "):
            errors.append(f"article has unsupported Git mode: {path}")
            continue
        additions.append(path)

    if not additions:
        errors.append("no new article Markdown files")
    if len(additions) > 5:
        errors.append(f"daily limit exceeded: {len(additions)} > 5")

    errors.extend(validate_archive(root))
    return additions, errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-ref", default="origin/main", help="latest main ref already fetched")
    args = parser.parse_args()
    additions, errors = validate_staged_batch(ROOT, args.base_ref)
    if errors:
        for issue in errors:
            print(f"ERROR: {issue}", file=sys.stderr)
        return 1
    print(f"OK: {len(additions)} addition(s) from {args.base_ref}; no edits/deletes; URLs unique")
    for path in additions:
        print(f"  + {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
