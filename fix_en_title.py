# fix_en_title.py - 改英文翻译中的 Caiyun 字段
import os
ROOT = r'C:\Users\xu_fa\ai-tcm-app'

# 找所有 en.title 附近的行
files = ['app.html', 'index.html', 'src/index.html', 'desktop/src/index.html']
for f in files:
    p = os.path.join(ROOT, f)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as fh:
        c = fh.read()
    new = c
    # 英文 title: 'Caiyun Smart Pharmacy' -> 'Family Pharmacist'
    new = new.replace("title:'🌿 Caiyun Smart Pharmacy'", "title:'🌿 Family Pharmacist'")
    new = new.replace("title: 'Caiyun Smart Pharmacy'", "title: 'Family Pharmacist'")
    # 还有 html 中的 en title attribute
    new = new.replace('<html lang="en">', '<html lang="en">')  # noop
    if new != c:
        with open(p, 'w', encoding='utf-8', newline='') as fh:
            fh.write(new)
        print(f'  updated: {f}')
    else:
        print(f'  no change: {f}')

# 查所有文件中的英文 title
print('\n[验证] en.title 字段')
for f in files:
    p = os.path.join(ROOT, f)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as fh:
        c = fh.read()
    import re
    for m in re.finditer(r"title:\s*'([^']*)'", c):
        # 找 zh 后的下一个
        pass
    # 简单查找
    if 'Caiyun' in c:
        idx = c.find('Caiyun')
        print(f'  {f}: Caiyun at {idx}: {c[idx-30:idx+50]!r}')
