
import React from 'react';
import { Input } from '@/components/ui/input';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import ResponsiveInfo from '@/components/ui/ResponsiveInfo';

import { cn } from '@/lib/utils';

interface LoanAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const LoanAmountField: React.FC<LoanAmountFieldProps> = ({ value, onChange, isInvalid = false }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-500 mb-1 flex items-center gap-1">
        Digite o valor desejado do Empréstimo
        <ResponsiveInfo content="Insira aqui o valor que você pretende pegar de empréstimo." />
      </label>
      <div className="flex items-center gap-2">
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <DollarSign className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="entre 75 mil e 5 milhões"
            className={cn('text-sm', isInvalid && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};

export default LoanAmountField;
