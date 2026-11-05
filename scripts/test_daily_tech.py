"""Tests for the daily-tech schema and canonical URL safeguards."""
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from scripts.validate_daily_tech import canonical_url, validate_archive, validate_note


ARTICLE = """---
type: tech-article
title: "Example"
source: "Example Blog"
published: 2026-01-01
collected: 2026-11-05
url: "https://example.org/article/"
categories:
  - 설계·아키텍처
projects: []
status: inbox
tags:
  - tech-article
---
> [!abstract] Summary

## 원문
[Example](https://example.org/article/)
"""


class DailyTechTests(unittest.TestCase):
    def setUp(self):
        self.tmp = TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.folder = self.root / "References/Tech Articles/Articles/2026"
        self.folder.mkdir(parents=True)
        base = self.root / "References/Tech Articles/기술 자료.base"
        base.write_text('filters:\n  - file.inFolder("References/Tech Articles/Articles")\nviews:\n  - name: 읽기 대기\n  - name: 학습 완료\n  - name: 전체 자료\n', encoding="utf-8")
        self.note = self.folder / "2026-11-05-example.md"
        self.note.write_text(ARTICLE, encoding="utf-8")

    def test_valid_article_and_base(self):
        self.assertEqual([], validate_archive(self.root))

    def test_url_identity_ignores_tracking_fragment_and_slash(self):
        self.assertEqual(
            canonical_url("https://EXAMPLE.org/article/?utm_source=x#foo"),
            canonical_url("https://example.org/article"),
        )

    def test_rejects_tracking_in_saved_url(self):
        self.note.write_text(ARTICLE.replace("https://example.org/article/\"", "https://example.org/article/?utm_source=x\""), encoding="utf-8")
        self.assertIn("tracking parameters", " ".join(validate_note(self.note, self.root)[1]))

    def test_rejects_invalid_status(self):
        self.note.write_text(ARTICLE.replace("status: inbox", "status: done"), encoding="utf-8")
        self.assertIn("invalid status", " ".join(validate_note(self.note, self.root)[1]))

    def test_rejects_bad_collection_date(self):
        self.note.write_text(ARTICLE.replace("collected: 2026-11-05", "collected: 2026-11-99"), encoding="utf-8")
        self.assertNotEqual([], validate_note(self.note, self.root)[1])

    def test_rejects_duplicate_canonical_url(self):
        second = self.folder / "2026-11-05-second.md"
        second.write_text(ARTICLE.replace("https://example.org/article/", "https://EXAMPLE.org/article"), encoding="utf-8")
        self.assertIn("duplicate canonical URL", " ".join(validate_archive(self.root)))


if __name__ == "__main__":
    unittest.main()
