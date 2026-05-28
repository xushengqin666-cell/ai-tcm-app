# -*- coding: utf-8 -*-
import json
kb = json.load(open('kb.json', 'r', encoding='utf-8'))
short = [(i, e.get('t',''), len(e.get('c','')), e.get('cat','')) for i, e in enumerate(kb) if len(e.get('c','')) < 80]
with open('_short.txt', 'w', encoding='utf-8') as f:
    for i, t, clen, cat in short:
        f.write(f'{i}|{t}|{clen}|{cat}\n')
print(f'Short entries: {len(short)}')
