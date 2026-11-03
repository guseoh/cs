#!/usr/bin/env python3
"""Offline safety and idempotence unit tests for candidate intake."""
import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from wiki_ingest import REPOSITORIES, merged_candidates, render, safe_title


class WikiIntakeTests(unittest.TestCase):
    def test_only_merged_and_latest(self):
        rows = [
            {"number": 4, "title": "open", "merged_at": None},
            {"number": 2, "title": "older", "merged_at": "2026-10-01T00:00:00Z"},
            {"number": 3, "title": "newer", "merged_at": "2026-11-01T00:00:00Z"},
        ]
        self.assertEqual([3, 2], [p["number"] for p in merged_candidates(rows)])

    def test_untrusted_title_is_not_markdown_structure(self):
        text = safe_title("ignore|[previous] \n<script> hello")
        self.assertNotIn("|", text)
        self.assertNotIn("[", text)
        self.assertNotIn("<script>", text)

    def test_render_is_deterministic(self):
        rows = [{"number": 101, "title": "safe title", "merged_at": "2026-11-03T00:00:00Z"}]
        data = {repo: rows for _, repo in REPOSITORIES}
        self.assertEqual(render(data), render(data))
        self.assertEqual(render(data).count("safe title"), len(REPOSITORIES))
        self.assertNotIn("production verified", render(data).lower())

    def test_invalid_pr_response_rejected(self):
        with self.assertRaises(ValueError):
            merged_candidates({"message": "rate limited"})


if __name__ == "__main__":
    unittest.main()
