
import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import SimulationForm from '@/components/SimulationForm';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { useIsMobile } from '@/hooks/use-mobile';
import scrollToTarget from '@/utils/scrollToTarget';

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

  useEffect(() => {
    if (!isMobile) {
      const frame = requestAnimationFrame(() => {
        const card = document.getElementById('simulation-card');
        const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;
        const cardHeader = card?.querySelector('[data-sim-card-header="true"]') as HTMLElement | null;
        if (cardHeader) {
          scrollToTarget(cardHeader, -headerHeight);

        }
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isMobile]);

  return (
    <MobileLayout>
      <WaveSeparator variant="hero" height="md" inverted />
      <div className="bg-white">
        <SimulationForm />
      </div>
    </MobileLayout>
  );
};

export default Simulacao;
