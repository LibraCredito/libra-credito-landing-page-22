import React from 'react';
import { ApiMessageAnalysis } from '@/utils/apiMessageAnalyzer';
import Limit30General from './Limit30General';
import Limit30Rural from './Limit30Rural';
import NoServiceAvailable from './NoServiceAvailable';
import ApiMessageDisplay from '../ApiMessageDisplay';

interface SmartApiMessageProps {
  analysis: ApiMessageAnalysis;
  valorImovel: number;
  valorEmprestimoAtual: number;
  onAdjustValues: (novoEmprestimo: number, isRural?: boolean) => void;
  onTryAgain: () => void;
}

/**
 * Componente inteligente que renderiza a mensagem adequada baseada na análise da API
 */
const SmartApiMessage: React.FC<SmartApiMessageProps> = ({
  analysis,
  valorImovel,
  valorEmprestimoAtual,
  onAdjustValues,
  onTryAgain
}) => {
  switch (analysis.type) {
    case 'limit_30_general':
      return (
        <Limit30General
          cidade={analysis.cidade || 'cidade informada'}
          valorSugerido={analysis.valorSugerido || 0}
          valorImovel={valorImovel}
          onAdjustValues={onAdjustValues}
          onTryAgain={onTryAgain}
        />
      );
      
    case 'limit_30_rural':
      return (
        <Limit30Rural
          cidade={analysis.cidade || 'cidade informada'}
          valorSugerido={analysis.valorSugerido || 0}
          valorImovel={valorImovel}
          valorEmprestimoAtual={valorEmprestimoAtual}
          onAdjustValues={onAdjustValues}
          onTryAgain={onTryAgain}
        />
      );
      
    case 'no_service':
      return (
        <NoServiceAvailable
          cidade={analysis.cidade || 'cidade informada'}
          onTryAnotherCity={onTryAgain}
        />
      );
      
    case 'unknown_error':
    default:
      // Fallback para mensagens não reconhecidas
      return (
        <ApiMessageDisplay
          message={analysis.originalMessage}
          type="error"
          onRetry={onTryAgain}
          showRetryButton={true}
        />
      );
  }
};

export default SmartApiMessage;
