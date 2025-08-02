import React, { useState } from 'react';
import Wheat from 'lucide-react/dist/esm/icons/wheat';
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface Limit30RuralProps {
  cidade: string;
  valorSugerido: number;
  valorImovel: number;
  onAdjustValues: (novoEmprestimo: number, isRural: boolean) => void;
  onTryAgain: () => void;
}

/**
 * Componente para quando a cidade aceita apenas imóveis rurais com limite 30%
 */
const Limit30Rural: React.FC<Limit30RuralProps> = ({
  cidade,
  valorSugerido,
  valorImovel,
  onAdjustValues,
  onTryAgain
}) => {
  const isMobile = useIsMobile();
  const [isRuralConfirmed, setIsRuralConfirmed] = useState(false);
  
  // CORRIGIDO: Calcular 30% do valor do IMÓVEL, não do empréstimo
  const valor30PercentImovel = Math.floor(valorImovel * 0.3);
  // Usar o valor sugerido da API se disponível, senão usar o cálculo
  const valorMaximoEmprestimo = valorSugerido || valor30PercentImovel;

  const handleAdjustClick = () => {
    if (isRuralConfirmed) {
      // Ajustar o valor do EMPRÉSTIMO para o máximo permitido
      onAdjustValues(valorMaximoEmprestimo, true);
    }
  };

  return (
    <div data-api-message="true" className={`bg-green-50 border border-green-200 rounded-lg ${isMobile ? 'p-3 mx-2' : 'p-4'} max-w-full overflow-hidden`}>
      <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
        <div className={`bg-green-100 ${isMobile ? 'p-1.5' : 'p-2'} rounded-full flex-shrink-0`}>
          <Wheat className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-green-900 ${isMobile ? 'mb-1' : 'mb-2'} flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
            <MapPin className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
            <span className="truncate">Empréstimo Rural em {cidade}</span>
          </h3>
          
          <div className={`text-green-800 ${isMobile ? 'text-xs' : 'text-sm'} mb-3`}>
            <p className={`${isMobile ? 'mb-1' : 'mb-2'} leading-relaxed`}>
              Na cidade de <strong>{cidade}</strong>, aceitamos apenas <strong>imóveis rurais 
              produtivos e georreferenciados</strong> como garantia, com limite de 
              <strong> 30% do valor do imóvel</strong>.
            </p>
            
            <div className={`bg-white rounded ${isMobile ? 'p-2' : 'p-3'} border border-green-100 mb-3`}>
              <div className={`flex items-center gap-2 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                <Calculator className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-600 flex-shrink-0`} />
                <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Cálculo para seu imóvel:</span>
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} space-y-1`}>
                <div className="break-words">Valor do imóvel: <strong>R$ {valorImovel.toLocaleString('pt-BR')}</strong></div>
                <div className="break-words">Máximo para empréstimo (30%): <strong>R$ {valorMaximoEmprestimo.toLocaleString('pt-BR')}</strong></div>
              </div>
            </div>
            
            {/* Checkbox para confirmar imóvel rural */}
            <div className={`bg-green-100 rounded ${isMobile ? 'p-2' : 'p-3'} border border-green-200`}>
              <label className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'} cursor-pointer`}>
                <input
                  type="checkbox"
                  checked={isRuralConfirmed}
                  onChange={(e) => setIsRuralConfirmed(e.target.checked)}
                  className={`mt-1 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-600 rounded focus:ring-green-500 flex-shrink-0`}
                />
                <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                  <div className={`font-medium text-green-900 ${isMobile ? 'mb-0.5' : 'mb-1'}`}>
                    Confirmo que meu imóvel é rural
                  </div>
                  <div className="text-green-700 leading-relaxed">
                    O imóvel é <strong>rural, produtivo e georreferenciado</strong>, 
                    atendendo aos requisitos para empréstimo nesta cidade.
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'gap-2'}`}>
            <Button
              onClick={handleAdjustClick}
              disabled={!isRuralConfirmed}
              className={`flex items-center justify-center gap-2 ${isMobile ? 'w-full text-xs' : ''} ${
                isRuralConfirmed 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              size={isMobile ? "sm" : "sm"}
            >
              {isRuralConfirmed && <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />}
              <Calculator className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
              <span className="truncate">
                {isMobile ? `Continuar com R$ ${(valorMaximoEmprestimo / 1000).toFixed(0)}k` : `Continuar com R$ ${valorMaximoEmprestimo.toLocaleString('pt-BR')}`}
              </span>
            </Button>
            
            <Button
              onClick={onTryAgain}
              variant="outline"
              className={`border-green-300 text-green-700 hover:bg-green-50 ${isMobile ? 'w-full text-xs' : ''}`}
              size={isMobile ? "sm" : "sm"}
            >
              Tentar Outra Cidade
            </Button>
          </div>
          
          {!isRuralConfirmed && (
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-green-600 mt-2`}>
              É necessário confirmar que o imóvel é rural para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Limit30Rural;
