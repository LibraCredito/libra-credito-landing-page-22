import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import OptimizedYouTube from '../OptimizedYouTube';

describe('OptimizedYouTube', () => {
  it('hides placeholder after thumbnail loads', () => {
    const { container, getByAltText } = render(
      <OptimizedYouTube videoId="abc123" title="Test Video" />
    );

    const placeholder = container.querySelector('img[aria-hidden="true"]') as HTMLImageElement;
    const thumbnail = getByAltText('Miniatura do Test Video') as HTMLImageElement;

    // placeholder initially in the DOM and visible
    expect(placeholder).toBeInTheDocument();
    expect(placeholder.style.display).toBe('block');

    // fire load event
    fireEvent.load(thumbnail);

    // placeholder should be hidden after thumbnail load
    expect(placeholder.style.display).toBe('none');
  });
});

