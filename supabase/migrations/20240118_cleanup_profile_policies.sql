-- Primeiro, remover TODAS as políticas existentes da tabela profiles
DROP POLICY IF EXISTS "Atualização de perfis" ON profiles;
DROP POLICY IF EXISTS "enable_delete_for_admins" ON profiles;
DROP POLICY IF EXISTS "enable_insert_for_users" ON profiles;
DROP POLICY IF EXISTS "enable_select_for_users" ON profiles;
DROP POLICY IF EXISTS "enable_update_for_users" ON profiles;
DROP POLICY IF EXISTS "Exclusão de perfis" ON profiles;
DROP POLICY IF EXISTS "Inserção de perfis" ON profiles;
DROP POLICY IF EXISTS "Visualização de perfis" ON profiles;

-- Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar novas políticas simplificadas
CREATE POLICY "profiles_select_policy" ON profiles
FOR SELECT TO public
USING (
    CASE 
        WHEN auth.uid() = id THEN true  -- usuário vê seu próprio perfil
        WHEN auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') THEN true  -- admin vê todos
        ELSE false
    END
);

CREATE POLICY "profiles_insert_policy" ON profiles
FOR INSERT TO public
WITH CHECK (auth.uid() = id);  -- usuário só pode inserir seu próprio perfil

CREATE POLICY "profiles_update_policy" ON profiles
FOR UPDATE TO public
USING (
    CASE 
        WHEN auth.uid() = id THEN true  -- usuário atualiza seu próprio perfil
        WHEN auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') THEN true  -- admin atualiza todos
        ELSE false
    END
);

CREATE POLICY "profiles_delete_policy" ON profiles
FOR DELETE TO public
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));  -- apenas admin pode deletar
