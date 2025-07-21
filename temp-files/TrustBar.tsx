import React from 'react';
import { Award, Users, TrendingUp, Shield } from 'lucide-react';

const TrustBar: React.FC = () => {
  return (
    <section id="trustbar" className="bg-[#003399] py-6 border-t border-gray-200 scroll-mt-header" aria-label="Indicadores de confiança">
      <h2 className="sr-only">Indicadores de Confiança da Libra Crédito</h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {/* Regulamentação */}
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs md:text-sm text-white leading-tight">Regulamentado pelo</p>
              <p className="text-sm md:text-base font-semibold text-white">Banco Central</p>
            </div>
          </div>
          
          {/* Anos no mercado */}
          <div className="flex items-center justify-center gap-3">
            <Award className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs md:text-sm text-white leading-tight">Grupo Stéfani</p>
              <p className="text-sm md:text-base font-semibold text-white">40+ anos</p>
            </div>
          </div>
          
          {/* Clientes atendidos */}
          <div className="flex items-center justify-center gap-3">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs md:text-sm text-white leading-tight">Mais de</p>
              <p className="text-sm md:text-base font-semibold text-white">10.000 clientes</p>
            </div>
          </div>
          
          {/* Valor liberado */}
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs md:text-sm text-white leading-tight">Liberados</p>
              <p className="text-sm md:text-base font-semibold text-white">R$ 500M+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
