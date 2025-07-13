import React from 'react';
import { Button } from '@/components/ui/button';
import PremiumButton from '@/components/ui/PremiumButton';
import { ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptimizedYouTube from './OptimizedYouTube';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroPremium: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const scrollToSimulator = () => {
    navigate('/simulacao');
  };

  const goToVantagens = () => {
    navigate('/vantagens');
  };

  const scrollToBenefits = () => {
    const card = document.getElementById('capital-giro-card');
    const trustbar = document.getElementById('trustbar');
    if (card) {
      const headerOffset = window.innerWidth < 768 ? 96 : 108;
      const trustbarRect = trustbar?.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const trustbarHeight = trustbarRect ? trustbarRect.height : 0;
      const cardHeight = cardRect.height;
      const centerOffset = (window.innerHeight - cardHeight) / 2;
      const baseTarget =
        cardRect.top +
        window.pageYOffset -
        headerOffset -
        trustbarHeight -
        centerOffset;

      const isMobileView = window.innerWidth < 768;
      const additionalScroll = window.innerHeight * (isMobileView ? 0.24 : 0.2);
      const target = baseTarget + additionalScroll;

      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="min-h-[60vh] md:min-h-[65vh] lg:min-h-[65vh] xl:min-h-[calc(100vh-280px)] pb-2 bg-white relative flex flex-col justify-center"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Lado Esquerdo */}
          <div className="text-[#003399] space-y-3 md:space-y-4 lg:space-y-3 xl:space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Espaçamento extra para mobile */}
            {isMobile && <div className="h-8"></div>}
            
            <div>
                <h1
                  id="hero-heading"
                  className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight"
                >
                  <span className="block">Crédito com Garantia de Imóvel</span>
                  <span className="block">é mais simples na Libra!</span>
                </h1>
              <div className="space-y-3 md:space-y-3 lg:space-y-2">
                <p className="text-sm md:text-base lg:text-base xl:text-lg text-[#003399] leading-relaxed font-medium">
                  Crédito inteligente para quem construiu patrimônio.
                </p>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <Shield className="w-5 h-5 lg:w-5 lg:h-5 text-[#003399] flex-shrink-0" aria-hidden="true" />
                  <p className="text-xs md:text-sm lg:text-sm xl:text-base text-[#003399] leading-relaxed font-bold">
                    Atendimento Personalizado, Segurança e Transparência!
                  </p>
                </div>
                <p className="text-sm md:text-base lg:text-base xl:text-lg text-[#003399] leading-relaxed font-bold">
                  Taxas a partir de 1,19% a.m. • Até 180 meses • 100% online
                </p>
                <p className="text-lg md:text-xl lg:text-xl xl:text-2xl font-bold leading-tight">
                  Libere até 50% do valor do seu imóvel
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 lg:gap-3 md:justify-center">
              <PremiumButton
                onClick={scrollToSimulator}
                variant="primary"
                className="w-full sm:w-auto"
              >
                Simular Agora
              </PremiumButton>
              <PremiumButton
                onClick={goToVantagens}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Conheça as Vantagens
              </PremiumButton>
            </div>
          </div>

            <div className="w-full max-w-xl lg:max-w-lg xl:max-w-none mx-auto">
            <div className="hero-video">
              <OptimizedYouTube
                videoId="E9lwL6R2l1s"
                title="Vídeo institucional Libra Crédito"
                priority={true}
                className="w-full h-full"
                thumbnailSrc="/images/video-thumbnail.jpg"
              />
            </div>
          </div>
        </div>

        {/* Botão Saiba Mais */}
        <div className="flex justify-center mt-4 md:mt-4 lg:mt-2">
          <button
            onClick={scrollToBenefits}
            className="text-[#003399] flex flex-col items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
            aria-label="Rolar para benefícios"
          >
            <span className="text-sm md:text-sm lg:text-xs font-medium">Saiba mais</span>
            <ChevronDown className="w-5 h-5 md:w-5 md:h-5 lg:w-4 lg:h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroPremium;