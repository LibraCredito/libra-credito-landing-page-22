import { useEffect } from 'react';
import criticalCss from '@/styles/critical.css?raw';

/**
 * Componente para injetar o CSS crítico inline no <head>.
 * Isso garante que os estilos essenciais para a primeira dobra
 * sejam aplicados sem uma requisição de rede bloqueante.
 */
const CriticalCssInjector = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'critical-css';
    styleElement.innerHTML = criticalCss;
    document.head.appendChild(styleElement);

    return () => {
      const existingStyleElement = document.getElementById('critical-css');
      if (existingStyleElement) {
        document.head.removeChild(existingStyleElement);
      }
    };
  }, []);

  return null; // Este componente não renderiza nada no DOM.
};

export default CriticalCssInjector;
