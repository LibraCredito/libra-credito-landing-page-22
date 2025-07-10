import React from 'react';
import ImageOptimizer from '@/components/ImageOptimizer';

const LogoBand: React.FC = () => {
  return (
    <div className="w-full bg-[#003399] flex justify-center py-8">
      <div className="h-16 flex items-center">
        <ImageOptimizer
          src="/images/logos/libra-logo.png"
          alt="Libra Crédito"
          className="h-16 w-auto"
          aspectRatio={1}
          priority={false}
        />
      </div>
    </div>
  );
};

export default LogoBand;
