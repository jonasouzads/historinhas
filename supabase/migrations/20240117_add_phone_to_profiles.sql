-- Adiciona coluna de telefone na tabela profiles
ALTER TABLE profiles
ADD COLUMN phone TEXT;

-- Atualiza a função de trigger para incluir o telefone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
