/**
 * Componente de tracking global
 * 
 * @component GlobalTracker
 * @description Componente responsável por inicializar e gerenciar o tracking global da aplicação
 * 
 * @features
 * - Inicialização automática do tracking
 * - Tracking de navegação entre páginas
 * - Coleta de dados de sessão
 * - Monitoramento de performance
 */

import { useEffect } from 'react';
import { useUserJourney } from '@/hooks/useUserJourney';
import { useLocation } from 'react-router-dom';

const GlobalTracker: React.FC = () => {
  const { sessionId, isTracking, trackPageVisit } = useUserJourney();
  const location = useLocation();

  // Log do tracking para debug (apenas desenvolvimento)
  useEffect(() => {
    if (isTracking && sessionId && process.env.NODE_ENV === 'development') {
      console.log('🎯 Tracking ativo:', {
        sessionId,
        currentPage: location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }, [sessionId, isTracking, location.pathname]);

  // Tracking específico para páginas importantes
  useEffect(() => {
    if (!isTracking) return;

    // Definir eventos especiais para páginas específicas
    const pageEvents: Record<string, string> = {
      '/': 'homepage_view',
      '/simulacao': 'simulation_page_view',
      '/simulacao-guiada': 'simulation_page_view',
      '/parceiros': 'partners_page_view',
      '/vantagens': 'benefits_page_view',
      '/quem-somos': 'about_page_view'
    };

    const eventType = pageEvents[location.pathname];
    if (eventType && process.env.NODE_ENV === 'development') {
      console.log('📊 Evento de página:', {
        event: eventType,
        page: location.pathname,
        sessionId
      });
    }
  }, [location.pathname, isTracking, sessionId]);

  return null; // Componente invisível
};

export default GlobalTracker;
