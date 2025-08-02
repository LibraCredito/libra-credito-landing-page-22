
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { LocalSimulationService } from '@/services/localSimulationService';
import { useUserJourney } from '@/hooks/useUserJourney';
import Home from 'lucide-react/dist/esm/icons/home';
import Building from 'lucide-react/dist/esm/icons/building';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import { cn } from '@/lib/utils';

interface ContactFormProps {
  simulationResult: {
    id?: string;
    valor: number;
    amortizacao: string;
    parcelas: number;
    primeiraParcela?: number;
    ultimaParcela?: number;
  };
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  compact?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  simulationResult, 
  className = '',
  inputClassName = '',
  buttonClassName = '',
  compact = false
}) => {
  const { sessionId } = useUserJourney();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [imovelProprio, setImovelProprio] = useState<'proprio' | 'terceiro' | ''>('');
  const [aceitePrivacidade, setAceitePrivacidade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showIncompleteError, setShowIncompleteError] = useState(false);

  const invalidNome = nome.trim() === '';
  const invalidEmail = email.trim() === '';
  const invalidTelefone = telefone.trim() === '';
  const invalidImovelProprio = imovelProprio === '';
  const invalidAceite = !aceitePrivacidade;
  const formComplete =
    !invalidNome &&
    !invalidEmail &&
    !invalidTelefone &&
    !invalidImovelProprio &&
    !invalidAceite;

  useEffect(() => {
    if (formComplete) {
      setShowIncompleteError(false);
    }
  }, [formComplete]);

  // Função para aplicar máscara de telefone
  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara conforme o número de dígitos
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setTelefone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formComplete) {
      setShowIncompleteError(true);
      return;
    }
    
    console.log('🔍 Debug dados da simulação:', {
      simulationResult,
      simulationId: simulationResult.id,
      sessionId,
      hasId: !!simulationResult.id,
      hasSessionId: !!sessionId
    });
    
    if (!aceitePrivacidade) {
      alert('É necessário aceitar a Política de Privacidade para continuar.');
      return;
    }

    if (!imovelProprio) {
      alert('Por favor, informe se o imóvel é próprio ou de terceiro.');
      return;
    }

    if (!simulationResult.id) {
      console.error('❌ ID da simulação não encontrado:', simulationResult);
      alert('Erro: ID da simulação não encontrado. Tente simular novamente.');
      return;
    }
    
    if (!sessionId) {
      console.error('❌ Session ID não encontrado');
      alert('Erro: Session ID não encontrado. Tente recarregar a página.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📋 Enviando formulário de contato:', {
        simulationId: simulationResult.id,
        sessionId,
        nome,
        email,
        telefone,
        imovelProprio,
        imovelProprioTexto: imovelProprio === 'proprio' ? 'Imóvel Próprio' : 'Imóvel de Terceiro'
      });
      
      // Usar o serviço local com dados da simulação
      await LocalSimulationService.processContact({
        simulationId: simulationResult.id,
        sessionId,
        nomeCompleto: nome,
        email,
        telefone,
        imovelProprio,
        observacoes: `Simulação: ${simulationResult.amortizacao} - ${simulationResult.parcelas}x - R$ ${simulationResult.valor.toLocaleString('pt-BR')}`,
        // Dados adicionais para API Ploomes
        valorDesejadoEmprestimo: simulationResult.valorEmprestimo,
        valorImovelGarantia: simulationResult.valorImovel,
        valorParcelaCalculada: simulationResult.valor,
        tipoAmortizacao: simulationResult.amortizacao,
        quantidadeParcelas: simulationResult.parcelas,
        aceitaPolitica: aceitePrivacidade
      });
      
      // Redirecionar diretamente para a página de confirmação
      navigate('/confirmacao');
      
      // Limpar formulário
      setNome('');
      setEmail('');
      setTelefone('');
      setImovelProprio('');
      setAceitePrivacidade(false);
      
    } catch (error) {
      console.error('❌ Erro ao enviar solicitação:', error);
      
      let mensagemErro = 'Erro ao enviar solicitação. ';
      
      if (error instanceof Error) {
        // Verificar se é erro de duplicidade do Ploomes/CRM
        if (error.message.toLowerCase().includes('já existe') || 
            error.message.toLowerCase().includes('7 dias') ||
            error.message.toLowerCase().includes('lead já existe')) {
          mensagemErro = '⚠️ Você já possui uma solicitação em andamento.\n\nNossa equipe já está analisando seu pedido anterior.\nAguarde nosso contato!\n\n📞 Em caso de dúvidas, entre em contato pelo WhatsApp.';
        } else {
          mensagemErro += error.message;
        }
      } else {
        mensagemErro += 'Por favor, tente novamente.';
      }
      
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const valorFormatado = simulationResult.valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  // Versão compacta para uso no resultado visual
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <div>
          <label htmlFor="nome-compact" className="sr-only">
            Nome Completo
          </label>
          <Input
            id="nome-compact"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome Completo"
            className={cn(
              'rounded-lg h-12 focus:shadow-md',
              inputClassName,
              invalidNome && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            required
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="email-compact" className="sr-only">
            E-mail
          </label>
          <Input
            id="email-compact"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className={cn(
              'rounded-lg h-12 focus:shadow-md',
              inputClassName,
              invalidEmail && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            required
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="telefone-compact" className="sr-only">
            Telefone
          </label>
          <Input
            id="telefone-compact"
            type="tel"
            value={telefone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Telefone (99) 99999-9999"
            className={cn(
              'rounded-lg h-12 focus:shadow-md',
              inputClassName,
              invalidTelefone && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            inputMode="numeric"
            required
            aria-required="true"
          />
        </div>
        
        <fieldset className={cn('space-y-2', invalidImovelProprio && 'border border-red-500 rounded-md p-2')}>
          <legend id="tipo-imovel-label" className="text-sm text-white font-medium mb-1">
            O imóvel que será utilizado como garantia é:
          </legend>
          <div className="flex gap-3" role="radiogroup" aria-labelledby="tipo-imovel-label">
            <label
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-sm font-medium cursor-pointer ${
                imovelProprio === 'proprio' ? 'bg-white text-libra-blue' : 'bg-white/50 text-libra-navy'
              }`}
            >
              <input
                type="radio"
                name="imovelProprioCompact"
                value="proprio"
                checked={imovelProprio === 'proprio'}
                onChange={(e) => setImovelProprio(e.target.value as 'proprio')}
                className="sr-only"
                required
              />
              <Home className="w-4 h-4" />
              Imóvel Próprio
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-sm font-medium cursor-pointer ${
                imovelProprio === 'terceiro' ? 'bg-white text-libra-blue' : 'bg-white/50 text-libra-navy'
              }`}
            >
              <input
                type="radio"
                name="imovelProprioCompact"
                value="terceiro"
                checked={imovelProprio === 'terceiro'}
                onChange={(e) => setImovelProprio(e.target.value as 'terceiro')}
                className="sr-only"
                required
              />
              <Building className="w-4 h-4" />
              Imóvel de terceiro
            </label>
          </div>
        </fieldset>

        <div
          className={cn(
            'flex items-start gap-2 mt-4',
            invalidAceite && 'border border-red-500 rounded-md p-2'
          )}
        >
          <Checkbox
            id="aceite-compact"
            checked={aceitePrivacidade}
            onCheckedChange={(checked) => setAceitePrivacidade(checked as boolean)}
            className="bg-white"
          />
          <label htmlFor="aceite-compact" className="text-sm text-white font-bold leading-tight">
            Concordo com a{' '}
            <Link
              to="/politica-privacidade"
              className="underline hover:text-white"
              target="_blank"
            >
              Política de Privacidade
            </Link>
          </label>
        </div>

        <div className="relative">
          <Button
            type="submit"
            disabled={loading || !formComplete}
            className={`w-full h-14 text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-libra-navy hover:from-yellow-500 hover:to-yellow-600 ${buttonClassName}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Enviando...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Solicitar análise agora
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
          { !formComplete && !loading && (
            <div
              className="absolute inset-0 rounded-full cursor-not-allowed"
              onClick={(e) => {
                e.preventDefault();
                setShowIncompleteError(true);
              }}
            />
          )}
        </div>
        {showIncompleteError && !formComplete && (
          <p className="text-red-600 text-sm mt-2">Preencha todos os campos</p>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resultado da simulação */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-4 text-center">
          <div className="bg-blue-800 rounded-lg p-3 mb-3 inline-block">
            <p className="text-sm mb-1">Valor da sua parcela:</p>
            <p className="text-2xl font-bold">{valorFormatado}</p>
          </div>
          
          <div className="text-xs space-y-1">
            <p>
              Parcela calculada pela tabela {simulationResult.amortizacao.toUpperCase()} com
              taxa de juros de 1,19% a.m. + IPCA. Esta taxa pode sofrer alterações de acordo
              com a análise de crédito. Já estão inclusos custos com avaliação do imóvel,
              cartório e impostos.
            </p>
            
            {simulationResult.amortizacao === 'SAC' && simulationResult.primeiraParcela && simulationResult.ultimaParcela && (
              <p className="mt-2">
                <strong>Sistema SAC:</strong> Primeira parcela: {simulationResult.primeiraParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | 
                Última parcela: {simulationResult.ultimaParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de contato */}
      <Card className="bg-libra-green">

        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-libra-navy text-center">
            Gostou? Preencha os campos abaixo e solicite uma análise de crédito! Em breve a 
            nossa equipe entrará em contato para dar continuidade no processo do seu 
            empréstimo.
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="nome-full" className="block text-sm font-medium text-libra-navy mb-1">
                Nome Completo *
              </label>
              <Input
                id="nome-full"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                className={cn(invalidNome && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                required
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="email-full" className="block text-sm font-medium text-libra-navy mb-1">
                E-mail *
              </label>
              <Input
                id="email-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className={cn(invalidEmail && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                required
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="telefone-full" className="block text-sm font-medium text-libra-navy mb-1">
                Telefone *
              </label>
              <Input
                id="telefone-full"
                type="tel"
                value={telefone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(99) 99999-9999"
                inputMode="numeric"
                className={cn(invalidTelefone && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
                required
                aria-required="true"
              />
            </div>

            <fieldset className={cn('space-y-3', invalidImovelProprio && 'border border-red-500 rounded-md p-2')}>
              <legend id="tipo-imovel-legend" className="text-sm font-medium text-libra-navy">
                O imóvel que será utilizado como garantia é: *
                <div className="text-xs text-gray-500 font-normal mt-1" title="A matrícula/escritura do imóvel está no seu nome próprio ou de um terceiro?">
                  (A matrícula/escritura do imóvel está no seu nome próprio ou de um terceiro?)
                </div>
              </legend>
              <div className="flex gap-4" role="radiogroup" aria-labelledby="tipo-imovel-legend">
                <label
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md shadow-sm cursor-pointer ${
                    imovelProprio === 'proprio' ? 'bg-white text-libra-blue' : 'bg-libra-light/60 text-libra-navy'
                  }`}
                >
                  <input
                    type="radio"
                    name="imovelProprio"
                    value="proprio"
                    checked={imovelProprio === 'proprio'}
                    onChange={(e) => setImovelProprio(e.target.value as 'proprio')}
                    className="text-libra-blue"
                    required
                    aria-describedby="tipo-imovel-help"
                  />
                  Imóvel Próprio
                </label>
                <label
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md shadow-sm cursor-pointer ${
                    imovelProprio === 'terceiro' ? 'bg-white text-libra-blue' : 'bg-libra-light/60 text-libra-navy'
                  }`}
                >
                  <input
                    type="radio"
                    name="imovelProprio"
                    value="terceiro"
                    checked={imovelProprio === 'terceiro'}
                    onChange={(e) => setImovelProprio(e.target.value as 'terceiro')}
                    className="text-libra-blue"
                    required
                    aria-describedby="tipo-imovel-help"
                  />
                  Imóvel de terceiro
                </label>
              </div>
              <div id="tipo-imovel-help" className="sr-only">
                Selecione se o imóvel usado como garantia é seu ou de terceiros
              </div>
            </fieldset>

            <div
              className={cn(
                'flex items-start gap-2 mt-2',
                invalidAceite && 'border border-red-500 rounded-md p-2'
              )}
            >
              <Checkbox
                id="aceite"
                checked={aceitePrivacidade}
                onCheckedChange={(checked) => setAceitePrivacidade(checked as boolean)}
                className="bg-white"
              />
              <label htmlFor="aceite" className="text-sm font-bold text-white leading-tight bg-libra-light/60 px-3 py-2 rounded-md shadow-sm focus-within:outline focus-within:outline-libra-blue">

                Tenho ciência e concordo que meus dados de contato aqui informados poderão ser
                utilizados pela Libra Crédito de acordo com os termos da{' '}
                <Link
                  to="/politica-privacidade"
                  className="text-libra-blue underline hover:text-libra-navy"
                  target="_blank"
                >
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <div className="relative">
              <Button
                type="submit"
                disabled={loading || !formComplete}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-libra-navy hover:from-yellow-500 hover:to-yellow-600"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Solicitar análise agora
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
              { !formComplete && !loading && (
                <div
                  className="absolute inset-0 rounded-full cursor-not-allowed"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowIncompleteError(true);
                  }}
                />
              )}
            </div>
            {showIncompleteError && !formComplete && (
              <p className="text-red-600 text-sm mt-2">Preencha todos os campos</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
