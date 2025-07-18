/**
 * Hook para tracking completo da jornada do usuário
 * 
 * @hook useUserJourney
 * @description Hook responsável por rastrear toda a jornada do usuário no site
 * 
 * @features
 * - Geração de session_id único
 * - Captura de UTMs e referrer
 * - Tracking de páginas visitadas
 * - Detecção de device/browser
 * - Tempo de permanência
 * - Persistência no Supabase
 * 
 * @usage
 * ```tsx
 * const { sessionId, trackPageVisit, trackSimulation } = useUserJourney();
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { UserJourneyData, PageVisit, DeviceInfo } from '@/lib/supabase';

// Lazy loader para evitar carregar Supabase na primeira pintura
let cachedSupabase: typeof import("@/lib/supabase").supabaseApi | null = null;
async function getSupabaseApi() {
  if (!cachedSupabase) {
    cachedSupabase = (await import('@/lib/supabase')).supabaseApi;
  }
  return cachedSupabase as typeof import('@/lib/supabase').supabaseApi;
}

// Constantes
const SESSION_STORAGE_KEY = 'libra_session_id';
const JOURNEY_STORAGE_KEY = 'libra_user_journey';

// Types específicos do hook
interface UserJourneyHook {
  sessionId: string;
  isTracking: boolean;
  trackPageVisit: (url?: string) => void;
  trackSimulation: (simulationData: unknown) => void;
  getJourneyData: () => UserJourneyData | null;
  updateTimeOnSite: () => void;
}

// Função para extrair UTMs da URL
function extractUTMParams(url: string = window.location.href): Record<string, string> {
  const urlObj = new URL(url);
  const utms: Record<string, string> = {};
  
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmParams.forEach(param => {
    const value = urlObj.searchParams.get(param);
    if (value) {
      utms[param] = value;
    }
  });
  
  return utms;
}

// Função para detectar informações do device
function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent;
  const screen = window.screen;
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // Detecção simples de device type
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = 'tablet';
  }
  
  // Detecção simples de browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  // Detecção simples de OS
  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  return {
    user_agent: userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${viewport.width}x${viewport.height}`,
    device_type: deviceType,
    browser,
    os
  };
}

// Função para obter IP (usando serviço externo)
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.warn('Erro ao obter IP:', error);
    return 'unknown';
  }
}

export function useUserJourney(): UserJourneyHook {
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [journeyData, setJourneyData] = useState<UserJourneyData | null>(null);
  const pageStartTime = useRef<number>(Date.now());
  const sessionStartTime = useRef<number>(Date.now());
  
  // Inicialização da sessão
  useEffect(() => {
    let currentSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      sessionStorage.setItem(SESSION_STORAGE_KEY, currentSessionId);
      sessionStartTime.current = Date.now();
    }
    
    setSessionId(currentSessionId);
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => initializeJourney(currentSessionId!));
    } else {
      setTimeout(() => initializeJourney(currentSessionId!), 500);
    }
  }, []);
  
  // Tracking de mudança de página
  useEffect(() => {
    if (sessionId && isTracking) {
      trackPageVisit();
    }
  }, [location.pathname, sessionId, isTracking]);
  
  // Inicializar jornada do usuário
  const initializeJourney = useCallback(async (sessionId: string) => {
    try {
      // Verificar se já existe jornada para esta sessão
      let existingJourney;
      
      const supabaseApi = await getSupabaseApi();
      try {
        existingJourney = await supabaseApi.getUserJourney(sessionId);
      } catch (getError: unknown) {
        // Apenas log em desenvolvimento, não desabilitar o tracking ainda
        if (process.env.NODE_ENV === 'development') {
          console.warn('Could not fetch existing journey:', getError?.message);
        }
        existingJourney = null; // Continuar para tentar criar nova jornada
      }
      
      if (!existingJourney) {
        // Tentar criar nova jornada apenas se a consulta anterior funcionou
        try {
          const utms = extractUTMParams();
          const deviceInfo = getDeviceInfo();

          const newJourney: UserJourneyData = {
            session_id: sessionId,
            utm_source: utms.utm_source || null,
            utm_medium: utms.utm_medium || null,
            utm_campaign: utms.utm_campaign || null,
            utm_term: utms.utm_term || null,
            utm_content: utms.utm_content || null,
            referrer: document.referrer || 'direct',
            landing_page: window.location.href,
            pages_visited: [],
            device_info: deviceInfo,
            ip_address: null
          };

          existingJourney = await supabaseApi.createUserJourney(newJourney);

          getUserIP()
            .then(ip =>
              supabaseApi.updateUserJourney(sessionId, { ip_address: ip })
            )
            .catch(error => {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Failed to update IP address:', error);
              }
            });
          if (process.env.NODE_ENV === 'development') {
            console.log('Nova jornada criada:', existingJourney);
          }
        } catch (createError) {
          // Desabilitar tracking silenciosamente em caso de erro
          if (process.env.NODE_ENV === 'development') {
            console.warn('User journey tracking disabled:', createError);
          }
          setIsTracking(false);
          return;
        }
      }
      
      setJourneyData(existingJourney);
      setIsTracking(true);
      
    } catch (error) {
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.warn('User journey initialization failed:', error);
      }
      setIsTracking(false);
    }
  }, []);
  
  // Função para rastrear visita de página
  const trackPageVisit = useCallback((url?: string) => {
    if (!sessionId || !isTracking) return;
    
    const currentUrl = url || window.location.href;
    const currentTime = Date.now();
    
    setJourneyData(prev => {
      if (!prev) return prev;
      
      const newPageVisit: PageVisit = {
        url: currentUrl,
        timestamp: new Date().toISOString(),
        time_spent: currentTime - pageStartTime.current
      };
      
      const updatedJourney = {
        ...prev,
        pages_visited: [...(prev.pages_visited || []), newPageVisit],
        time_on_site: Math.floor((currentTime - sessionStartTime.current) / 1000)
      };
      
      // Atualizar no Supabase (debounced) apenas se tracking estiver ativo
      setTimeout(() => {
        if (isTracking && updatedJourney.pages_visited) {
          // Garantir que os dados são serializáveis
          const safeData = {
            pages_visited: updatedJourney.pages_visited.map(page => ({
              url: String(page.url),
              timestamp: String(page.timestamp),
              time_spent: Number(page.time_spent) || 0
            })),
            time_on_site: Number(updatedJourney.time_on_site) || 0
          };
          
          getSupabaseApi().then(api =>
            api.updateUserJourney(sessionId, safeData).catch((error) => {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Failed to update user journey:', error);
              }
            })
          );
        }
      }, 1000);
      
      return updatedJourney;
    });
    
    pageStartTime.current = currentTime;
  }, [sessionId, isTracking]);
  
  // Função para rastrear simulação
  const trackSimulation = useCallback((simulationData: unknown) => {
    if (!sessionId) return;
    
    console.log('Tracking simulação:', { sessionId, simulationData });
    
    // Adicionar evento de simulação às páginas visitadas
    const simulationEvent: PageVisit = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      time_spent: 0
    };
    
    setJourneyData(prev => {
      if (!prev) return prev;
      
      const updatedJourney = {
        ...prev,
        pages_visited: [...(prev.pages_visited || []), simulationEvent]
      };
      
      // Atualizar no Supabase apenas se tracking estiver ativo
      if (isTracking && updatedJourney.pages_visited) {
        // Garantir que os dados são serializáveis
        const safeData = {
          pages_visited: updatedJourney.pages_visited.map(page => ({
            url: String(page.url),
            timestamp: String(page.timestamp),
            time_spent: Number(page.time_spent) || 0
          }))
        };
        
        getSupabaseApi().then(api =>
          api.updateUserJourney(sessionId, safeData).catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to track simulation:', error);
            }
          })
        );
      }
      
      return updatedJourney;
    });
  }, [sessionId]);
  
  // Função para atualizar tempo no site
  const updateTimeOnSite = useCallback(() => {
    if (!sessionId || !isTracking) return;
    
    const currentTime = Date.now();
    const timeOnSite = Math.floor((currentTime - sessionStartTime.current) / 1000);
    
    if (isTracking) {
      getSupabaseApi().then(api =>
        api.updateUserJourney(sessionId, {
          time_on_site: timeOnSite
        }).catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to update time on site:', error);
          }
        })
      );
    }
  }, [sessionId, isTracking]);
  
  // Atualizar tempo a cada 30 segundos
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(updateTimeOnSite, 30000);
    return () => clearInterval(interval);
  }, [isTracking, updateTimeOnSite]);
  
  // Cleanup ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateTimeOnSite();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [updateTimeOnSite]);
  
  const getJourneyData = useCallback(() => journeyData, [journeyData]);
  
  return {
    sessionId,
    isTracking,
    trackPageVisit,
    trackSimulation,
    getJourneyData,
    updateTimeOnSite
  };
}

export default useUserJourney;
