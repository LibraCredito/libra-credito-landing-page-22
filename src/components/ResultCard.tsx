
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';

interface ResultCardProps {
  valor: number;
  amortizacao?: string;
  primeiraParcela?: number;
  ultimaParcela?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  valor, 
  amortizacao,
  primeiraParcela,
  ultimaParcela 
}) => {
  const valorFormatado = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <Card className="mt-4 bg-gradient-to-r from-libra-blue to-libra-navy shadow-xl">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <CheckCircle className="w-6 h-6 text-white" />
          <h3 className="text-lg font-bold text-white">
            Simulação Realizada!
          </h3>
        </div>
        
        <div className="bg-white rounded-lg p-3 inline-block">
          <p className="text-xs text-gray-600 mb-1">
            {amortizacao === 'SAC' ? 'Primeira parcela:' : 'Valor da parcela:'}
          </p>
          <p className="text-2xl font-bold text-libra-navy">
            {valorFormatado}
          </p>
          
          {amortizacao === 'SAC' && ultimaParcela && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Última parcela:</p>
              <p className="text-lg font-bold text-libra-navy">
                {ultimaParcela.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
          )}
        </div>
        
        <p className="text-white/90 text-xs mt-3">
          *Valores sujeitos à análise de crédito e avaliação do imóvel
        </p>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
