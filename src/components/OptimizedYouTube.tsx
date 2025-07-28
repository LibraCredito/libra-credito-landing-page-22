import React, { useState, useRef, useCallback } from 'react';
import { Play } from 'lucide-react';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Função simplificada para carregamento
  const loadVideo = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Usar thumbnail otimizada menor (65KB vs 525KB)
  const thumbnailImage = thumbnailSrc || `/images/optimized/video-thumbnail.webp`;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {!isLoaded ? (
        <button
          className="w-full h-full cursor-pointer relative bg-black flex items-center justify-center hero-video group"
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
            loading="lazy"
          />

          {/* Overlay simplificado - usando apenas CSS */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-200">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-all duration-200 group-hover:scale-105">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&rel=0&modestbranding=1&preload=metadata`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          playsInline
        />
      )}
    </div>
  );
};

export default OptimizedYouTube;
