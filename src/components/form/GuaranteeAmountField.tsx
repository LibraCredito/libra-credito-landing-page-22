
import React from 'react';
import { Input } from '@/components/ui/input';
import Home from 'lucide-react/dist/esm/icons/home';
import Info from 'lucide-react/dist/esm/icons/info';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GuaranteeAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}

const GuaranteeAmountField: React.FC<GuaranteeAmountFieldProps> = ({ 
  value, 
  onChange, 
  showError 
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-500 mb-1 flex items-center gap-1">
        Digite o valor do Imóvel em Garantia
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 text-gray-500 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>Insira aqui o valor da garantia (valor do imóvel a ser considerado na operação).</TooltipContent>
        </Tooltip>
      </label>
      <div className="flex items-center gap-2">
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <Home className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Mínimo 2x o valor do empréstimo"
            className="text-sm"
            inputMode="numeric"
          />
        </div>
      </div>
      {showError && (
        <p className="text-red-500 text-xs mt-1">
          O valor da garantia deve ser pelo menos 2x o valor do empréstimo
        </p>
      )}
    </div>
  );
};

export default GuaranteeAmountField;
