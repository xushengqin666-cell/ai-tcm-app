import zipfile, os, re

AAB = r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab'

print(f'AAB: {os.path.getsize(AAB)} bytes')
with zipfile.ZipFile(AAB) as z:
    names = z.namelist()
    # 找 strings.xml
    for n in names:
        if 'values/values' in n and n.endswith('.xml'):
            print(f'\n[FILE] {n}')
            data = z.read(n).decode('utf-8', errors='replace')
            print(data[:2000])
            break
    # 找 assets 里的 index.html
    for n in names:
        if n.endswith('index.html') and 'assets' in n:
            print(f'\n[FILE] {n} ({z.getinfo(n).file_size} bytes)')
            data = z.read(n).decode('utf-8', errors='replace')
            old = data.count('彩云智药')
            new = data.count('家庭药师')
            print(f'  彩云智药: {old}')
            print(f'  家庭药师: {new}')
            break
    # 找 manifest.json
    for n in names:
        if n.endswith('manifest.json') and 'assets' in n:
            print(f'\n[FILE] {n}')
            data = z.read(n).decode('utf-8', errors='replace')
            print(data[:500])
            break
