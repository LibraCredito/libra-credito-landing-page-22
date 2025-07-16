/**
 * Componente de cabeçalho para dispositivos móveis
 * 
 * @component MobileHeader
 * @description Implementa a versão mobile do cabeçalho com menu hamburguer e navegação adaptada
 * 
 * @features
 * - Menu hamburguer com animação
 * - Navegação responsiva
 * - Botões de ação adaptados para mobile
 * - Integração com localStorage para estado do menu
 * 
 * @param {MobileHeaderProps} props
 * @param {() => void} props.onPortalClientes - Callback para acesso ao portal de clientes
 * @param {() => void} props.onSimulateNow - Callback para iniciar simulação
 * 
 * @example
 * ```tsx
 * <MobileHeader 
 *   onPortalClientes={() => window.open('https://portal.com')}
 *   onSimulateNow={() => navigate('/simulacao')}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Info } from 'lucide-react';
import ImageOptimizer from '@/components/ImageOptimizer';

interface MobileHeaderProps {
  onPortalClientes: () => void;
  onSimulateNow: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onPortalClientes, onSimulateNow }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Simulação', path: '/simulacao', highlight: true },
    { name: 'Vantagens', path: '/vantagens' },
    { name: 'Quem Somos', path: '/quem-somos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Parceiros', path: '/parceiros' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-md" role="banner" style={{ position: 'fixed !important' }}>
      {/* Barra superior compacta */}
      <div className="bg-libra-navy border-b border-blue-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-white text-xs font-semibold">
              <Info className="w-3 h-3 mr-1 text-white" />
              A Libra não realiza cobrança até a liberação
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" aria-label="Página inicial da Libra Crédito" className="tap-transparent">
              <div className="h-16 overflow-hidden flex items-center">
                <img
                  src="/images/media/logo-header.png?v=3"
                  alt="Libra Crédito"
                  className="h-full w-auto pointer-events-none max-w-none"
                />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              className="min-h-[40px] px-4 text-sm font-semibold bg-libra-navy text-white hover:bg-libra-navy/90 shadow-md"
              size="sm"
              onClick={onSimulateNow}
              aria-label="Simular crédito agora"
            >
              Simular Agora
            </Button>

            <button
              className="lg:hidden p-2 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu de navegação"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <nav className="bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-3">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block py-3 px-3 text-[1.25rem] font-medium rounded-md transition-colors ${
                      item.highlight
                        ? 'bg-libra-navy text-white hover:bg-libra-navy/90 font-semibold'
                        : location.pathname === item.path
                          ? 'text-libra-blue bg-blue-50'
                          : 'text-libra-navy hover:text-libra-blue hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Button
                  onClick={() => {
                    onPortalClientes();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-center text-base font-medium"
                >
                  Portal de Clientes
                </Button>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;
