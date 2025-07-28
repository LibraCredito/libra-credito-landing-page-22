import React, { useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobileContext';

// Critical components - NOT lazy loaded for LCP
import HeroPremium from '@/components/HeroPremium';
import TrustBarMinimal from '@/components/TrustBarMinimal';
import WaveSeparator from '@/components/ui/WaveSeparator';
import LogoBand from '@/components/LogoBand';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Lazy loading dos componentes pesados - com threshold otimizado
const Benefits = lazy(() => import('@/components/Benefits'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const MediaSection = lazy(() => import('@/components/MediaSection'));
const FAQ = lazy(() => import('@/components/FAQ'));
const BlogSection = lazy(() => import('@/components/BlogSection'));


const Index: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Meta Title otimizado - 58 caracteres
    document.title = "Home Equity Libra Crédito | Garantia Imóvel 1,19% a.m";
    
    // Meta Description otimizada - 155 caracteres
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Crédito com garantia de imóvel (Home Equity) da Libra: taxa mínima 1,19% a.m., até 180 meses. Simule grátis e libere até 50% do valor do imóvel.');
    }
  }, []);

  const goToQuemSomos = () => {
    navigate('/quem-somos');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        id="main-content"
        data-has-header="true"
        className="flex-grow pt-header"
      >
        {/* Faixa Separadora Superior Invertida - Ondas para baixo */}
        <WaveSeparator variant="hero" height="md" inverted />
        
        <HeroPremium />
      
      {/* Faixa Separadora com Ondas - Apenas adicionada, sem alterar o resto */}
      <WaveSeparator variant="hero" height="md" />
      
      <TrustBarMinimal />
      
      <Suspense fallback={null}>
        <Benefits />
      </Suspense>

      {/* Faixa azul com logo - apenas para desktop */}
      {!isMobile && <LogoBand />}

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      
      <WaveSeparator variant="hero" height="md" />
      
      <Suspense fallback={null}>
        <MediaSection />
      </Suspense>
      
      <WaveSeparator variant="hero" height="md" inverted />
      
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
      
      {/* Wave separator acima do botão Conheça a Libra */}
      <WaveSeparator variant="hero" height="md" />
      
      {/* Botão Conheça a Libra - Desktop / Faixa azul clicável - Mobile */}
      {!isMobile ? (
        <section 
          className="py-8"
          style={{ backgroundColor: '#003399' }}
          aria-label="Conheça mais sobre a Libra Crédito"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center">
              <Button 
                onClick={goToQuemSomos}
                className="min-h-[48px] min-w-[200px] bg-white text-[#003399] hover:bg-gray-50 border-0"
                size="xl"
                aria-label="Clique para conhecer mais sobre a Libra Crédito"
              >
                Conheça a Libra
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section 
          className="w-full bg-[#003399] flex justify-center py-8 cursor-pointer hover:bg-[#002277] transition-colors"
          onClick={goToQuemSomos}
          aria-label="Clique para conhecer mais sobre a Libra Crédito"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goToQuemSomos();
            }
          }}
        >
          <div className="flex items-center px-4 max-w-full">
            <img
              src="/images/logos/libra-logo.png"
              alt="Libra Crédito"
              className="h-12 sm:h-16 w-auto flex-shrink-0"
            />
            <span className="ml-3 sm:ml-4 text-white text-sm sm:text-base font-semibold leading-tight text-center flex-1 min-w-0">
              Crédito justo, equilibrado e consciente!
            </span>
          </div>
        </section>
      )}
      
      <WaveSeparator variant="hero" height="md" inverted />
      
      <Suspense fallback={null}>
        <BlogSection />
      </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;