import { useRef, useCallback } from 'react';

let workerInstance: Worker | null = null;
let messageId = 0;
const pendingMessages = new Map<number, { resolve: Function; reject: Function }>();

/**
 * Hook para usar Web Worker para processamento de cidades
 * Reduz Script Evaluation na main thread
 */
export function useCityWorker() {
  const workerRef = useRef<Worker | null>(null);

  // Inicializa worker apenas uma vez
  const getWorker = useCallback(() => {
    if (!workerInstance && typeof Worker !== 'undefined') {
      workerInstance = new Worker('/city-worker.js');
      
      workerInstance.onmessage = (e) => {
        const { id, success, result, error } = e.data;
        const pending = pendingMessages.get(id);
        
        if (pending) {
          pendingMessages.delete(id);
          if (success) {
            pending.resolve(result);
          } else {
            pending.reject(new Error(error));
          }
        }
      };
      
      workerInstance.onerror = (error) => {
        console.error('City Worker error:', error);
      };
    }
    
    return workerInstance;
  }, []);

  // Função helper para enviar mensagens para o worker
  const sendMessage = useCallback((type: string, payload: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const worker = getWorker();
      
      if (!worker) {
        // Fallback: execução na main thread se Worker não disponível
        reject(new Error('Worker not available'));
        return;
      }

      const id = ++messageId;
      pendingMessages.set(id, { resolve, reject });
      
      worker.postMessage({ id, type, payload });
      
      // Timeout para evitar promises pendentes
      setTimeout(() => {
        if (pendingMessages.has(id)) {
          pendingMessages.delete(id);
          reject(new Error('Worker timeout'));
        }
      }, 5000);
    });
  }, [getWorker]);

  const searchCities = useCallback(async (searchTerm: string): Promise<string[]> => {
    try {
      return await sendMessage('SEARCH_CITIES', { searchTerm });
    } catch (error) {
      console.warn('Worker search failed, using fallback');
      // Fallback para a implementação original se worker falhar
      const { searchCities: fallbackSearch } = await import('@/utils/cityLtvService');
      return fallbackSearch(searchTerm);
    }
  }, [sendMessage]);

  const validateCity = useCallback(async (cityName: string) => {
    try {
      return await sendMessage('VALIDATE_CITY', { cityName });
    } catch (error) {
      console.warn('Worker validation failed, using fallback');
      // Fallback para a implementação original se worker falhar
      const { validateCity: fallbackValidate } = await import('@/utils/cityLtvService');
      return fallbackValidate(cityName);
    }
  }, [sendMessage]);

  return {
    searchCities,
    validateCity,
    isWorkerSupported: typeof Worker !== 'undefined'
  };
}