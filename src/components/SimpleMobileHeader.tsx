import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDevice } from '@/hooks/useDevice';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import { Button } from '@/components/ui/button';

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
    <header 
      data-mobile="true"
      className={`fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-sm ${hasNotch ? 'pt-safe-top' : ''}`}
    >
      <div className="h-[64px] px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center tap-transparent" aria-label="Ir para página inicial da Libra Crédito">
          <div className="h-[64px] overflow-hidden flex items-center">
            <img
              src="/images/logos/logo-header.webp"
              alt="Libra Crédito - Simulação de crédito com garantia de imóvel"
              className="header-logo h-[48px]"
              width="90"
              height="90"
            />
          </div>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Simular Button - destaque principal */}
          <Button
            onClick={handleSimulate}
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700 text-sm px-4 py-3 h-11 min-h-[44px]"
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
                    className={`block py-3 px-2 text-[1.0938rem] font-medium rounded-md transition-colors min-h-[44px] flex items-center ${
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
                <li role="none">
                  <button
                    onClick={() => {
                      onPortalClientes();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-2 text-[1.0938rem] font-medium text-libra-navy hover:text-libra-blue hover:bg-gray-50 rounded-md transition-colors flex items-center min-h-[44px]"
                    role="menuitem"
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
