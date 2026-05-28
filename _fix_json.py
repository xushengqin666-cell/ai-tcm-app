# -*- coding: utf-8 -*-
import json, re

with open('_expansions_bulk.json', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8', errors='replace')

LQ = '\u201c'
RQ = '\u201d'

# Fix unescaped inner double quotes by replacing Chinese-context "..." with smart quotes
text2 = re.sub(r'(?<=[\u4e00-\u9fff\uff0c\u3001\uff1b])"([^"]{1,30})"(?=[\u4e00-\u9fff\uff0c\u3001\uff1b\uff09)])', lambda m: LQ + m.group(1) + RQ, text)

try:
    data = json.loads(text2)
    print(f"Fixed! {len(data)} entries")
    with open('_expansions_bulk_fixed.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved _expansions_bulk_fixed.json")
except json.JSONDecodeError as e:
    print(f"Still broken at line {e.lineno}, col {e.colno}")
    start = max(0, e.pos - 80)
    end = min(len(text2), e.pos + 80)
    print(text2[start:end])
