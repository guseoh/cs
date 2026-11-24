#!/usr/bin/env python3
"""Single machine-readable project policy for Wiki intake, handoff and validation."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "Wiki" / "project-policy.json"
MODES = {"full", "design-only", "manual"}


def load_policy(path=POLICY):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict) or data.get("version") != 1:
        raise ValueError("invalid project policy version")
    projects = data.get("projects")
    if not isinstance(projects, dict) or not projects:
        raise ValueError("project policy must contain projects")
    repositories = set()
    for slug, policy in projects.items():
        if not re.fullmatch(r"[a-z][a-z0-9-]*", slug) or not isinstance(policy, dict):
            raise ValueError("invalid project policy entry")
        if policy.get("mode") not in MODES or type(policy.get("collect")) is not bool:
            raise ValueError("invalid project mode or collect flag: " + slug)
        if policy.get("collect"):
            repo = policy.get("repository", "")
            if (policy["mode"] != "full" or
                    not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repo) or
                    not isinstance(policy.get("label"), str) or not policy["label"].strip() or
                    repo in repositories):
                raise ValueError("invalid or duplicate collection repository: " + slug)
            repositories.add(repo)
        parent = policy.get("parent")
        if parent is not None and (parent == slug or parent not in projects):
            raise ValueError("invalid project parent: " + slug)
    return projects


PROJECTS = load_policy()


def collectors():
    return tuple((slug, p["label"], p["repository"])
                 for slug, p in sorted(PROJECTS.items()) if p["collect"])
