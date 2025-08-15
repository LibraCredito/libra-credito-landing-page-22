import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import supabase, { type SimulacaoData } from '@/lib/supabase';
import { startAssistantSession } from '@/lib/elevenlabs';

const Assistente = () => {
  const [searchParams] = useSearchParams();
  const simId = searchParams.get('sim_id');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [conv, setConv] = useState<any>(null);

  useEffect(() => {
    if (import.meta.env.VITE_FEATURE_ASSISTANT !== 'true') {
      setError('Assistente desabilitado');
      return;
    }
    if (!simId) {
      setError('Simulação não encontrada');
      return;
    }
    let active = true;
    (async () => {
      try {
        const { data: sim, error: simError } = await supabase
          .from('simulacoes')
          .select('*')
          .eq('id', simId)
          .single<SimulacaoData>();
        if (simError || !sim) throw simError || new Error('Simulação não encontrada');

        const res = await fetch(`/api/elevenlabs/signed-url?agent_id=${import.meta.env.VITE_ELEVENLABS_AGENT_ID}`);
        if (!res.ok) throw new Error('Falha ao obter signed URL');
        const { signedUrl } = await res.json();

        const conversation = await startAssistantSession({
          sim,
          signedUrl,
          callbacks: {
            onStatusChange: setStatus,
            onMessage: (m) => console.log('msg', m),
            onError: (e) => console.error('ElevenLabs error', e)
          }
        });
        if (!active) return;
        setConv(conversation);
        const conversationId = conversation.getId();
        await fetch('/api/conversations/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversation_id: conversationId,
            agent_id: import.meta.env.VITE_ELEVENLABS_AGENT_ID,
            simulation_id: simId
          })
        });
      } catch (err) {
        console.error(err);
        if (active) setError('Erro ao iniciar assistente');
      }
    })();
    return () => {
      active = false;
      conv?.endSession?.();
    };
  }, [simId]);

  if (import.meta.env.VITE_FEATURE_ASSISTANT !== 'true') {
    return <div className="p-4 text-center">Assistente desabilitado</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assistente de Voz</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {status && <p className="mb-2">Status: {status}</p>}
      <p className="text-sm text-gray-600">Permita o uso do microfone para iniciar a conversa.</p>
    </div>
  );
};

export default Assistente;
