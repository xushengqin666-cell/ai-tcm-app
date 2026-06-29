import os, sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
p = os.path.join(ROOT, 'app.html')
with open(p, 'r', encoding='utf-8') as fh: c = fh.read()
idx = 0
n = 0
while True:
    i = c.find('Caiyun', idx)
    if i < 0: break
    n += 1
    start = max(0, i-60)
    end = min(len(c), i+80)
    snippet = c[start:end].replace('\n', '\\n')
    print(f'[{n}] @{i}: ...{snippet}...')
    idx = i + 1
