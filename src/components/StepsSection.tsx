import React from 'react';
import { useNavigate } from 'react-router-dom';

const StepsSection: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Simulação de valores",
      description: "Faça sua simulação online e descubra quanto pode obter",
      image: "/images/hero-professional.png",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      number: "2", 
      title: "Análise de crédito",
      description: "Nossa equipe analisa seu perfil e documenta o processo",
      image: "/images/customer-testimonial.png",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      number: "3",
      title: "Avaliação do imóvel", 
      description: "Realizamos a avaliação do seu imóvel de forma rápida",
      image: "/images/hero-professional.png",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      number: "4",
      title: "Proposta final e assinatura",
      description: "Receba sua proposta final e assine digitalmente",
      image: "/images/customer-testimonial.png", 
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  const handleSimulate = () => {
    navigate('/simulacao');
  };

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Os <span className="text-libra-blue">4 passos</span> para conseguir crédito:
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`${step.bgColor} rounded-3xl p-6 relative overflow-hidden`}
            >
              {/* Step Number */}
              <div className="absolute top-4 right-4">
                <div className={`w-8 h-8 ${step.textColor.replace('text-', 'bg-')} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {step.number}
                </div>
              </div>

              {/* Content Container */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Image */}
                <div className="flex-shrink-0">
                <div className="w-24 h-18 rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`font-bold text-lg mb-2 ${step.textColor}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow to next step (except last) */}
              {index < steps.length - 1 && index % 2 === 0 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Arrow down for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-4">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-libra-blue to-blue-700 rounded-3xl px-8 py-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para começar?
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Inicie sua jornada para conseguir o crédito que você precisa com as melhores condições do mercado.
            </p>
            <button
              onClick={handleSimulate}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Começar Simulação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsSection;