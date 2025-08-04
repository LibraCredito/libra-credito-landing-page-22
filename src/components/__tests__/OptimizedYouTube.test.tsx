import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import OptimizedYouTube from '../OptimizedYouTube';

describe('OptimizedYouTube', () => {
  it('replaces placeholder src with real thumbnail after idle', async () => {
    // mock requestIdleCallback to run immediately
    // @ts-expect-error requestIdleCallback is not in the DOM lib yet
    vi.stubGlobal('requestIdleCallback', (cb: any) => cb());

    const OriginalImage = global.Image;
    class MockImage {
      onload: (() => void) | null = null;
      _src = '';
      set src(value: string) {
        this._src = value;
        if (this.onload) this.onload();
      }
      get src() {
        return this._src;
      }
      loading = '';
      fetchPriority = '';
      decoding = '';
    }
    // @ts-expect-error overriding global Image for test
    global.Image = MockImage;

    const { container } = render(
      <OptimizedYouTube videoId="abc123" title="Test Video" />
    );

    const img = container.querySelector('img') as HTMLImageElement;

    await waitFor(() => {
      expect(img.src).toContain('/images/media/video-cgi-libra.webp');
    });

    global.Image = OriginalImage;
  });
});
