#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
彩云智药 - 服务器自动部署脚本
用法: python3 deploy_server.py
功能: 将本地 index.html (v2分支) SFTP 上传到服务器 132.232.141.186:9033
前提: 需先 git push 到 v2 分支（GitHub Pages 会自动部署，本脚本负责同步到自有服务器）
"""
import paramiko
import os
import sys

HOST = '132.232.141.186'
USER = 'xf'
# 密码从环境变量读取（避免硬编码到公开仓库）
# 使用: $env:CAIYUN_PASS='你的密码'; python3 deploy_server.py
PASS = os.environ.get('CAIYUN_PASS', '')
if not PASS:
    # 尝试从本地 deploy.env 读取（该文件不提交到 git）
    env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deploy.env')
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('CAIYUN_PASS='):
                    PASS = line.split('=', 1)[1].strip()
                    break
if not PASS:
    print('[错误] 未找到服务器密码。请设置环境变量 CAIYUN_PASS 或在 deploy.env 中配置')
    sys.exit(1)

REMOTE = '/home/xf/caiyun-app/public/index.html'
REMOTE_TCM = '/home/xf/caiyun-app/public/tcmengine.js'

# 本地 index.html 路径（脚本在仓库根目录时）
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL = os.path.join(SCRIPT_DIR, 'index.html')
LOCAL_TCM = os.path.join(SCRIPT_DIR, 'tcmengine.js')

def upload(sftp, local, remote, label):
    if not os.path.exists(local):
        print(f"[跳过] 本地文件不存在: {local}")
        return
    sz = os.path.getsize(local)
    print(f"[上传] {label}: {local} ({sz:,} 字节) -> {remote}")
    sftp.put(local, remote)
    print("    OK 上传完成")

def main():
    if not os.path.exists(LOCAL):
        print(f"[错误] 找不到本地文件: {LOCAL}")
        sys.exit(1)

    size = os.path.getsize(LOCAL)
    print(f"[1] 本地文件: {LOCAL} ({size:,} 字节)")

    print(f"[2] 连接服务器 {USER}@{HOST}:22 ...")
    transport = paramiko.Transport((HOST, 22))
    transport.connect(username=USER, password=PASS)
    sftp = paramiko.SFTPClient.from_transport(transport)
    print("    OK 已连接")

    upload(sftp, LOCAL, REMOTE, 'index.html')
    upload(sftp, LOCAL_TCM, REMOTE_TCM, 'tcmengine.js')

    # 验证
    print("[4] 验证服务器文件...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=10, look_for_keys=False, allow_agent=False)
    stdin, stdout, stderr = client.exec_command(
        "wc -c ~/caiyun-app/public/index.html ~/caiyun-app/public/tcmengine.js && "
        "grep -c 'fadeSlideUp' ~/caiyun-app/public/index.html && "
        "grep -c 'comprehensiveAnalysis' ~/caiyun-app/public/tcmengine.js"
    )
    out = stdout.read().decode('utf-8', 'replace')
    # 过滤非 GBK 字符以便 Windows 控制台显示
    out = out.encode('gbk', 'ignore').decode('gbk')
    print("    " + out.replace("\n", "\n    "))

    sftp.close()
    transport.close()
    client.close()
    print("\n=== 服务器部署完成 (132.232.141.186:9033) ===")
    print("=== 访问: http://132.232.141.186:9033 ===")

if __name__ == '__main__':
    main()
