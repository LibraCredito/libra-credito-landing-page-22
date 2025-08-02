import React from 'react';
import Info from 'lucide-react/dist/esm/icons/info';
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface Limit30GeneralProps {
  cidade: string;
  valorSugerido: number;
  valorImovel: number;
  onAdjustValues: (novoEmprestimo: number) => void;
  onTryAgain: () => void;
}

/**
 * Componente para quando a cidade tem limite de 30% geral
 */
const Limit30General: React.FC<Limit30GeneralProps> = ({
  cidade,
  valorSugerido,
  valorImovel,
  onAdjustValues,
  onTryAgain
}) => {
  const isMobile = useIsMobile();
  
  // CORRIGIDO: Calcular 30% do valor do IMÓVEL, não do empréstimo
  const valor30PercentImovel = Math.floor(valorImovel * 0.3);
  // Usar o valor sugerido da API se disponível, senão usar o cálculo
  const valorMaximoEmprestimo = valorSugerido || valor30PercentImovel;

  const handleAdjustClick = () => {
    // Ajustar o valor do EMPRÉSTIMO para o máximo permitido
    onAdjustValues(valorMaximoEmprestimo);
  };

  return (
    <div data-api-message="true" className={`bg-libra-blue/10 border border-libra-blue/20 rounded-lg ${isMobile ? 'p-3 mx-2' : 'p-4'} max-w-full overflow-hidden`}>
      <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
        <div className={`bg-libra-blue/20 ${isMobile ? 'p-1.5' : 'p-2'} rounded-full flex-shrink-0`}>
          <Info className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-libra-blue`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-libra-navy ${isMobile ? 'mb-1' : 'mb-2'} flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
            <MapPin className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0 text-libra-blue`} />
            <span className="truncate">Limite Especial para {cidade}</span>
          </h3>

          <div className={`text-libra-blue ${isMobile ? 'text-xs' : 'text-sm'} mb-3`}>
            <p className={`${isMobile ? 'mb-1' : 'mb-2'} leading-relaxed`}>
              Na cidade de <strong>{cidade}</strong>, o valor máximo de empréstimo
              é limitado a <strong>30% do valor do imóvel</strong>.
            </p>

            <div className={`bg-white rounded ${isMobile ? 'p-2' : 'p-3'} border border-libra-blue/10`}>
              <div className={`flex items-center gap-2 ${isMobile ? 'mb-1' : 'mb-2'}`}>
                <Calculator className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-libra-blue flex-shrink-0`} />
                <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Cálculo para seu imóvel:</span>
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} space-y-1`}>
                <div className="break-words">Valor do imóvel: <strong>R$ {valorImovel.toLocaleString('pt-BR')}</strong></div>
                <div className="break-words">Máximo para empréstimo (30%): <strong>R$ {valorMaximoEmprestimo.toLocaleString('pt-BR')}</strong></div>
              </div>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'gap-2'}`}>
            <Button
              onClick={handleAdjustClick}
              className={`bg-libra-blue hover:bg-libra-navy text-white flex items-center justify-center gap-2 ${isMobile ? 'w-full text-xs' : ''}`}
              size={isMobile ? "sm" : "sm"}
            >
              <Calculator className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
              <span className="truncate">
                {isMobile ? `Ajustar para R$ ${(valorMaximoEmprestimo / 1000).toFixed(0)}k` : `Ajustar para R$ ${valorMaximoEmprestimo.toLocaleString('pt-BR')}`}
              </span>
            </Button>

            <Button
              onClick={onTryAgain}
              variant="outline"
              className={`border-libra-blue text-libra-blue hover:bg-libra-blue/10 ${isMobile ? 'w-full text-xs' : ''}`}
              size={isMobile ? "sm" : "sm"}
            >
              Tentar Outra Cidade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Limit30General;
