import React from 'react';

const CGISection: React.FC = () => {
  const benefits = [
    {
      icon: "🚀",
      title: "Você pode investir em seu negócio",
      description: "com nosso capital de giro inteligente",
      bgColor: "bg-green-100",
      iconBg: "bg-green-500"
    },
    {
      icon: "🏠",
      title: "Viabilizar capital necessário para financiar aquela reforma dos sonhos",
      description: "",
      bgColor: "bg-blue-100", 
      iconBg: "bg-blue-500"
    },
    {
      icon: "💰",
      title: "Quitar suas dívidas e conquistar seu equilíbrio financeiro",
      description: "",
      bgColor: "bg-yellow-100",
      iconBg: "bg-yellow-500"
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Como usar seu <span className="text-green-500">CGI Libra?</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Literalmente do jeito que quiser!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`${benefit.bgColor} rounded-3xl p-6 text-center relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <div className="w-full h-full rounded-full border-4 border-white transform translate-x-8 -translate-y-8"></div>
              </div>
              
              {/* Icon */}
              <div className={`w-16 h-16 ${benefit.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                {benefit.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight">
                {benefit.title}
              </h3>
              {benefit.description && (
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Transforme seu imóvel em oportunidades!
            </h3>
            <p className="text-gray-600 mb-6">
              Com o CGI Libra, você tem a liberdade de usar o crédito como desejar, 
              sempre com as melhores condições do mercado.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full transition-colors">
              Simular Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGISection;