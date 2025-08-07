
import React, { useEffect, useRef, useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { useIsMobile } from '@/hooks/use-mobile';
import scrollToTarget from '@/utils/scrollToTarget';
import LazySection from '@/components/LazySection';

const SimulationForm = lazy(() => import('@/components/SimulationForm'));
const Footer = lazy(() => import('@/components/Footer'));

interface LazySectionProps {
  load: () => Promise<{ default: React.ComponentType<unknown> }>;
}

const LazySection: React.FC<LazySectionProps> = ({ load }) => {
  const [Component, setComponent] = useState<React.ComponentType<unknown> | null>(
    null,
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadRef.current().then(({ default: Loaded }) => {
            setComponent(() => Loaded);
          });
          obs.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{Component ? <Component /> : null}</div>;
};

const Simulacao = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Meta Title otimizado para simulação - 59 caracteres
    document.title = 'Simulação Home Equity | Libra Crédito Garantia Imóvel';

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
    <MobileLayout showHeader={false} showFooter={false}>
      <LazySection load={() => import('@/components/Header')} />
      <WaveSeparator variant="hero" height="md" inverted />
      <div className="bg-white lg:flex lg:justify-center">
        <SimulationForm />
      </div>
      <LazySection load={() => import('@/components/Footer')} />

    </MobileLayout>
  );
};

export default Simulacao;
