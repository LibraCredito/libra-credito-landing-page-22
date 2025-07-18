import React from 'react';
import { cn } from '@/lib/utils';

const HeroButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
  }
>(({ className, variant = 'primary', ...props }, ref) => {
  const baseClasses =
    'w-full cta-button px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base font-bold';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#003399] to-[#0055CC] text-white',
    secondary:
      'bg-transparent border-2 border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      ref={ref}
      {...props}
    />
  );
});

HeroButton.displayName = 'HeroButton';

export default HeroButton;
