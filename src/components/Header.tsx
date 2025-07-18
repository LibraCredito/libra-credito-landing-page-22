/**
 * Componente de cabeçalho principal da aplicação Libra Crédito
 * 
 * @component Header
 * @description Implementa um cabeçalho responsivo que se adapta entre versões mobile e desktop.
 * Inclui funcionalidades de navegação, acesso ao portal de clientes e popup informativo.
 * 
 * @features
 * - Responsividade automática via useIsMobile hook
 * - Popup informativo com persistência via localStorage
 * - Integração com React Router para navegação
 * - Portal de clientes em nova aba
 * 
 * @example
 * ```tsx
 * <Header />
 * ```
 * 
 * @memoperformance
 * Componente memorizado via React.memo para evitar re-renders desnecessários
 */

import React, { memo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDevice } from '@/hooks/useDevice';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import SimpleMobileHeader from './SimpleMobileHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useState } from 'react';

const Header: React.FC = memo(() => {
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDevice();

  // Controla quando mostrar o popup baseado na página atual
  useEffect(() => {
    const currentPath = location.pathname;
    const allowedPaths = ['/', '/simulacao'];
    
    if (allowedPaths.includes(currentPath)) {
      const storageKey = `popup_seen_${currentPath.replace('/', 'home')}`;
      const hasSeenPopup = localStorage.getItem(storageKey);
      
      if (!hasSeenPopup) {
        setIsInfoPopupOpen(true);
      }
    }
  }, [location.pathname]);

  const handleClosePopup = () => {
    const currentPath = location.pathname;
    const storageKey = `popup_seen_${currentPath.replace('/', 'home')}`;
    localStorage.setItem(storageKey, 'true');
    // iOS may delay removing fixed elements after a click.
    // Schedule state update in the next frame to ensure proper cleanup.
    requestAnimationFrame(() => {
      setIsInfoPopupOpen(false);
    });
  };

  const handleSimulateNow = () => {
    navigate('/simulacao');
  };

  const handlePortalClientes = () => {
    window.open('https://libracredito.construtorastefani.com.br:9000/', '_blank');
  };

  return (
    <>
      {isMobile ? (
        <SimpleMobileHeader onPortalClientes={handlePortalClientes} />
      ) : (
        <DesktopHeader 
          onPortalClientes={handlePortalClientes}
          onSimulateNow={handleSimulateNow}
        />
      )}

      {/* Popup informativo centralizado - apenas para páginas específicas */}
      <Dialog open={isInfoPopupOpen} onOpenChange={setIsInfoPopupOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-libra-navy text-base">
              <Info className="w-5 h-5 mr-2 text-libra-blue" aria-hidden="true" />
              Informação Importante
            </DialogTitle>
          </DialogHeader>
            <p className="text-sm text-libra-navy">
              A Libra não realiza nenhum tipo de cobrança até a liberação do crédito.
            </p>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 self-end"
              onClick={handleClosePopup}
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
