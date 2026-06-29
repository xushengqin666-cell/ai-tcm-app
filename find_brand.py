# find_brand.py - 扫描所有出现"家庭药师"的文件
import os, sys

ROOT = r'C:\Users\xu_fa\ai-tcm-app'
TARGET = '家庭药师'

EXCLUDE_DIRS = {'node_modules', '.git', 'android\\.gradle', 'android\\app\\build', '_temp_scripts'}

count = 0
files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    # 排除目录
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith('.git')]
    for fn in filenames:
        # 只扫文本相关文件
        if not any(fn.endswith(ext) for ext in ('.html','.json','.xml','.js','.py','.gradle','.md','.txt','.css','.csv','.properties','.toml','.yml','.yaml')):
            continue
        path = os.path.join(dirpath, fn)
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
            n = c.count(TARGET)
            if n > 0:
                count += n
                rel = os.path.relpath(path, ROOT)
                files.append((rel, n))
        except Exception as e:
            pass

# 按出现次数排序
files.sort(key=lambda x: -x[1])
print(f'总出现次数: {count}')
print(f'涉及文件数: {len(files)}')
print('---')
for rel, n in files[:50]:
    print(f'  {n:4d}  {rel}')
