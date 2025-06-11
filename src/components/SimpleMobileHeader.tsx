import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDevice } from '@/hooks/useDevice';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageOptimizer from '@/components/ImageOptimizer';

interface SimpleMobileHeaderProps {
  onPortalClientes?: () => void;
}

const SimpleMobileHeader: React.FC<SimpleMobileHeaderProps> = ({ onPortalClientes }) => {
  const { hasNotch } = useDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Simulação', path: '/simulacao' },
    { name: 'Vantagens', path: '/vantagens' },
    { name: 'Quem Somos', path: '/quem-somos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Parceiros', path: '/parceiros' },
  ];

  const handleSimulate = () => {
    navigate('/simulacao');
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-sm ${hasNotch ? 'safe-top' : ''}`} style={{ position: 'fixed !important' }}>
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label="Ir para página inicial da Libra Crédito">
          <div className="h-12 overflow-hidden flex items-center">
            <ImageOptimizer
              src="/images/logos/libra-logo.png"
              alt="Libra Crédito - Empréstimo com garantia de imóvel"
              className="h-16 w-auto transform scale-105"
              aspectRatio={1}
              priority={true}
              style={{
                clipPath: 'inset(30% 0 30% 0)'
              }}
            />
          </div>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Simular Button - destaque principal */}
          <Button 
            onClick={handleSimulate}
            size="sm"
            className="bg-libra-navy text-white hover:bg-libra-navy/90 text-sm px-4 py-3 h-11 min-h-[44px]"
            aria-label="Ir para simulação de empréstimo"
          >
            Simular
          </Button>

          {/* Menu Hamburguer */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 hover:bg-gray-100 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          >
            {isMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <nav className="bg-white border-t border-gray-100 shadow-lg" aria-label="Menu principal de navegação">
          <div className="px-4 py-3">
            <ul className="space-y-2" role="menu">
              {navigationItems.map((item) => (
                <li key={item.path} role="none">
                  <Link
                    to={item.path}
                    className={`block py-3 px-2 text-sm font-medium rounded-md transition-colors min-h-[44px] flex items-center ${
                      location.pathname === item.path 
                        ? 'text-libra-blue bg-blue-50' 
                        : 'text-libra-navy hover:text-libra-blue hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {/* Portal de Clientes */}
              {onPortalClientes && (
                <li className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      onPortalClientes();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-2 text-sm font-medium text-libra-blue hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Portal de Clientes
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default SimpleMobileHeader;
