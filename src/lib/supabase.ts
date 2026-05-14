import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhcwliyrlpdrksrzwcbw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoY3dsaXlybHBkcmtzcnp3Y2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjk2MDEsImV4cCI6MjA5MDY0NTYwMX0._Vjy1IZNXVGjpJYoXcZTSwTwJGJUVgCqU_NBtX8GPEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Search for candidate applications based on multiple criteria
 * @param query The search term (ID, Email, Business Name, or Name)
 */
export const searchApplications = async (query: string) => {
  if (!query) return { data: [], error: null };

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .or(`candidate_id.eq.${query},email.ilike.%${query}%,business_name.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Update candidate application status or information
 * @param id The application UUID
 * @param updates The object containing fields to update
 */
export const updateApplication = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('applications')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

/**
 * Submit a new candidate application
 */
export const submitApplication = async (formData: any) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([formData])
    .select()
    .single();

  return { data, error };
};