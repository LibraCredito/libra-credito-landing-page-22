import { render, fireEvent, waitFor } from '@testing-library/react';
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

  it('calls player methods on click', async () => {
    const unMute = vi.fn();
    const setVolume = vi.fn();
    const playVideo = vi.fn();

    const PlayerMock = vi.fn().mockImplementation((element, options) => {
      options.events.onReady({ target: { unMute, setVolume, playVideo } });
      return {};
    });

    (window as any).YT = { Player: PlayerMock };

    const { container } = render(
      <OptimizedYouTube videoId="abc123" title="Test Video" />
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);

    await waitFor(() => {
      expect(PlayerMock).toHaveBeenCalled();
      expect(unMute).toHaveBeenCalled();
      expect(setVolume).toHaveBeenCalledWith(100);
      expect(playVideo).toHaveBeenCalled();
    });
  });
});

