import React from 'react';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NoServiceAvailableProps {
  cidade: string;
  onTryAnotherCity: () => void;
}

/**
 * Componente para quando não realizamos empréstimo na cidade
 */
const NoServiceAvailable: React.FC<NoServiceAvailableProps> = ({
  cidade,
  onTryAnotherCity
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg ${isMobile ? 'p-3 mx-2' : 'p-4'} max-w-full overflow-hidden`}>
      <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
        <div className={`bg-red-100 ${isMobile ? 'p-1.5' : 'p-2'} rounded-full flex-shrink-0`}>
          <XCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-600`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-red-900 ${isMobile ? 'mb-1' : 'mb-2'} flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
            <MapPin className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
            <span className="truncate">Serviço não disponível em {cidade}</span>
          </h3>
          
          <div className={`text-red-800 ${isMobile ? 'text-xs' : 'text-sm'} mb-4`}>
            <p className={`${isMobile ? 'mb-2' : 'mb-3'} leading-relaxed`}>
              Infelizmente, ainda <strong>não realizamos empréstimos com garantia 
              de imóvel</strong> na cidade de <strong>{cidade}</strong>.
            </p>
            
            <div className={`bg-white rounded ${isMobile ? 'p-2' : 'p-3'} border border-red-100`}>
              <h4 className={`font-medium text-red-900 ${isMobile ? 'mb-1' : 'mb-2'} ${isMobile ? 'text-xs' : 'text-sm'}`}>Alternativas disponíveis:</h4>
              <ul className={`${isMobile ? 'text-xs' : 'text-sm'} space-y-1 text-red-700`}>
                <li>• Verificar se há outras cidades próximas onde atuamos</li>
                <li>• Aguardar expansão dos nossos serviços para sua região</li>
                <li>• Entrar em contato para mais informações sobre disponibilidade</li>
              </ul>
            </div>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'gap-2'}`}>
            <Button
              onClick={onTryAnotherCity}
              className={`bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 ${isMobile ? 'w-full text-xs' : ''}`}
              size={isMobile ? "sm" : "sm"}
            >
              <Search className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
              Tentar Outra Cidade
            </Button>
            
            <Button
              variant="outline"
              className={`border-red-300 text-red-700 hover:bg-red-50 ${isMobile ? 'w-full text-xs' : ''}`}
              size={isMobile ? "sm" : "sm"}
              onClick={() => window.open('/contato', '_blank')}
            >
              Entrar em Contato
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoServiceAvailable;
