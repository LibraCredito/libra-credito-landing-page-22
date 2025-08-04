import React from 'react';
import ImageOptimizer from '@/components/ImageOptimizer';

const LogoBand: React.FC = () => {
  return (
    <div className="w-full bg-[#003399] flex justify-center py-4">
      <div className="flex items-center">
        <ImageOptimizer
          src="/images/logos/libra-logo.png"
          alt="Libra Crédito"
          className="h-20 w-20"
          aspectRatio={1}
          priority={false}
          width={80}
          height={80}
        />
        <span className="ml-4 text-white text-lg font-semibold whitespace-nowrap">
          Crédito justo, equilibrado e consciente!
        </span>
      </div>
    </div>
  );
};

export default LogoBand;
