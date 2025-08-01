import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumLoadingProps {
  variant?: 'dots' | 'spinner' | 'pulse' | 'wave' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'white';
  className?: string;
  text?: string;
}

const PremiumLoading: React.FC<PremiumLoadingProps> = ({
  variant = 'dots',
  size = 'md',
  color = 'blue',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-700',
    yellow: 'text-yellow-500',
    white: 'text-white'
  };

  const DotsLoader = () => (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-current animate-bounce',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );

  const SpinnerLoader = () => (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{ animationDuration: '1s' }}
      />
    </div>
  );

  const PulseLoader = () => (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'animate-ping rounded-full bg-current opacity-75',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-current',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  );

  const WaveLoader = () => (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-current animate-pulse',
            size === 'sm' ? 'h-8' : size === 'md' ? 'h-12' : 'h-16',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const SkeletonLoader = () => (
    <div className={cn('animate-pulse space-y-3', className)}>
      <div className="h-4 bg-gray-300 rounded-full w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded-full w-5/6"></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'spinner':
        return <SpinnerLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'wave':
        return <WaveLoader />;
      case 'skeleton':
        return <SkeletonLoader />;
      default:
        return <DotsLoader />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderLoader()}
      {text && (
        <p className={cn(
          'text-sm font-medium animate-pulse',
          colorClasses[color]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default PremiumLoading;