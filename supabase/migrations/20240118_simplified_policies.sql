-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "children_select_policy" ON children;
DROP POLICY IF EXISTS "children_insert_policy" ON children;
DROP POLICY IF EXISTS "children_update_policy" ON children;
DROP POLICY IF EXISTS "children_delete_policy" ON children;
DROP POLICY IF EXISTS "stories_select_policy" ON stories;
DROP POLICY IF EXISTS "stories_insert_policy" ON stories;
DROP POLICY IF EXISTS "stories_update_policy" ON stories;
DROP POLICY IF EXISTS "stories_delete_policy" ON stories;
DROP POLICY IF EXISTS "subscriptions_select_policy" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_policy" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_policy" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_delete_policy" ON subscriptions;

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Atualizar o tipo plan_type
DROP TYPE IF EXISTS plan_type CASCADE;
CREATE TYPE plan_type AS ENUM ('magic', 'family');

-- Políticas para profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (
    -- Permite que um usuário crie seu próprio perfil
    auth.uid() = id OR
    -- Permite que admins criem perfis para outros usuários
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para children
CREATE POLICY "children_select" ON children FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "children_insert" ON children FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "children_update" ON children FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "children_delete" ON children FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para stories
CREATE POLICY "stories_select" ON stories FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "stories_insert" ON stories FOR INSERT WITH CHECK (
    auth.uid() = user_id  -- usuário pode criar histórias para si mesmo
);

CREATE POLICY "stories_update" ON stories FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "stories_delete" ON stories FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para subscriptions
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "subscriptions_delete" ON subscriptions FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Criar função para inserir perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para criar perfil de usuário
CREATE OR REPLACE FUNCTION create_user_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_role TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com as permissões do criador da função
AS $$
BEGIN
  -- Verifica se o usuário que está chamando é admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem criar usuários';
  END IF;

  -- Insere o perfil
  INSERT INTO profiles (id, user_id, full_name, email, role)
  VALUES (p_user_id, p_user_id, p_full_name, p_email, p_role);
END;
$$;
