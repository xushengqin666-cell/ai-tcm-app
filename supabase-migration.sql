-- 彩云智药数据库迁移脚本
-- 在 Supabase SQL Editor 中执行

-- ============================================
-- 1. 用户表（Supabase 自动创建 auth.users）
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的 profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 自动创建 profile（触发器）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. 家庭成员表
-- ============================================

CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT,
  birth_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own family members" ON public.family_members
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 3. 药箱药品表
-- ============================================

CREATE TABLE IF NOT EXISTS public.cabinet_drugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  drug_name TEXT NOT NULL,
  generic_name TEXT,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  unit TEXT DEFAULT '盒',
  expiry_date DATE,
  purchase_date DATE,
  location TEXT,
  notes TEXT,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cabinet_drugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own drugs" ON public.cabinet_drugs
  FOR ALL USING (auth.uid() = user_id);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_cabinet_drugs_updated_at
  BEFORE UPDATE ON public.cabinet_drugs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 4. 用药记录表
-- ============================================

CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  drug_id UUID REFERENCES public.cabinet_drugs(id) ON DELETE SET NULL,
  member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'taken', 'skipped', 'refilled', 'discarded'
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own logs" ON public.medication_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 5. 用药提醒表
-- ============================================

CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  drug_id UUID REFERENCES public.cabinet_drugs(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  reminder_type TEXT NOT NULL, -- 'daily', 'weekly', 'before_meal', 'after_meal'
  reminder_time TIME,
  days_of_week TEXT[], -- ['mon', 'wed', 'fri']
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminders" ON public.reminders
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 6. 索引优化
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cabinet_drugs_user_id ON public.cabinet_drugs(user_id);
CREATE INDEX IF NOT EXISTS idx_cabinet_drugs_expiry ON public.cabinet_drugs(expiry_date);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_user_id ON public.medication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_created_at ON public.medication_logs(created_at);

-- ============================================
-- 完成
-- ============================================

-- 验证表结构
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
