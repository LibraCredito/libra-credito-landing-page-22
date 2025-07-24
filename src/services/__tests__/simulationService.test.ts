import { describe, it, expect, vi, beforeEach } from 'vitest';
import SimulationService, { SimulationInput, ContactFormInput } from '../simulationService';
import { supabaseApi, supabase, __fromMock as fromMock } from '@/lib/supabase';
import { simulateCredit } from '../simulationApi';
import { PloomesService } from '../ploomesService';
import { WebhookService } from '../webhookService';

vi.mock('@/lib/supabase', () => {
  const from = vi.fn();
  return {
    supabaseApi: {
      createSimulacao: vi.fn(),
    },
    supabase: { from },
    __fromMock: from,
  };
});

vi.mock('../simulationApi', () => ({
  simulateCredit: vi.fn(),
}));

vi.mock('../ploomesService', () => ({
  PloomesService: {
    cadastrarProposta: vi.fn(),
    isDuplicidadeError: vi.fn(() => false),
  },
}));

vi.mock('../webhookService', () => ({
  WebhookService: {
    sendSimulationData: vi.fn(),
  },
}));

const mockedSupabaseApi = supabaseApi as unknown as { createSimulacao: ReturnType<typeof vi.fn> };
const mockedSimulate = simulateCredit as unknown as ReturnType<typeof vi.fn>;
const mockedPloomes = PloomesService as unknown as { cadastrarProposta: ReturnType<typeof vi.fn>; isDuplicidadeError: ReturnType<typeof vi.fn> };
const mockedWebhook = WebhookService as unknown as { sendSimulationData: ReturnType<typeof vi.fn> };

const validInput: SimulationInput = {
  sessionId: 's1',
  nomeCompleto: 'John Doe',
  email: 'john@example.com',
  telefone: '11999999999',
  cidade: 'Sao Paulo',
  valorEmprestimo: 200000,
  valorImovel: 500000,
  parcelas: 120,
  tipoAmortizacao: 'PRICE',
};

function buildApiResult() {
  return {
    parcelas: [
      {},
      { parcela_final: [2000] },
      { parcela_final: [1800] },
    ],
  };
}

describe('SimulationService.performSimulation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls API and saves result on success', async () => {
    mockedSimulate.mockResolvedValueOnce(buildApiResult());
    mockedSupabaseApi.createSimulacao.mockResolvedValueOnce({ id: 'supabase-id' });

    const result = await SimulationService.performSimulation(validInput);

    expect(mockedSimulate).toHaveBeenCalledWith({
      valor_solicitado: validInput.valorEmprestimo,
      vlr_imovel: validInput.valorImovel,
      numero_parcelas: validInput.parcelas,
      amortizacao: validInput.tipoAmortizacao,
      juros: 1.09,
      carencia: 2,
      cidade: validInput.cidade,
    });
    expect(mockedSupabaseApi.createSimulacao).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'supabase-id',
      valor: 2000,
      amortizacao: 'PRICE',
      parcelas: 120,
      valorEmprestimo: 200000,
      valorImovel: 500000,
      cidade: 'Sao Paulo',
      sessionId: 's1',
      primeiraParcela: undefined,
      ultimaParcela: undefined,
    });
  });

  it('throws on validation failure', async () => {
    await expect(
      SimulationService.performSimulation({ ...validInput, email: 'bad-email' })
    ).rejects.toThrow('Email inválido');
  });

  it('throws when API returns invalid data', async () => {
    mockedSimulate.mockResolvedValueOnce({ foo: 'bar' });
    await expect(SimulationService.performSimulation(validInput)).rejects.toThrow(
      'API retornou estrutura de dados inválida'
    );
  });

  it('propagates errors from Supabase', async () => {
    mockedSimulate.mockResolvedValueOnce(buildApiResult());
    mockedSupabaseApi.createSimulacao.mockRejectedValueOnce(new Error('db fail'));
    await expect(SimulationService.performSimulation(validInput)).rejects.toThrow('db fail');
  });

  it('does not trigger CRM/webhook integrations', async () => {
    mockedSimulate.mockResolvedValueOnce(buildApiResult());
    mockedSupabaseApi.createSimulacao.mockResolvedValueOnce({ id: '1' });

    await SimulationService.performSimulation(validInput);

    expect(mockedPloomes.cadastrarProposta).not.toHaveBeenCalled();
    expect(mockedWebhook.sendSimulationData).not.toHaveBeenCalled();
  });
});
