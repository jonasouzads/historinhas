-- Criar enum para status da assinatura
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired');

-- Criar enum para tipo de plano
CREATE TYPE subscription_plan AS ENUM ('magic', 'family');

-- Criar tabela de assinaturas
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kiwify_order_id VARCHAR(255) UNIQUE,
    kiwify_subscription_id VARCHAR(255) UNIQUE,
    plan_type subscription_plan NOT NULL,
    status subscription_status DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_kiwify_order_id ON subscriptions(kiwify_order_id);
CREATE INDEX idx_subscriptions_kiwify_subscription_id ON subscriptions(kiwify_subscription_id);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
