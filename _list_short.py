# -*- coding: utf-8 -*-
"""List all short entries (<100 chars) for batch expansion"""
import json

kb = json.load(open('kb.json', 'r', encoding='utf-8'))
short = [(i, e['t'], len(e.get('c','')), e.get('cat','')) for i, e in enumerate(kb) if len(e.get('c','')) < 100]
print(f"Short entries: {len(short)}")
for idx, t, l, cat in short[:50]:
    print(f"  [{idx}] {t} ({l}c, {cat})")
print("...")
for idx, t, l, cat in short[50:100]:
    print(f"  [{idx}] {t} ({l}c, {cat})")
