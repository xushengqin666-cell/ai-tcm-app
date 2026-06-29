import subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')

# 用 bundletool 或 aapt2 dump badging
AAB = r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab'

# 找 aapt2
AAPT2 = r'C:\android-sdk\build-tools\34.0.0\aapt2.exe'
if not os.path.exists(AAPT2):
    # 找其他版本
    import glob
    candidates = glob.glob(r'C:\android-sdk\build-tools\*\aapt2.exe')
    if candidates:
        AAPT2 = candidates[0]
    else:
        print('aapt2 not found')
        sys.exit(1)

print(f'aapt2: {AAPT2}')

# 提取 AAB 中的 base.apk 然后 dump
import zipfile, tempfile
tmp = tempfile.mkdtemp()
with zipfile.ZipFile(AAB) as z:
    z.extract('base/manifest/AndroidManifest.xml', tmp)

manifest_path = os.path.join(tmp, 'base', 'manifest', 'AndroidManifest.xml')

# dump xmltree
r = subprocess.run([AAPT2, 'dump', 'xmltree', manifest_path, '--file', 'AndroidManifest.xml'],
                   capture_output=True, timeout=30)
print('stdout:', r.stdout.decode('utf-8', errors='replace')[:3000])
print('stderr:', r.stderr.decode('utf-8', errors='replace')[:1000])
