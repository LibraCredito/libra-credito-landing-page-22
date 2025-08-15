import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const agentId = req.query.agent_id as string;
  if (!agentId) return res.status(400).json({ error: 'agent_id is required' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`, {
      headers: { 'xi-api-key': apiKey }
    });
    const data = await response.json();
    res.status(200).json({ signedUrl: data.signed_url ?? data });
  } catch {
    res.status(500).json({ error: 'failed to get signed url' });
  }
}
