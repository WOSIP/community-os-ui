-- Update application_status enum to include new statuses
DO $$ 
BEGIN 
    ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'rejected';
    ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'disabled';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add missing columns to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS candidate_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS business_status TEXT,
ADD COLUMN IF NOT EXISTS business_country TEXT,
ADD COLUMN IF NOT EXISTS business_year INTEGER,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS business_sector TEXT,
ADD COLUMN IF NOT EXISTS business_employees INTEGER,
ADD COLUMN IF NOT EXISTS business_ca TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS is_existing_franchisee BOOLEAN,
ADD COLUMN IF NOT EXISTS network_details TEXT,
ADD COLUMN IF NOT EXISTS motivation TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS payment_schedule TEXT,
ADD COLUMN IF NOT EXISTS deposit_amount TEXT,
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT FALSE;

-- Function to generate candidate_id
CREATE OR REPLACE FUNCTION generate_candidate_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.candidate_id IS NULL THEN
        NEW.candidate_id := 'CAND-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for candidate_id
DROP TRIGGER IF EXISTS tr_generate_candidate_id ON public.applications;
CREATE TRIGGER tr_generate_candidate_id
    BEFORE INSERT ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION generate_candidate_id();

-- Indexing for search performance
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_business_name ON applications(business_name);
CREATE INDEX IF NOT EXISTS idx_applications_full_name ON applications(first_name, last_name);