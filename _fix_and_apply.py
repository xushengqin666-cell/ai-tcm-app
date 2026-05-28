# -*- coding: utf-8 -*-
"""
Brute force: read _expansions_bulk.json as raw text, extract key-value pairs
using line-by-line parsing, rebuild as proper JSON.
"""
import json, re

with open('_expansions_bulk.json', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8', errors='replace')

# Find all keys - they're at the start of lines: "key": "value"
# Keys should be simple Chinese disease names without inner quotes
# Split by the pattern: ",\n  " which separates entries
entries = {}

# Approach: find each key by matching "key": at start of line
# Then take everything after : " until we find the next key or end

lines = text.split('\n')
i = 0
while i < len(lines):
    line = lines[i].strip()
    # Match: "key": "value_start
    m = re.match(r'^"([^"]+)"\s*:\s*"(.*)$', line)
    if m:
        key = m.group(1)
        val_parts = [m.group(2)]
        # Continue reading until we find a line that starts a new key or ends the object
        i += 1
        while i < len(lines):
            nextline = lines[i]
            # Check if this line starts a new key
            if re.match(r'^\s*"[^"]+"\s*:', nextline) or nextline.strip() in ['}', '{']:
                break
            val_parts.append(nextline)
            i += 1
        # Join and clean up the value
        val = '\n'.join(val_parts)
        # Remove trailing comma and/or closing quote if present
        val = val.rstrip()
        if val.endswith('",'):
            val = val[:-2]
        elif val.endswith('"'):
            val = val[:-1]
        entries[key] = val
    else:
        i += 1

print(f"Extracted {len(entries)} entries")

# Verify by checking some known keys
for k in list(entries.keys())[:3]:
    print(f"  {k}: {entries[k][:50]}...")

# Save as proper JSON
with open('_expansions_bulk_fixed.json', 'w', encoding='utf-8') as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)
print(f"Saved _expansions_bulk_fixed.json")

# Now apply to kb.json
kb = json.load(open('kb.json', 'r', encoding='utf-8'))
count = 0
for i, e in enumerate(kb):
    t = e.get('t', '')
    if t in entries and len(e.get('c', '')) < 150:
        kb[i]['c'] = entries[t]
        count += 1

with open('kb.json', 'w', encoding='utf-8') as f:
    json.dump(kb, f, ensure_ascii=False, indent=2)

lengths = [len(e.get('c', '')) for e in kb]
print(f"Applied {count} expansions")
print(f"Total: {len(kb)} Avg: {sum(lengths)/len(lengths):.0f} >200: {sum(1 for x in lengths if x>=200)} <50: {sum(1 for x in lengths if x<50)} <100: {sum(1 for x in lengths if x<100)}")
