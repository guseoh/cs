#!/usr/bin/env python3
"""Validate the Obsidian Tech Articles archive (no network or file writes)."""
from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
import re
import sys

import yaml

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = Path("References/Tech Articles/Articles")
BASE = Path("References/Tech Articles/기술 자료.base")
STATUSES = {"inbox", "reading", "reviewed", "archived"}
CATEGORIES = {
    "DB·데이터", "성능", "설계·아키텍처", "테스트", "장애·운영",
    "리팩터링", "동시성·분산", "인프라·DevOps", "AI·개발도구",
    "보안", "개발문화·회고",
}
TRACKING = {"fbclid", "gclid", "mc_cid", "mc_eid", "igshid", "ref"}
FILENAME = re.compile(r"^\d{4}-\d{2}-\d{2}-.+\.md$")


def canonical_url(raw: str) -> str:
    """Normalize for comparing URL identity, not for replacing the source link."""
    if not isinstance(raw, str) or not raw.strip():
        raise ValueError("URL is empty")
    parts = urlsplit(raw.strip())
    if parts.scheme.lower() not in {"http", "https"} or not parts.hostname:
        raise ValueError("URL must be an absolute http(s) URL")
    if parts.username or parts.password:
        raise ValueError("URL must not contain credentials")
    host = parts.hostname.lower()
    port = parts.port
    if port and (parts.scheme.lower(), port) not in {("https", 443), ("http", 80)}:
        host += f":{port}"
    pairs = [
        (key, value) for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if not key.lower().startswith("utm_") and key.lower() not in TRACKING
    ]
    path = parts.path.rstrip("/") or "/"
    return urlunsplit((parts.scheme.lower(), host, path, urlencode(sorted(pairs)), ""))


def split_note(content: str) -> tuple[dict, str]:
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n(.*)\Z", content, re.S)
    if not match:
        raise ValueError("missing YAML frontmatter")
    metadata = yaml.safe_load(match.group(1))
    if not isinstance(metadata, dict):
        raise ValueError("frontmatter must be a mapping")
    return metadata, match.group(2)


def _as_date(value: object, required: bool) -> date | None:
    if value is None or value == "":
        if required:
            raise ValueError("date is required")
        return None
    if isinstance(value, datetime):
        raise ValueError("use date only (YYYY-MM-DD)")
    if isinstance(value, date):
        return value
    if isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        return date.fromisoformat(value)
    raise ValueError("date must be YYYY-MM-DD")


def validate_note(path: Path, root: Path = ROOT) -> tuple[str, list[str]]:
    errors: list[str] = []
    try:
        data, body = split_note(path.read_text(encoding="utf-8"))
    except (ValueError, yaml.YAMLError, UnicodeError) as exc:
        return "", [f"{path}: {exc}"]

    def issue(detail: str) -> None:
        errors.append(f"{path.relative_to(root)}: {detail}")

    if data.get("type") != "tech-article":
        issue("type must be tech-article")
    for key in ("title", "source"):
        if not isinstance(data.get(key), str) or not data[key].strip():
            issue(f"{key} must be non-empty text")
    if not isinstance(data.get("status"), str) or data["status"] not in STATUSES:
        issue("invalid status")
    for field in ("categories", "projects", "tags", "aliases"):
        values = data.get(field, [] if field == "aliases" else None)
        if not isinstance(values, list) or any(not isinstance(v, str) or not v.strip() for v in values):
            issue(f"{field} must be a list of non-empty strings")
    categories = data.get("categories")
    if isinstance(categories, list):
        if not (1 <= len(categories) <= 2) or len(categories) != len(set(map(str, categories))):
            issue("categories must contain one or two distinct values")
        if any(not isinstance(c, str) or c not in CATEGORIES for c in categories):
            issue("unknown category")
    tags = data.get("tags")
    if isinstance(tags, list) and "tech-article" not in tags:
        issue("tags must include tech-article")

    collected = None
    for key, required in (("collected", True), ("published", False)):
        try:
            parsed = _as_date(data.get(key), required)
            if key == "collected":
                collected = parsed
        except (ValueError, TypeError) as exc:
            issue(f"invalid {key}: {exc}")

    relative = path.relative_to(root)
    if not FILENAME.fullmatch(path.name):
        issue("filename must be YYYY-MM-DD-short-topic.md")
    if collected is not None:
        if not path.name.startswith(collected.isoformat() + "-"):
            issue("filename date must match collected date")
        if relative.parent.name != str(collected.year):
            issue("parent folder must match collected year")

    url = data.get("url")
    identity = ""
    try:
        identity = canonical_url(url)
        if urlsplit(url).fragment:
            issue("url must not include fragment")
        if any(k.lower().startswith("utm_") or k.lower() in TRACKING
               for k, _ in parse_qsl(urlsplit(url).query)):
            issue("url contains tracking parameters")
    except (ValueError, TypeError) as exc:
        issue(f"invalid url: {exc}")

    if not body.strip():
        issue("empty article body")
    if "## 원문" not in body:
        issue("missing source section")
    linked = re.findall(r"\]\((https?://[^\s)]+)\)", body)
    found_source = False
    for link in linked:
        try:
            found_source = found_source or (canonical_url(link) == identity)
        except (ValueError, TypeError):
            issue("invalid Markdown source link")
    if identity and not found_source:
        issue("body must link to the same canonical source URL")
    return identity, errors


def validate_archive(root: Path = ROOT) -> list[str]:
    errors: list[str] = []
    base_path = root / BASE
    try:
        base = yaml.safe_load(base_path.read_text(encoding="utf-8"))
        if not isinstance(base, dict) or not isinstance(base.get("views"), list):
            errors.append("invalid Bases YAML or missing views")
        else:
            names = {view.get("name") for view in base["views"] if isinstance(view, dict)}
            if not {"읽기 대기", "전체 자료", "학습 완료"}.issubset(names):
                errors.append("Bases required views are missing")
            if "file.inFolder" not in str(base.get("filters", "")):
                errors.append("Bases must filter to Articles folder")
    except (OSError, yaml.YAMLError) as exc:
        errors.append(f"{BASE}: {exc}")

    identities: dict[str, Path] = {}
    article_paths = sorted((root / ARTICLES).rglob("*.md"))
    if not article_paths:
        errors.append("no sample articles to validate")
    for path in article_paths:
        if path.is_symlink():
            errors.append(f"article may not be a symlink: {path.relative_to(root)}")
            continue
        identity, problems = validate_note(path, root)
        errors.extend(problems)
        if identity:
            if identity in identities:
                errors.append(f"duplicate canonical URL: {path.relative_to(root)} and {identities[identity].relative_to(root)}")
            else:
                identities[identity] = path
    return errors


def main() -> int:
    errors = validate_archive()
    if errors:
        for message in errors:
            print("ERROR:", message, file=sys.stderr)
        return 1
    count = len(list((ROOT / ARTICLES).rglob("*.md")))
    print(f"OK: {count} tech article(s), URLs unique, metadata and Bases valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
