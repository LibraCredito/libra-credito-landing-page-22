import { describe, it, expect, vi, afterEach } from 'vitest';
import PloomesService from '../ploomesService';

afterEach(() => {
  vi.restoreAllMocks();
  // @ts-ignore
  delete global.fetch;
});

describe('PloomesService', () => {
  it('sends UTM params in payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: true, msg: '', retorno: { nomeCompleto: '', email: '' } })
    });
    // @ts-ignore
    global.fetch = fetchMock;

    await PloomesService.cadastrarProposta({
      cidade: 'São Paulo',
      valorEmprestimo: 10000,
      valorImovel: 20000,
      parcelas: 36,
      tipoAmortizacao: 'PRICE',
      valorParcela: 500,
      nomeCompleto: 'John Doe',
      email: 'john@example.com',
      telefone: '11999999999',
      imovelProprio: 'proprio',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'camp',
      utm_term: 'term',
      utm_content: 'content',
      landing_page: 'https://example.com'
    });

    expect(fetchMock).toHaveBeenCalled();
    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse((options as any).body);
    expect(body).toMatchObject({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'camp',
      utm_term: 'term',
      utm_content: 'content',
      landing_page: 'https://example.com'
    });
  });
});

