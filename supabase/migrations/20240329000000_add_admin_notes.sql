-- Add admin_notes column to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;