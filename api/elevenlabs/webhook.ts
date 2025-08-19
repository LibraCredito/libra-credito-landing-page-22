import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');

  const signature = req.headers['elevenlabs-signature'] as string;
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET || '';
  if (!signature || !secret) {
    return res.status(400).json({ error: 'missing signature' });
  }
  const [tPart, v0Part] = signature.split(',');
  const timestamp = tPart?.split('=')[1] || '';
  const v0 = v0Part?.split('=')[1] || '';
  const hmac = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  if (hmac !== v0) {
    return res.status(401).json({ error: 'invalid signature' });
  }

  const payload = JSON.parse(rawBody);
  if (payload.type !== 'post_call_transcription') {
    return res.status(200).json({ ok: true });
  }

  const url = process.env.VITE_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const supabase = createClient(url, serviceKey);

  const data = payload.data;
  const convId = data?.conversation_id;
  const agentId = data?.agent_id;
  const transcript = data?.transcript || [];
  const analysis = data?.analysis;
  const metadata = { ...(data?.metadata || {}), has_audio: data?.has_audio, has_user_audio: data?.has_user_audio, has_response_audio: data?.has_response_audio };

  await supabase.from('conversations').upsert({
    conversation_id: convId,
    agent_id: agentId,
    ended_at: new Date().toISOString(),
    duration_secs: metadata.call_duration_secs,
    call_successful: analysis?.call_successful,
    transcript_summary: analysis?.transcript_summary,
    analysis,
    metadata,
  });

  if (Array.isArray(transcript) && transcript.length > 0) {
    const messages = transcript.map((m: any) => ({
      conversation_id: convId,
      role: m.role,
      message: m.message,
      time_in_call_secs: m.time_in_call_secs,
    }));
    await supabase.from('conversation_messages').insert(messages);
  }

  res.status(200).json({ ok: true });
}
