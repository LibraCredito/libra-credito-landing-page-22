import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary';
}

const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-xl";
  
  const variantStyles = {
    primary: "bg-libra-blue text-white border-0",
    secondary: "bg-transparent text-[#003399] border-2 border-[#003399] hover:bg-[#003399] hover:text-white"
  };

  return (
    <Button 
      className={cn(
        baseStyles,
        variantStyles[variant],
        "h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Gradient overlay effect for primary button */}
      {variant === 'primary' && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-500/80
                     transform translate-y-full group-hover:translate-y-0
                     transition-transform duration-300 ease-out"
        />
      )}
      
      {/* Shimmer effect */}
      <div 
        className="absolute inset-0 -top-2 -left-2 w-[calc(100%+4px)] h-[calc(100%+4px)]
                   bg-gradient-to-r from-transparent via-white/10 to-transparent
                   transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%]
                   transition-transform duration-1000 ease-out"
      />
    </Button>
  );
};

export default PremiumButton;
