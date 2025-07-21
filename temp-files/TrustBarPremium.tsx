import React, { useEffect, useState } from 'react';
import { Shield, Users, TrendingUp, Award, CheckCircle, Star } from 'lucide-react';
import PremiumCard from './ui/PremiumCard';

const TrustBarPremium: React.FC = () => {
  const [counters, setCounters] = useState({
    clients: 0,
    loans: 0,
    satisfaction: 0,
    years: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  // Animação de contador
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('trustbar-premium');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targets = {
      clients: 50000,
      loans: 5000,
      satisfaction: 98,
      years: 15
    };

    const duration = 2000; // 2 segundos
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        clients: Math.round(targets.clients * progress),
        loans: Math.round(targets.loans * progress),
        satisfaction: Math.round(targets.satisfaction * progress),
        years: Math.round(targets.years * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  const trustStats = [
    {
      icon: Users,
      value: counters.clients.toLocaleString('pt-BR'),
      suffix: '+',
      label: 'Clientes Atendidos',
      color: 'blue',
      description: 'Famílias realizaram seus sonhos'
    },
    {
      icon: TrendingUp,
      value: `R$ ${counters.loans}`,
      suffix: 'M+',
      label: 'Em Empréstimos',
      color: 'green',
      description: 'Valor total já liberado'
    },
    {
      icon: Star,
      value: counters.satisfaction,
      suffix: '%',
      label: 'Satisfação',
      color: 'yellow',
      description: 'Dos clientes recomendam'
    },
    {
      icon: Award,
      value: counters.years,
      suffix: ' anos',
      label: 'De Experiência',
      color: 'purple',
      description: 'Consolidados no mercado'
    }
  ];

  const certifications = [
    {
      icon: Shield,
      title: 'Certificação Bacen',
      description: 'Autorizada pelo Banco Central'
    },
    {
      icon: CheckCircle,
      title: 'Selo de Confiança',
      description: 'Empresa verificada'
    },
    {
      icon: Award,
      title: 'Top Rated 2024',
      description: 'Melhor avaliação do setor'
    }
  ];

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <section 
      id="trustbar-premium"
      className="py-16 bg-blue-600 relative overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Confiança que{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transforma Vidas
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mais de uma década ajudando brasileiros a realizarem seus sonhos com segurança e transparência
          </p>
        </div>

        {/* Grid de estatísticas premium */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustStats.map((stat, index) => (
            <PremiumCard
              key={index}
              variant="glass"
              hover="lift"
              glowColor={stat.color as any}
              className="p-6 text-center bg-white/70 backdrop-blur-md border-white/40 rounded-2xl"
            >
              <div className="space-y-4">
                {/* Ícone */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-white rounded-xl flex items-center justify-center shadow-lg">
                    <stat.icon className={`w-6 h-6 ${iconColors[stat.color as keyof typeof iconColors]}`} />
                  </div>
                </div>

                {/* Valor animado */}
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.value}
                    <span className={`${iconColors[stat.color as keyof typeof iconColors]} font-semibold`}>
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {stat.description}
                  </div>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* Certificações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <PremiumCard
              key={index}
              variant="solid"
              hover="glow"
              glowColor="blue"
              className="p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <cert.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {cert.description}
                  </p>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* Call to action adicional */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Empresa 100% Regulamentada pelo Banco Central</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBarPremium;