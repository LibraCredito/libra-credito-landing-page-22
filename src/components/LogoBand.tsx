import React from 'react';
import ImageOptimizer from '@/components/ImageOptimizer';

interface LogoBandProps {
  /**
   * Optional click handler to transform the band into a clickable element.
   */
  onClick?: () => void;
  /**
   * Visual variant controlling paddings and sizes.
   * - `desktop`: larger logo and tighter padding (default)
   * - `mobile`: smaller logo with bigger vertical padding
   */
  size?: 'desktop' | 'mobile';
}

const LogoBand: React.FC<LogoBandProps> = ({ onClick, size = 'desktop' }) => {
  const isClickable = typeof onClick === 'function';

  const config =
    size === 'mobile'
      ? {
          padding: 'py-8',
          imgSize: 64,
          imgClass: 'h-12 sm:h-16 flex-shrink-0',
          textClass:
            'ml-3 sm:ml-4 text-white text-sm sm:text-base font-semibold leading-tight text-center flex-1 min-w-0',
        }
      : {
          padding: 'py-4',
          imgSize: 80,
          imgClass: 'h-20 w-20 flex-shrink-0',
          textClass: 'ml-4 text-white text-lg font-semibold whitespace-nowrap',
        };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`w-full bg-[#003399] flex justify-center ${config.padding} ${
        isClickable ? 'cursor-pointer hover:bg-[#002277] transition-colors' : ''
      }`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={
        isClickable
          ? 'Clique para conhecer mais sobre a Libra Crédito'
          : undefined
      }
    >
      <div className="flex items-center px-4 max-w-full">
        <ImageOptimizer
          src="/images/logos/logo-branco.svg"
          alt="Libra Crédito"
          className={config.imgClass}
          aspectRatio={1}

          priority={false}
          width={config.imgSize}
          height={config.imgSize}
          widths={[config.imgSize, config.imgSize * 2]}
          sizes={`${config.imgSize}px`}
        />
        <span className={config.textClass}>
          Crédito justo, equilibrado e consciente!
        </span>
      </div>
    </div>
  );
};

export default LogoBand;
