import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import OptimizedYouTube from '../OptimizedYouTube';

describe('OptimizedYouTube', () => {
  it('renders thumbnail without placeholder', () => {
    const { queryByAltText, getByAltText } = render(
      <OptimizedYouTube videoId="abc123" title="Test Video" />
    );

    const thumbnail = getByAltText('Miniatura do Test Video');
    const placeholder = queryByAltText('');

    expect(thumbnail).toBeInTheDocument();
    expect(placeholder).toBeNull();
  });

  it('loads video iframe on click', () => {
    const { container } = render(
      <OptimizedYouTube videoId="abc123" title="Test Video" />
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute('src')).toContain('abc123');
  });

  it('não renderiza botão de unmute', () => {
    const { container } = render(
      <OptimizedYouTube videoId="abc123" title="Test Video" />
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).not.toContain('mute=1');

    const postMessage = vi.fn();
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage },
    });

    const messageData = JSON.stringify({ event: 'onReady' });
    window.dispatchEvent(
      new MessageEvent('message', { source: iframe.contentWindow, data: messageData })
    );

    expect(postMessage).not.toHaveBeenCalled();
  });
});

