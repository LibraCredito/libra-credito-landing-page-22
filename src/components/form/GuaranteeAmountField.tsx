
import React from 'react';
import { Input } from '@/components/ui/input';
import Home from 'lucide-react/dist/esm/icons/home';
import ResponsiveInfo from '@/components/ui/ResponsiveInfo';
import { cn } from '@/lib/utils';

interface GuaranteeAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
  isInvalid?: boolean;
}

const GuaranteeAmountField: React.FC<GuaranteeAmountFieldProps> = ({
  value,
  onChange,
  showError,
  isInvalid = false
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
        Digite o valor do Imóvel em Garantia
        <ResponsiveInfo content="Insira aqui o valor da garantia (valor do imóvel a ser considerado na operação)." />
      </label>
      <div className="flex items-center gap-2">
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <Home className="w-4 h-4 text-green-700" />
        </div>
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Mínimo 2x o valor do empréstimo"
            className={cn('text-sm', isInvalid && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
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
