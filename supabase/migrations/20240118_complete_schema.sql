-- Criar tipos personalizados
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE plan_type AS ENUM ('free', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- Criar tabela profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    phone TEXT,
    role user_role NOT NULL DEFAULT 'user'
);

-- Criar tabela children
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela stories
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    theme TEXT NOT NULL,
    mood TEXT,
    values TEXT[],
    additional_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    kiwify_order_id VARCHAR,
    kiwify_subscription_id VARCHAR,
    plan_type plan_type NOT NULL DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
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
WITH CHECK (auth.uid() = id);

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
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Políticas para children
CREATE POLICY "children_select_policy" ON children
FOR SELECT TO public
USING (
    CASE 
        WHEN auth.uid() = user_id THEN true  -- usuário vê seus próprios filhos
        WHEN auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') THEN true  -- admin vê todos
        ELSE false
    END
);

CREATE POLICY "children_insert_policy" ON children
FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "children_update_policy" ON children
FOR UPDATE TO public
USING (auth.uid() = user_id);

CREATE POLICY "children_delete_policy" ON children
FOR DELETE TO public
USING (auth.uid() = user_id);

-- Políticas para stories
CREATE POLICY "stories_select_policy" ON stories
FOR SELECT TO public
USING (
    CASE 
        WHEN auth.uid() = user_id THEN true  -- usuário vê suas próprias histórias
        WHEN auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') THEN true  -- admin vê todas
        ELSE false
    END
);

CREATE POLICY "stories_insert_policy" ON stories
FOR INSERT TO public
WITH CHECK (
    auth.uid() = user_id AND  -- usuário só pode criar histórias para si mesmo
    EXISTS (  -- verifica se o child_id pertence ao usuário
        SELECT 1 FROM children 
        WHERE id = stories.child_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "stories_update_policy" ON stories
FOR UPDATE TO public
USING (auth.uid() = user_id);

CREATE POLICY "stories_delete_policy" ON stories
FOR DELETE TO public
USING (auth.uid() = user_id);

-- Políticas para subscriptions
CREATE POLICY "subscriptions_select_policy" ON subscriptions
FOR SELECT TO public
USING (
    CASE 
        WHEN auth.uid() = user_id THEN true  -- usuário vê suas próprias assinaturas
        WHEN auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') THEN true  -- admin vê todas
        ELSE false
    END
);

CREATE POLICY "subscriptions_insert_policy" ON subscriptions
FOR INSERT TO public
WITH CHECK (
    auth.uid() = user_id OR  -- usuário pode criar sua própria assinatura
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')  -- admin pode criar para qualquer um
);

CREATE POLICY "subscriptions_update_policy" ON subscriptions
FOR UPDATE TO public
USING (
    auth.uid() = user_id OR  -- usuário pode atualizar sua própria assinatura
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')  -- admin pode atualizar qualquer uma
);

CREATE POLICY "subscriptions_delete_policy" ON subscriptions
FOR DELETE TO public
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));  -- apenas admin pode deletar

-- Criar índices para melhor performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_children_user_id ON children(user_id);
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_child_id ON stories(child_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Criar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
