"""Prove that daily-tech staging rejects edits, conflicts and duplicate URLs."""
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
import unittest

from scripts.preflight_daily_tech import validate_staged_batch
from scripts.test_daily_tech import ARTICLE


class StagingTests(unittest.TestCase):
    def setUp(self):
        self.tmp = TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.folder = self.root / "References/Tech Articles/Articles/2026"
        self.folder.mkdir(parents=True)
        b = self.root / "References/Tech Articles/기술 자료.base"
        b.write_text(
            'filters:\n  and:\n    - file.inFolder("References/Tech Articles/Articles")'
            '\nviews:\n  - name: 읽기 대기\n  - name: 학습 완료\n  - name: 전체 자료\n',
            encoding="utf-8",
        )
        self.existing = self.folder / "2026-11-05-example.md"
        self.existing.write_text(ARTICLE, encoding="utf-8")
        self.git("init", "-b", "main")
        self.git("config", "user.name", "Daily Tech Test")
        self.git("config", "user.email", "daily-tech-test@example.org")
        self.commit("baseline")
        self.base = self.git("rev-parse", "HEAD").stdout.strip()
        self.git("switch", "-c", "daily-tech")

    def git(self, *args):
        return subprocess.run(["git", *args], cwd=self.root,
                              capture_output=True, text=True, check=True)

    def commit(self, message):
        self.git("add", ".")
        self.git("commit", "-m", message)

    def add_new(self, url="https://example.org/new"):
        new = self.folder / "2026-11-05-new.md"
        new.write_text(
            ARTICLE.replace("https://example.org/article/", url),
            encoding="utf-8",
        )
        self.commit("new article")
        return new

    def test_clean_article_addition(self):
        self.add_new()
        additions, errors = validate_staged_batch(self.root, self.base)
        self.assertEqual([], errors)
        self.assertEqual(1, len(additions))

    def test_rejects_modified_existing_note(self):
        self.existing.write_text(ARTICLE + "\nUser notes must survive.\n", encoding="utf-8")
        self.commit("overwrite existing note")
        _, errors = validate_staged_batch(self.root, self.base)
        self.assertIn("change outside allowed", " ".join(errors))

    def test_rejects_non_article_changes(self):
        (self.root / "Wiki").mkdir()
        (self.root / "Wiki/test.md").write_text("no", encoding="utf-8")
        self.commit("unexpected wiki write")
        _, errors = validate_staged_batch(self.root, self.base)
        self.assertIn("change outside allowed", " ".join(errors))

    def test_rejects_duplicate_canonical_url(self):
        self.add_new("https://EXAMPLE.org/article?utm_source=x")
        _, errors = validate_staged_batch(self.root, self.base)
        self.assertIn("duplicate canonical URL", " ".join(errors))

    def test_rejects_main_advance(self):
        self.add_new()
        self.git("switch", "main")
        (self.root / "another.md").write_text("a local change", encoding="utf-8")
        self.commit("concurrent main update")
        moved_main = self.git("rev-parse", "HEAD").stdout.strip()
        self.git("switch", "daily-tech")
        _, errors = validate_staged_batch(self.root, moved_main)
        self.assertIn("not based on current main", " ".join(errors))

    def test_rejects_no_new_documents(self):
        _, errors = validate_staged_batch(self.root, self.base)
        self.assertIn("no staged changes", " ".join(errors))


if __name__ == "__main__":
    unittest.main()
