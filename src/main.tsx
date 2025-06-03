import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializePerformanceOptimizations } from './lib/performance';

// Função para verificar necessidades de acessibilidade
const setupAccessibility = () => {
  // Adicionar Skip Link para navegação por teclado
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-libra-navy focus:rounded';
  skipLink.textContent = 'Pular para o conteúdo principal';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Definir idioma da página
  document.documentElement.lang = 'pt-BR';
};

// Inicializa otimizações de performance antes da renderização
initializePerformanceOptimizations();

// Renderização rápida
const renderApp = () => {
  setupAccessibility();
  
  const root = document.getElementById("root");
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

renderApp();
