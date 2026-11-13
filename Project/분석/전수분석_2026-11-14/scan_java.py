# -*- coding: utf-8 -*-
"""백엔드 Java 정량 스캔: 긴 메서드, 넓은 record, 인라인 FQN, 예외 처리, 트랜잭션 패턴."""
import sys, os, re, collections, json

root = sys.argv[1]
out = {}
methods, recs, catches, txt_tmpl, fqn_lines = [], [], [], [], collections.Counter()
sig = re.compile(r'^\s*(?:@\w+(?:\([^)]*\))?\s+)*(?:(?:public|protected|private|static|final|synchronized|default)\s+)*[\w<>\[\],.? ]+\s+(\w+)\s*\(')
skip = re.compile(r'^\s*(if|for|while|switch|return|new|else|catch|try|throw|case)\b')

for dp, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.java'):
            continue
        p = os.path.join(dp, f)
        rel = os.path.relpath(p, root).replace(os.sep, '/')
        L = open(p, encoding='utf-8').read().split('\n')
        src = '\n'.join(L)
        for ln in L:
            s = ln.strip()
            if s.startswith('import ') or s.startswith('package ') or s.startswith('*') or s.startswith('//'):
                continue
            if re.search(r'(?<![\w.])java\.(util|time|math|sql)\.[A-Z]', ln):
                fqn_lines[rel] += 1
        for m in re.finditer(r'\brecord\s+(\w+)\s*\(([^)]*)\)', src, re.S):
            n = len([x for x in m.group(2).split(',') if x.strip()])
            if n >= 8:
                recs.append((n, rel, m.group(1)))
        for i, ln in enumerate(L):
            m = re.search(r'catch \((?:final )?([\w.| ]+) (\w+)\)', ln)
            if m and re.search(r'\b(RuntimeException|Exception|Throwable)\b', m.group(1)):
                body = ' '.join(x.strip() for x in L[i + 1:i + 4])
                catches.append((rel, i + 1, m.group(1).strip(), body[:90]))
            if 'new TransactionTemplate(' in ln:
                txt_tmpl.append(rel)
        i = 0
        while i < len(L):
            ln = L[i]
            m = sig.match(ln)
            if m and not skip.match(ln) and not ln.rstrip().endswith(';'):
                j, depth, started = i, 0, False
                while j < len(L):
                    depth += L[j].count('{') - L[j].count('}')
                    if '{' in L[j]:
                        started = True
                    if started and depth <= 0:
                        break
                    if not started and L[j].rstrip().endswith(';'):
                        break
                    j += 1
                if started and j - i + 1 >= 60:
                    methods.append((j - i + 1, rel, m.group(1)))
                i = j + 1 if started else i + 1
            else:
                i += 1

methods.sort(reverse=True)
recs.sort(reverse=True)
out['long_methods_60'] = len(methods)
out['long_methods_top'] = methods[:20]
out['wide_records_8'] = len(recs)
out['wide_records_top'] = recs[:15]
out['inline_fqn_lines'] = sum(fqn_lines.values())
out['inline_fqn_files'] = len(fqn_lines)
out['inline_fqn_top'] = fqn_lines.most_common(8)
out['broad_catches'] = len(catches)
out['broad_catches_list'] = catches
out['transaction_template_files'] = collections.Counter(txt_tmpl).most_common()
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in out.items() if not k.endswith('_list')}, ensure_ascii=False, indent=1)[:6000])
