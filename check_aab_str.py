import zipfile, os

AAB = r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab'

with zipfile.ZipFile(AAB) as z:
    for n in z.namelist():
        if n.endswith('values/strings.xml') or 'values/values.xml' in n or 'res/values/' in n:
            data = z.read(n).decode('utf-8', errors='replace')
            if 'app_name' in data or '彩云' in data or '家庭' in data:
                print(f'[{n}]')
                print(data[:1500])
                print('---')
