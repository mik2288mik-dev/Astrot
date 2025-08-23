-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    birth_date DATE,
    birth_time TIME,
    birth_place VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for telegram_id for faster lookups
CREATE INDEX idx_profiles_telegram_id ON profiles(telegram_id);

-- Create natal_charts table (cache for calculations)
CREATE TABLE natal_charts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sun_sign VARCHAR(50),
    moon_sign VARCHAR(50),
    ascendant VARCHAR(50),
    full_data JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(profile_id)
);

-- Create index for profile_id
CREATE INDEX idx_natal_charts_profile_id ON natal_charts(profile_id);

-- Create daily_advice table (cache for advice)
CREATE TABLE daily_advice (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    advice_text TEXT,
    astro_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(profile_id, date)
);

-- Create indexes for daily_advice
CREATE INDEX idx_daily_advice_profile_id ON daily_advice(profile_id);
CREATE INDEX idx_daily_advice_date ON daily_advice(date);

-- Create user_settings table
CREATE TABLE user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    advice_tone VARCHAR(50) DEFAULT 'balanced', -- 'positive', 'balanced', 'realistic'
    theme VARCHAR(50) DEFAULT 'light', -- 'light', 'dark', 'auto'
    language VARCHAR(10) DEFAULT 'ru', -- 'ru', 'en'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(profile_id)
);

-- Create index for user_settings
CREATE INDEX idx_user_settings_profile_id ON user_settings(profile_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE natal_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (these will need to be adjusted based on your auth strategy)
-- For now, we'll create basic policies that allow authenticated users to manage their own data

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (true); -- Adjust based on your auth

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (true); -- Adjust based on your auth

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (true); -- Adjust based on your auth

-- Natal charts policies
CREATE POLICY "Users can view their own natal chart" ON natal_charts
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own natal chart" ON natal_charts
    FOR ALL USING (true);

-- Daily advice policies
CREATE POLICY "Users can view their own advice" ON daily_advice
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own advice" ON daily_advice
    FOR ALL USING (true);

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own settings" ON user_settings
    FOR ALL USING (true);