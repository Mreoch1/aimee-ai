-- Best Friend AI SMS System Database Schema
-- Initial migration for Aimee project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Messages table - stores all SMS conversations
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_messages_user_phone ON messages(user_phone);
CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX idx_messages_user_timestamp ON messages(user_phone, timestamp DESC);

-- Memories table - stores extracted information about users
CREATE TABLE memories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_phone VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('personal', 'preference', 'date', 'current_topic', 'emotion', 'goal')),
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for memories
CREATE INDEX idx_memories_user_phone ON memories(user_phone);
CREATE INDEX idx_memories_category ON memories(category);
CREATE INDEX idx_memories_importance ON memories(importance DESC);
CREATE INDEX idx_memories_user_category ON memories(user_phone, category);

-- Special dates table - for birthdays and important dates
CREATE TABLE special_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_phone VARCHAR(20) NOT NULL,
    date_type VARCHAR(50) NOT NULL, -- 'birthday', 'anniversary', 'event', etc.
    date_value DATE NOT NULL,
    description TEXT,
    recurring BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for special dates
CREATE INDEX idx_special_dates_user_phone ON special_dates(user_phone);
CREATE INDEX idx_special_dates_date_value ON special_dates(date_value);

-- Reminders table - for storing pending reminders
CREATE TABLE reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_phone VARCHAR(20) NOT NULL,
    reminder_text TEXT NOT NULL,
    reminder_date TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for reminders
CREATE INDEX idx_reminders_user_phone ON reminders(user_phone);
CREATE INDEX idx_reminders_date ON reminders(reminder_date);
CREATE INDEX idx_reminders_pending ON reminders(user_phone, completed, reminder_date);

-- User preferences table - for storing user-specific settings
CREATE TABLE user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_phone VARCHAR(20) UNIQUE NOT NULL,
    preferred_name VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    morning_messages BOOLEAN DEFAULT TRUE,
    evening_messages BOOLEAN DEFAULT TRUE,
    birthday_reminders BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user preferences
CREATE INDEX idx_user_preferences_phone ON user_preferences(user_phone);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
-- These policies allow full access with the service role key
CREATE POLICY "Service role can manage messages" ON messages
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage memories" ON memories
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage special_dates" ON special_dates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage reminders" ON reminders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage user_preferences" ON user_preferences
    FOR ALL USING (auth.role() = 'service_role'); 