import React, { useEffect, useState } from 'react';
import { Shield, MapPin, Award } from 'lucide-react';

const TrustBarMinimal: React.FC = () => {
  const [counters, setCounters] = useState({
    cities: 0,
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

    const element = document.getElementById('trustbar');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targets = {
      cities: 3000,
      satisfaction: 98,
      years: 5
    };

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

    return () => clearInterval(timer);
  }, [isVisible]);

  const trustStats = [
    {
      icon: MapPin,
      value: counters.cities.toLocaleString('pt-BR'),
      suffix: '+',
      label: 'Cidades Atendidas'
    },
    {
      icon: Award,
      value: counters.satisfaction,
      suffix: '%',
      label: 'Satisfação'
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
      className="py-6 md:py-8 bg-gradient-to-b from-[#003399] to-white relative"
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
                  <div className="text-lg md:text-2xl font-bold text-white leading-none">
                    {stat.value}
                    <span className="text-[#00ccff] font-bold bg-white/10 px-1 rounded text-sm md:text-xl">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm font-medium text-white/80 mt-0.5">
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