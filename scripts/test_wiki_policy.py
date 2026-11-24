import json
from pathlib import Path
import tempfile
import unittest

from wiki_policy import load_policy, collectors, PROJECTS


class PolicyTests(unittest.TestCase):
    def test_existing_collection_scope_preserved(self):
        self.assertEqual({slug for slug, _, _ in collectors()}, {"csforge", "pawcycle"})
        self.assertEqual(PROJECTS["devpedia"]["mode"], "design-only")
        self.assertEqual(PROJECTS["dark-todo"]["mode"], "manual")
        self.assertEqual(PROJECTS["logistics-learning"]["parent"], "backend-systems-lab")

    def test_invalid_collection_policy_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "policy.json"
            path.write_text(json.dumps({"version": 1, "projects": {"x": {"mode": "manual", "collect": True}}}))
            with self.assertRaises(ValueError):
                load_policy(path)


if __name__ == "__main__":
    unittest.main()
