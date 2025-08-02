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
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('@/utils/scrollToTarget', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('Simulacao layout', () => {
  it('centers SimulationForm on large screens using flex', () => {
    render(<Simulacao />);
    const form = screen.getByTestId('simulation-form');
    const wrapper = form.parentElement as HTMLElement;
    expect(wrapper).toHaveClass('bg-white');
    expect(wrapper).toHaveClass('lg:flex');
    expect(wrapper).toHaveClass('lg:justify-center');
  });

  it('preserves mobile layout without flex utilities', () => {
    render(<Simulacao />);
    const form = screen.getByTestId('simulation-form');
    const wrapper = form.parentElement as HTMLElement;
    expect(wrapper.classList.contains('flex')).toBe(false);
    expect(wrapper.classList.contains('justify-center')).toBe(false);
  });

  it('SimulationForm remains centered with mx-auto and max width', () => {
    render(<Simulacao />);
    const form = screen.getByTestId('simulation-form');
    expect(form).toHaveClass('container');
    expect(form).toHaveClass('mx-auto');
    expect(form.className).toContain('max-w-6xl');
  });
});
