import React from 'react';
import { cn } from '@/lib/utils';

interface WaveSeparatorProps {
  variant?: 'hero' | 'section' | 'inverted' | 'footer' | 'page';
  height?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
  className?: string;
}

const WaveSeparator: React.FC<WaveSeparatorProps> = ({ 
  variant = 'hero', 
  height = 'md',
  inverted = false,
  className 
}) => {
  // Alturas responsivas usando Tailwind classes (mantém fix mobile)
  const heightClasses = {
    sm: 'h-8 md:h-10 lg:h-12 xl:h-16', // 32px, 40px, 48px, 64px
    md: 'h-12 md:h-16 lg:h-20 xl:h-24 2xl:h-28', // 48px, 64px, 80px, 96px, 112px  
    lg: 'h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-36'  // 64px, 80px, 96px, 112px, 144px
  };

  // Configurações de cores da marca Libra (versão original)
  const variantConfig = {
    hero: {
      background: 'bg-[#003399]',
      fill: '#ffffff',
    },
    section: {
      background: 'bg-gray-50',
      fill: '#ffffff',
    },
    inverted: {
      background: 'bg-white',
      fill: '#003399',
    },
    footer: {
      background: 'bg-[#003399]',
      fill: '#ffffff',
    },
    page: {
      background: 'bg-[#003399]',
      fill: '#ffffff',
    }
  };

  const config = variantConfig[variant];
  const heightClass = heightClasses[height];

  return (
    <div
      className={cn(
        'relative w-full flex-shrink-0 overflow-hidden pointer-events-none', // Adiciona overflow-hidden e desativa interações
        config.background,
        heightClass,
        inverted && '-mt-1', // Margem negativa para ondas invertidas grudarem no header
        className
      )}
      aria-hidden="true"
    >
      {/* SVG com as 3 camadas de profundidade originais */}
      <svg
        className={cn(
          'absolute w-full h-full pointer-events-none',
          inverted ? '-bottom-1' : '-top-1', // Estende 1px para fora em ambas direções
          inverted && 'transform scale-y-[-1]'
        )}
        style={{ 
          left: 0,
          right: 0,
          height: 'calc(100% + 2px)', // Aumenta altura em 2px
          shapeRendering: 'auto', // Melhor para anti-aliasing
          vectorEffect: 'non-scaling-stroke' // Previne problemas de escala
        }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill={config.fill}
      >
        {/* Camada 1: 25% opacidade - Fundo mais sutil */}
        <path
          style={{ opacity: 0.25 }}
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        />
        
        {/* Camada 2: 50% opacidade - Transição média */}
        <path
          style={{ opacity: 0.5 }}
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        />
        
        {/* Camada 3: 100% opacidade - Definição principal */}
        <path
          style={{ opacity: 1 }}
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        />
      </svg>
    </div>
  );
};

export default WaveSeparator;