/**
 * Context otimizado para detecção mobile
 * 
 * Este contexto substitui o useIsMobile para evitar múltiplas instâncias
 * de media query listeners e reduzir re-renders desnecessários
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const MOBILE_BREAKPOINT = 1024;

interface MobileContextType {
  isMobile: boolean;
  isLoading: boolean;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  // Valor inicial baseado no breakpoint padrão
  const getInitialValue = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  };

  const [isMobile, setIsMobile] = useState<boolean>(getInitialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se estamos no browser
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Definir valor inicial correto
    setIsMobile(mql.matches);
    setIsLoading(false);
    
    // Adicionar listener
    mql.addEventListener('change', onChange);
    
    // Cleanup
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  const value: MobileContextType = {
    isMobile,
    isLoading
  };

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileOptimized = (): MobileContextType => {
  const context = useContext(MobileContext);
  
  if (context === undefined) {
    // Ao invés de lançar erro, retorna valores padrão
    console.warn('useMobileOptimized used outside MobileProvider, using defaults');
    return {
      isMobile: false,
      isLoading: false
    };
  }
  
  return context;
};

// Hook de compatibilidade para migração gradual
export const useIsMobile = (): boolean => {
  try {
    const { isMobile } = useMobileOptimized();
    return isMobile;
  } catch (error) {
    console.warn('useIsMobile error, defaulting to false:', error);
    return false;
  }
};