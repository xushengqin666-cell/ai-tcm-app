# rename_brand.py - 把所有"家庭药师"替换为"家庭药师"
import os, sys, shutil

ROOT = r'C:\Users\xu_fa\ai-tcm-app'
OLD = '家庭药师'
NEW = '家庭药师'

# 这些文件是 build 产物，下次 build 会重生成，跳过
SKIP_PATHS = {
    'android\\app\\build',
    'node_modules',
    '.git',
}

# 必须修改的源文件（白名单路径模式）
SOURCE_PATTERNS = (
    'app.html', 'index.html', 'cabinet.html', 'adverse.html', 'chronic.html',
    'manifest.json', 'capacitor.config.json', 'package.json',
    'strings.xml', 'main.js',
    'setup_electron.py', 'inject_pwa.py', 'setup_pwa.py', 'setup_capacitor.py',
    'setup_signing.py', 'rebuild_v2.py',
)

total_replaced = 0
files_changed = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # 跳过 build/git/node_modules
    parts = dirpath.split(os.sep)
    if any(s in dirpath for s in SKIP_PATHS):
        continue
    for fn in filenames:
        if not any(p in fn or fn.endswith(p) for p in ('.html','.json','.xml','.js','.py')):
            continue
        path = os.path.join(dirpath, fn)
        rel = os.path.relpath(path, ROOT)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                c = f.read()
        except (UnicodeDecodeError, IOError):
            continue
        if OLD not in c:
            continue
        n = c.count(OLD)
        new_c = c.replace(OLD, NEW)
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(new_c)
        total_replaced += n
        files_changed += 1
        print(f'  [{n:2d}] {rel}')

print(f'\n总计: 替换 {total_replaced} 处，修改 {files_changed} 个文件')

# 验证：再次扫描确认
print('\n[验证] 重新扫描...')
remaining = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    if any(s in dirpath for s in SKIP_PATHS):
        continue
    for fn in filenames:
        if not any(fn.endswith(ext) for ext in ('.html','.json','.xml','.js','.py')):
            continue
        path = os.path.join(dirpath, fn)
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
            n = c.count(OLD)
            if n > 0:
                remaining += n
                rel = os.path.relpath(path, ROOT)
                print(f'  [残留{n}] {rel}')
        except:
            pass

if remaining == 0:
    print('  [OK] 无残留！')
else:
    print(f'  [警告] 还有 {remaining} 处残留')
