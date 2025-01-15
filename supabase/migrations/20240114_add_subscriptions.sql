-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'basic', 'premium')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_features table
CREATE TABLE subscription_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_type TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    feature_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription features
INSERT INTO subscription_features (plan_type, feature_name, feature_value) VALUES
    ('free', 'stories_per_month', '3'),
    ('free', 'ai_models', 'basic'),
    ('free', 'download_stories', 'false'),
    ('basic', 'stories_per_month', '10'),
    ('basic', 'ai_models', 'standard'),
    ('basic', 'download_stories', 'true'),
    ('premium', 'stories_per_month', 'unlimited'),
    ('premium', 'ai_models', 'advanced'),
    ('premium', 'download_stories', 'true');

-- Create RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
    ON subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policies for subscription_features
CREATE POLICY "Anyone can view subscription features"
    ON subscription_features FOR SELECT
    TO authenticated
    USING (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
