import React, { useEffect, useState } from 'react';
import PremiumButton from '@/components/ui/PremiumButton';
import OptimizedYouTube from './OptimizedYouTube';
import { cn } from '@/lib/utils';

const TEXTS = [
  'Crédito com Garantia de Imóvel',
  'Home Equity',
  'Capital de Giro Inteligente',
  'Empréstimo com Garantia de Imóvel',
  'Consolidação Estratégica de Débitos'
];

const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TEXTS.length);
        setFading(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white text-libra-navy py-12 md:py-20" aria-labelledby="hero-title">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 id="hero-title" className="text-3xl md:text-4xl font-semibold">
            <span
              className={cn(
                'inline-block transition-opacity duration-500',
                fading ? 'opacity-0' : 'opacity-100'
              )}
            >
              {TEXTS[index]}
            </span>
            , é na Libra
          </h1>
          <ul className="space-y-2 text-lg">
            <li className="flex items-center gap-2">✔️ Atendimento premium</li>
            <li className="flex items-center gap-2">✔️ 100% online</li>
            <li className="flex items-center gap-2">✔️ Taxas a partir de 1,19% a.m.</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <PremiumButton variant="primary" className="w-full sm:w-auto">
              Simular Agora
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              className="w-full sm:w-auto text-libra-navy border-libra-navy hover:bg-libra-navy hover:text-white"
            >
              Conheça as Vantagens
            </PremiumButton>
          </div>
        </div>
        <div className="w-full">
          <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
            <OptimizedYouTube
              videoId="E9lwL6R2l1s"
              title="Vídeo institucional Libra Crédito"
              priority={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
