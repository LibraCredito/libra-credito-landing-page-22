import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Simulacao from '../Simulacao';

vi.mock('@/components/MobileLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/ui/WaveSeparator', () => ({
  default: () => <div />,
}));
vi.mock('@/components/SimulationForm', () => ({
  default: () => (
    <div data-testid="simulation-form" className="container mx-auto max-w-6xl" />
  ),
}));
vi.mock('@/components/Footer', () => ({
  default: () => <div />,
}));
vi.mock('@/components/LazySection', () => ({
  default: ({ children }: { children: React.ReactNode; load: () => Promise<unknown> }) => <>{children}</>,
}));
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('@/utils/scrollToTarget', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('Simulacao layout', () => {
  it('centers SimulationForm on large screens using flex', async () => {
    render(<Simulacao />);
    const form = await screen.findByTestId('simulation-form');
    const wrapper = form.parentElement as HTMLElement;
    expect(wrapper).toHaveClass('bg-white');
    expect(wrapper).toHaveClass('lg:flex');
    expect(wrapper).toHaveClass('lg:justify-center');
  });

  it('preserves mobile layout without flex utilities', async () => {
    render(<Simulacao />);
    const form = await screen.findByTestId('simulation-form');
    const wrapper = form.parentElement as HTMLElement;
    expect(wrapper.classList.contains('flex')).toBe(false);
    expect(wrapper.classList.contains('justify-center')).toBe(false);
  });

  it('SimulationForm remains centered with mx-auto and max width', async () => {
    render(<Simulacao />);
    const form = await screen.findByTestId('simulation-form');
    expect(form).toHaveClass('container');
    expect(form).toHaveClass('mx-auto');
    expect(form.className).toContain('max-w-6xl');
  });
});
