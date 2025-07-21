/**
 * Formulário avançado de simulação de crédito
 * 
 * @component SimulationForm
 * @description Implementa o formulário completo de simulação de crédito com garantia de imóvel,
 * incluindo validações avançadas, cálculos precisos e integração com API.
 * 
 * @features
 * - Integração com API de simulação
 * - Suporte a diferentes sistemas de amortização (SAC/PRICE)
 * - Validações em tempo real
 * - Feedback visual de erros
 * - Loading states
 * - Formulário de contato pós-simulação
 * 
 * @businessRules
 * - Validação de valores mínimos e máximos
 * - Verificação de proporção empréstimo/garantia
 * - Cálculo de parcelas com juros + IPCA
 * - Tratamento de casos especiais (carência, etc)
 * 
 * @errorHandling
 * - Validação de entrada de dados
 * - Tratamento de erros da API
 * - Feedback visual de erros
 * - Logs de depuração
 * 
 * @integration
 * - Integração com serviço simulationApi
 * - Formatação de dados para API
 * - Parsing de resposta
 * 
 * @example
 * ```tsx
 * <SimulationForm />
 * ```
 * 
 * @see {@link simulateCredit} para detalhes da integração com API
 * @see {@link validateForm} para regras de validação
 * @see {@link formatBRL} para formatação de valores
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateForm } from '@/utils/validations';
import { LocalSimulationService, SimulationResult } from '@/services/localSimulationService';
import { useUserJourney } from '@/hooks/useUserJourney';
import { useIsMobile } from '@/hooks/use-mobile';
import CityAutocomplete from './form/CityAutocomplete';
import LoanAmountField from './form/LoanAmountField';
import GuaranteeAmountField from './form/GuaranteeAmountField';
import InstallmentsField from './form/InstallmentsField';
import AmortizationField from './form/AmortizationField';
import ResultCard from './ResultCard';
import ContactForm from './ContactForm';
import ApiMessageDisplay from './ApiMessageDisplay';
import SmartApiMessage from './messages/SmartApiMessage';
import SimulationResultDisplay from './SimulationResultDisplay';
import { analyzeApiMessage, ApiMessageAnalysis } from '@/utils/apiMessageAnalyzer';
import { analyzeLocalMessage } from '@/utils/localMessageAnalyzer';
import { formatBRL, norm } from '@/utils/formatters';

const SimulationForm: React.FC = () => {
  const { sessionId, trackSimulation } = useUserJourney();
  const isMobile = useIsMobile();
  const [emprestimo, setEmprestimo] = useState('');
  const [garantia, setGarantia] = useState('');
  const [parcelas, setParcelas] = useState<number>(180);
  const [amortizacao, setAmortizacao] = useState('');
  const [cidade, setCidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<SimulationResult | null>(null);
  const [erro, setErro] = useState('');
  const [apiMessage, setApiMessage] = useState<ApiMessageAnalysis | null>(null);
  const [isRuralProperty, setIsRuralProperty] = useState(false);

  // Validações
  const validation = validateForm(emprestimo, garantia, parcelas, amortizacao, cidade);

  const handleEmprestimoChange = (value: string) => {
    // aceitar somente números e limitar a 7 dígitos
    const numeric = value.replace(/\D/g, '').slice(0, 7);
    if (!numeric) return setEmprestimo('');

    // limitar valor máximo permitido
    let numValue = Number(numeric);
    if (numValue > 5000000) {
      numValue = 5000000;
    }

    setEmprestimo(formatBRL(numValue.toString()));
  };

  const handleGarantiaChange = (value: string) => {
    const numeric = value.replace(/\D/g, '').slice(0, 8);
    if (!numeric) return setGarantia('');

    let numValue = Number(numeric);
    if (numValue > 25000000) {
      numValue = 25000000;
    }

    setGarantia(formatBRL(numValue.toString()));
  };

  // Função para rolar para o resultado no mobile
  const scrollToResult = () => {
    if (isMobile) {
      setTimeout(() => {
        const resultElement = document.querySelector('[data-result-section="true"]');
        if (resultElement) {
          (resultElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Delay para garantir que o resultado seja renderizado
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.formularioValido || !sessionId) return;

    setLoading(true);
    setErro('');
    setResultado(null);

    try {
      // Preparar dados para o serviço (sem dados pessoais ainda)
      const simulationInput = {
        sessionId,
        nomeCompleto: 'Lead Anônimo', // Temporário até preenchimento do contato
        email: 'nao-informado@temp.com',
        telefone: '(00) 00000-0000',
        cidade: cidade,
        valorEmprestimo: validation.emprestimoValue,
        valorImovel: validation.garantiaValue,
        parcelas: parcelas,
        tipoAmortizacao: amortizacao,
        userAgent: navigator.userAgent,
        ipAddress: undefined
      };


      // Usar o serviço local sem APIs
      const result = await LocalSimulationService.performSimulation(simulationInput);


      // Rastrear simulação na jornada do usuário
      trackSimulation({
        simulationId: result.id,
        valorEmprestimo: result.valorEmprestimo,
        valorImovel: result.valorImovel,
        parcelas: result.parcelas,
        cidade: result.cidade
      });

      setResultado(result);
      
      // Rolar para o resultado no mobile
      scrollToResult();

    } catch (error) {
      // Erro na simulação
      
      if (error instanceof Error) {
        // Analisar a mensagem usando analisador local
        const analysis = analyzeLocalMessage(error.message);
        
        if (analysis.type !== 'unknown_error') {
          // É uma mensagem estruturada do serviço local
          setApiMessage(analysis);
          setErro(''); // Limpar erro genérico
        } else {
          // É um erro genérico
          let errorMessage = 'Erro desconhecido ao realizar simulação';
          
          if (error.message.includes('HTTP') || error.message.includes('fetch')) {
            errorMessage = 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.';
          } else {
            errorMessage = error.message;
          }
          
          setErro(errorMessage);
          setApiMessage(null);
        }
      } else {
        setErro('Erro desconhecido ao realizar simulação');
        setApiMessage(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmprestimo('');
    setGarantia('');
    setParcelas(180);
    setAmortizacao('');
    setCidade('');
    setResultado(null);
    setErro('');
    setApiMessage(null);
    setIsRuralProperty(false);
  };

  // Função para ajustar valores automaticamente (30%) e executar simulação
  const handleAdjustValues = async (novoEmprestimo: number, isRural: boolean = false) => {
    // Ajustar os valores - usar valor completo com formatação
    setEmprestimo(formatBRL(novoEmprestimo.toString()));
    setIsRuralProperty(isRural);
    setApiMessage(null);
    setErro('');

    // Aguardar um pouco para garantir que os estados sejam atualizados
    setTimeout(async () => {
      // Verificar se temos todos os dados necessários para simular
      if (!sessionId || !cidade || !amortizacao) {
        return;
      }

      // Recalcular validação com novos valores
      const newValidation = validateForm(
        formatBRL(novoEmprestimo.toString()),
        garantia,
        parcelas,
        amortizacao,
        cidade
      );

      if (!newValidation.formularioValido) {
        return;
      }

      // Executar simulação automaticamente
      setLoading(true);

      try {
        const simulationInput = {
          sessionId,
          nomeCompleto: 'Lead Anônimo',
          email: 'nao-informado@temp.com',
          telefone: '(00) 00000-0000',
          cidade: cidade,
          valorEmprestimo: newValidation.emprestimoValue,
          valorImovel: newValidation.garantiaValue,
          parcelas: parcelas,
          tipoAmortizacao: amortizacao,
          userAgent: navigator.userAgent,
          ipAddress: undefined
        };


        const result = await LocalSimulationService.performSimulation(simulationInput);


        // Rastrear simulação na jornada do usuário
        trackSimulation({
          simulationId: result.id,
          valorEmprestimo: result.valorEmprestimo,
          valorImovel: result.valorImovel,
          parcelas: result.parcelas,
          cidade: result.cidade
        });

        setResultado(result);
        
        // Rolar para o resultado no mobile
        scrollToResult();

      } catch (error) {
        // Erro na simulação automática
        
        if (error instanceof Error) {
          const analysis = analyzeLocalMessage(error.message);
          
          if (analysis.type !== 'unknown_error') {
            setApiMessage(analysis);
            setErro('');
          } else {
            let errorMessage = 'Erro ao processar simulação automática';
            
            if (error.message.includes('HTTP') || error.message.includes('fetch')) {
              errorMessage = 'Erro de conexão. Tente novamente.';
            } else {
              errorMessage = error.message;
            }
            
            setErro(errorMessage);
            setApiMessage(null);
          }
        } else {
          setErro('Erro desconhecido na simulação automática');
          setApiMessage(null);
        }
      } finally {
        setLoading(false);
      }
    }, 100); // Pequeno delay para garantir que os estados sejam atualizados
  };

  // Função para tentar novamente
  const handleTryAgain = () => {
    setApiMessage(null);
    setErro('');
    setResultado(null);
    // Manter os valores preenchidos para facilitar nova tentativa
  };

  // Função para nova simulação (limpa resultado mas mantém valores)
  const handleNewSimulation = () => {
    setResultado(null);
    setApiMessage(null);
    setErro('');
    // Manter valores para facilitar nova simulação
  };

  // Função para trocar para tabela PRICE e refazer simulação
  const handleSwitchToPrice = async () => {
    if (!sessionId || !cidade) return;

    // Alterar amortização para PRICE
    setAmortizacao('PRICE');
    setApiMessage(null);
    setErro('');
    setLoading(true);

    // Aguardar um pouco para garantir que o estado seja atualizado
    setTimeout(async () => {
      try {
        const simulationInput = {
          sessionId,
          nomeCompleto: 'Lead Anônimo',
          email: 'nao-informado@temp.com',
          telefone: '(00) 00000-0000',
          cidade: cidade,
          valorEmprestimo: validation.emprestimoValue,
          valorImovel: validation.garantiaValue,
          parcelas: parcelas,
          tipoAmortizacao: 'PRICE',
          userAgent: navigator.userAgent,
          ipAddress: undefined
        };


        const result = await LocalSimulationService.performSimulation(simulationInput);


        // Rastrear simulação na jornada do usuário
        trackSimulation({
          simulationId: result.id,
          valorEmprestimo: result.valorEmprestimo,
          valorImovel: result.valorImovel,
          parcelas: result.parcelas,
          cidade: result.cidade
        });

        setResultado(result);
        
        // Rolar para o resultado no mobile
        scrollToResult();

      } catch (error) {
        // Erro na simulação PRICE
        
        if (error instanceof Error) {
          const analysis = analyzeLocalMessage(error.message);
          
          if (analysis.type !== 'unknown_error') {
            setApiMessage(analysis);
            setErro('');
          } else {
            setErro('Erro ao refazer simulação com tabela PRICE');
            setApiMessage(null);
          }
        } else {
          setErro('Erro desconhecido ao refazer simulação');
          setApiMessage(null);
        }
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const isLtvMessage =
    apiMessage &&
    (apiMessage.type === 'limit_30_general' || apiMessage.type === 'limit_30_rural');

  const showSideComplement = !isMobile && (resultado || isLtvMessage);

  return (
    <div
      className={`container mx-auto px-3 ${
        isMobile ? 'py-2 pb-4' : 'py-2 min-h-[calc(100vh-4rem)]'
      } ${showSideComplement ? 'max-w-6xl' : 'max-w-xl'}`}
    >
      <div className={`${showSideComplement ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
        {/* Formulário de Simulação */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg md:text-xl font-bold text-green-500 mb-1">
              Sua simulação em um clique!
            </CardTitle>
            <p className="text-gray-600 text-xs">
              Com apenas algumas informações você já entende se as parcelas que cabem no orçamento!
            </p>
          </CardHeader>
          
          <CardContent className="p-3 md:p-4">
            <form onSubmit={handleSubmit} className="space-y-2">
              
              <CityAutocomplete value={cidade} onCityChange={setCidade} />

              <LoanAmountField value={emprestimo} onChange={handleEmprestimoChange} />

              <GuaranteeAmountField 
                value={garantia} 
                onChange={handleGarantiaChange}
                showError={validation.emprestimoExcedeGarantia}
              />

              <InstallmentsField value={parcelas} onChange={setParcelas} />

              <AmortizationField value={amortizacao} onChange={setAmortizacao} />

              {/* Botões */}
              <div className="flex gap-2 pt-2">
                <Button
                type="submit"
                disabled={!validation.formularioValido || loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 text-sm font-semibold min-h-[44px]"
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

              {/* Mensagem inteligente da API */}
              {apiMessage && (!isLtvMessage || isMobile) && (
                <div className="mt-3">
                  <SmartApiMessage
                    analysis={apiMessage}
                    valorImovel={validation.garantiaValue}
                    onAdjustValues={handleAdjustValues}
                    onTryAgain={handleTryAgain}
                  />
                </div>
              )}
              
              {/* Erro genérico */}
              {erro && !apiMessage && (
                <div className="mt-3">
                  <ApiMessageDisplay 
                    message={erro}
                    type="error"
                    onRetry={() => {
                      setErro('');
                      if (validation.formularioValido) {
                        handleSubmit(new Event('submit') as any);
                      }
                    }}
                    showRetryButton={validation.formularioValido}
                  />
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Resultado ou Complemento */}
        {(resultado || (isLtvMessage && apiMessage)) && (
          <div data-result-section="true" className={`${showSideComplement ? '' : 'mt-4'} scroll-mt-header`}>
            {resultado ? (
              <SimulationResultDisplay
                resultado={resultado}
                valorEmprestimo={validation.emprestimoValue}
                valorImovel={validation.garantiaValue}
                cidade={cidade}
                onNewSimulation={handleNewSimulation}
                onSwitchToPrice={handleSwitchToPrice}
              />
            ) : (
              <SmartApiMessage
                analysis={apiMessage as ApiMessageAnalysis}
                valorImovel={validation.garantiaValue}
                onAdjustValues={handleAdjustValues}
                onTryAgain={handleTryAgain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationForm;
