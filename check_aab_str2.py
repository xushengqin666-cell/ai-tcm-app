import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
for p in ['android/app/src/main/res/values/strings.xml',
          'android/app/src/main/assets/capacitor.config.json',
          'android/app/src/main/assets/public/index.html',
          'android/app/src/main/assets/public/manifest.json']:
    full = os.path.join(ROOT, p)
    if os.path.exists(full):
        sz = os.path.getsize(full)
        with open(full, 'r', encoding='utf-8') as f:
            c = f.read()
        old = c.count('彩云智药')
        new = c.count('家庭药师')
        print(f'{sz:>8}  old={old}  new={new}  {p}')
    else:
        print(f'  missing  {p}')
