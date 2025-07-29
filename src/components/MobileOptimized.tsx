import React, { useEffect } from 'react';
import { useDevice } from '@/hooks/useDevice';

interface MobileOptimizedProps {
  children: React.ReactNode;
}

export const MobileOptimized: React.FC<MobileOptimizedProps> = ({ children }) => {
  const { isMobile, isIOS } = useDevice();

  useEffect(() => {
    if (!isMobile) return;

    // Configurar viewport respeitando acessibilidade
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0'
      );
    }

    // Adicionar classes específicas do dispositivo ao body
    const bodyClasses = [];
    if (isMobile) bodyClasses.push('is-mobile');
    if (isIOS) bodyClasses.push('is-ios');
    
    document.body.classList.add(...bodyClasses);

    // Desabilitar pull-to-refresh no Chrome mobile
    let lastY = 0;
    const preventPullToRefresh = (e: TouchEvent) => {
      const scrollY = window.scrollY;
      const touchY = e.touches[0].clientY;
      const touchYDelta = touchY - lastY;
      lastY = touchY;

      if (scrollY === 0 && touchYDelta > 0) {
        e.preventDefault();
      }
    };

    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', (e) => {
        lastY = e.touches[0].clientY;
      }, { passive: false });
      
      document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    }

    // CSS Containment para melhor performance
    const style = document.createElement('style');
    style.textContent = `
      .mobile-optimized {
        contain: layout style;
      }
      
      /* Desabilitar hover effects em touch devices */
      @media (hover: none) and (pointer: coarse) {
        *:hover {
          transform: none !important;
          filter: none !important;
        }
      }
      
      /* Otimizar scroll performance */
      .mobile-scroll {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      
      /* Prevenir text resize no iOS */
      body {
        -webkit-text-size-adjust: 100%;
      }
      
      /* Safe areas para iPhone X+ */
      .safe-area-top {
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
      }
      
      .safe-area-bottom {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.body.classList.remove(...bodyClasses);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      document.removeEventListener('touchmove', preventPullToRefresh);
    };
  }, [isMobile, isIOS]);

  // Adicionar meta tags para PWA
  useEffect(() => {
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'theme-color', content: '#003399' },
      { name: 'mobile-web-app-capable', content: 'yes' },
    ];

    const addedTags: HTMLMetaElement[] = [];

    metaTags.forEach(tag => {
      const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        const meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
        addedTags.push(meta);
      }
    });

    return () => {
      addedTags.forEach(tag => {
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
    };
  }, []);

  return (
    <div className={isMobile ? 'mobile-optimized' : ''}>
      {children}
    </div>
  );
};

// Hook para detectar orientação
export const useOrientation = () => {
  const getOrientation = () => {
    if (window.screen && (window.screen as any).orientation) {
      const type = (window.screen as any).orientation.type as string;
      return type.startsWith('portrait') ? 'portrait' : 'landscape';
    }
    return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
  };

  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    getOrientation()
  );

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
};

// Hook para detectar teclado virtual
export const useVirtualKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      if (heightDifference > 100) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(heightDifference);
      } else {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Atualizar altura inicial quando orientação muda
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        initialHeight = window.innerHeight;
      }, 500);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};
