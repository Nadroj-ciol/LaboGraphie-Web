-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create service_pricing table
CREATE TABLE IF NOT EXISTS public.service_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    local_tjm INTEGER NOT NULL,
    intl_tjm INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

-- Policies for system_settings (read for all, write for authenticated/admins)
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.system_settings FOR SELECT
    USING ( true );

CREATE POLICY "Users can update system settings."
    ON public.system_settings FOR ALL
    USING ( auth.role() = 'authenticated' );

-- Policies for service_pricing (read for all, write for authenticated/admins)
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.service_pricing FOR SELECT
    USING ( true );

CREATE POLICY "Users can update service pricing."
    ON public.service_pricing FOR ALL
    USING ( auth.role() = 'authenticated' );

-- Insert default exchange rates
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('exchange_rates', '{"EUR": 655.957, "USD": 600}'::jsonb, 'Current exchange rates relative to FCFA')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

-- Insert default service pricing based on src/data/services.ts
INSERT INTO public.service_pricing (slug, title, local_tjm, intl_tjm)
VALUES 
    ('design-branding', 'Design & Branding', 50000, 150000),
    ('developpement-web', 'Développement Web & Mobile', 75000, 250000),
    ('marketing-digital', 'Marketing Digital', 40000, 120000),
    ('cybersecurite', 'Cybersécurité', 100000, 300000),
    ('formations-pro', 'Formations Pro', 50000, 150000),
    ('maintenance-it', 'Maintenance IT & Réseau', 50000, 150000)
ON CONFLICT (slug) DO UPDATE 
SET local_tjm = EXCLUDED.local_tjm, intl_tjm = EXCLUDED.intl_tjm;
