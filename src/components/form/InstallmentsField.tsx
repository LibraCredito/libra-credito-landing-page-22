
import React from 'react';
import { Calendar } from 'lucide-react';

interface InstallmentsFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const InstallmentsField: React.FC<InstallmentsFieldProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-green-500">
          Em quantas parcelas?
        </label>
        <span className="bg-libra-blue text-white px-2 py-0.5 rounded text-xs font-bold">
          {value} meses ({Math.round(value / 12)} anos)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <Calendar className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex-1">
          <input
            type="range"
            min="36"
            max="180"
            step="12"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              "--value": ((value - 36) / (180 - 36)) * 100 + "%",
            } as React.CSSProperties}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {Array.from({ length: 13 }, (_, i) => 36 + i * 12).map((months) => (
              <span key={months}>{months}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentsField;
