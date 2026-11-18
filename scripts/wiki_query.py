#!/usr/bin/env python3
"""Search canonical Markdown, inspect record relations, and evaluate retrieval."""
import argparse
from collections import Counter
from dataclasses import dataclass
from datetime import date
import json
import math
import re
import unicodedata

from wiki_validate import RECORD_FOLDERS, RELATIONS, ROOT, WIKI, frontmatter, list_ids


@dataclass
class Record:
    fields: dict
    path: str
    title: str
    text: str
    index_entry: str = ""

    @property
    def id(self):
        return self.fields["id"]


def normalize(text):
    return unicodedata.normalize("NFKC", text).casefold()


def load_records():
    records = {}
    for directory in RECORD_FOLDERS:
        for path in sorted((WIKI / directory).rglob("*.md")):
            fields, text = frontmatter(path)
            heading = re.search(r"^# (.+)$", text, flags=re.M)
            record = Record(fields, path.relative_to(ROOT).as_posix(),
                            heading[1] if heading else fields["id"], text)
            if record.id in records:
                raise ValueError(f"duplicate record ID: {record.id}")
            records[record.id] = record
    for line in (WIKI / "index.md").read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        for record_id in re.findall(r"\[([A-Z][A-Z0-9-]+)\]\(", line):
            if record_id in records and not records[record_id].index_entry:
                records[record_id].index_entry = line
    return records


def lookup(records, question, project=None, limit=5):
    ignored = {"어떤", "어떻게", "무엇", "있는가", "과거에", "당시", "현재", "무엇인가"}
    terms = set(re.findall(r"[^\W_]{2,}", normalize(question))) - ignored
    ids = set(re.findall(r"\b[A-Z][A-Z0-9]+-[A-Z0-9-]+\b", question.upper()))
    candidates = [r for r in records.values() if project is None or r.fields["project"] == project]
    texts = [(r, normalize(r.title), normalize(r.index_entry), normalize(r.text)) for r in candidates]
    frequency = Counter(term for _, title, index, body in texts for term in terms
                        if term in body or term in index or term in title)
    weight = {term: 1 + math.log((1 + len(texts)) / (1 + frequency[term])) for term in terms}
    ranked = []
    looking_for_replacement = bool(re.search(r"대체|supersed|replacement", normalize(question)))
    for record, title, index, body in texts:
        score = sum(weight[term] * (6 if term in title else 3 if term in index else 1)
                    for term in terms if term in title or term in index or term in body)
        if record.id in ids:
            score += 100
        if looking_for_replacement and ids.intersection(list_ids(record.fields["supersedes"])):
            score += 150
        if score:
            ranked.append((score, record))
    return [r for _, r in sorted(ranked, key=lambda item: (-item[0], item[1].id))[:limit]]


def relation_data(records, selected=None):
    if selected and selected not in records:
        raise ValueError(f"unknown record ID: {selected}")
    edges = [{"source": r.id, "relation": name, "target": target}
             for r in records.values() for name in RELATIONS
             for target in list_ids(r.fields[name])]
    if selected:
        edges = [edge for edge in edges if selected in (edge["source"], edge["target"])]
    included = {node for edge in edges for node in (edge["source"], edge["target"])}
    nodes = records.keys() if not selected else included | {selected}
    return {
        "nodes": [{"id": node, "title": records[node].title, "path": records[node].path,
                   "status": records[node].fields["status"]}
                  for node in sorted(nodes) if node in records],
        "edges": sorted(edges, key=lambda edge: (edge["source"], edge["relation"], edge["target"])),
    }


def audit(records, as_of, max_age):
    titles = {}
    for record in records.values():
        canonical = re.sub(r"[^\w]+", "", normalize(record.title))
        titles.setdefault((record.fields["project"], canonical), []).append(record.id)
    edges = relation_data(records)["edges"]
    issues = []
    for edge in edges:
        if edge["relation"] != "supersedes":
            continue
        source = records[edge["source"]]
        target = records.get(edge["target"])
        if (not target or source.fields["type"] != "decision" or target.fields["type"] != "decision"
                or source.fields["status"] not in {"accepted", "superseded"}
                or target.fields["status"] != "superseded"):
            issues.append(edge)
    return {
        "records": len(records),
        "relation_counts": dict(sorted(Counter(edge["relation"] for edge in edges).items())),
        "duplicate_title_candidates": [ids for ids in sorted(titles.values()) if len(ids) > 1],
        "supersedes_review": issues,
        "stale_project_records": [
            { "id": r.id, "updated_at": r.fields["updated_at"] }
            for r in records.values() if r.fields["type"] == "project" and
            (as_of - date.fromisoformat(r.fields["updated_at"])).days > max_age
        ],
    }


def evaluate(records, limit):
    cases = json.loads((WIKI / "search-cases.json").read_text(encoding="utf-8"))
    passed = 0
    for case in cases:
        results = lookup(records, case["question"], case.get("project"), limit)
        ids = [r.id for r in results]
        expected = records[case["expected_id"]]
        evidence_matches = (case["evidence"] in expected.text
                            and expected.fields["status"] == case["status"])
        ok = expected.id in ids and evidence_matches
        passed += ok
        position = ids.index(expected.id) + 1 if expected.id in ids else "-"
        print(f"{'PASS' if ok else 'FAIL'} {case['intent']}: {expected.id} rank={position} evidence={evidence_matches}")
    print(f"{passed}/{len(cases)} cases passed at top {limit}")
    return 0 if passed == len(cases) else 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    search = commands.add_parser("search")
    search.add_argument("question")
    search.add_argument("--project")
    search.add_argument("--limit", type=int, default=5)
    relations = commands.add_parser("relations")
    relations.add_argument("record_id", nargs="?")
    report = commands.add_parser("audit")
    report.add_argument("--as-of", type=date.fromisoformat, default=date.today())
    report.add_argument("--max-age", type=int, default=14)
    benchmark = commands.add_parser("evaluate")
    benchmark.add_argument("--limit", type=int, default=5)
    args = parser.parse_args()
    if getattr(args, "limit", 1) < 1 or getattr(args, "max_age", 0) < 0:
        parser.error("limit must be positive and max age cannot be negative")
    records = load_records()
    if args.command == "search":
        for record in lookup(records, args.question, args.project, args.limit):
            print(f"{record.id}\t{record.fields['status']}\t{record.fields['evidence_level']}\t{record.path}\t{record.title}")
        return 0
    if args.command == "evaluate":
        return evaluate(records, args.limit)
    try:
        output = (relation_data(records, args.record_id) if args.command == "relations"
                  else audit(records, args.as_of, args.max_age))
    except ValueError as exc:
        parser.error(str(exc))
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
