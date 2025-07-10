import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PremiumButton from '@/components/ui/PremiumButton';
import { ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptimizedYouTube from './OptimizedYouTube';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroMinimal: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSimulator = () => {
    navigate('/simulacao');
  };

  const goToVantagens = () => {
    navigate('/vantagens');
  };

  const scrollToBenefits = () => {
    const trustbarSection = document.getElementById('trustbar');
    if (trustbarSection) {
      trustbarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const FloatingElement = ({ children, delay = 0, className = "" }: { 
    children: React.ReactNode; 
    delay?: number; 
    className?: string; 
  }) => (
    <div 
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  return (
    <section 
      className="min-h-screen relative overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Background Minimalista com Cores da Marca */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003399] to-[#00ccff]">
        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Elementos geométricos minimalistas */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/3 rounded-full blur-2xl"></div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen flex items-center pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Lado Esquerdo - Conteúdo Minimalista */}
            <div className="text-white space-y-8">
              
              {/* Título Original */}
              <FloatingElement delay={200}>
                <h1
                  id="hero-heading"
                  className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white"
                >
                  <span className="whitespace-nowrap">Crédito Com Garantia de Imóvel</span>
                  <br />
                  é mais simples na Libra!
                  <br />
                  Libere até 50% do valor do seu imóvel
                </h1>
              </FloatingElement>

              {/* Copy Original */}
              <FloatingElement delay={400}>
                <div className="space-y-3 md:space-y-4">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                    Crédito inteligente para quem construiu patrimonio.
                  </p>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#00ccff] flex-shrink-0" aria-hidden="true" />
                    <p className="text-base md:text-lg text-white/80 leading-relaxed font-bold">
                      Atendimento Personalizado, Segurança e Transparência!
                    </p>
                  </div>
                  <p className="text-base md:text-lg text-white/80 leading-relaxed font-bold">
                    Taxas a partir de 1,19% a.m. • Até 180 meses • 100% online
                  </p>
                </div>
              </FloatingElement>

              {/* CTAs Originais */}
              <FloatingElement delay={600}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <PremiumButton 
                    onClick={scrollToSimulator} 
                    variant="primary"
                    className="w-full sm:w-auto bg-[#00ccff] hover:bg-[#00ccff]/90 text-[#003399] font-bold shadow-lg hover:shadow-[#00ccff]/25"
                  >
                    Simular Agora
                  </PremiumButton>
                  <PremiumButton 
                    onClick={goToVantagens} 
                    variant="secondary"
                    className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 hover:border-[#00ccff] hover:text-[#00ccff]"
                  >
                    Conheça as Vantagens
                  </PremiumButton>
                </div>
              </FloatingElement>
            </div>

            {/* Lado Direito - Vídeo Original Minimalista */}
            <FloatingElement delay={400} className="relative">
              <div className="relative group">
                {/* Container do vídeo minimalista */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
                  
                  {/* Vídeo Original */}
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <OptimizedYouTube
                      videoId="E9lwL6R2l1s"
                      title="Vídeo institucional Libra Crédito"
                      priority={true}
                      className="w-full aspect-video"
                      thumbnailSrc="/images/video-thumbnail.jpg"
                    />
                  </div>

                  {/* Mensagem personalizada */}
                  <div className="text-center mt-6">
                    <p className="text-lg font-semibold text-[#00ccff]">
                      Crédito com Garantia de Imóvel - Simule Gratuitamente
                    </p>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </div>

          {/* Scroll Indicator Minimalista */}
          <FloatingElement delay={1000}>
            <div className="flex justify-center mt-16">
              <button
                onClick={scrollToBenefits}
                className="group flex flex-col items-center space-y-2 text-white/60 hover:text-[#00ccff] transition-all duration-300"
                aria-label="Scroll para ver mais informações"
              >
                <span className="text-sm font-medium">Saiba mais</span>
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-[#00ccff] transition-colors">
                  <ChevronDown className="w-4 h-4 mt-2 animate-bounce" />
                </div>
              </button>
            </div>
          </FloatingElement>
        </div>
      </div>
    </section>
  );
};

export default HeroMinimal;