# fix_caiyun_ai.py - 替换英文 AI 提示语中的 Caiyun
import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
files = ['app.html', 'index.html', 'src/index.html', 'desktop/src/index.html']
replacements = [
    ('Caiyun Smart Pharmacy AI Assistant', 'Family Pharmacist AI Assistant'),
    ('Caiyun Smart Pharmacy AI', 'Family Pharmacist AI'),
    ('Caiyun Smart Pharmacy', 'Family Pharmacist'),
]
for f in files:
    p = os.path.join(ROOT, f)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as fh:
        c = fh.read()
    new = c
    for old, repl in replacements:
        new = new.replace(old, repl)
    if new != c:
        with open(p, 'w', encoding='utf-8', newline='') as fh:
            fh.write(new)
        print(f'  updated: {f}')
    else:
        print(f'  no change: {f}')

# 验证
print('\n[验证]')
for f in files:
    p = os.path.join(ROOT, f)
    with open(p, 'r', encoding='utf-8') as fh: c = fh.read()
    print(f'  {f}: Caiyun={c.count("Caiyun")}  彩云智药={c.count("彩云智药")}')
