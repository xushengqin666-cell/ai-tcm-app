import os
for p in [r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab',
          r'C:\Users\xu_fa\Desktop\彩云智药.apk',
          r'C:\Users\xu_fa\Desktop\家庭药师.apk']:
    if os.path.exists(p):
        print(f'{os.path.getsize(p):>10}  {p}')
    else:
        print(f'  missing  {p}')
