-- Create tables for SeenByAI MVP

-- Organizations (Multi-tenant isolation)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Extended profiles if necessary, assuming Auth is handled by Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization Members
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Sites
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    city TEXT NOT NULL,
    industry TEXT NOT NULL,
    main_services TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitors
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queries
CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    intent_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engines
CREATE TABLE engines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider_type TEXT NOT NULL, -- e.g., 'openai', 'perplexity', 'mock'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Engines
INSERT INTO engines (name, provider_type) VALUES 
('ChatGPT (Mock)', 'mock'),
('Perplexity (Mock)', 'mock'),
('Claude (Mock)', 'mock');

-- Runs
CREATE TABLE runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    query_id UUID NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
    engine_id UUID NOT NULL REFERENCES engines(id) ON DELETE CASCADE,
    raw_result TEXT,
    normalized_result TEXT,
    brand_mentioned BOOLEAN DEFAULT FALSE,
    competitors_detected JSONB DEFAULT '[]',
    citations JSONB DEFAULT '[]',
    source_urls JSONB DEFAULT '[]',
    confidence FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visibility Scores
CREATE TABLE visibility_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- 0 to 100
    metrics JSONB NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    run_id UUID REFERENCES runs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL, -- high, medium, low
    estimated_impact TEXT,
    effort TEXT,
    reason TEXT,
    evidence TEXT,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, ignored
    autofix_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_name TEXT NOT NULL DEFAULT 'Free',
    status TEXT NOT NULL DEFAULT 'active',
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Events
CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'query_generated', 'scan_run', etc.
    amount INTEGER NOT NULL DEFAULT 1,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Configuration

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(user_id UUID)
RETURNS TABLE (organization_id UUID) AS $$
BEGIN
    RETURN QUERY SELECT om.organization_id FROM organization_members om WHERE om.user_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple Policies (Example for MVP)
CREATE POLICY "Users can view their own organizations" ON organizations
    FOR SELECT USING (id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can view members of their organizations" ON organization_members
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can view sites in their organizations" ON sites
    FOR ALL USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can view competitors of their sites" ON competitors
    FOR ALL USING (site_id IN (SELECT id FROM sites WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))));

CREATE POLICY "Users can view queries of their sites" ON queries
    FOR ALL USING (site_id IN (SELECT id FROM sites WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))));

CREATE POLICY "Users can view runs of their sites" ON runs
    FOR ALL USING (site_id IN (SELECT id FROM sites WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))));

CREATE POLICY "Users can view answers of their runs" ON answers
    FOR ALL USING (run_id IN (SELECT id FROM runs WHERE site_id IN (SELECT id FROM sites WHERE organization_id IN (SELECT get_user_organizations(auth.uid())))));

CREATE POLICY "Users can view visibility_scores of their sites" ON visibility_scores
    FOR ALL USING (site_id IN (SELECT id FROM sites WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))));

CREATE POLICY "Users can view recommendations of their sites" ON recommendations
    FOR ALL USING (site_id IN (SELECT id FROM sites WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))));

CREATE POLICY "Users can view subscriptions of their organizations" ON subscriptions
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can view usage_events of their organizations" ON usage_events
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));
