# Integração ElevenLabs ↔ Supabase

## Mapa do Projeto
- **Stack:** React + Vite + TypeScript
- **Roteamento:** React Router (`src/App.tsx`)
- **Persistência:** Supabase (`src/lib/supabase.ts`)
- **Página de Simulação:** `/simulacao` com `SimulationForm` → `SimulationResultDisplay`
- **Assistente:** nova rota [`/assistente`](../src/pages/Assistente.tsx)

## Mapeamento de Variáveis
| ElevenLabs | Campo do Projeto |
| --- | --- |
| `lead_name` | `simulacoes.nome_completo` |
| `secret__phone` | `simulacoes.telefone` |
| `secret__email` | `simulacoes.email` |
| `sim_property_value` | `simulacoes.valor_imovel` |
| `sim_requested_amount` | `simulacoes.valor_emprestimo` |
| `sim_installment_value` | `simulacoes.parcela_inicial` ou cálculo |
| `sim_min_income` | `simulacoes.renda_minima` ou cálculo |
| `sim_city` / `sim_state` | parse de `simulacoes.cidade` |

## Pontos de Integração
- **Front:** [`src/pages/Assistente.tsx`](../src/pages/Assistente.tsx) inicia `Conversation.startSession`
- **Signed URL:** [`api/elevenlabs/signed-url.ts`](../api/elevenlabs/signed-url.ts)
- **Link Conversa:** [`api/conversations/link.ts`](../api/conversations/link.ts)
- **Webhook:** [`api/elevenlabs/webhook.ts`](../api/elevenlabs/webhook.ts)
- **Edge Functions (alternativa):** `supabase/functions/*`

## Modelo de Dados
Script SQL: [`database/sql/20250815143023_elevenlabs-conversations.sql`](../database/sql/20250815143023_elevenlabs-conversations.sql)

## Variáveis de Ambiente
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_FEATURE_ASSISTANT`
- `VITE_ELEVENLABS_AGENT_ID`
- `ELEVENLABS_API_KEY`, `ELEVENLABS_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## Teste Local
```bash
npm run dev
# Após simulação: /assistente?sim_id=<id>

# Webhook de teste
curl -X POST http://localhost:3000/api/elevenlabs/webhook \
  -H "elevenlabs-signature: t=0,v0=assinatura" \
  -d '{"type":"post_call_transcription","data":{}}'
```

## Referências de Arquivos
- [`src/lib/elevenlabs.ts`](../src/lib/elevenlabs.ts)
- [`src/components/SimulationResultDisplay.tsx`](../src/components/SimulationResultDisplay.tsx)
- [`README.md`](../README.md)
