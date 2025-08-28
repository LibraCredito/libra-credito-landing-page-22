import React from 'react';
import { WizardStepProps } from '../index';
import { cn } from '@/lib/utils';

// Step 1: Valor necessário
export const ValueStep: React.FC<WizardStepProps> = ({ data, updateData, errors }) => {
  const values = [
    { label: 'R$ 100 mil', value: 100000 },
    { label: 'R$ 300 mil', value: 300000 },
    { label: 'R$ 500 mil', value: 500000 },
    { label: 'R$ 750 mil', value: 750000 },
    { label: 'R$ 1 milhão', value: 1000000 },
    { label: 'Acima de R$ 1 milhão', value: 1500000 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-libra-blue mb-2">
          Quanto você precisa?
        </h3>
        <p className="text-gray-600">
          Escolha o valor que melhor atende sua necessidade
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {values.map((option) => (
          <button
            key={option.value}
            onClick={() => updateData({ loanAmount: option.value })}
            className={cn(
              "p-6 rounded-xl border-2 transition-all duration-200",
              "hover:border-libra-blue hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-libra-blue focus:ring-offset-2",
              data.loanAmount === option.value
                ? "border-libra-blue bg-blue-50 shadow-md"
                : "border-gray-200 bg-white"
            )}
          >
            <span className={cn(
              "text-lg font-semibold block",
              data.loanAmount === option.value ? "text-libra-blue" : "text-gray-900"
            )}>
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {data.loanAmount && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 text-center">
            ✓ Valor selecionado: {values.find(v => v.value === data.loanAmount)?.label}
          </p>
        </div>
      )}

      {errors?.general && (
        <p className="text-red-600 text-sm text-center mt-4">{errors.general}</p>
      )}
    </div>
  );
};

// Step 2: Prazo desejado
export const TermStep: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const terms = [
    { label: '12 meses', value: 12, description: 'Parcelas maiores, menos juros' },
    { label: '24 meses', value: 24, description: 'Equilíbrio ideal' },
    { label: '36 meses', value: 36, description: 'Parcelas menores' },
    { label: '48 meses', value: 48, description: 'Maior flexibilidade' },
    { label: '60 meses', value: 60, description: 'Parcelas mínimas' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cálculo simplificado da parcela
  const calculatePayment = (term: number) => {
    if (!data.loanAmount) return 0;
    const monthlyRate = 0.0119; // 1.19% ao mês
    const payment = data.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return payment;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-libra-blue mb-2">
          Em quantos meses?
        </h3>
        <p className="text-gray-600">
          Escolha o prazo ideal para seu orçamento
        </p>
      </div>

      <div className="space-y-3">
        {terms.map((term) => (
          <button
            key={term.value}
            onClick={() => updateData({ loanTerm: term.value })}
            className={cn(
              "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
              "hover:border-libra-blue hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-libra-blue focus:ring-offset-2",
              data.loanTerm === term.value
                ? "border-libra-blue bg-blue-50 shadow-md"
                : "border-gray-200 bg-white"
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={cn(
                  "text-lg font-semibold block",
                  data.loanTerm === term.value ? "text-libra-blue" : "text-gray-900"
                )}>
                  {term.label}
                </span>
                <span className="text-sm text-gray-600">{term.description}</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Parcela estimada</span>
                <span className={cn(
                  "block font-bold",
                  data.loanTerm === term.value ? "text-libra-blue" : "text-gray-900"
                )}>
                  {formatCurrency(calculatePayment(term.value))}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {data.loanAmount && !data.loanTerm && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm text-center">
            💡 Dica: Prazos maiores reduzem o valor da parcela mensal
          </p>
        </div>
      )}
    </div>
  );
};

// Step 3: Dados de contato
export const ContactStep: React.FC<WizardStepProps> = ({ data, updateData, errors }) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
    }
    
    updateData({ phone: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-libra-blue mb-2">
          Como podemos te contatar?
        </h3>
        <p className="text-gray-600">
          Precisamos de alguns dados para enviar sua simulação
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
            className={cn(
              "mobile-input",
              errors?.name && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Digite seu nome"
          />
          {errors?.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={handlePhoneChange}
            className={cn(
              "mobile-input",
              errors?.phone && "border-red-500 focus:ring-red-500"
            )}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {errors?.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail (opcional)
          </label>
          <input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            className="mobile-input"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-800 text-sm">
          🔒 Seus dados estão seguros e serão usados apenas para a simulação
        </p>
      </div>

      {errors?.general && (
        <p className="text-red-600 text-sm text-center mt-4">{errors.general}</p>
      )}
    </div>
  );
};

// Step 4: Resumo e confirmação
export const SummaryStep: React.FC<WizardStepProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const monthlyRate = 0.0119;
  const payment = data.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, data.loanTerm)) / (Math.pow(1 + monthlyRate, data.loanTerm) - 1);
  const totalPayment = payment * data.loanTerm;
  const totalInterest = totalPayment - data.loanAmount;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-libra-blue mb-2">
          Sua simulação está pronta!
        </h3>
        <p className="text-gray-600">
          Confira os detalhes do seu crédito
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Valor da parcela</p>
          <p className="text-3xl font-bold text-libra-blue">{formatCurrency(payment)}</p>
          <p className="text-sm text-gray-600 mt-1">por {data.loanTerm} meses</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div>
            <p className="text-sm text-gray-600">Valor solicitado</p>
            <p className="font-semibold">{formatCurrency(data.loanAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total a pagar</p>
            <p className="font-semibold">{formatCurrency(totalPayment)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <h4 className="font-semibold text-gray-900">Seus dados:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nome:</span>
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">WhatsApp:</span>
            <span className="font-medium">{data.phone}</span>
          </div>
          {data.email && (
            <div className="flex justify-between">
              <span className="text-gray-600">E-mail:</span>
              <span className="font-medium">{data.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          ⏱️ Um de nossos consultores entrará em contato em até 24 horas úteis
        </p>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Simulação válida por 7 dias</p>
        <p className="font-semibold mt-1">Taxa a partir de 1,19% a.m.</p>
      </div>
    </div>
  );
};
