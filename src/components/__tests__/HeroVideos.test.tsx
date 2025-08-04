import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import HeroAnimated from '../HeroAnimated';
import Hero from '../../../temp-files/Hero';
import HeroMinimal from '../../../temp-files/HeroMinimal';

vi.mock('../TypewriterText', () => ({
  default: () => <span>Typewriter</span>,
}));

const setup = () => {
  // mock requestIdleCallback and Image loading
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
  return OriginalImage;
};

describe('video thumbnails', () => {
  it('HeroAnimated uses the updated thumbnail', async () => {
    const OriginalImage = setup();
    const { container } = render(
      <MemoryRouter>
        <HeroAnimated />
      </MemoryRouter>
    );
    const thumbnail = container.querySelector('img[aria-hidden="true"]') as HTMLImageElement;
    await waitFor(() => {
      expect(thumbnail.src).toContain('/images/media/video-cgi-libra.webp');
    });
    global.Image = OriginalImage;
  });

  it('Hero uses the updated thumbnail', async () => {
    const OriginalImage = setup();
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const thumbnail = container.querySelector('img[aria-hidden="true"]') as HTMLImageElement;
    await waitFor(() => {
      expect(thumbnail.src).toContain('/images/media/video-cgi-libra.webp');
    });
    global.Image = OriginalImage;
  });

  it('HeroMinimal uses the updated thumbnail', async () => {
    const OriginalImage = setup();
    const { container } = render(
      <MemoryRouter>
        <HeroMinimal />
      </MemoryRouter>
    );
    const thumbnail = container.querySelector('img[aria-hidden="true"]') as HTMLImageElement;
    await waitFor(() => {
      expect(thumbnail.src).toContain('/images/media/video-cgi-libra.webp');
    });
    global.Image = OriginalImage;
  });
});
