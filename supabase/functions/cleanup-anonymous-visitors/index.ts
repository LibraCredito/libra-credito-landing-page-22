import { createClient } from '@supabase/supabase-js'

// Edge function that removes visitor records without contact info after N days
Deno.serve(async () => {
  const days = Number(Deno.env.get('ANON_VISITOR_RETENTION_DAYS') ?? '30')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  })

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const { error, count } = await client
    .from('leads')
    .delete({ count: 'exact' })
    .not('visitor_id', 'is', null)
    .is('email', null)
    .is('phone', null)
    .lt('created_at', cutoff.toISOString())

  if (error) {
    console.error('cleanup failed', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ deleted: count }), { status: 200 })
})
