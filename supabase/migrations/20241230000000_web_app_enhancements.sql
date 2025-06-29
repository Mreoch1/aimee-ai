-- Add web app specific columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_code TEXT,
ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMP WITH TIME ZONE;

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    stripe_price_id TEXT,
    features JSONB,
    message_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (id, name, price_monthly, message_limit, features) VALUES
('free', 'Free', 0.00, 50, '["50 messages per month", "Basic personality responses", "Limited conversation memory", "Available 24/7", "Community support"]'),
('basic', 'Basic', 14.99, -1, '["Unlimited SMS conversations", "Personality that learns about you", "Memory of your conversations", "Available 24/7", "Emotional support & companionship"]'),
('premium', 'Premium', 24.99, -1, '["Everything in Basic", "Advanced personality traits", "Deeper conversation memory", "Relationship milestone tracking", "Priority response times", "Exclusive personality updates"]')
ON CONFLICT (id) DO NOTHING;

-- Create user_sessions table for web authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- Create usage_tracking table to track message usage for free tier
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: YYYY-MM
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- Add RLS policies for new tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans (read-only for all)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
    FOR SELECT USING (true);

-- Policies for user_sessions (users can only see their own sessions)
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for usage_tracking (users can only see their own usage)
CREATE POLICY "Users can view own usage" ON usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage" ON usage_tracking
    FOR ALL USING (true);

-- Function to increment message usage
CREATE OR REPLACE FUNCTION increment_message_usage(user_phone TEXT)
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    current_month TEXT;
BEGIN
    -- Get current month in YYYY-MM format
    current_month := to_char(NOW(), 'YYYY-MM');
    
    -- Get user by phone
    SELECT id, subscription_tier INTO user_record FROM users WHERE phone = user_phone;
    
    IF user_record.id IS NOT NULL THEN
        -- Only track usage for free tier users
        IF user_record.subscription_tier = 'free' THEN
            -- Insert or update usage tracking
            INSERT INTO usage_tracking (user_id, month_year, message_count)
            VALUES (user_record.id, current_month, 1)
            ON CONFLICT (user_id, month_year)
            DO UPDATE SET 
                message_count = usage_tracking.message_count + 1,
                updated_at = NOW();
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has exceeded message limit
CREATE OR REPLACE FUNCTION check_message_limit(user_phone TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
    current_month TEXT;
    usage_count INTEGER;
    plan_limit INTEGER;
BEGIN
    -- Get current month in YYYY-MM format
    current_month := to_char(NOW(), 'YYYY-MM');
    
    -- Get user and their plan
    SELECT u.id, u.subscription_tier, sp.message_limit 
    INTO user_record
    FROM users u
    LEFT JOIN subscription_plans sp ON u.subscription_tier = sp.id
    WHERE u.phone = user_phone;
    
    IF user_record.id IS NULL THEN
        RETURN false; -- User not found, allow message
    END IF;
    
    -- If unlimited messages (-1) or not free tier, allow
    IF user_record.message_limit = -1 OR user_record.subscription_tier != 'free' THEN
        RETURN true;
    END IF;
    
    -- Check current usage
    SELECT COALESCE(message_count, 0) INTO usage_count
    FROM usage_tracking
    WHERE user_id = user_record.id AND month_year = current_month;
    
    -- Return true if under limit
    RETURN usage_count < user_record.message_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 