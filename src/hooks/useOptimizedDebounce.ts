import { useCallback, useRef } from 'react';

/**
 * Hook de debounce otimizado para reduzir trabalho da main thread
 * Implementa cancelamento eficiente e cleanup automático
 */
export function useOptimizedDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  
  // Atualiza callback ref sem recriações desnecessárias
  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<T>) => {
      // Cancela execução anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Agenda nova execução usando requestIdleCallback se disponível
      timeoutRef.current = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            callbackRef.current(...args);
          });
        } else {
          callbackRef.current(...args);
        }
      }, delay);
    },
    [delay]
  ) as T;
}

/**
 * Hook para throttling de eventos de input críticos
 * Reduz drasticamente o trabalho da main thread em formulários
 */
export function useThrottledInput<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 16 // 60fps
): T {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  
  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;
      
      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callbackRef.current(...args);
        }, delay - timeSinceLastCall);
      }
    },
    [delay]
  ) as T;
}