# -*- coding: utf-8 -*-
"""Export short entries to a text file for batch expansion"""
import json

kb = json.load(open('kb.json', 'r', encoding='utf-8'))
short = [(e['t'], e.get('c',''), e.get('cat',''), e.get('kw',[])) for e in kb if len(e.get('c','')) < 100]

with open('_short_entries.txt', 'w', encoding='utf-8') as f:
    for t, c, cat, kw in short:
        kw_str = ','.join(kw) if kw else ''
        f.write(f"{t}|{cat}|{kw_str}|{c}\n")

print(f"Exported {len(short)} short entries to _short_entries.txt")
