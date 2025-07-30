import React, { useState, useEffect, useRef } from 'react';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import { useDevice } from '@/hooks/useDevice';
import { cn } from '@/lib/utils';

interface WizardStep {
  id: string;
  title: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: (data: any) => boolean;
}

interface WizardStepProps {
  data: any;
  updateData: (updates: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

interface MobileWizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void;
  onClose?: () => void;
  initialData?: any;
  saveKey?: string; // Para salvar no localStorage
}

export const MobileWizard: React.FC<MobileWizardProps> = ({
  steps,
  onComplete,
  onClose,
  initialData = {},
  saveKey = 'wizard-data'
}) => {
  const { isMobile } = useDevice();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  
  const contentRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  // Auto-save no localStorage
  useEffect(() => {
    if (saveKey && data && Object.keys(data).length > 0) {
      localStorage.setItem(saveKey, JSON.stringify({
        data,
        currentStep,
        timestamp: Date.now()
      }));
    }
  }, [data, currentStep, saveKey]);

  // Recuperar dados salvos
  useEffect(() => {
    if (saveKey) {
      const saved = localStorage.getItem(saveKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Dados salvos há menos de 24h
          if (parsed.timestamp && Date.now() - parsed.timestamp < 86400000) {
            setData(parsed.data);
            setCurrentStep(parsed.currentStep || 0);
          }
        } catch (e) {
          console.error('Erro ao recuperar dados do wizard:', e);
        }
      }
    }
  }, [saveKey]);

  const updateData = (updates: Partial<any>) => {
    setData(prev => ({ ...prev, ...updates }));
    // Limpar erros dos campos atualizados
    const updatedKeys = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedKeys.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  };

  const handleNext = () => {
    const step = steps[currentStep];
    
    // Validação
    if (step.validation && !step.validation(data)) {
      setErrors({ general: 'Por favor, preencha todos os campos obrigatórios' });
      return;
    }

    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setSlideDirection('left');
      setCurrentStep(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      // Último step - completar
      onComplete(data);
      // Limpar dados salvos
      if (saveKey) {
        localStorage.removeItem(saveKey);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setSlideDirection('right');
      setCurrentStep(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Touch handlers para swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || isAnimating) return;
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isAnimating) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    if (contentRef.current) {
      contentRef.current.style.transform = `translateX(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || isAnimating) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 50;
    
    if (contentRef.current) {
      contentRef.current.style.transform = '';
    }
    
    if (diff > threshold && currentStep > 0) {
      handleBack();
    } else if (diff < -threshold && currentStep < steps.length - 1) {
      handleNext();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen-safe">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 safe-top">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={currentStep > 0 ? handleBack : onClose}
            className="touch-target -ml-2"
            aria-label={currentStep > 0 ? 'Voltar' : 'Fechar'}
          >
            {currentStep > 0 ? (
              <ChevronLeft className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </button>
          
          <h2 className="text-lg font-semibold flex-1 text-center px-4 truncate">
            {steps[currentStep].title}
          </h2>
          
          <div className="w-10" /> {/* Spacer para centralizar título */}
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-libra-blue transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-center items-center gap-2 py-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentStep
                  ? "w-8 bg-libra-blue"
                  : index < currentStep
                  ? "w-2 bg-libra-blue"
                  : "w-2 bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={contentRef}
          className={cn(
            "h-full overflow-y-auto transition-transform duration-300",
            isAnimating && slideDirection === 'left' && "animate-slide-left",
            isAnimating && slideDirection === 'right' && "animate-slide-right"
          )}
        >
          <div className="p-4 pb-32">
            <CurrentStepComponent
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
              errors={errors}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 safe-bottom">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="mobile-button-secondary flex-1"
              disabled={isAnimating}
            >
              Voltar
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="mobile-button-primary flex-1"
            disabled={isAnimating}
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para exibir resumo dos dados
export const WizardSummary: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Resumo da Simulação</h3>
      
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
