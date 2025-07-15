import { useState, useEffect } from 'react';

/**
 * Hook para detectar se o dispositivo é mobile
 * @param breakpoint - Ponto de quebra para considerar mobile (padrão: 768px)
 * @returns boolean - true se for mobile, false caso contrário
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);

    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, [breakpoint]);

  return isMobile;
};

// Hook adicional para diferentes breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => {
      window.removeEventListener('resize', checkBreakpoint);
    };
  }, []);

  return breakpoint;
};

// Hook para detectar orientação do dispositivo
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const getOrientation = () => {
      if (window.screen && (window.screen as any).orientation) {
        const type = (window.screen as any).orientation.type as string;
        return type.startsWith('portrait') ? 'portrait' : 'landscape';
      }
      return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
    };

    const checkOrientation = () => {
      setOrientation(getOrientation());
    };

    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  return orientation;
};
