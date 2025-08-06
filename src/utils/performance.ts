// Performance utilities for mobile optimization

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  connectionSpeed: 'slow' | 'medium' | 'fast';
}

class MobilePerformanceMonitor {
  private fps: number = 60;
  private lastTime: number = performance.now();
  private frame: number = 0;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const measureFPS = () => {
      const currentTime = performance.now();
      this.frame++;

      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frame * 1000) / (currentTime - this.lastTime));
        this.frame = 0;
        this.lastTime = currentTime;

        const metrics = this.getMetrics();
        this.callbacks.forEach(cb => cb(metrics));
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
    if (typeof navigator === 'undefined') return 'medium';

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (!connection || !('effectiveType' in connection)) return 'medium';

    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    return 'fast';
  }

  public getMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      fps: this.fps,
      connectionSpeed: this.getConnectionSpeed()
    };

    // Memory usage (if available)
    if ('memory' in performance) {
      metrics.memory = (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
    }

    return metrics;
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  public shouldReduceMotion(): boolean {
    // Check user preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }

    // Check performance
    const metrics = this.getMetrics();
    return metrics.fps < 30 || metrics.connectionSpeed === 'slow';
  }

  public shouldLoadHighQualityImages(): boolean {
    const metrics = this.getMetrics();
    return metrics.connectionSpeed === 'fast' && metrics.fps >= 50;
  }
}

// Singleton instance
export const performanceMonitor = new MobilePerformanceMonitor();

// Utility functions
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy load images with Intersection Observer
export const lazyLoadImage = (
  imageElement: HTMLImageElement,
  src: string,
  placeholder?: string
) => {
  if (placeholder) {
    imageElement.src = placeholder;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  imageObserver.observe(imageElement);
};

// Optimize scroll performance
export const optimizeScroll = (element: HTMLElement) => {
  let ticking = false;

  const updateScroll = () => {
    // Your scroll update logic here
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };

  element.addEventListener('scroll', requestTick, { passive: true });

  return () => {
    element.removeEventListener('scroll', requestTick);
  };
};

// Detect if device has low memory
export const isLowEndDevice = (): boolean => {
  // Check device memory (if available)
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory < 4;
  }

  // Check hardware concurrency (CPU cores)
  if ('hardwareConcurrency' in navigator) {
    return navigator.hardwareConcurrency < 4;
  }

  // Fallback: check screen size and pixel ratio
  const screenWidth = window.screen.width;
  const pixelRatio = window.devicePixelRatio || 1;
  
  return screenWidth < 768 && pixelRatio < 2;
};

// Preload critical resources
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(woff|woff2)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Request idle callback polyfill
export const requestIdleCallback = 
  window.requestIdleCallback ||
  function (cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1);
  };

// Cancel idle callback polyfill
export const cancelIdleCallback = 
  window.cancelIdleCallback ||
  function (id: number) {
    clearTimeout(id);
  };
