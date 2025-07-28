import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import ImageOptimizer from '@/components/ImageOptimizer';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Shield, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const QuemSomos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "Quem Somos | Libra Crédito | Nossa História e Missão";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Conheça a Libra Crédito: nossa história, missão e valores. Especialistas em empréstimo com garantia de imóvel.');
    }
  }, []);

  const handleSimular = () => {
    navigate('/simulacao');
  };

  const valores = [
    {
      icon: TrendingUp,
      title: "Ser Melhor que Ontem",
      description: "Buscamos evolução contínua, visando inovação e excelência em todos os serviços que oferecemos."
    },
    {
      icon: Shield,
      title: "Honestidade",
      description: "Operamos com total honestidade e transparência em todas as nossas relações."
    },
    {
      icon: Target,
      title: "Cumprir o que Prometer",
      description: "Nossa palavra é nossa garantia. Cumprimos rigorosamente todos os nossos compromissos."
    },
    {
      icon: Users,
      title: "Humildade",
      description: "Mantemos a humildade como base de nossas relações e crescimento contínuo."
    },
    {
      icon: Award,
      title: "Orgulho de Pertencer",
      description: "Temos orgulho de fazer parte do Grupo Construtora Stéfani e de nossa trajetória."
    }
  ];

  return (
    <MobileLayout>
      <WaveSeparator variant="hero" height="md" inverted />
      <div className="bg-white">
        {/* Quem Somos e Nossa História lado a lado */}
        <section className="py-3 lg:py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-libra-navy mb-2 lg:mb-3">
                  Quem Somos
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600">
                  A Libra Crédito é uma fintech que nasceu para criar oportunidades de crédito justo, sustentável e equilibrado.
                </p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-libra-navy mt-4 mb-2">Nossa História</h2>
                <p className="text-base md:text-lg text-gray-600">
                  Somos do <a href="https://www.construtorastefani.com.br/" target="_blank" rel="noopener noreferrer" className="text-libra-blue hover:text-libra-navy transition-colors">Grupo Construtora Stéfani</a> e agregamos em nossos serviços todo o know-how, experiência e solidez adquiridos ao longo de mais de 40 anos de história no mercado imobiliário.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Clique aqui e entenda as <Link to="/vantagens" className="text-libra-blue hover:text-libra-navy transition-colors">vantagens</Link> que oferecemos para equiLIBRAr a sua vida financeira.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Faça uma <Link to="/simulacao" className="text-libra-blue hover:text-libra-navy transition-colors">simulação</Link> e fale com um consultor!
                </p>
              </div>
              <div className="relative">
                <ImageOptimizer
                    src="/images/time,libra.webp"
                    alt="Equipe especialista Libra Crédito em home equity e garantia de imóvel"
                    className="rounded-lg shadow-xl"
                    aspectRatio={16/9}
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Missão - Seção unificada */}
        <WaveSeparator variant="hero" height="md" />
        <section className="py-8" style={{ backgroundColor: '#003399' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">Nossa Missão</h2>
              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                Democratizar o acesso ao crédito no Brasil, oferecendo soluções financeiras justas e transparentes que ajudem nossos clientes a realizarem seus sonhos e alcançarem a liberdade financeira.
              </p>
            </div>
          </div>
        </section>
        <WaveSeparator variant="hero" height="md" inverted />

        {/* Nossos Valores e Imagem Institucional lado a lado */}
        <section className="py-3 lg:py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Nossos Valores */}
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-libra-navy mb-3 lg:mb-4">Nossos Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                  {valores.map((valor, index) => {
                    const Icon = valor.icon;
                    return (
                      <div key={index} className="bg-white p-3 md:p-4 rounded-lg shadow-lg border border-gray-100">
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-libra-blue mr-2" />
                          <h3 className="text-base md:text-lg font-bold text-libra-navy">{valor.title}</h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Imagem Institucional */}
              <div className="relative">
                <ImageOptimizer
                  src="/images/optimized/timelibra2.webp"
                  alt="Libra Crédito - Quem Somos"
                  className="rounded-xl shadow-lg w-full"
                  aspectRatio={16/9}
                />
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-libra-navy mb-4`}>
                Conhece nossa história? Faça parte dela!
              </h2>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 mb-6`}>
                Junte-se aos milhares de clientes que já transformaram suas vidas conosco
              </p>
              <Button 
                onClick={handleSimular}
                size="lg"
                className="bg-libra-blue text-white hover:bg-libra-navy font-semibold px-8 py-3 text-lg"
              >
                Simular Agora
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default QuemSomos;
