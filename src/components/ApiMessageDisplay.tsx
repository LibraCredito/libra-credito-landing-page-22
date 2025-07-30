import React from 'react';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ApiMessageDisplayProps {
  message: string;
  type: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  showRetryButton?: boolean;
}

/**
 * Componente para exibir mensagens retornadas pela API
 * Pode exibir erros, avisos ou informações com visual apropriado
 */
const ApiMessageDisplay: React.FC<ApiMessageDisplayProps> = ({
  message,
  type = 'error',
  onRetry,
  showRetryButton = true
}) => {
  const isMobile = useIsMobile();
  
  const getColorClasses = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-500',
          text: 'text-red-700',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-500',
          text: 'text-yellow-700',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-500',
          text: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-500',
          text: 'text-gray-700',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`rounded-lg border ${isMobile ? 'p-3 mx-2' : 'p-4'} ${colors.container} max-w-full overflow-hidden`}>
      <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
        <AlertCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mt-0.5 flex-shrink-0 ${colors.icon}`} />
        <div className="flex-1 min-w-0">
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${colors.text} break-words leading-relaxed`}>
            {message}
          </p>
          {showRetryButton && onRetry && (
            <Button
              onClick={onRetry}
              size={isMobile ? "sm" : "sm"}
              className={`${isMobile ? 'mt-2 w-full text-xs' : 'mt-3'} ${colors.button} text-white flex items-center justify-center gap-2`}
            >
              <RefreshCw className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} />
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiMessageDisplay;
