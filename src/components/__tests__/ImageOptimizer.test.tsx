import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ImageOptimizer from '../ImageOptimizer';

describe('ImageOptimizer', () => {
  it('applies w-full and h-full by default', () => {
    render(<ImageOptimizer src="/test.jpg" alt="default" />);
    const img = screen.getByAltText('default');
    expect(img).toHaveClass('w-full');
    expect(img).toHaveClass('h-full');
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
});
