import React, { useState, useRef, useCallback } from 'react';
import Play from 'lucide-react/dist/esm/icons/play';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Carrega dinamicamente a YouTube Iframe API quando necessário
const loadYouTubeIframeAPI = (): Promise<any> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    const existing = document.getElementById('youtube-iframe-api');
    if (!existing) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.id = 'youtube-iframe-api';
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };
  });
};

interface OptimizedYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  priority?: boolean;
  thumbnailSrc?: string;
}

const OptimizedYouTube: React.FC<OptimizedYouTubeProps> = ({
  videoId,
  title,
  className = "",
  priority = false,
  thumbnailSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // Instancia o player da YouTube API na primeira interação
  const loadVideo = useCallback(async () => {
    if (playerRef.current || !containerRef.current) return;

    setIsLoaded(true);

    const YT = await loadYouTubeIframeAPI();
    playerRef.current = new YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          event.target.unMute();
          event.target.playVideo();
        },
      },
    });
  }, [videoId]);

  // Usar thumbnail otimizada menor (65KB vs 525KB)
  const thumbnailImage = thumbnailSrc || `/images/optimized/video-thumbnail.webp`;

  return (
    <div className={`hero-video relative w-full h-full overflow-hidden ${className}`}>
      {!isLoaded && (
        <button
          className="w-full h-full cursor-pointer relative bg-black flex items-center justify-center group"
          onClick={loadVideo}
          aria-label={`Reproduzir vídeo: ${title}`}
          type="button"
        >
          {/* Thumbnail otimizada - ocupando todo o espaço do container */}
          <img
            src={thumbnailImage}
            alt={`Miniatura do ${title}`}
            width="480"
            height="360"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            loading={priority ? 'eager' : 'lazy'}
          />

          {/* Overlay simplificado - usando apenas CSS */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-200">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-all duration-200 group-hover:scale-105">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </button>

      )}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export default OptimizedYouTube;
