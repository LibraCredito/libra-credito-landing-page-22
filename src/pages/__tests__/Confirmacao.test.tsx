/* @vitest-environment jsdom */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
  let mainScrollMock: ReturnType<typeof vi.fn>;
  let windowScrollMock: ReturnType<typeof vi.fn>;
  let metaSetAttributeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.localStorage.clear();
    mainScrollMock = vi.fn();
    windowScrollMock = vi.fn();
    metaSetAttributeMock = vi.fn();
    document.getElementById = vi.fn().mockReturnValue({ scrollTo: mainScrollMock });
    document.querySelector = vi
      .fn()
      .mockImplementation((selector) =>
        selector === 'meta[name="description"]'
          ? { setAttribute: metaSetAttributeMock }
          : null
      );
    window.scrollTo = windowScrollMock;

  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      'https://wa.me/5516997338791'
    );
  });

  it('scrolls to top on mount', () => {
    render(
      <MemoryRouter>
        <Confirmacao />
      </MemoryRouter>
    );

    expect(document.title).toBe('Simulação Enviada | Libra Crédito');
    expect(metaSetAttributeMock).toHaveBeenCalledWith(
      'content',
      'Confirmação de envio da simulação. Em breve nossa equipe entrará em contato.'
    );
    expect(metaSetAttributeMock).toHaveBeenCalledTimes(1);
    expect(mainScrollMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
    expect(windowScrollMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
    expect(mainScrollMock).toHaveBeenCalledTimes(1);
    expect(windowScrollMock).toHaveBeenCalledTimes(1);
  });
});

