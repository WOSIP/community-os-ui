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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if the requester is a Super Admin
    const { data: { user: requester }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !requester) throw new Error('Unauthorized')

    const { data: profile, error: profileFetchError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requester.id)
      .single()

    if (profileFetchError || profile?.role !== 'super_admin') {
      throw new Error('Forbidden: Only Super Admins can manage users')
    }

    const body = await req.json()
    const { 
      action, 
      id, 
      email, 
      password, 
      role, 
      is_active,
      first_name,
      last_name,
      phone,
      gender,
      age,
      profile_picture_url,
      id_picture_url,
      id_type,
      passport_id,
      national_id
    } = body

    if (action === 'create') {
      if (!email || !password) throw new Error('Email and password are required for creation')
      
      // Create user in Auth
      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) throw createError

      // Update profile with all details
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: authData.user.id, 
          email: email,
          role: role || 'read_only',
          is_active: is_active ?? true,
          first_name,
          last_name,
          phone,
          gender,
          age,
          profile_picture_url,
          id_picture_url,
          id_type,
          passport_id,
          national_id,
          updated_at: new Date().toISOString()
        })

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true, user: authData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      })

    } else if (action === 'update') {
      if (!id) throw new Error('User ID is required for update')
      
      const updateData: any = {}
      if (role) updateData.role = role
      if (is_active !== undefined) updateData.is_active = is_active
      if (first_name !== undefined) updateData.first_name = first_name
      if (last_name !== undefined) updateData.last_name = last_name
      if (phone !== undefined) updateData.phone = phone
      if (gender !== undefined) updateData.gender = gender
      if (age !== undefined) updateData.age = age
      if (profile_picture_url !== undefined) updateData.profile_picture_url = profile_picture_url
      if (id_picture_url !== undefined) updateData.id_picture_url = id_picture_url
      if (id_type !== undefined) updateData.id_type = id_type
      if (passport_id !== undefined) updateData.passport_id = passport_id
      if (national_id !== undefined) updateData.national_id = national_id
      
      updateData.updated_at = new Date().toISOString()

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', id)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else if (action === 'toggle_status') {
      if (!id) throw new Error('User ID is required')
      
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else {
      throw new Error('Invalid action')
    }

  } catch (error: any) {
    console.error('Error in manage-admins:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes('Forbidden') || error.message.includes('Unauthorized') ? 403 : 400,
    })
  }
})