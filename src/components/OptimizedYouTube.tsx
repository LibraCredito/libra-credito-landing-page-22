import Play from 'lucide-react/dist/esm/icons/play';
import { type FC, type MouseEvent, useEffect, useRef } from 'react';

interface OptimizedYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  decoding?: 'sync' | 'async' | 'auto';
  thumbnailSrc?: string;
}

/**
 * Lightweight YouTube embed that swaps in the real iframe on demand.
 * Uses an SVG placeholder for instant paint while the real image loads lazily.
 */
const OptimizedYouTube: FC<OptimizedYouTubeProps> = ({
  videoId,
  title,
  className = '',
  decoding = 'async',
  thumbnailSrc,
}) => {
  const thumbnailImage = thumbnailSrc || '/images/media/video-cgi-libra.webp';

  const placeholderRef = useRef<HTMLImageElement | null>(null);
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'%3E%3Crect width='480' height='360' fill='%23e2e8f0'/%3E%3C/svg%3E";

  useEffect(() => {
    const imgEl = placeholderRef.current;
    if (!imgEl) return;

    const loadRealImage = () => {
      const img = new Image();
      img.loading = 'lazy';
      // @ts-expect-error fetchPriority is experimental
      img.fetchPriority = 'low';
      img.decoding = decoding;
      img.onload = () => {
        if (placeholderRef.current) {
          placeholderRef.current.src = thumbnailImage;
        }
      };
      img.src = thumbnailImage;
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.disconnect();
            if ('requestIdleCallback' in window) {
              // @ts-expect-error requestIdleCallback is not in the DOM lib yet
              requestIdleCallback(loadRealImage);
            } else {
              loadRealImage();
            }
          }
        });
      });
      observer.observe(imgEl);
      return () => observer.disconnect();
    }

    if ('requestIdleCallback' in window) {
      // @ts-expect-error requestIdleCallback is not in the DOM lib yet
      requestIdleCallback(loadRealImage);
    } else {
      const id = setTimeout(loadRealImage, 200);
      return () => clearTimeout(id);
    }
  }, [thumbnailImage, decoding]);

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
        <img
          ref={placeholderRef}
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          width="480"
          height="360"
          loading="lazy"
          // @ts-expect-error fetchPriority is experimental
          fetchPriority="low"
          decoding={decoding}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
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
