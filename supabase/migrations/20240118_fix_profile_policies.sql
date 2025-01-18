-- Remover política existente
DROP POLICY IF EXISTS "Política de acesso aos profiles" ON profiles;

-- Criar política separada para SELECT
CREATE POLICY "Política de visualização de profiles"
ON profiles
FOR SELECT
USING (
    auth.uid() = id OR  -- Usuário pode ver seu próprio perfil
    EXISTS (           -- Admin pode ver todos os perfis
        SELECT 1 
        FROM profiles p
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'::user_role
    )
);

-- Criar política separada para INSERT
CREATE POLICY "Política de inserção de profiles"
ON profiles
FOR INSERT
WITH CHECK (
    auth.uid() = id  -- Usuário só pode inserir seu próprio perfil
);

-- Criar política separada para UPDATE
CREATE POLICY "Política de atualização de profiles"
ON profiles
FOR UPDATE
USING (
    auth.uid() = id OR  -- Usuário pode atualizar seu próprio perfil
    EXISTS (           -- Admin pode atualizar todos os perfis
        SELECT 1 
        FROM profiles p
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'::user_role
    )
)
WITH CHECK (
    auth.uid() = id OR  -- Usuário pode atualizar seu próprio perfil
    EXISTS (           -- Admin pode atualizar todos os perfis
        SELECT 1 
        FROM profiles p
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'::user_role
    )
);

-- Criar política separada para DELETE
CREATE POLICY "Política de exclusão de profiles"
ON profiles
FOR DELETE
USING (
    EXISTS (  -- Apenas admin pode excluir perfis
        SELECT 1 
        FROM profiles p
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'::user_role
    )
);
