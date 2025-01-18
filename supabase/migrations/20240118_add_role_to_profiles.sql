-- Criar tipo enum para os roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Adicionar coluna role na tabela profiles com valor padrão 'user'
ALTER TABLE profiles 
ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Criar índice para melhorar performance de queries que filtram por role
CREATE INDEX idx_profiles_role ON profiles(role);

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Usuários podem ver seus próprios roles" ON profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os roles" ON profiles;
DROP POLICY IF EXISTS "Apenas admins podem alterar roles" ON profiles;

-- Criar política mais simples que permite usuários verem seus próprios dados
-- e admins verem todos os dados
CREATE POLICY "Política de acesso aos profiles"
ON profiles
FOR ALL
USING (
    (auth.uid() = id) OR  -- Usuário pode ver/editar seu próprio perfil
    (role = 'admin')      -- Admin pode ver/editar todos os perfis
);

-- Função para promover um usuário a admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    caller_role user_role;
BEGIN
    -- Busca o role do usuário que está chamando a função
    SELECT role INTO caller_role
    FROM profiles
    WHERE id = auth.uid();

    -- Verifica se o usuário é admin
    IF caller_role != 'admin' THEN
        RAISE EXCEPTION 'Apenas administradores podem promover outros usuários';
    END IF;

    -- Atualiza o role do usuário para admin
    UPDATE profiles
    SET role = 'admin'::user_role
    WHERE id = user_id;
END;
$$;
