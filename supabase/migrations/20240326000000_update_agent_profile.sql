-- Add columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS id_picture_url TEXT,
ADD COLUMN IF NOT EXISTS id_type TEXT;

-- Storage setup (if not already done via UI)
-- Note: These might fail if executed without enough permissions, 
-- but are here for reference and backend consistency.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-assets', 'agent-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for the bucket
DO $$ 
BEGIN
    -- Allow public read access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Agent Assets'
    ) THEN
        CREATE POLICY "Public Access for Agent Assets" ON storage.objects 
        FOR SELECT USING (bucket_id = 'agent-assets');
    END IF;

    -- Allow authenticated uploads (or admin via service role)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Uploads'
    ) THEN
        CREATE POLICY "Authenticated Uploads" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'agent-assets');
    END IF;
END $$;