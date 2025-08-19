import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const { conversation_id, agent_id, simulation_id } = await req.json();
  const url = Deno.env.get('VITE_SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(url, serviceKey);
  await supabase.from('conversations').upsert({
    conversation_id,
    agent_id,
    simulation_id,
    started_at: new Date().toISOString()
  });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
});
