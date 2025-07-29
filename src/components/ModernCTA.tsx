import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernCTAProps {
  onSimulate: () => void;
  title?: string;
  subtitle?: string;
}

const ModernCTA: React.FC<ModernCTAProps> = ({ 
  onSimulate, 
  title = "Transforme seu patrimônio em oportunidades",
  subtitle = "Tecnologia inteligente para decisões financeiras rápidas e seguras"
}) => {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden font-sans">
      {/* Background com gradiente dinâmico usando cores da marca */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#003399] to-[#001f5c]">
        {/* Overlay com padrão geométrico de círculos */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-full h-full bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        {/* Elementos flutuantes animados */}
        <div className="absolute inset-0">
          {/* Círculos flutuantes com cores da marca */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00ccff] rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#00ccff] rounded-full animate-ping opacity-40"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-[#00ccff] rounded-full animate-bounce opacity-30"></div>
          
          {/* Linhas dinâmicas com cores da marca */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ccff]/30 to-transparent animate-pulse"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ccff]/20 to-transparent animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Brilho dinâmico com cores da marca */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-[#00ccff]/20 via-[#003399]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        <div className={`container mx-auto px-4 ${isMobile ? 'py-12' : 'py-16'}`}>
          <div className="text-center max-w-4xl mx-auto">
            {/* Ícone tecnológico com cores da marca */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ccff] to-[#003399] rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-[#00ccff] to-[#003399] p-3 rounded-full">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Título com efeito usando Comfortaa */}
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold mb-4 text-white relative font-sans`}>
              <span className="bg-gradient-to-r from-white via-[#00ccff]/80 to-white bg-clip-text text-transparent">
                {title}
              </span>
            </h2>

            {/* Subtítulo usando Comfortaa */}
            <p className={`${isMobile ? 'text-base px-2' : 'text-lg'} mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed font-sans`}>
              {subtitle}
            </p>

            {/* Indicadores visuais com cores da marca */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-[#00ccff]">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium font-sans">Aprovação em 24h</span>
              </div>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center gap-2 text-[#00ccff]">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium font-sans">100% Digital</span>
              </div>
            </div>

            {/* Botão principal com efeitos usando cores da marca */}
            <div className="relative inline-block">
              {/* Brilho do botão */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ccff] to-[#003399] rounded-xl blur-lg opacity-75 animate-pulse"></div>
              
              {/* Botão */}
              <Button
                onClick={onSimulate}
                size={isMobile ? "default" : "lg"}
                className={`
                  relative font-sans
                  ${isMobile ? 'min-h-[48px] px-8' : 'min-h-[56px] px-12'} 
                  bg-gradient-to-r from-[#00ccff] via-[#0099dd] to-[#003399]
                  hover:from-[#00ddff] hover:via-[#00aaee] hover:to-[#0044aa]
                  text-white font-semibold
                  border-0 rounded-xl
                  shadow-2xl
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-[#00ccff]/25
                  group
                `}
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  <span className={isMobile ? 'text-base' : 'text-lg'}>
                    Simular Agora
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>

            {/* Texto de segurança usando Comfortaa */}
            <p className="mt-6 text-sm text-gray-400 font-sans">
              🔒 Simulação gratuita e sem compromisso • Dados protegidos
            </p>
          </div>
        </div>
      </div>

      {/* Animação de partículas no mobile com cores da marca */}
      {isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-1 h-1 bg-[#00ccff] rounded-full animate-ping delay-500"></div>
          <div className="absolute top-3/4 right-10 w-1 h-1 bg-[#00ccff] rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#00ccff] rounded-full animate-ping delay-1500"></div>
        </div>
      )}
    </section>
  );
};

export default ModernCTA;