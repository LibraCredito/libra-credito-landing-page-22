
import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import SimulationForm from '@/components/SimulationForm';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { useIsMobile } from '@/hooks/use-mobile';

const Simulacao = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Meta Title otimizado para simulação - 59 caracteres
    document.title = "Simulação Home Equity | Libra Crédito Garantia Imóvel";
    
    // Meta Description otimizada - 154 caracteres
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Simulação gratuita de crédito com garantia de imóvel. Taxa mínima 1,19% a.m. Descubra sua parcela em segundos com nossa calculadora online.');
    }
  }, []);

  return (
    <MobileLayout>
      <WaveSeparator variant="hero" height="md" inverted />
      <div className="bg-[#33cc99]">
        <SimulationForm />
      </div>
    </MobileLayout>
  );
};

export default Simulacao;
