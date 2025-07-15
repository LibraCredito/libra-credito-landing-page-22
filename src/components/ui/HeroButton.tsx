import React from 'react';
import { cn } from '@/lib/utils';

const HeroButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
  }
>(({ className, variant = 'primary', ...props }, ref) => {
  const baseClasses =
    'w-full rounded-lg px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base font-bold transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#003399] to-[#0055CC] text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-[#003399]',
    secondary:
      'bg-transparent border-2 border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white focus:ring-[#003399]',
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
