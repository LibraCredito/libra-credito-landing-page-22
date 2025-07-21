import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero2: React.FC = () => {
  const navigate = useNavigate();

  const handleSimulate = () => {
    navigate('/simulacao');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-libra-blue via-blue-600 to-blue-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 translate-y-32"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="text-white font-bold text-xl">Libra</div>
          <div className="text-white text-sm opacity-90">crédito</div>
        </div>
        <button className="text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        {/* Professional Image */}
        <div className="mb-8 relative">
          <div className="w-48 h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl transform rotate-3">
            <img 
              src="/images/hero-professional.png" 
              alt="Profissional analisando documentos"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-libra-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Main Text */}
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Empréstimo com
          <br />
          <span className="text-green-400">garantia de imóvel</span>
          <br />
          <span className="text-sm font-normal opacity-90">com flexibilidade</span>
        </h1>

        {/* CTA Button */}
        <Button
          onClick={handleSimulate}
          className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 mb-8"
        >
          SIMULE AGORA
        </Button>

        {/* Bottom Message */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-4 max-w-sm mx-auto">
          <p className="text-blue-900 text-sm">
            O crédito com as <strong>menores taxas</strong>,{' '}
            <span className="text-green-600 font-semibold">sem precisar sair de casa</span>
          </p>
          <Button
            onClick={handleSimulate}
            className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
          >
            CLIQUE AQUI
          </Button>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 text-white" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero2;