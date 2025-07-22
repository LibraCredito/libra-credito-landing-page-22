import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';

// App de teste simples para debug
const DebugApp = () => {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="text-white text-4xl font-bold">
        App Debug - Funcionando!
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<DebugApp />);
}