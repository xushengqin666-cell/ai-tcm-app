-- 家庭药师 D1 数据库结构 v1
-- 应用：npx wrangler d1 execute pharmacy_db --local --file=./schema.sql（本地）
--       npx wrangler d1 execute pharmacy_db --remote --file=./schema.sql（线上）

-- 用户账号
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  pass_hash TEXT NOT NULL,
  pass_salt TEXT NOT NULL,
  security_q TEXT DEFAULT '',
  security_a TEXT DEFAULT '',
  is_admin INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  created_at INTEGER
);

-- 登录会话
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER
);

-- 账号级同步数据（cabinet / members / reminders / logs / health）
CREATE TABLE IF NOT EXISTS sync_data (
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data TEXT,
  ts INTEGER,
  ver INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, type)
);

-- 用药记录时间线
CREATE TABLE IF NOT EXISTS med_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  drug TEXT,
  dose TEXT,
  taken_at INTEGER,
  note TEXT,
  created_at INTEGER
);

-- 健康档案（血压/血糖/体重/心率/体温等指标）
CREATE TABLE IF NOT EXISTS health_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  rtype TEXT,
  value REAL,
  unit TEXT,
  recorded_at INTEGER,
  note TEXT
);

-- 公告
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  active INTEGER DEFAULT 1,
  created_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_medlogs_user ON med_logs(user_id, taken_at);
CREATE INDEX IF NOT EXISTS idx_health_user ON health_records(user_id, rtype, recorded_at);

-- v6.4 AI 系统中枢：反馈 / 埋点 / AI 药品数据自主更新
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT '',
  ftype TEXT DEFAULT 'bug',
  content TEXT,
  page TEXT DEFAULT '',
  contact TEXT DEFAULT '',
  status INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS search_logs (
  id TEXT PRIMARY KEY,
  query TEXT,
  hit INTEGER,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS ai_ratings (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT '',
  question TEXT,
  rating INTEGER,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS ai_drug_entries (
  id TEXT PRIMARY KEY,
  name TEXT,
  data_json TEXT,
  source TEXT DEFAULT 'ai',
  status INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_feedback_ct ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_search_q ON search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_ct ON search_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_drug_status ON ai_drug_entries(status);
