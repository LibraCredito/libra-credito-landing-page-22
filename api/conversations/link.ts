import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { conversation_id, agent_id, simulation_id } = req.body ?? {};
  if (!conversation_id || !simulation_id) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return res.status(500).json({ error: 'supabase not configured' });
  }

  const supabase = createClient(url, serviceKey);

  await supabase.from('conversations').upsert({
    conversation_id,
    agent_id,
    simulation_id,
    started_at: new Date().toISOString()
  });

  res.status(200).json({ ok: true });
}
