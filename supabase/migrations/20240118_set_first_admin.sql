-- Defina aqui o ID do usuário que será o primeiro admin
DO $$
DECLARE
    admin_email TEXT := 'seu_email@exemplo.com'; -- Substitua pelo email do admin
BEGIN
    -- Atualiza o primeiro usuário com o email especificado para ser admin
    UPDATE profiles
    SET role = 'admin'
    WHERE email = admin_email;

    -- Verifica se a atualização foi bem sucedida
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuário com email % não encontrado', admin_email;
    END IF;
END;
$$;
