import React from 'react';
import TypewriterText from './TypewriterText';
import HeroButton from '@/components/ui/HeroButton';
import { ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptimizedYouTube from './OptimizedYouTube';
import scrollToTarget from '@/utils/scrollToTarget';

const HeroPremium: React.FC = () => {
  const navigate = useNavigate();

  const alternatingTexts = [
    'Crédito com Garantia de Imóvel',
    'Home Equity',
    'Capital de Giro Inteligente',
    'Empréstimo com Garantia de Imóvel',
    'Consolidação Estratégica de Débitos',
  ];

  const scrollToSimulator = () => {
    navigate('/simulacao');
  };

  const scrollToBenefits = () => {
    const card = document.getElementById('capital-giro-card');
    const trustbar = document.getElementById('trustbar');
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
      className="min-h-[50vh] md:min-h-[45vh] lg:min-h-[50vh] xl:min-h-[calc(100vh-340px)] py-2 md:py-4 bg-white relative flex flex-col justify-center"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 items-center">
          {/* Lado Esquerdo */}
          <div className="text-[#003399] max-w-lg mx-auto space-y-2 md:space-y-3 text-center flex flex-col items-center">
            <div>
              <h1
                id="hero-heading"
                className="text-xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight"
              >
                <TypewriterText strings={alternatingTexts} />
                <span className="block text-green-700">
                  é mais simples na Libra!
                </span>
              </h1>
              <ul className="mt-1 space-y-1 md:space-y-2 text-sm md:text-base lg:text-base text-[#003399] font-medium lg:scale-[0.85]">
                <li className="flex items-center justify-center gap-2 bg-green-50 rounded-md py-1 px-2">
                  <Shield
                    className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-center">
                    Atendimento Premium, Segurança e Velocidade!
                  </span>
                </li>
                <li className="list-none">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-0 sm:pt-1 lg:scale-[0.85]">
                    <HeroButton onClick={scrollToSimulator} variant="primary">
                      Simular Agora
                    </HeroButton>
                  </div>
                </li>
                <li className="mt-1 lg:mt-2 text-sm md:text-lg lg:text-xl">
                  Taxas a partir de{' '}
                  <span className="font-bold text-green-700">1,19% a.m.</span> •
                  Até 180 meses • 100% online
                </li>
              </ul>
            </div>
          </div>

          {/* Vídeo reduzido para exibir as ondas seguintes na dobra inicial */}
          <div className="w-full max-w-md lg:w-[85%] lg:max-w-lg mx-auto lg:scale-[0.85]">
            <div className="hero-video aspect-video">
              <OptimizedYouTube
                videoId="E9lwL6R2l1s"
                title="Vídeo institucional Libra Crédito"
                priority={true}
                className="w-full h-full"
                thumbnailSrc="/images/optimized/video-thumbnail.webp"
              />
            </div>
            <p className="text-lg md:text-xl lg:text-xl text-[#003399] font-semibold mt-1 text-center lg:scale-[0.85]">
              Crédito inteligente para quem construiu patrimônio.
            </p>
          </div>
        </div>

        {/* Botão Saiba Mais */}
        <div className="flex justify-center mt-3 md:mt-5 lg:scale-[0.85]">
          <button
            onClick={scrollToBenefits}
            className="text-[#003399] flex flex-col items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
            aria-label="Rolar para benefícios"
          >
            <span className="text-sm md:text-sm lg:text-xs font-medium">
              Saiba mais
            </span>
            <ChevronDown className="w-5 h-5 md:w-5 md:h-5 lg:w-4 lg:h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroPremium;
