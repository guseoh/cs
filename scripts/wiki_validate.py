#!/usr/bin/env python3
"""Validate canonical Markdown Wiki record IDs, metadata, relations and links."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
WIKI = ROOT / "Wiki"
RECORD_FOLDERS = ("projects", "decisions", "knowledge", "lessons")
REQUIRED = ("id", "type", "project", "status", "created_at", "updated_at",
            "evidence_level", "sources", "depends_on", "supersedes", "related_to")
STATUSES = {
    "project": {"active", "paused", "archived"},
    "decision": {"proposed", "accepted", "superseded", "rejected"},
    "knowledge": {"draft", "published"},
    "lesson": {"draft", "published"},
}
RELATIONS = ("depends_on", "supersedes", "related_to")


def frontmatter(path):
    text = path.read_text(encoding="utf-8-sig")
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not match:
        raise ValueError("missing YAML frontmatter")
    fields = {}
    for line in match.group(1).splitlines():
        if re.match(r"^[a-z_]+:", line):
            key, value = line.split(":", 1)
            if key in fields:
                raise ValueError("duplicate field " + key)
            fields[key] = value.strip()
    return fields, text


def list_ids(value):
    if not (value.startswith("[") and value.endswith("]")):
        raise ValueError("relation must use an inline ID list")
    return [x.strip().strip("'\"") for x in value[1:-1].split(",") if x.strip()]


def find_errors():
    problems = []
    records = {}
    edges = []
    record_paths = []
    for directory in RECORD_FOLDERS:
        folder = WIKI / directory
        if folder.exists():
            record_paths.extend(folder.rglob("*.md"))
    for path in sorted(record_paths):
        label = path.relative_to(ROOT).as_posix()
        try:
            fields, _ = frontmatter(path)
            for key in REQUIRED:
                if key not in fields:
                    problems.append(label + ": missing " + key)
            record_id = fields.get("id", "")
            if not re.fullmatch(r"[A-Z][A-Z0-9-]{2,60}", record_id):
                problems.append(label + ": invalid record ID")
            elif record_id in records:
                problems.append(label + ": duplicate ID " + record_id)
            else:
                records[record_id] = label
            record_type = fields.get("type", "")
            if record_type not in STATUSES:
                problems.append(label + ": invalid type")
            elif fields.get("status") not in STATUSES[record_type]:
                problems.append(label + ": invalid status")
            if path.parent.name == "decisions" and record_type != "decision":
                problems.append(label + ": decision directory type mismatch")
            if path.parent.name == "projects" and record_type != "project":
                problems.append(label + ": project directory type mismatch")
            if fields.get("evidence_level") not in {"source-verified", "user-confirmed", "unverified"}:
                problems.append(label + ": invalid evidence_level")
            for field in ("created_at", "updated_at"):
                if field in fields and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", fields[field]):
                    problems.append(label + ": invalid " + field)
            for relation in RELATIONS:
                if relation in fields:
                    targets = list_ids(fields[relation])
                    if len(targets) != len(set(targets)):
                        problems.append(label + ": duplicate " + relation)
                    edges += [(record_id, relation, target) for target in targets]
        except (OSError, ValueError) as error:
            problems.append(label + ": " + str(error))

    for origin, relation, target in edges:
        if target not in records:
            problems.append(origin + ": unresolved " + relation + " => " + target)
        if origin == target:
            problems.append(origin + ": self-reference " + relation)

    for relation in ("depends_on", "supersedes"):
        adjacency = {}
        for origin, rel, target in edges:
            if rel == relation:
                adjacency.setdefault(origin, []).append(target)
        visited, active = set(), set()
        def visit(node):
            if node in active:
                problems.append("Cycle in " + relation + ": " + node)
                return
            if node in visited:
                return
            active.add(node)
            for target in adjacency.get(node, []):
                if target in records:
                    visit(target)
            active.remove(node)
            visited.add(node)
        for node in adjacency:
            visit(node)

    for path in [ROOT / "AGENTS.md", *WIKI.rglob("*.md")]:
        if not path.exists():
            continue
        try:
            content = path.read_text(encoding="utf-8-sig")
            for raw in re.findall(r"\]\(([^)\s]+)(?:\s+[^)]*)?\)", content):
                if raw.startswith(("https://", "http://", "mailto:", "#")):
                    continue
                target = raw.split("#", 1)[0]
                if target and not (path.parent / target).resolve().is_file():
                    problems.append(path.relative_to(ROOT).as_posix() + ": broken link " + raw)
        except OSError as error:
            problems.append(str(error))
    index = WIKI / "index.md"
    if not index.exists():
        problems.append("Missing Wiki/index.md")
    else:
        content = index.read_text(encoding="utf-8")
        for record in records.values():
            if Path(record).name not in content:
                problems.append("Wiki/index.md missing record: " + record)
    return problems, len(records)


def main():
    issues, count = find_errors()
    for issue in issues:
        print("ERROR: " + issue, file=sys.stderr)
    print("Validated " + str(count) + " Wiki records: " + str(len(issues)) + " issue(s)")
    return 1 if issues else 0


if __name__ == "__main__":
    sys.exit(main())
