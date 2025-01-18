-- Remove todas as políticas existentes da tabela profiles
DROP POLICY IF EXISTS "Política de atualização de profiles" ON profiles;
DROP POLICY IF EXISTS "Política de exclusão de profiles" ON profiles;
DROP POLICY IF EXISTS "Política de inserção de profiles" ON profiles;
DROP POLICY IF EXISTS "Política de visualização de profiles" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;

-- Habilita RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política de SELECT para profiles
CREATE POLICY "Visualização de perfis"
ON profiles
FOR SELECT
TO public
USING (
    id = auth.uid() OR  -- Usuário vê seu próprio perfil
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'  -- Admin vê todos
);

-- Política de INSERT para profiles
CREATE POLICY "Inserção de perfis"
ON profiles
FOR INSERT
TO public
WITH CHECK (
    id = auth.uid()  -- Usuário só insere seu próprio perfil
);

-- Política de UPDATE para profiles
CREATE POLICY "Atualização de perfis"
ON profiles
FOR UPDATE
TO public
USING (
    id = auth.uid() OR  -- Usuário atualiza seu próprio perfil
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'  -- Admin atualiza todos
);

-- Política de DELETE para profiles
CREATE POLICY "Exclusão de perfis"
ON profiles
FOR DELETE
TO public
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'  -- Apenas admin pode deletar
);

-- Função para verificar se um usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;
