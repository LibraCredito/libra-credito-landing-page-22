import { Conversation } from '@elevenlabs/client';
import type { SimulacaoData } from './supabase';

export function mapCityUf(cidade: string | null | undefined): { city?: string; state?: string } {
  if (!cidade) return {};
  const [city, state] = cidade.split('-').map((s) => s.trim());
  return { city, state };
}

interface StartAssistantOptions {
  sim: SimulacaoData;
  signedUrl: string;
  callbacks?: {
    onStatusChange?: (status: string) => void;
    onMessage?: (msg: unknown) => void;
    onError?: (err: unknown) => void;
  };
}

export async function startAssistantSession({ sim, signedUrl, callbacks }: StartAssistantOptions) {
  const { city, state } = mapCityUf(sim.cidade);
  const installment = (sim as any).valor_parcela ?? sim.parcela_inicial ?? null;
  const minIncome = (sim as any).renda_minima ?? (installment ? Math.round(installment / 0.3) : null);

  const dynamicVariables: Record<string, unknown> = {
    lead_name: sim.nome_completo,
    secret__phone: sim.telefone,
    secret__email: sim.email,
    sim_property_value: sim.valor_imovel,
    sim_requested_amount: sim.valor_emprestimo,
    sim_installment_value: installment,
    sim_min_income: minIncome,
    sim_city: city,
    sim_state: state,
  };

  const conversation = await Conversation.startSession({
    signedUrl,
    dynamicVariables,
    onStatusChange: callbacks?.onStatusChange,
    onMessage: callbacks?.onMessage,
    onError: callbacks?.onError,
  });

  return conversation;
}
