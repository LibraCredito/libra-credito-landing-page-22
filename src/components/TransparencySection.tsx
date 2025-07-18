import React from 'react';

const TransparencySection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Testimonial Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Customer Image */}
            <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
              <img
                src="/images/customer-testimonial.png"
                alt="Cliente satisfeita"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            </div>

            {/* Testimonial Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Quem <span className="text-green-500">conhece</span>{' '}
                <span className="text-green-500">confia</span>
              </h2>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "Conheci a Libra pelo Instagram e consegui crédito de forma{' '}
                  <strong>rápida e eficiente.</strong> Aprovei muito o atendimento dos consultores e{' '}
                  a experiência geral, positiva e útil para quem precisa. É bem simples, que vai{' '}
                  reduzir dívidas."
                </p>
                
                <div className="flex items-center justify-center md:justify-start">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency Section */}
        <div className="text-center">
          <div className="bg-libra-blue rounded-3xl px-8 py-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Prezamos a <span className="text-green-400">transparência</span>
            </h3>
            
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              A Libra Crédito <strong>não solicita nenhum tipo de valor</strong>{' '}
              antecipado para aprovação do crédito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencySection;