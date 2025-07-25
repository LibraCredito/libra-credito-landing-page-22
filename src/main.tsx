import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx'
import './index.css';
import './styles/overflow-fix.css';

// Renderização direta com createRoot para LCP otimizado
const renderApp = () => {
  // Definir idioma da página
  document.documentElement.lang = 'pt-BR';
  
  // Skip Link para acessibilidade - lazy load
  requestIdleCallback(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-libra-navy focus:rounded';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
  });
  
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(<App />);
  }
};

renderApp();
