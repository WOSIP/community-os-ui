-- Add registrant_id to applications to track who created the file
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS registrant_id UUID REFERENCES public.profiles(id);

-- Add index for registrant_id
CREATE INDEX IF NOT EXISTS idx_applications_registrant_id ON applications(registrant_id);

-- Ensure all required statuses are in the enum
DO $$ 
BEGIN 
    ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'rejected';
    ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'disabled';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;