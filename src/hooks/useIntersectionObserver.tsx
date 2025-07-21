/**
 * Hook otimizado para Intersection Observer
 * 
 * Implementa lazy loading performático para reduzir o JavaScript da thread principal
 */

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || typeof window === 'undefined') return;

    // Se já foi acionado e é triggerOnce, não fazer nada
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    targetRef,
    isIntersecting: triggerOnce ? (isIntersecting || hasTriggered) : isIntersecting,
    hasTriggered
  };
};