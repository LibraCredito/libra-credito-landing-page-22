/**
 * Componente de seção lazy loading otimizado
 * 
 * Substitui o Suspense fallback por um loading mais performático
 */

import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  className = '',
  rootMargin = '100px',
  threshold = 0.1
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const defaultFallback = (
    <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-libra-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    </div>
  );

  return (
    <div ref={targetRef} className={className}>
      {isIntersecting ? children : (fallback || defaultFallback)}
    </div>
  );
};

export default LazySection;