# -*- coding: utf-8 -*-
"""문서 스캔: 규모, 디렉터리별 분포, 저장소 내부 경로 참조 중 존재하지 않는 대상, 상태 표기."""
import sys, os, re, collections
repo = sys.argv[1]
docs = os.path.join(repo, 'docs')
by_dir = collections.Counter(); lines_by_dir = collections.Counter()
broken = []; total = 0
status_words = collections.Counter()
link_re = re.compile(r'\]\(([^)#\s]+)(?:#[^)]*)?\)')
code_path_re = re.compile(r'`((?:backend|frontend|infra|docs|scripts|\.github)/[\w./-]+)`')
for dp, _, fs in os.walk(docs):
    for f in fs:
        if not f.endswith('.md'):
            continue
        p = os.path.join(dp, f); rel = os.path.relpath(p, repo).replace(os.sep, '/')
        top = '/'.join(rel.split('/')[:2])
        txt = open(p, encoding='utf-8', errors='replace').read()
        n = txt.count('\n') + 1
        by_dir[top] += 1; lines_by_dir[top] += n; total += 1
        for m in re.finditer(r'(?im)^\s*[-*]?\s*(상태|status)\s*[:：]\s*`?([^`\n]{1,40})', txt):
            status_words[m.group(2).strip()[:30]] += 1
        targets = []
        for t in link_re.findall(txt):
            if t.startswith(('http', 'mailto:')):
                continue
            targets.append(os.path.normpath(os.path.join(dp, t)))
        for t in code_path_re.findall(txt):
            if '*' in t or '<' in t:
                continue
            targets.append(os.path.normpath(os.path.join(repo, t)))
        for t in targets:
            if not os.path.exists(t):
                broken.append((rel, os.path.relpath(t, repo).replace(os.sep, '/')))
print('markdown docs:', total)
for d, c in by_dir.most_common(20):
    print(f'  {d:32s} files={c:4d} lines={lines_by_dir[d]}')
print('missing local references:', len(broken), 'in', len(set(b[0] for b in broken)), 'docs')
tgt = collections.Counter(b[1] for b in broken)
print('  most referenced missing targets:')
for t, c in tgt.most_common(12):
    print(f'   {c:3d} {t}')
print('  docs with most missing refs:')
for d, c in collections.Counter(b[0] for b in broken).most_common(8):
    print(f'   {c:3d} {d}')
print('status labels (top):', status_words.most_common(10))
