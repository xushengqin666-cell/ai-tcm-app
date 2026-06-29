# check_brand.py
import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
for f in ['app.html', 'index.html', 'manifest.json', 'src/index.html',
          'desktop/main.js', 'desktop/package.json', 'capacitor.config.json',
          'android/app/src/main/res/values/strings.xml']:
    p = os.path.join(ROOT, f)
    if os.path.exists(p):
        sz = os.path.getsize(p)
        with open(p, 'r', encoding='utf-8') as fh:
            c = fh.read()
        n_old = c.count('彩云智药')
        n_new = c.count('家庭药师')
        print(f'{sz:>8}  old={n_old}  new={n_new}  {f}')
