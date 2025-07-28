import React from 'react';
import HeroButton from '@/components/ui/HeroButton';
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
      const additionalScroll = window.innerHeight * (isMobileView ? 0.22 : 0.18);
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
          <div className="text-[#003399] space-y-4 md:space-y-5 text-center flex flex-col items-center">
            {/* Espaçamento extra para mobile */}
            {isMobile && <div className="h-4"></div>}
            
            <div>
              <h1
                id="hero-heading"
                className="text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight"
              >
                <span className="block whitespace-nowrap">Crédito com Garantia de Imóvel</span>
                <span className="block text-green-700">é mais simples na Libra!</span>
              </h1>
              <ul className="mt-2 space-y-1 text-sm md:text-base lg:text-lg text-[#003399] font-medium">
                <li className="flex items-center justify-center gap-2 bg-green-50 rounded-md py-1 px-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-center">Atendimento Premium, Segurança e Velocidade!</span>
                </li>
                <li>
                  Taxas a partir de <span className="font-bold text-green-700">1,19% a.m.</span> • Até 180 meses • 100% online
                </li>
              </ul>
              <p className="text-lg md:text-xl lg:text-2xl text-[#003399] font-semibold">
                Crédito inteligente para quem construiu patrimonio.
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-3 sm:pt-4">
              <HeroButton
                onClick={scrollToSimulator}
                variant="primary"
              >
                Simular Agora
              </HeroButton>
              <HeroButton
                onClick={goToVantagens}
                variant="secondary"
              >
                Conheça as Vantagens
              </HeroButton>
            </div>
          </div>

            <div className="w-full max-w-xl lg:max-w-lg xl:max-w-none mx-auto">
            <div className="hero-video aspect-video">
              <OptimizedYouTube
                videoId="E9lwL6R2l1s"
                title="Vídeo institucional Libra Crédito"
                priority={true}
                className="w-full h-full"
                thumbnailSrc="/images/optimized/video-thumbnail.webp"
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