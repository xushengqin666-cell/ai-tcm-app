import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
for f in ['app.html', 'index.html', 'src/index.html', 'desktop/src/index.html']:
    p = os.path.join(ROOT, f)
    with open(p, 'r', encoding='utf-8') as fh: c = fh.read()
    caiyun = c.count('Caiyun')
    caiyun_zh = c.count('彩云智药')
    print(f'{f}: Caiyun={caiyun}  caiyun_zh={caiyun_zh}')
