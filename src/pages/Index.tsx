import React, { useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/MobileLayout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useIsMobile } from '@/hooks/use-mobile';

// Hero não deve ser lazy loaded pois contém o LCP
import HeroPremium from '@/components/HeroPremium';
import TrustBarMinimal from '@/components/TrustBarMinimal';
import WaveSeparator from '@/components/ui/WaveSeparator';
import LogoBand from '@/components/LogoBand';

// Lazy loading dos componentes pesados
const Benefits = lazy(() => import('@/components/Benefits'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const MediaSection = lazy(() => import('@/components/MediaSection'));
const FAQ = lazy(() => import('@/components/FAQ'));
const BlogSection = lazy(() => import('@/components/BlogSection'));

// Componente de fallback para lazy loading
const SectionLoader: React.FC = () => (
  <div className="w-full h-[300px] flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

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
    <MobileLayout>
      {/* Faixa Separadora Superior Invertida - Ondas para baixo */}
      <WaveSeparator variant="hero" height="md" inverted />
      
      <HeroPremium />
      
      {/* Faixa Separadora com Ondas - Apenas adicionada, sem alterar o resto */}
      <WaveSeparator variant="hero" height="md" />
      
      <TrustBarMinimal />
      
      <Suspense fallback={<SectionLoader />}>
        <Benefits />
      </Suspense>

      {/* Faixa azul com logo - apenas para desktop */}
      {!isMobile && <LogoBand />}

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
      
      <WaveSeparator variant="hero" height="md" />
      
      <Suspense fallback={<SectionLoader />}>
        <MediaSection />
      </Suspense>
      
      <WaveSeparator variant="hero" height="md" inverted />
      
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      
      {/* Botão Conheça a Libra */}
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
      
      <WaveSeparator variant="hero" height="md" inverted />
      
      <Suspense fallback={<SectionLoader />}>
        <BlogSection />
      </Suspense>
    </MobileLayout>
  );
};

export default Index;