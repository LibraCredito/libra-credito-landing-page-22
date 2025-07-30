/**
 * Formulário de simulação local sem APIs
 * 
 * @description Nova versão do formulário que usa apenas dados locais:
 * - JSON de cidades (LTV_Cidades.json)
 * - Calculadora local (SAC/PRICE)
 * - Configuração via painel admin
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useOptimizedDebounce } from '@/hooks/useOptimizedDebounce';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateCity, validateLTV, searchCities, CityValidationResult } from '@/utils/cityLtvService';
import { formatBRL, norm } from '@/utils/formatters';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import Home from 'lucide-react/dist/esm/icons/home';

interface LtvValidationResult {
  valid: boolean;
  message: string;
  suggestedLoanAmount?: number;
}

interface LocalSimulationResult {
  valorEmprestimo: number;
  valorImovel: number;
  cidade: string;
  parcelas: number;
  parcelaSac: {
    inicial: number;
    final: number;
  };
  parcelaPrice: number;
  taxaJuros: number;
}

const LocalSimulationForm: React.FC = () => {
  // Estados do formulário
  const [cidade, setCidade] = useState('');
  const [valorEmprestimo, setValorEmprestimo] = useState('');
  const [valorImovel, setValorImovel] = useState('');
  const [parcelas, setParcelas] = useState<number>(36);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Estados de validação e resultado
  const [cityValidation, setCityValidation] = useState<CityValidationResult | null>(null);
  const [ltvValidation, setLtvValidation] = useState<LtvValidationResult | null>(null);
  const [resultado, setResultado] = useState<LocalSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar cidades conforme o usuário digita
  useEffect(() => {
    if (cidade.length >= 2) {
      searchCities(cidade).then(suggestions => {
        setCitySuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      });
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  }, [cidade]);

  // Validar cidade quando selecionada
  useEffect(() => {
    if (cidade) {
      validateCity(cidade).then(validation => {
        setCityValidation(validation);
      }).catch(error => {
        console.error('Erro ao validar cidade:', error);
        setCityValidation({
          found: false,
          status: 'not_found',
          message: 'Erro ao carregar dados da cidade',
          allowCalculation: false
        });
      });
    } else {
      setCityValidation(null);
    }
  }, [cidade]);

  // Validar LTV quando valores ou cidade validada mudarem
  useEffect(() => {
    const empValue = norm(valorEmprestimo);
    const imValue = norm(valorImovel);

    if (
      empValue > 0 &&
      imValue > 0 &&
      cidade &&
      cityValidation?.allowCalculation
    ) {
      validateLTV(empValue, imValue, cidade).then(validation => {
        setLtvValidation(validation);
      });
    } else {
      setLtvValidation(null);
    }
  }, [valorEmprestimo, valorImovel, cidade, cityValidation]);

  const handleCitySelect = useCallback((selectedCity: string) => {
    setCidade(selectedCity);
    setShowSuggestions(false);
  }, []);

  // Debounced handlers para reduzir trabalho da main thread
  const debouncedEmprestimoChange = useOptimizedDebounce((value: string) => {
    setValorEmprestimo(formatBRL(value));
  }, 300);

  const debouncedImovelChange = useOptimizedDebounce((value: string) => {
    setValorImovel(formatBRL(value));
  }, 300);

  const handleValorEmprestimoChange = useCallback((value: string) => {
    debouncedEmprestimoChange(value);
  }, [debouncedEmprestimoChange]);

  const handleValorImovelChange = useCallback((value: string) => {
    debouncedImovelChange(value);
  }, [debouncedImovelChange]);

  const canCalculate = () => {
    return (
      cityValidation?.allowCalculation &&
      ltvValidation?.valid &&
      norm(valorEmprestimo) > 0 &&
      norm(valorImovel) > 0 &&
      parcelas >= 36 &&
      parcelas <= 180
    );
  };

  const handleCalculate = () => {
    if (!canCalculate()) return;

    setLoading(true);
    
    // Simular pequeno delay para UX
    setTimeout(async () => {
      const empValue = norm(valorEmprestimo);
      const imValue = norm(valorImovel);

      // Importa calculadora de forma dinâmica para reduzir bundle inicial
      const {
        calculateLoan,
        getInterestRate,
        validateLoanParameters
      } = await import('@/utils/loanCalculator');

      const taxaJuros = getInterestRate();

      // Validar parâmetros
      const paramValidation = validateLoanParameters(empValue, parcelas);
      if (!paramValidation.valid) {
        setLoading(false);
        return;
      }

      // Calcular empréstimo
      const calculation = calculateLoan(empValue, taxaJuros, parcelas, imValue);

      const result: LocalSimulationResult = {
        valorEmprestimo: empValue,
        valorImovel: imValue,
        cidade,
        parcelas,
        parcelaSac: calculation.parcelaSac,
        parcelaPrice: calculation.parcelaPrice,
        taxaJuros: taxaJuros * 100 // Converter para %
      };

      setResultado(result);
      setLoading(false);
    }, 800);
  };

  const handleClear = () => {
    setCidade('');
    setValorEmprestimo('');
    setValorImovel('');
    setParcelas(36);
    setCityValidation(null);
    setLtvValidation(null);
    setResultado(null);
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  const handleNewSimulation = () => {
    setResultado(null);
  };

  const adjustLoanAmount = () => {
    if (ltvValidation?.suggestedLoanAmount) {
      setValorEmprestimo(formatBRL(ltvValidation.suggestedLoanAmount.toString()));
    }
  };

  const renderAlert = (validation: CityValidationResult | LtvValidationResult | null, type: 'city' | 'ltv') => {
    if (!validation) return null;

    const getIcon = () => {
      if (type === 'city' && 'status' in validation) {
        switch (validation.status) {
          case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
          case 'ltv_30': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
          case 'rural_only': return <Home className="w-4 h-4 text-blue-600" />;
          default: return <XCircle className="w-4 h-4 text-red-600" />;
        }
      } else if (type === 'ltv' && 'valid' in validation) {
        return validation.valid ? 
          <CheckCircle className="w-4 h-4 text-green-600" /> : 
          <XCircle className="w-4 h-4 text-red-600" />;
      }
      return <XCircle className="w-4 h-4 text-red-600" />;
    };

    const getColor = () => {
      if (type === 'city' && 'status' in validation) {
        switch (validation.status) {
          case 'success': return 'text-green-800 bg-green-50 border-green-200';
          case 'ltv_30': return 'text-yellow-800 bg-yellow-50 border-yellow-200';
          case 'rural_only': return 'text-blue-800 bg-blue-50 border-blue-200';
          default: return 'text-red-800 bg-red-50 border-red-200';
        }
      } else if (type === 'ltv' && 'valid' in validation) {
        return validation.valid ? 
          'text-green-800 bg-green-50 border-green-200' : 
          'text-red-800 bg-red-50 border-red-200';
      }
      return 'text-red-800 bg-red-50 border-red-200';
    };

    return (
      <div className={`p-3 rounded-lg border mb-4 ${getColor()}`}>
        <div className="flex items-start gap-2">
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm">
              {validation.message}
              {type === 'ltv' && 'valid' in validation && !validation.valid && 'suggestedLoanAmount' in validation && validation.suggestedLoanAmount && (
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={adjustLoanAmount}
                    className="text-xs"
                  >
                    Ajustar para R$ {validation.suggestedLoanAmount.toLocaleString('pt-BR')}
                  </Button>
                </div>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`container mx-auto px-3 py-2 min-h-[calc(100vh-4rem)] ${
      resultado ? 'max-w-6xl' : 'max-w-xl'
    }`}>
      <div className={`${resultado ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
        {/* Formulário */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg md:text-xl font-bold text-libra-navy mb-1">
              Simulação Local de Crédito
            </CardTitle>
            <p className="text-gray-600 text-xs">
              Calcule suas parcelas instantaneamente, sem depender de APIs externas
            </p>
          </CardHeader>
          
          <CardContent className="p-3 md:p-4">
            <div className="space-y-4">
              {/* Campo Cidade */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <Input
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Digite sua cidade..."
                  className="w-full"
                />
                
                {/* Sugestões */}
                {showSuggestions && citySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {citySuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                        onClick={() => handleCitySelect(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Validação da Cidade */}
              {renderAlert(cityValidation, 'city')}

              {/* Campo Valor do Empréstimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor do Empréstimo *
                </label>
                <Input
                  value={valorEmprestimo}
                  onChange={(e) => handleValorEmprestimoChange(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full"
                />
              </div>

              {/* Campo Valor do Imóvel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor do Imóvel (Garantia) *
                </label>
                <Input
                  value={valorImovel}
                  onChange={(e) => handleValorImovelChange(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full"
                />
              </div>

              {/* Validação do LTV */}
              {renderAlert(ltvValidation, 'ltv')}

              {/* Campo Parcelas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Parcelas
                </label>
                <Select value={parcelas.toString()} onValueChange={(value) => setParcelas(Number(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 145 }, (_, i) => i + 36).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} meses
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botões */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCalculate}
                  disabled={!canCalculate() || loading}
                  className="flex-1 bg-libra-blue hover:bg-libra-blue/90 text-white py-2 text-sm font-semibold min-h-[44px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Calculando...
                    </div>
                  ) : (
                    'CALCULAR'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="px-4 py-2 text-libra-blue border-libra-blue hover:bg-libra-light min-h-[44px] text-sm"
                >
                  LIMPAR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-libra-navy flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Resultado da Simulação
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-3 md:p-4">
              <div className="space-y-4">
                {/* Informações do Empréstimo */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Dados da Simulação</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Cidade:</span>
                      <p className="font-medium">{resultado.cidade}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Parcelas:</span>
                      <p className="font-medium">{resultado.parcelas} meses</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Empréstimo:</span>
                      <p className="font-medium">R$ {resultado.valorEmprestimo.toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Taxa Juros:</span>
                      <p className="font-medium">{resultado.taxaJuros.toFixed(2)}% a.m.</p>
                    </div>
                  </div>
                </div>

                {/* Valores das Parcelas */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Valores das Parcelas</h3>
                  
                  {/* PRICE */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-1">Sistema PRICE</h4>
                    <p className="text-sm text-blue-600 mb-2">Parcelas fixas</p>
                    <p className="text-xl font-bold text-blue-800">
                      R$ {resultado.parcelaPrice.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>

                  {/* SAC */}
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-1">Sistema SAC</h4>
                    <p className="text-sm text-green-600 mb-2">Parcelas decrescentes</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-green-600">1ª parcela</p>
                        <p className="text-lg font-bold text-green-800">
                          R$ {resultado.parcelaSac.inicial.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-600">Última parcela</p>
                        <p className="text-lg font-bold text-green-800">
                          R$ {resultado.parcelaSac.final.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Nova Simulação */}
                <Button
                  onClick={handleNewSimulation}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Nova Simulação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default memo(LocalSimulationForm);