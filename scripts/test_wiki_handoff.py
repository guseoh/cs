#!/usr/bin/env python3
"""Offline adversarial tests for AI handoff review-candidate intake."""
import copy
import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from wiki_handoff import display, parse_issue, render

OWNER = "guseoh"
REPO = "guseoh/cs"


def fixture():
    data = {
        "project": "csforge",
        "client": "chatgpt",
        "kind": "decision",
        "summary": "Preserve content history in synchronization",
        "context": "Existing attempts cannot be reinterpreted after edits.",
        "decision": "Protect history-bearing questions during automated sync.",
        "rejected_alternatives": "Overwrite attempted questions automatically.",
        "constraints": "Do not infer live deployment from merged source.",
        "source_urls": ["https://github.com/guseoh/csforge/pull/288"],
        "confirmed": True,
        "public_safe": True,
    }
    return {
        "number": 50, "title": "[wiki] CSForge guarded content sync",
        "html_url": "https://github.com/guseoh/cs/issues/50",
        "user": {"login": OWNER}, "body": json.dumps(data),
    }


class HandoffTests(unittest.TestCase):
    def test_owner_confirmed_public_safe_success(self):
        issue = fixture()
        n, data, url = parse_issue(issue, OWNER, REPO)
        self.assertEqual(n, 50)
        self.assertIn("Not an accepted decision", render(n, data, url))
        self.assertEqual(render(n, data, url), render(n, data, url))

    def test_accepts_json_fence(self):
        issue = fixture()
        issue["body"] = chr(96) * 3 + "json\n" + issue["body"] + "\n" + chr(96) * 3
        self.assertEqual(parse_issue(issue, OWNER, REPO)[0], 50)

    def test_rejects_other_author(self):
        issue = fixture()
        issue["user"]["login"] = "someone-else"
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)

    def test_rejects_wrong_repository(self):
        issue = fixture()
        issue["html_url"] = "https://github.com/other/cs/issues/50"
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)

    def test_rejects_unconfirmed_and_unsafe(self):
        for key in ("confirmed", "public_safe"):
            issue = fixture()
            data = json.loads(issue["body"])
            data[key] = False
            issue["body"] = json.dumps(data)
            with self.assertRaises(ValueError):
                parse_issue(issue, OWNER, REPO)

    def test_rejects_unknown_project(self):
        issue = fixture()
        data = json.loads(issue["body"])
        data["project"] = "path/../../secrets"
        issue["body"] = json.dumps(data)
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)

    def test_rejects_secret(self):
        issue = fixture()
        data = json.loads(issue["body"])
        data["context"] = "password=reallyunsafevaluehere"
        issue["body"] = json.dumps(data)
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)

    def test_escapes_markdown_and_html(self):
        result = display("](../../AGENTS.md) | <script>x</script> \n## malicious")
        self.assertNotIn("](", result)
        self.assertNotIn("<script>", result)
        self.assertNotIn("\n", result)
        self.assertIn("&#91;", display("[test]"))

    def test_rejects_invalid_source(self):
        issue = fixture()
        data = json.loads(issue["body"])
        data["source_urls"] = ["javascript:alert(1)"]
        issue["body"] = json.dumps(data)
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)

    def test_rejects_pr_and_wrong_title(self):
        issue = fixture()
        issue["pull_request"] = {"url": "https://example.invalid"}
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)
        issue = fixture()
        issue["title"] = "Ordinary Issue"
        with self.assertRaises(ValueError):
            parse_issue(issue, OWNER, REPO)


if __name__ == "__main__":
    unittest.main()
