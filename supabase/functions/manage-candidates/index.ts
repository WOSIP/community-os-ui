import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    })

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if the requester is at least an Admin
    const { data: { user: requester }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !requester) throw new Error('Unauthorized')

    const { data: profile, error: profileFetchError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requester.id)
      .single()

    if (profileFetchError) throw new Error('Forbidden: User profile not found')

    const body = await req.json()
    const { action, id, query, searchType, status, data } = body

    // RBAC: read_only can only search
    if (profile.role === 'read_only' && action !== 'search') {
      throw new Error('Forbidden: Only Admins can update candidates')
    }

    if (action === 'search') {
      // We want to join with profiles to get registrant email if possible
      let dbQuery = supabaseAdmin
        .from('applications')
        .select(`
          *,
          registrant:profiles!registrant_id(email)
        `)
      
      if (query) {
        const cleanQuery = query.trim()
        if (searchType === 'id') {
          dbQuery = dbQuery.ilike('candidate_id', `%${cleanQuery}%`)
        } else if (searchType === 'email') {
          // Search both the candidate email and the registrant email
          // We use or with ilike for candidate email and registrant email
          dbQuery = dbQuery.or(`email.ilike.%${cleanQuery}%,profiles!registrant_id.email.ilike.%${cleanQuery}%`)
        } else if (searchType === 'businessName') {
          dbQuery = dbQuery.ilike('business_name', `%${cleanQuery}%`)
        } else if (searchType === 'name') {
          dbQuery = dbQuery.or(`first_name.ilike.%${cleanQuery}%,last_name.ilike.%${cleanQuery}%`)
        } else {
          // General search across all relevant fields
          dbQuery = dbQuery.or(`candidate_id.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%,business_name.ilike.%${cleanQuery}%,first_name.ilike.%${cleanQuery}%,last_name.ilike.%${cleanQuery}%`)
        }
      }

      const { data: candidates, error: searchError } = await dbQuery.order('created_at', { ascending: false })
      if (searchError) throw searchError

      return new Response(JSON.stringify({ success: true, candidates }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else if (action === 'update_status') {
      if (!id || !status) throw new Error('ID and status are required')
      
      // Map user-friendly labels if they come from frontend
      let dbStatus = status
      if (status === 'attributed exclusive') dbStatus = 'exclusive'
      if (status === 'attributed non exclusive') dbStatus = 'non_exclusive'
      if (status === 'disable') dbStatus = 'disabled'

      const { data: updated, error: updateError } = await supabaseAdmin
        .from('applications')
        .update({ status: dbStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true, data: updated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else if (action === 'update_info') {
      if (!id || !data) throw new Error('ID and data are required')
      
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('applications')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true, data: updated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else {
      throw new Error('Invalid action')
    }

  } catch (error: any) {
    console.error('Error in manage-candidates:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes('Forbidden') || error.message.includes('Unauthorized') ? 403 : 400,
    })
  }
})