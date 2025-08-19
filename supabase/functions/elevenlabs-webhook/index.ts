import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function verifySignature(signature: string | null, body: string): Promise<boolean> {
  const secret = Deno.env.get('ELEVENLABS_WEBHOOK_SECRET') || '';
  if (!signature || !secret) return false;
  const [tPart, v0Part] = signature.split(',');
  const timestamp = tPart?.split('=')[1] || '';
  const v0 = v0Part?.split('=')[1] || '';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${body}`));
  const hmac = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hmac === v0;
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const body = await req.text();
  const signature = req.headers.get('elevenlabs-signature');
  const valid = await verifySignature(signature, body);
  if (!valid) return new Response(JSON.stringify({ error: 'invalid signature' }), { status: 401, headers: { 'content-type': 'application/json' } });

  const payload = JSON.parse(body);
  if (payload.type !== 'post_call_transcription') {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
  }

  const url = Deno.env.get('VITE_SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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
    metadata
  });

  if (Array.isArray(transcript) && transcript.length > 0) {
    const messages = transcript.map((m: any) => ({
      conversation_id: convId,
      role: m.role,
      message: m.message,
      time_in_call_secs: m.time_in_call_secs
    }));
    await supabase.from('conversation_messages').insert(messages);
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
});
