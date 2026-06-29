# check_gitignore.py
import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'
gi = os.path.join(ROOT, '.gitignore')
print('exists:', os.path.exists(gi))
if os.path.exists(gi):
    with open(gi, 'r', encoding='utf-8', errors='replace') as f:
        print(f.read()[:3000])

# 也检查 ls -la
print('\n--- ls -la ---')
import subprocess
r = subprocess.run(['cmd', '/c', 'dir', '/a', ROOT], capture_output=True, text=True)
print(r.stdout[:2000])
