# -*- coding: utf-8 -*-
"""Fix _expansions_bulk.json by doing a char-by-char state machine to find and escape inner quotes"""
import json

with open('_expansions_bulk.json', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8', errors='replace')

# State machine approach
result = []
i = 0
in_string = False
escaped = False

while i < len(text):
    c = text[i]
    
    if escaped:
        result.append(c)
        escaped = False
        i += 1
        continue
    
    if c == '\\':
        result.append(c)
        escaped = True
        i += 1
        continue
    
    if c == '"':
        if not in_string:
            # Opening quote of a string
            in_string = True
            result.append(c)
        else:
            # Could be closing quote or inner quote
            # Look ahead: if next non-space char is : or , or } or ], it's a closing quote
            j = i + 1
            while j < len(text) and text[j] in ' \t':
                j += 1
            
            if j < len(text) and text[j] in ':,}]\n':
                # Closing quote
                in_string = False
                result.append(c)
            elif j < len(text) and text[j] == '"':
                # Another quote follows - this is closing, next is opening
                in_string = False
                result.append(c)
            else:
                # Inner quote - escape it
                result.append('\\"')
        i += 1
        continue
    
    result.append(c)
    i += 1

fixed_text = ''.join(result)

try:
    data = json.loads(fixed_text)
    print(f"Fixed! {len(data)} entries")
    with open('_expansions_bulk_fixed.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved _expansions_bulk_fixed.json")
except json.JSONDecodeError as e:
    print(f"Still broken at line {e.lineno}, col {e.colno}, pos {e.pos}")
    start = max(0, e.pos - 100)
    end = min(len(fixed_text), e.pos + 100)
    print(f"Context: {fixed_text[start:end]}")
