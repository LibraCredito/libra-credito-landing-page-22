import React from 'react';
import MobileLayout from '@/components/MobileLayout';
import ImageOptimizer from '@/components/ImageOptimizer';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { Button } from '@/components/ui/button';
import Users from 'lucide-react/dist/esm/icons/users';
import Target from 'lucide-react/dist/esm/icons/target';
import Award from 'lucide-react/dist/esm/icons/award';
import Shield from 'lucide-react/dist/esm/icons/shield';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Seo from '@/components/Seo';

const QuemSomos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Quem Somos - Libra Crédito',
    description:
      'Conheça a Libra Crédito: nossa história, missão e valores. Especialistas em empréstimo com garantia de imóvel.',
  };

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
      <Seo
        title="Quem Somos | Libra Crédito | Nossa História e Missão"
        description="Conheça a Libra Crédito: nossa história, missão e valores. Especialistas em empréstimo com garantia de imóvel."
        jsonLd={aboutJsonLd}
        schemaId="about-schema"
      />
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
                    src="/images/media/time-libra.webp"
                    alt="Equipe especialista Libra Crédito em home equity e garantia de imóvel"
                    className="rounded-lg shadow-xl"
                    aspectRatio={16/9}
                    width={2048}
                    height={1106}
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
                  src="/images/media/timelibra2.webp"
                  alt="Libra Crédito - Quem Somos"
                  className="rounded-xl shadow-lg w-full"
                  aspectRatio={1600/1066}
                  width={1600}
                  height={1066}
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
                className="bg-red-600 text-white hover:bg-red-700 font-semibold px-8 py-3 text-lg"
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
