import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('@/services/localSimulationService', () => ({
  LocalSimulationService: {
    processContact: vi.fn().mockResolvedValue({ success: true, message: 'ok' })
  }
}));

const mockGetJourneyData = vi.fn();
vi.mock('@/hooks/useUserJourney', () => ({
  useUserJourney: () => ({
    sessionId: 'session123',
    getJourneyData: mockGetJourneyData
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => React.createElement('a', { href: to }, children)
  };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '../ContactForm';
import { LocalSimulationService } from '@/services/localSimulationService';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ContactForm', () => {
  const simulationResult = {
    id: 'sim1',
    valor: 1000,
    amortizacao: 'PRICE',
    parcelas: 12,
    valorEmprestimo: 50000,
    valorImovel: 100000
  } as any;

  it('forwards journey UTM params to LocalSimulationService.processContact', async () => {
    mockGetJourneyData.mockReturnValue({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'camp',
      utm_term: 'term',
      utm_content: 'content',
      landing_page: 'https://example.com'
    });

    render(<ContactForm simulationResult={simulationResult} />);

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.click(screen.getByLabelText(/Imóvel Próprio/i));
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /Solicitar análise agora/i }));

    await waitFor(() => {
      expect(LocalSimulationService.processContact).toHaveBeenCalledWith(
        expect.objectContaining({
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'camp',
          utm_term: 'term',
          utm_content: 'content',
          landing_page: 'https://example.com'
        })
      );
    });
  });

  it('handles missing journey data and submits with undefined UTM fields', async () => {
    mockGetJourneyData.mockReturnValue(undefined);

    render(<ContactForm simulationResult={simulationResult} />);

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11988888888' } });
    fireEvent.click(screen.getByLabelText(/Imóvel Próprio/i));
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /Solicitar análise agora/i }));

    await waitFor(() => {
      expect(LocalSimulationService.processContact).toHaveBeenCalledWith(
        expect.objectContaining({
          utm_source: undefined,
          utm_medium: undefined,
          utm_campaign: undefined,
          utm_term: undefined,
          utm_content: undefined,
          landing_page: undefined
        })
      );
    });
  });
});

