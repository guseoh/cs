# -*- coding: utf-8 -*-
"""모듈(2단계 패키지) 사이의 persistence/domain 직접 의존을 센다."""
import sys, os, re, collections
root = sys.argv[1]
base = 'com.pawcycle.backend.'
edges = collections.Counter()
files_by_edge = collections.defaultdict(set)

def module_of(pkg):
    parts = pkg.split('.')
    if parts[0] in ('commerce', 'catalog', 'subscription', 'member') and len(parts) > 1:
        return parts[0] + '.' + parts[1]
    return parts[0]

for dp, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.java'):
            continue
        p = os.path.join(dp, f)
        src = open(p, encoding='utf-8').read()
        m = re.search(r'^package ' + re.escape(base) + r'([\w.]+);', src, re.M)
        if not m:
            continue
        me = module_of(m.group(1))
        for imp in re.findall(r'^import ' + re.escape(base) + r'([\w.]+)\.[A-Z]\w*;', src, re.M):
            target = module_of(imp)
            layer = imp.split('.')[-1] if imp.split('.')[-1] in ('persistence', 'domain', 'api', 'application', 'model', 'infrastructure') else imp.split('.')[-1]
            if target != me and layer in ('persistence', 'domain'):
                edges[(me, target, layer)] += 1
                files_by_edge[(me, target, layer)].add(os.path.relpath(p, root).replace(os.sep, '/'))

print('cross-module persistence/domain import edges:', len(edges), 'imports:', sum(edges.values()))
for (a, b, l), n in edges.most_common(30):
    print(f'{n:3d}  {a:28s} -> {b:28s} [{l}]  files={len(files_by_edge[(a,b,l)])}')
