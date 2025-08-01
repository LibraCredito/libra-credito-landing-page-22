
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

interface CityFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const CityField: React.FC<CityFieldProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-libra-navy mb-1">
        Selecione a cidade do imóvel a ser utilizado como garantia
      </label>
      <div className="flex items-center gap-2">
        <div className="bg-libra-light p-1.5 rounded-full flex-shrink-0">
          <MapPin className="w-4 h-4 text-green-700" />
        </div>
        <div className="flex-1">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Cidade/UF do imóvel a ser dado em Garantia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ribeirao-preto-sp">Ribeirão Preto/SP</SelectItem>
              <SelectItem value="sao-paulo-sp">São Paulo/SP</SelectItem>
              <SelectItem value="campinas-sp">Campinas/SP</SelectItem>
              <SelectItem value="santos-sp">Santos/SP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CityField;
