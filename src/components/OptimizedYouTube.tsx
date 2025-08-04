import Play from 'lucide-react/dist/esm/icons/play';
import { type FC, type MouseEvent, useRef } from 'react';

interface OptimizedYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  /**
   * If true, the thumbnail is loaded eagerly with high fetch priority.
   * Use for above-the-fold videos that impact LCP.
   */
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  thumbnailSrc?: string;
}

/**
 * Lightweight YouTube embed that swaps in the real iframe on demand.
 * Set `priority` for above-the-fold videos so their thumbnail is requested early
 * with high fetch priority, improving Largest Contentful Paint.
 */
const OptimizedYouTube: FC<OptimizedYouTubeProps> = ({
  videoId,
  title,
  className = '',
  priority = false,
  fetchPriority,
  thumbnailSrc,
}) => {
  const thumbnailImage = thumbnailSrc || '/images/optimized/video-thumbnail.webp';
  const placeholderRef = useRef<HTMLImageElement | null>(null);
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'%3E%3Crect width='480' height='360' fill='%23e2e8f0'/%3E%3C/svg%3E";

  const loadVideo = (e: MouseEvent<HTMLButtonElement>) => {
    const container = e.currentTarget.parentElement as HTMLElement | null;
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&modestbranding=1&rel=0`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.position = 'absolute';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(iframe);
  };

  return (
    <div className={`hero-video relative w-full h-full overflow-hidden ${className}`}>
      <button
        className="w-full h-full cursor-pointer relative bg-black flex items-center justify-center group"
        onClick={loadVideo}
        aria-label={`Reproduzir vídeo: ${title}`}
        type="button"
      >
        {/* When priority is true, set fetchPriority="high" so the thumbnail is requested early for better LCP */}
        <img
          ref={placeholderRef}
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          width="480"
          height="360"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
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
            display: 'block',
          }}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}

        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-200">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-all duration-200 group-hover:scale-105">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default OptimizedYouTube;
