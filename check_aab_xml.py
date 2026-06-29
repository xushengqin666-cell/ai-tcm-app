import zipfile

AAB = r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab'

with zipfile.ZipFile(AAB) as z:
    xml_files = [n for n in z.namelist() if n.endswith('.xml')]
    print(f'Total XML files in AAB: {len(xml_files)}')
    for n in xml_files[:20]:
        print(' ', n)
    print('...')
    for n in xml_files[-5:]:
        print(' ', n)
