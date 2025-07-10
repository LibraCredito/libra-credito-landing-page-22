import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PremiumButton from '@/components/ui/PremiumButton';
import { ChevronDown, Shield, Star, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptimizedYouTube from './OptimizedYouTube';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroPremium: React.FC = () => {
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
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
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
      {/* Background Premium com Gradientes Dinâmicos */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Gradiente overlay premium */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-800/30"></div>
        
        {/* Elementos flutuantes de fundo */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-300/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern sutil */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen flex items-center pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Lado Esquerdo - Conteúdo */}
            <div className="text-white space-y-6 lg:space-y-8">
              
              {/* Badge Premium */}
              <FloatingElement delay={200}>
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    #1 em Crédito Imobiliário
                  </span>
                </div>
              </FloatingElement>

              {/* Título Premium */}
              <FloatingElement delay={400}>
                <h1 
                  id="hero-heading"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  <span className="block text-white">
                    Empréstimo com
                  </span>
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                    Garantia Real
                  </span>
                  <span className="block text-white text-2xl md:text-3xl lg:text-4xl font-medium mt-2">
                    As melhores taxas do Brasil
                  </span>
                </h1>
              </FloatingElement>

              {/* Descrição Premium */}
              <FloatingElement delay={600}>
                <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-lg">
                  <span className="font-semibold text-white">Até R$ 5 milhões</span> com taxas a partir de{' '}
                  <span className="font-bold text-yellow-400">0,99% ao mês</span>.{' '}
                  <span className="block mt-2 text-blue-200">
                    Análise em 24h, sem burocracia.
                  </span>
                </p>
              </FloatingElement>

              {/* Trust Indicators Premium */}
              <FloatingElement delay={800}>
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>100% Seguro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>4.9/5 Avaliação</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>+50mil Clientes</span>
                  </div>
                </div>
              </FloatingElement>

              {/* CTAs Premium */}
              <FloatingElement delay={1000}>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <PremiumButton 
                    onClick={scrollToSimulator}
                    className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Simular Agora</span>
                      <ChevronDown className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </PremiumButton>
                  
                  <Button 
                    onClick={goToVantagens}
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Ver Vantagens
                  </Button>
                </div>
              </FloatingElement>

              {/* Garantia Premium */}
              <FloatingElement delay={1200}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 inline-block">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Aprovação Garantida</p>
                      <p className="text-xs text-blue-200">Para imóveis próprios quitados</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>

            {/* Lado Direito - Vídeo Premium */}
            <FloatingElement delay={600} className="relative">
              <div className="relative group">
                {/* Container do vídeo com efeitos premium */}
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
                  
                  {/* Badge de qualidade */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ✓ Aprovado pelo Bacen
                    </div>
                  </div>

                  {/* Vídeo otimizado */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <OptimizedYouTube
                      videoId="dQw4w9WgXcQ" // Substitua pelo ID do seu vídeo
                      title="Libra Crédito - Como Funciona"
                      className="w-full aspect-video"
                    />
                    
                    {/* Overlay de hover premium */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Indicadores de confiança embaixo do vídeo */}
                  <div className="flex justify-center space-x-6 mt-6 text-sm text-white/80">
                    <div className="text-center">
                      <div className="font-bold text-lg text-yellow-400">2 min</div>
                      <div>Análise Rápida</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-green-400">24h</div>
                      <div>Aprovação</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-blue-400">0,99%</div>
                      <div>Taxa ao mês</div>
                    </div>
                  </div>
                </div>

                {/* Efeitos decorativos flutuantes */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </FloatingElement>
          </div>

          {/* Scroll Indicator Premium */}
          <FloatingElement delay={1400}>
            <div className="flex justify-center mt-12 lg:mt-16">
              <button
                onClick={scrollToBenefits}
                className="group flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll para ver mais informações"
              >
                <span className="text-sm font-medium">Descubra mais</span>
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors">
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

export default HeroPremium;