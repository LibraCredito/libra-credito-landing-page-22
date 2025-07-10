import React from 'react';
import { cn } from '@/lib/utils';
import WaveSeparator from '@/components/ui/WaveSeparator';

interface SlimWaveBandProps {
  className?: string;
}

const SlimWaveBand: React.FC<SlimWaveBandProps> = ({ className }) => (
  <div className={cn('relative w-full overflow-hidden', className)}>
    <WaveSeparator variant="hero" height="sm" inverted className="relative z-10" />
    <div className="h-6 md:h-8 bg-[#0044cc]" />
    <WaveSeparator variant="hero" height="sm" className="relative z-10 -mt-1" />
  </div>
);

export default SlimWaveBand;
