import zipfile

AAB = r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab'

with zipfile.ZipFile(AAB) as z:
    data = z.read('base/manifest/AndroidManifest.xml').decode('utf-8', errors='replace')
    # 找 application 标签和 android:label
    import re
    for m in re.finditer(r'android:label="([^"]*)"', data):
        print('label:', m.group(1))
    for m in re.finditer(r'package="([^"]*)"', data):
        print('package:', m.group(1))
    # 找 application 部分
    app_match = re.search(r'<application[^>]*>', data)
    if app_match:
        print('\napplication tag:')
        print(app_match.group(0)[:500])
