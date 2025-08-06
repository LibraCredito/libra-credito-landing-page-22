import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import DesktopHeader from '../DesktopHeader';

describe('DesktopHeader', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 103,
    });

    // Simple mock for ResizeObserver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).ResizeObserver = class {
      observe() {}
      disconnect() {}
    };
  });

  afterAll(() => {
    delete (HTMLElement.prototype as any).offsetHeight;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).ResizeObserver;
  });

  it('keeps header offset after closing the banner', async () => {
    render(
      <MemoryRouter>
        <DesktopHeader onPortalClientes={() => {}} onSimulateNow={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue('--header-offset-desktop')
      ).toBe('103px');
    });

    const closeButton = screen.getByLabelText('Fechar aviso');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue('--header-offset-desktop')
      ).toBe('103px');
    });
  });
});

