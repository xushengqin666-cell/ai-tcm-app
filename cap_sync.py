# cap_sync.py - 同步资源到 Android
import subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\xu_fa\ai-tcm-app')

print('[1] npx cap sync android')
NPX = r'C:\Program Files\nodejs\npx.cmd'
r = subprocess.run(
    [NPX, 'cap', 'sync', 'android'],
    capture_output=True, timeout=180, shell=True
)
out = (r.stdout or b'').decode('utf-8', errors='replace')
err = (r.stderr or b'').decode('utf-8', errors='replace')
print(f'  returncode: {r.returncode}')
if out: print(f'  stdout: {out[-1500:]}')
if err: print(f'  stderr: {err[-1500:]}')
