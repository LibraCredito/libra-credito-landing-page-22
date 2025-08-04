import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import HeroAnimated from '../HeroAnimated';
import Hero from '../../../temp-files/Hero';
import HeroMinimal from '../../../temp-files/HeroMinimal';

vi.mock('../TypewriterText', () => ({
  default: () => <span>Typewriter</span>,
}));

describe('video thumbnails', () => {
  it('HeroAnimated uses the updated thumbnail', () => {
    render(
      <MemoryRouter>
        <HeroAnimated />
      </MemoryRouter>
    );
    const thumbnail = screen.getByAltText('Miniatura do Vídeo institucional Libra Crédito') as HTMLImageElement;
    expect(thumbnail.src).toContain('/images/media/video-cgi-libra.webp');
  });

  it('Hero uses the updated thumbnail', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const thumbnail = screen.getByAltText('Miniatura do Vídeo institucional Libra Crédito') as HTMLImageElement;
    expect(thumbnail.src).toContain('/images/media/video-cgi-libra.webp');
  });

  it('HeroMinimal uses the updated thumbnail', () => {
    render(
      <MemoryRouter>
        <HeroMinimal />
      </MemoryRouter>
    );
    const thumbnail = screen.getByAltText('Miniatura do Vídeo institucional Libra Crédito') as HTMLImageElement;
    expect(thumbnail.src).toContain('/images/media/video-cgi-libra.webp');
  });
});
