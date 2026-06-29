# check_status.py
import subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\xu_fa\ai-tcm-app')

# 完整 status
print('=== git status ===')
r = subprocess.run(['git', 'status'], capture_output=True, text=True)
print(r.stdout)

print('\n=== git log --oneline -10 ===')
r = subprocess.run(['git', 'log', '--oneline', '-10'], capture_output=True, text=True)
print(r.stdout)

print('\n=== git ls-files | grep -E "(app.html|index.html|manifest.json)" ===')
r = subprocess.run(['git', 'ls-files'], capture_output=True, text=True)
files = r.stdout.split('\n')
for f in files:
    if f in ('app.html', 'index.html', 'manifest.json',
             'src/index.html', 'src/manifest.json',
             'desktop/main.js', 'desktop/package.json',
             'desktop/src/index.html', 'desktop/src/manifest.json',
             'capacitor.config.json'):
        print(f'  [TRACKED] {f}')

# 看 app.html 是否有差异
print('\n=== git diff app.html | head -20 ===')
r = subprocess.run(['git', 'diff', 'app.html'], capture_output=True, text=True)
print(r.stdout[:1500])
