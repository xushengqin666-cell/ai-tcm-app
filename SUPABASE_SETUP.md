# Supabase 项目配置指南

## 第一步：创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（推荐）或邮箱注册
4. 点击 "New Project"
5. 填写项目信息：
   - **Name**: `pharmacy-sync`（或其他名称）
   - **Database Password**: 自动生成，保存好
   - **Region**: 选择 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`（国内访问友好）
   - **Pricing Plan**: Free（免费版足够）
6. 点击 "Create new project"
7. 等待约 2 分钟，项目初始化完成

---

## 第二步：获取 API 密钥

1. 项目创建后，左侧菜单点击 "Settings" → "API"
2. 记录以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: 以 `eyJ` 开头的长字符串
3. 复制这两个值，后面要用

---

## 第三步：执行数据库迁移

1. 左侧菜单点击 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase-migration.sql` 的全部内容
4. 粘贴到编辑器
5. 点击右下角 "Run" 按钮
6. 看到 "Success. No rows returned" 表示成功

---

## 第四步：配置邮箱登录

1. 左侧菜单点击 "Authentication" → "Providers"
2. 确保 "Email" 已启用
3. 配置：
   - Enable email confirmations: **关闭**（简化流程）
   - Secure email change: 开启
   - Secure password change: 开启
4. 点击 "Save"

---

## 第五步：更新配置文件

编辑 `supabase-config.js`：

```javascript
const SUPABASE_CONFIG = {
  url: 'https://你的项目ID.supabase.co',
  anonKey: '你的anon_key',
};
```

---

## 第六步：测试

1. 打开 `cabinet.html`
2. 点击右上角 "登录/注册"
3. 输入邮箱 → 发送验证码 → 输入验证码 → 登录
4. 登录成功后，添加一个药品
5. 用另一个浏览器或无痕窗口打开 `cabinet.html`
6. 登录同一账号 → 应该能看到刚才添加的药品

---

## 常见问题

### Q: 邮箱收不到验证码？
A: 检查垃圾邮件；Supabase 免费版邮件可能延迟几分钟。

### Q: 跨域错误？
A: 在 Settings → API → URL Configuration 添加你的域名。

### Q: RLS 报错？
A: 确保执行了完整的迁移脚本，特别是 RLS Policy 部分。

### Q: 想换成微信登录？
A: 需要微信开放平台企业认证（300元/年），后续可以改。
