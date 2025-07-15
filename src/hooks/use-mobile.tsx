/**
 * Hook para detectar se o dispositivo atual é mobile
 * 
 * @hook useIsMobile
 * @description Detecta se a viewport atual está em tamanho mobile usando media queries
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

import * as React from "react"

const MOBILE_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}