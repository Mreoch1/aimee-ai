-- Web Application Schema Extension
-- This extends the existing Aimee SMS system with web application user management

-- Create users table if it doesn't exist (from original schema)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'trial')),
    subscription_id TEXT,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table if it doesn't exist (from original schema)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_phone TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    body TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_sid TEXT
);

-- Create memories table if it doesn't exist (from original schema)
CREATE TABLE IF NOT EXISTS memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_phone TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('personal', 'preference', 'date', 'current_topic', 'emotion', 'goal')),
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 10),
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to users table for web app functionality
DO $$ 
BEGIN
    -- Add stripe_customer_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
    END IF;
    
    -- Add selected_plan column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'selected_plan') THEN
        ALTER TABLE users ADD COLUMN selected_plan TEXT DEFAULT 'basic';
    END IF;
    
    -- Add phone_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_verified') THEN
        ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Update trial_ends_at column to allow NULL if needed
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'trial_ends_at' AND is_nullable = 'YES') THEN
        ALTER TABLE users ALTER COLUMN trial_ends_at DROP NOT NULL;
    END IF;
END $$;

-- Create phone verifications table
CREATE TABLE IF NOT EXISTS phone_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_verified);
CREATE INDEX IF NOT EXISTS idx_messages_user_phone ON messages(user_phone);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_memories_user_phone ON memories(user_phone);
CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON phone_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_code ON phone_verifications(code);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires ON phone_verifications(expires_at);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
    -- Drop and recreate policies for users table
    DROP POLICY IF EXISTS "Users can view own data" ON users;
    DROP POLICY IF EXISTS "Users can update own data" ON users;
    
    CREATE POLICY "Users can view own data" ON users
        FOR SELECT USING (auth.uid()::text = id::text);
    
    CREATE POLICY "Users can update own data" ON users
        FOR UPDATE USING (auth.uid()::text = id::text);
    
    -- Drop and recreate policies for messages table
    DROP POLICY IF EXISTS "Users can view own messages" ON messages;
    DROP POLICY IF EXISTS "System can insert messages" ON messages;
    
    CREATE POLICY "Users can view own messages" ON messages
        FOR SELECT USING (user_phone IN (
            SELECT phone FROM users WHERE id = auth.uid()
        ));
    
    CREATE POLICY "System can insert messages" ON messages
        FOR INSERT WITH CHECK (true);
    
    -- Drop and recreate policies for memories table
    DROP POLICY IF EXISTS "Users can view own memories" ON memories;
    DROP POLICY IF EXISTS "System can manage memories" ON memories;
    
    CREATE POLICY "Users can view own memories" ON memories
        FOR SELECT USING (user_phone IN (
            SELECT phone FROM users WHERE id = auth.uid()
        ));
    
    CREATE POLICY "System can manage memories" ON memories
        FOR ALL WITH CHECK (true);
    
    -- Drop and recreate policies for phone verifications
    DROP POLICY IF EXISTS "Users can access own verifications" ON phone_verifications;
    
    CREATE POLICY "Users can access own verifications" ON phone_verifications
        FOR ALL USING (phone IN (
            SELECT phone FROM users WHERE id = auth.uid()
        ));
        
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors if policies don't exist
        NULL;
END $$;

-- Function to clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM phone_verifications 
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$;

-- Update existing users to have phone_verified = true if they have messages
-- (This is for existing users from the SMS system)
UPDATE users 
SET phone_verified = TRUE 
WHERE phone IN (
    SELECT DISTINCT user_phone FROM messages
) AND phone_verified = FALSE;

-- Create a view for user dashboard data
CREATE OR REPLACE VIEW user_dashboard_data AS
SELECT 
    u.id,
    u.email,
    u.phone,
    u.full_name,
    u.subscription_status,
    u.trial_ends_at,
    u.selected_plan,
    u.phone_verified,
    u.created_at,
    COUNT(DISTINCT m.id) as message_count,
    COUNT(DISTINCT mem.id) as memory_count,
    MAX(m.timestamp) as last_message_at
FROM users u
LEFT JOIN messages m ON u.phone = m.user_phone
LEFT JOIN memories mem ON u.phone = mem.user_phone
GROUP BY u.id, u.email, u.phone, u.full_name, u.subscription_status, 
         u.trial_ends_at, u.selected_plan, u.phone_verified, u.created_at;

-- Grant permissions
GRANT SELECT ON user_dashboard_data TO authenticated, anon;
GRANT ALL ON phone_verifications TO authenticated, anon;
GRANT SELECT ON users TO authenticated, anon;
GRANT SELECT ON messages TO authenticated, anon;
GRANT SELECT ON memories TO authenticated, anon;

-- Add helpful comments
COMMENT ON TABLE users IS 'User accounts and subscription information';
COMMENT ON TABLE messages IS 'SMS conversation history';
COMMENT ON TABLE memories IS 'AI extracted memories from conversations';
COMMENT ON TABLE phone_verifications IS 'Phone verification codes for user signup';
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN users.selected_plan IS 'Selected subscription plan (basic/premium)';
COMMENT ON COLUMN users.phone_verified IS 'Whether the phone number has been verified';
COMMENT ON COLUMN users.trial_ends_at IS 'When the free trial ends';
COMMENT ON VIEW user_dashboard_data IS 'Aggregated user data for dashboard display'; 