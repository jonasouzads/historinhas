-- Remover políticas existentes
DROP POLICY IF EXISTS "Política de visualização de profiles" ON profiles;
DROP POLICY IF EXISTS "Política de inserção de profiles" ON profiles;
DROP POLICY IF EXISTS "Política de atualização de profiles" ON profiles;
DROP POLICY IF EXISTS "Política de exclusão de profiles" ON profiles;

-- Criar política para SELECT
CREATE POLICY "enable_select_for_users"
ON profiles
FOR SELECT
USING (
    auth.uid() = id OR  -- Usuário pode ver seu próprio perfil
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' -- Admin pode ver todos
);

-- Criar política para INSERT
CREATE POLICY "enable_insert_for_users"
ON profiles
FOR INSERT
WITH CHECK (
    auth.uid() = id  -- Usuário só pode inserir seu próprio perfil
);

-- Criar política para UPDATE
CREATE POLICY "enable_update_for_users"
ON profiles
FOR UPDATE
USING (
    auth.uid() = id OR  -- Usuário pode atualizar seu próprio perfil
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' -- Admin pode atualizar todos
)
WITH CHECK (
    auth.uid() = id OR  -- Usuário pode atualizar seu próprio perfil
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' -- Admin pode atualizar todos
);

-- Criar política para DELETE
CREATE POLICY "enable_delete_for_admins"
ON profiles
FOR DELETE
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' -- Apenas admin pode excluir
);
