
import React from 'react';
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import ResponsiveInfo from '@/components/ui/ResponsiveInfo';
import { cn } from '@/lib/utils';

interface AmortizationFieldProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const AmortizationField: React.FC<AmortizationFieldProps> = ({ value, onChange, isInvalid = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
        Escolha a Amortização
        <ResponsiveInfo
          content={
            <>
              <p>SAC: parcelas maiores no início e que vão diminuindo com o tempo.</p>
              <p>PRICE: parcelas fixas ao longo do contrato.</p>
            </>
          }
        />
      </label>
      <div className={cn('flex items-center gap-2', isInvalid && 'border border-red-500 rounded-md p-2')}>
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <Calculator className="w-4 h-4 text-green-700" />
        </div>
        <div className="flex-1">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="PRICE"
                checked={value === 'PRICE'}
                onChange={(e) => onChange(e.target.value)}
                className="text-green-700"
              />
              <span className="text-xs">PRICE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="SAC"
                checked={value === 'SAC'}
                onChange={(e) => onChange(e.target.value)}
                className="text-green-700"
              />
              <span className="text-xs">SAC</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmortizationField;
