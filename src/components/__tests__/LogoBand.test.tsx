import { describe, it, expect, vi } from 'vitest';
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
    const imgContainer = img.parentElement as HTMLElement;

    expect(imgContainer).toHaveClass('h-20');
    expect(imgContainer).toHaveClass('w-auto');
    expect(img).not.toHaveClass('w-full');
    expect(img).not.toHaveClass('h-full');
    expect(img).toHaveClass('object-contain');
    expect(img.getAttribute('src')).toBe('/images/logos/logo-branco.svg');
    expect(img).toHaveAttribute('width', '80');
    expect(img).toHaveAttribute('height', '80');
    expect(img.getAttribute('srcset')).toContain('width=80');
    expect(img).toHaveAttribute('sizes', '80px');
  });

  it('allows mobile sizing and clickable behaviour', () => {
    const handleClick = vi.fn();
    const { container } = render(<LogoBand size="mobile" onClick={handleClick} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('py-8');
    expect(wrapper).toHaveClass('cursor-pointer');

    wrapper.click();
    expect(handleClick).toHaveBeenCalled();

    const img = screen.getByAltText('Libra Crédito') as HTMLImageElement;
    const imgContainer = img.parentElement as HTMLElement;
    expect(imgContainer).toHaveClass('h-12');
  });
});

