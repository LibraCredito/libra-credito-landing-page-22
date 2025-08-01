import React from 'react';
import TypewriterText from './TypewriterText';
import HeroButton from '@/components/ui/HeroButton';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Shield from 'lucide-react/dist/esm/icons/shield';
import { useNavigate } from 'react-router-dom';
import OptimizedYouTube from './OptimizedYouTube';
import { useIsMobile } from '@/hooks/use-mobile';
import scrollToTarget from '@/utils/scrollToTarget';

const HeroAnimated: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Textos alternantes para o título
  const alternatingTexts = [
    "Crédito com Garantia de Imóvel",
    "Home Equity",
    "Capital de Giro Inteligente",
    "Empréstimo Imobiliário",
    "Quitação de dívidas"

  ];


  const scrollToSimulator = () => {
    navigate('/simulacao');
  };

  const goToVantagens = () => {
    navigate('/vantagens');
  };

  const scrollToBenefits = () => {
    const card = document.getElementById('capital-giro-card');
    if (card) {
      const headerOffset = window.innerWidth < 768 ? 96 : 108;
      const trustbarRect = trustbar?.getBoundingClientRect();
      const trustbarHeight = trustbarRect ? trustbarRect.height : 0;
      const centerOffset =
        (window.innerHeight - card.getBoundingClientRect().height) / 2;
      const isMobileView = window.innerWidth < 768;
      const additionalScroll = window.innerHeight * (isMobileView ? 0.22 : 0.18);
      const offset = -headerOffset - trustbarHeight - centerOffset + additionalScroll;

      scrollToTarget(card as HTMLElement, offset);

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
          <div className="text-[#003399] space-y-4 md:space-y-5 text-center flex flex-col items-center animate-fade-in-up">
            {/* Espaçamento extra para mobile */}
            {isMobile && <div className="h-4"></div>}
            
            <div>
              <h1
                id="hero-heading"
                className="text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight"
              >
                <TypewriterText strings={alternatingTexts} />
                <span className="block text-green-700">é na Libra!</span>
              </h1>
              
                <p className="text-lg md:text-xl lg:text-2xl text-[#003399] font-semibold">
                  Crédito inteligente para quem construiu patrimônio.
                </p>
              <ul className="mt-2 space-y-1 text-sm md:text-base lg:text-lg text-[#003399] font-medium">
                <li className="flex items-center justify-center gap-2 bg-green-50 rounded-md py-1 px-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-center">Atendimento Personalizado, Segurança e Transparência</span>
                </li>
                <li>
                  Taxas a partir de <span className="font-bold text-green-700">1,19% a.m.</span> • Até 180 meses • 100% online
                </li>
              </ul>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-[#003399] mt-3">
                  Libere até 50% do valor do seu imóvel.
                </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-3 sm:pt-4">
              <HeroButton
                onClick={scrollToSimulator}
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
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
            <div 
              className="hero-video aspect-video" 
              style={{ 
                containIntrinsicSize: '480px 360px', 
                contain: 'strict',
                willChange: 'auto',
                transform: 'translateZ(0)'
              }}
            >
              <OptimizedYouTube
                videoId="E9lwL6R2l1s"
                title="Vídeo institucional Libra Crédito"
                priority={true}
                className="w-full h-full"
                thumbnailSrc="/images/thumbnail-libra.webp"
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

export default HeroAnimated;