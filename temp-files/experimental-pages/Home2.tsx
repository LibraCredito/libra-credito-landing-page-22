import React, { useEffect, lazy, Suspense } from 'react';
import MobileLayout from '@/components/MobileLayout';
import PremiumLoading from '@/components/ui/PremiumLoading';

// Lazy loading dos componentes do novo design
const Hero2 = lazy(() => import('@/components/Hero2'));
const BenefitsSection2 = lazy(() => import('@/components/BenefitsSection2'));
const TransparencySection = lazy(() => import('@/components/TransparencySection'));
const FAQSection2 = lazy(() => import('@/components/FAQSection2'));
const CGISection = lazy(() => import('@/components/CGISection'));
const StepsSection = lazy(() => import('@/components/StepsSection'));

const SectionLoader: React.FC = () => (
  <div className="w-full h-[200px] flex items-center justify-center">
    <PremiumLoading 
      variant="pulse" 
      size="lg" 
      color="blue" 
      text="Carregando..."
    />
  </div>
);

const Home2: React.FC = () => {
  useEffect(() => {
    document.title = "Libra Crédito | Nova Home - Empréstimo com Garantia de Imóvel";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nova experiência Libra Crédito - Empréstimo com garantia de imóvel com as melhores taxas do mercado. Simule agora e descubra quanto você pode obter.');
    }
  }, []);

  return (
    <MobileLayout>
      <Suspense fallback={<SectionLoader />}>
        <Hero2 />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <BenefitsSection2 />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TransparencySection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FAQSection2 />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CGISection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <StepsSection />
      </Suspense>
    </MobileLayout>
  );
};

export default Home2;