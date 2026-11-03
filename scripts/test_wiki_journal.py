#!/usr/bin/env python3
"""Offline tests: journal completeness, idempotence and project opt-out."""
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from wiki_journal import build_changes, entry, REPOSITORIES


def sample(repo, number, timestamp, merged=True):
    return {"number": number, "title": "fix: minor UI spacing | <script>fake</script>",
            "merged_at": timestamp if merged else None, "merge_commit_sha": "a" * 40}


def source_events():
    return {
        "guseoh/csforge": [
            sample("csforge", 41, "2026-11-03T01:00:00Z"),
            sample("csforge", 40, "2026-11-02T01:00:00Z"),
            sample("csforge", 42, "2026-11-03T02:00:00Z", merged=False),
        ],
        "guseoh/pawcycle-commerce": [
            sample("pawcycle", 496, "2026-11-03T05:21:59Z"),
        ],
    }


class JournalTests(unittest.TestCase):
    def test_only_full_mode_projects(self):
        self.assertEqual({x[0] for x in REPOSITORIES}, {"csforge", "pawcycle"})

    def test_generates_monthly_entries_and_preserves_history(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            c = build_changes(source_events(), root)
            self.assertEqual(len(c), 2)
            cs = c[root / "csforge" / "2026-11.md"]
            self.assertIn("wiki-pr:guseoh/csforge#40", cs)
            self.assertIn("wiki-pr:guseoh/csforge#41", cs)
            self.assertNotIn("#42", cs)
            self.assertNotIn("<script>", cs)
            self.assertLess(cs.index("#40"), cs.index("#41"))
            for path, value in c.items():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(value, encoding="utf-8")
            self.assertEqual(build_changes(source_events(), root), {})
            # A newer PR must append without removing old events.
            data = source_events()
            data["guseoh/csforge"].insert(0, sample("csforge", 43, "2026-11-03T09:00:00Z"))
            updates = build_changes(data, root)
            self.assertEqual(len(updates), 1)
            content = updates[root / "csforge" / "2026-11.md"]
            self.assertEqual(content.count("wiki-pr:guseoh/csforge#41"), 1)
            self.assertEqual(content.count("wiki-pr:guseoh/csforge#43"), 1)

    def test_preserves_manual_journal_lines(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            file = root / "csforge" / "2026-11.md"
            file.parent.mkdir(parents=True)
            file.write_text("# Journal\n\nManual fact with source.\n", encoding="utf-8")
            changes = build_changes(source_events(), root)
            self.assertIn("Manual fact with source.", changes[file])

    def test_invalid_timestamp_rejected(self):
        with self.assertRaises(ValueError):
            entry("guseoh/csforge", sample("csforge", 20, "November 3"))

    def test_invalid_number_rejected(self):
        with self.assertRaises(ValueError):
            entry("guseoh/csforge", sample("csforge", "21", "2026-11-03T01:00:00Z"))

    def test_missing_repo_data_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                build_changes({"guseoh/csforge": []}, Path(tmp))


if __name__ == "__main__":
    unittest.main()
