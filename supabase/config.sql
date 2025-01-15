-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Habilitar RLS para perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Criar tabela de crianças
CREATE TABLE IF NOT EXISTS public.children (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('menino', 'menina')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS para crianças
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Criar política para crianças
CREATE POLICY "Usuários podem ver suas próprias crianças"
    ON public.children
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar crianças"
    ON public.children
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias crianças"
    ON public.children
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias crianças"
    ON public.children
    FOR DELETE
    USING (auth.uid() = user_id);

-- Criar tabela de histórias
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    theme TEXT NOT NULL,
    mood TEXT,
    values TEXT[],
    additional_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS para histórias
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança para histórias
CREATE POLICY "Usuários podem ver suas próprias histórias"
    ON public.stories
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar histórias"
    ON public.stories
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias histórias"
    ON public.stories
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias histórias"
    ON public.stories
    FOR DELETE
    USING (auth.uid() = user_id);

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (new.id);
    RETURN new;
END;
$$;

-- Trigger para criar perfil após signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
