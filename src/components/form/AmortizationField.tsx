
import React from 'react';
import { Calculator, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface AmortizationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const AmortizationField: React.FC<AmortizationFieldProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-500 mb-1 flex items-center gap-1">
        Escolha a Amortização
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 text-gray-500 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>SAC: parcelas maiores no início e que vão diminuindo com o tempo. PRICE: parcelas fixas ao longo do contrato.</TooltipContent>
        </Tooltip>
      </label>
      <div className="flex items-center gap-2">
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <Calculator className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex-1">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="PRICE"
                checked={value === 'PRICE'}
                onChange={(e) => onChange(e.target.value)}
                className="text-green-500"
              />
              <span className="text-xs">PRICE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="SAC"
                checked={value === 'SAC'}
                onChange={(e) => onChange(e.target.value)}
                className="text-green-500"
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
