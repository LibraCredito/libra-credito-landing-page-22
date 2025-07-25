import React, { useEffect, useState } from 'react';
import { Shield, MapPin, Clock } from 'lucide-react';

const TrustBarMinimal: React.FC = () => {
  const [counters, setCounters] = useState({
    cities: 3000,
    satisfaction: 24,
    years: 5
  });

  const [isVisible, setIsVisible] = useState(false);

  // Lazy load counter animation após LCP
  useEffect(() => {
    const initAnimation = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      const element = document.getElementById('trustbar');
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    };

    // Defer até após LCP period
    const timer = setTimeout(initAnimation, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Reset to 0 and start animation
    setCounters({ cities: 0, satisfaction: 0, years: 0 });

    const targets = {
      cities: 3000,
      satisfaction: 24,
      years: 5
    };

    requestAnimationFrame(() => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounters({
          cities: Math.round(targets.cities * progress),
          satisfaction: Math.round(targets.satisfaction * progress),
          years: Math.round(targets.years * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepDuration);
    });
  }, [isVisible]);

  const trustStats = [
    {
      icon: MapPin,
      value: counters.cities.toLocaleString('pt-BR'),
      suffix: '+',
      label: 'Cidades Atendidas'
    },
    {
      icon: Clock,
      value: counters.satisfaction,
      suffix: 'h',
      label: 'Para uma Pré-Proposta'
    },
    {
      icon: Shield,
      value: counters.years,
      suffix: '+ anos',
      label: 'De Experiência'
    }
  ];

  return (
    <section
      id="trustbar"
      className="py-[1.2rem] md:py-[1.6rem] bg-[#003399] relative scroll-mt-header"
    >
      <div className="container mx-auto px-4">
        {/* Grid de estatísticas compacto */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
          {trustStats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              {/* Layout responsivo - vertical no mobile, horizontal no desktop */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                {/* Ícone menor */}
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>

                {/* Valor e label em linha */}
                <div className="text-center md:text-left">
                  <div className="text-[0.9rem] md:text-[1.2rem] font-bold text-white leading-none">
                    {stat.value}
                    <span className="text-white font-bold text-[0.75rem] md:text-[1rem]">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-[0.75rem] md:text-[0.875rem] font-medium text-white/80 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBarMinimal;