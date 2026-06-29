# fix_html_title.py - 改 HTML <title> 标签
import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
files = ['app.html', 'index.html', 'src/index.html', 'desktop/src/index.html']
for f in files:
    p = os.path.join(ROOT, f)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as fh:
        c = fh.read()
    new = c
    new = new.replace('<title>家庭药师 / Caiyun Smart Pharmacy v5</title>',
                      '<title>家庭药师 / Family Pharmacist v5</title>')
    if new != c:
        with open(p, 'w', encoding='utf-8', newline='') as fh:
            fh.write(new)
        print(f'  updated: {f}')
    else:
        print(f'  no change: {f}')

# 扫描 Caiyun 残留
print('\n[残留扫描]')
for f in files:
    p = os.path.join(ROOT, f)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as fh:
        c = fh.read()
    if 'Caiyun' in c:
        idx = c.find('Caiyun')
        print(f'  {f}: {c[max(0,idx-40):idx+60]!r}')
    else:
        print(f'  {f}: clean')
