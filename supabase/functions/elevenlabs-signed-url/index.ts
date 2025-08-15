import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const agentId = url.searchParams.get('agent_id');
  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!agentId || !apiKey) {
    return new Response(JSON.stringify({ error: 'missing params' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const resp = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`, {
    headers: { 'xi-api-key': apiKey }
  });
  const text = await resp.text();
  return new Response(text, { headers: { 'content-type': 'application/json' } });
});
