import React from 'react';
import { cn } from '@/lib/utils';

interface WaveSeparatorProps {
  variant?: 'hero' | 'section' | 'inverted' | 'footer';
  height?: 'sm' | 'md' | 'lg';
  inverted?: boolean; // Nova prop para inverter as ondas
  className?: string;
}

const WaveSeparator: React.FC<WaveSeparatorProps> = ({ 
  variant = 'hero', 
  height = 'md',
  inverted = false, // Padrão: ondas normais (para baixo)
  className 
}) => {
  // Configurações de altura responsiva
  const heightConfig = {
    sm: { desktop: '60px', tablet: '50px', mobile: '40px' },
    md: { desktop: '120px', tablet: '80px', mobile: '70px' },
    lg: { desktop: '160px', tablet: '120px', mobile: '90px' }
  };

  // Configurações de cores da marca Libra
  const variantConfig = {
    hero: {
      background: 'bg-[#003399]', // Azul escuro da marca
      fill: '#ffffff', // Branco
    },
    section: {
      background: 'bg-gray-50',
      fill: '#ffffff',
    },
    inverted: {
      background: 'bg-white',
      fill: '#003399', // Azul escuro da marca
    },
    footer: {
      background: 'bg-[#001f5c]', // Azul mais escuro
      fill: '#ffffff',
    }
  };

  const currentHeight = heightConfig[height];
  const config = variantConfig[variant];

  return (
    <div 
      className={cn(
        'relative w-full overflow-hidden',
        config.background,
        className
      )}
      style={{
        height: currentHeight.desktop,
      }}
      aria-hidden="true"
    >
      {/* SVG com as 3 camadas de profundidade */}
      <svg
        className={cn(
          'absolute left-0 w-full',
          inverted ? 'top-0' : 'bottom-0' // Posição baseada em inverted
        )}
        style={{ 
          height: currentHeight.desktop,
          transform: inverted ? 'scaleY(-1)' : 'none' // Inverter verticalmente se inverted
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

      {/* CSS responsivo */}
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            height: ${currentHeight.tablet} !important;
          }
          svg {
            height: ${currentHeight.tablet} !important;
          }
        }
        
        @media (max-width: 480px) {
          div {
            height: ${currentHeight.mobile} !important;
          }
          svg {
            height: ${currentHeight.mobile} !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WaveSeparator;