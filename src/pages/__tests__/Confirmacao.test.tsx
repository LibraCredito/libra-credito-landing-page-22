/* @vitest-environment jsdom */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Confirmacao from '../Confirmacao';

vi.mock('@/components/MobileLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/WaveSeparator', () => ({
  default: () => <div />,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

describe('Confirmacao page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Mock scrollTo to avoid jsdom not implemented error
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.scrollTo = vi.fn();
  });

  it('renders without preloaded data', () => {
    render(
      <MemoryRouter>
        <Confirmacao />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Simulação enviada com sucesso/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Conheça a Libra/i })
    ).toBeInTheDocument();
    const atendenteLink = screen.getByRole('link', {
      name: /Falar com a Atendente/i,
    });
    expect(atendenteLink).toHaveAttribute(
      'href',
      'https://wa.me/551636007956'
    );
  });
});

