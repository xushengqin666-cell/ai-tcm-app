import subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')

AAB = r'C:\Users\xu_fa\ai-tcm-app\android\app\build\outputs\bundle\release\app-release.aab'
AAPT2 = r'C:\android-sdk\build-tools\34.0.0\aapt2.exe'

# dump badging
r = subprocess.run([AAPT2, 'dump', 'badging', AAB], capture_output=True, timeout=30)
out = r.stdout.decode('utf-8', errors='replace')
print(out[:3000])
