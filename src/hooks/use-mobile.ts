import { useState, useEffect } from 'react';

/**
 * Hook SSR-safe para detectar se o dispositivo é mobile
 * Evita hydration mismatch iniciando com valor correto
 * @param breakpoint - Ponto de quebra para considerar mobile (padrão: 768px)
 * @returns boolean - true se for mobile, false caso contrário
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  // Inicia com valor determinístico para evitar mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Atualiza imediatamente após o mount
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
};

// Hook adicional para diferentes breakpoints - SSR-safe
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};

// Hook para detectar orientação do dispositivo - SSR-safe
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getOrientation = () => {
      if (window.screen && (window.screen as any).orientation) {
        const type = (window.screen as any).orientation.type as string;
        return type.startsWith('portrait') ? 'portrait' : 'landscape';
      }
      return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
    };

    const checkOrientation = () => setOrientation(getOrientation());

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
