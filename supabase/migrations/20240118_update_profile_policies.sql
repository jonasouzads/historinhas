-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios roles" ON profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os roles" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem alterar roles" ON profiles;

-- Criar política mais simples e direta
CREATE POLICY "Política de acesso aos profiles"
ON profiles
FOR ALL
USING (
    auth.uid() = id OR  -- Usuário pode ver/editar seu próprio perfil
    EXISTS (           -- Admin pode ver/editar todos os perfis
        SELECT 1 
        FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);
