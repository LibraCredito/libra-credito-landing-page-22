import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LogoBand from '../LogoBand';

describe('LogoBand', () => {
  it('renders container with py-4 padding and optimized image', () => {
    const { container } = render(<LogoBand />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('py-4');
    expect(wrapper).not.toHaveClass('py-8');

    const img = screen.getByAltText('Libra Crédito') as HTMLImageElement;
    expect(img).toHaveClass('h-20');
    expect(img).toHaveClass('w-20');
    expect(img).not.toHaveClass('h-24');
    expect(img).not.toHaveClass('w-auto');
    expect(img.getAttribute('src')).toBe('/images/logos/logo-branco.svg');
    expect(img).toHaveAttribute('width', '80');
    expect(img).toHaveAttribute('height', '80');
  });
});

