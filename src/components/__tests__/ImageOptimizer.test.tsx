import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ImageOptimizer from '../ImageOptimizer';

describe('ImageOptimizer', () => {
  it('applies w-full, h-full and object-cover by default', () => {
    render(<ImageOptimizer src="/test.jpg" alt="default" />);
    const img = screen.getByAltText('default');
    expect(img).toHaveClass('w-full');
    expect(img).toHaveClass('h-full');
    expect(img).toHaveClass('object-cover');
  });

  it('avoids w-full and h-full when size classes provided', () => {
    render(<ImageOptimizer src="/test.jpg" alt="sized" className="w-10 h-10" />);
    const img = screen.getByAltText('sized');
    const container = img.parentElement as HTMLElement;
    expect(container).toHaveClass('w-10');
    expect(container).toHaveClass('h-10');
    expect(img).not.toHaveClass('w-full');
    expect(img).not.toHaveClass('h-full');
  });

  it('supports custom object-fit', () => {
    render(<ImageOptimizer src="/test.jpg" alt="contain" objectFit="contain" />);
    const img = screen.getByAltText('contain');
    expect(img).toHaveClass('object-contain');
  });
});
