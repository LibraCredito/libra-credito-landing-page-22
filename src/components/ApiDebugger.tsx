import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Componente temporário para debug da API
 * Remove este componente após identificar o problema
 */
const ApiDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiCall = async (cidade: string) => {
    setLoading(true);
    setDebugInfo(null);

    const payload = {
      vlr_imovel: 5000000.0,
      valor_solicitado: 1000000.0,
      juros: 1.09,
      carencia: 2,
      amortizacao: "SAC",
      numero_parcelas: 36,
      cidade: cidade
    };

    try {
      console.log('🔍 Debug: Testando API com', cidade);
      
      const apiUrl = import.meta.env.VITE_SIMULATION_API_URL || 'https://api-calculos.vercel.app/simulacao';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      const analysis = {
        payload,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        responseData: data,
        dataType: typeof data,
        isObject: typeof data === 'object' && data !== null,
        isString: typeof data === 'string',
        isArray: Array.isArray(data),
        hasParcelasProperty: data && typeof data === 'object' && 'parcelas' in data,
        parcelasIsArray: data?.parcelas ? Array.isArray(data.parcelas) : false,
        parcelasLength: data?.parcelas?.length || 0,
        hasMessageFields: {
          message: data?.message !== undefined,
          erro: data?.erro !== undefined,
          error: data?.error !== undefined,
          msg: data?.msg !== undefined,
          mensagem: data?.mensagem !== undefined,
          detail: data?.detail !== undefined,
          details: data?.details !== undefined
        },
        objectKeys: (typeof data === 'object' && data !== null) ? Object.keys(data) : [],
        wouldBeConsideredError: (() => {
          if (typeof data === 'string') return true;
          if (data && typeof data === 'object') {
            if (data.parcelas && Array.isArray(data.parcelas) && data.parcelas.length > 0) return false;
            if (data.message || data.erro || data.error || data.msg || data.mensagem || data.detail || data.details) return true;
            return true;
          }
          return true;
        })()
      };
      
      setDebugInfo(analysis);
      
    } catch (error) {
      setDebugInfo({
        error: true,
        errorType: error.constructor.name,
        errorMessage: error.message,
        payload
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">🔧 Debug da API (Remover depois)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            onClick={() => testApiCall('São Paulo - SP')}
            disabled={loading}
            size="sm"
            className="mr-2"
          >
            Testar SP (Deve funcionar)
          </Button>
          
          <Button 
            onClick={() => testApiCall('Ribeira do Piauí - PI')}
            disabled={loading}
            size="sm"
            className="mr-2"
          >
            Testar Ribeira do Piauí (Problema)
          </Button>
          
          <Button 
            onClick={() => testApiCall('Cidade Inexistente - ZZ')}
            disabled={loading}
            size="sm"
          >
            Testar Cidade Inválida
          </Button>
        </div>
        
        {loading && (
          <div className="mt-3 text-sm text-yellow-700">🔄 Testando API...</div>
        )}
        
        {debugInfo && (
          <div className="mt-3 p-3 bg-white rounded border text-xs">
            <div className="font-mono">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiDebugger;
