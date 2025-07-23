import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.tsx'
import './index.css';
import './styles/overflow-fix.css';

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

// Renderização simplificada - removendo StrictMode temporariamente
const renderApp = () => {
  setupAccessibility();
  
  const root = document.getElementById('root');
  if (root) {
    hydrateRoot(root, <App />);
  }
};

renderApp();
