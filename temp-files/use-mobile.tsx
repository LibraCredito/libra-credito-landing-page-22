/**
 * Hook otimizado para detectar se o dispositivo atual é mobile
 * 
 * @hook useIsMobile
 * @description Detecta se a viewport atual está em tamanho mobile usando contexto otimizado
 * 
 * @returns {boolean} Retorna true se a viewport for menor que MOBILE_BREAKPOINT (1024px)
 * 
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *     {content}
 *   </div>
 * );
 * ```
 */

import { useIsMobile as useIsMobileContext } from './useMobileContext';

export function useIsMobile(): boolean {
  return useIsMobileContext();
}