
import React from 'react';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

interface LoanAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const LoanAmountField: React.FC<LoanAmountFieldProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-500 mb-1">
        Digite o valor desejado do Empréstimo
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
            className="text-sm"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};

export default LoanAmountField;
