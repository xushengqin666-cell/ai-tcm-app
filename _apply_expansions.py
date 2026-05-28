# -*- coding: utf-8 -*-
import json

kb = json.load(open('kb.json', 'r', encoding='utf-8'))
exp = json.load(open('_expansions_bulk.json', 'r', encoding='utf-8'))

count = 0
skipped = 0
for i, e in enumerate(kb):
    t = e.get('t', '')
    if t in exp and len(e.get('c', '')) < 150:
        kb[i]['c'] = exp[t]
        count += 1
    elif t in exp and len(e.get('c', '')) >= 150:
        skipped += 1

with open('kb.json', 'w', encoding='utf-8') as f:
    json.dump(kb, f, ensure_ascii=False, indent=2)

# Stats
l = [len(e.get('c', '')) for e in kb]
print(f'Expanded: {count}, Skipped (already long): {skipped}')
print(f'Total: {len(kb)} Avg: {sum(l)/len(l):.0f} >200: {sum(1 for x in l if x>=200)} <50: {sum(1 for x in l if x<50)} <100: {sum(1 for x in l if x<100)}')
