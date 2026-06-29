# git_push_brand.py - 只 add 源代码文件
import subprocess, os, sys
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\xu_fa\ai-tcm-app')

# 已知修改过的源文件
FILES = [
    'app.html',
    'index.html',
    'manifest.json',
    'cap_sync.py',
    'cap_sync.py',
    'find_brand.py',
    'rename_brand.py',
    'git_push_brand.py',
    'cap_sync.py',
    'git_push_brand.py',
    # desktop 源
    'desktop/main.js',
    'desktop/package.json',
    'desktop/src/index.html',
    'desktop/src/manifest.json',
    # src 源
    'src/index.html',
    'src/manifest.json',
]

# 检查文件存在
existing = [f for f in FILES if os.path.exists(f)]
print(f'[1] 要 add 的文件: {len(existing)}')
for f in existing:
    sz = os.path.getsize(f)
    print(f'  {sz:>8} {f}')

# 增量 add
print('\n[2] git add <files>')
r = subprocess.run(['git', 'add'] + existing, capture_output=True)
print(f'  returncode: {r.returncode}')
if r.stderr:
    print(f'  stderr: {r.stderr.decode("utf-8", errors="replace")[:500]}')

# 查 status
print('\n[3] git status --short')
r = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
print(r.stdout[:3000])

# commit
print('\n[4] git commit')
msg = 'rebrand: 彩云智药 → 家庭药师（避开云南白药商标）'
r = subprocess.run(['git', 'commit', '-m', msg], capture_output=True)
out = r.stdout.decode('utf-8', errors='replace')
err = r.stderr.decode('utf-8', errors='replace')
print(f'  returncode: {r.returncode}')
if out: print(f'  stdout: {out[:500]}')
if err and 'nothing to commit' not in err: print(f'  stderr: {err[:500]}')

# push
print('\n[5] git push')
r = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, timeout=120)
out = r.stdout.decode('utf-8', errors='replace')
err = r.stderr.decode('utf-8', errors='replace')
print(f'  returncode: {r.returncode}')
if out: print(f'  stdout: {out[:500]}')
if err: print(f'  stderr: {err[:500]}')

if r.returncode == 0:
    print('\n[OK] 推送完成！')
else:
    print('\n[FAIL]')
