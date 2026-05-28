# -*- coding: utf-8 -*-
import json

with open('_expansions_bulk.json', 'rb') as f:
    raw = f.read()

# Try to find and fix the JSON error
try:
    data = json.loads(raw.decode('utf-8'))
    print(f"JSON parsed OK, {len(data)} entries")
except json.JSONDecodeError as e:
    print(f"Error at line {e.lineno}, col {e.colno}, pos {e.pos}")
    # Show context around error
    text = raw.decode('utf-8', errors='replace')
    start = max(0, e.pos - 100)
    end = min(len(text), e.pos + 100)
    print(f"Context: ...{text[start:end]}...")
    print(f"Char at error: {repr(text[e.pos-5:e.pos+5])}")
