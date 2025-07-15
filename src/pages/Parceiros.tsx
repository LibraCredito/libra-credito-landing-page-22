import React, { useEffect, useState } from 'react';
import { HandshakeIcon, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SelectItem } from "@/components/ui/select";
import MobileLayout from '@/components/MobileLayout';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { PartnersService } from '@/services/partnersService';
import { useUserJourney } from '@/hooks/useUserJourney';
import { validateEmail, validatePhone, formatPhone } from '@/utils/validations';
import ValidatedInput from '@/components/ValidatedInput';
import ValidatedSelect from '@/components/ValidatedSelect';

const Parceiros = () => {
  const { sessionId } = useUserJourney();
  
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [tempoHomeEquity, setTempoHomeEquity] = useState('');
  const [perfilCliente, setPerfilCliente] = useState('');
  const [ramoAtuacao, setRamoAtuacao] = useState('');
  const [origem, setOrigem] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estados de validação
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    document.title = "Seja Parceiro | Libra Crédito";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Torne-se um parceiro da Libra Crédito e cresça conosco. Acesse também a área exclusiva para parceiros.');
    }
  }, []);

  // Funções de validação
  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'nome':
        if (!value) {
          newErrors.nome = 'Nome é obrigatório';
        } else if (value.length < 3) {
          newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
        } else {
          delete newErrors.nome;
        }
        break;
        
      case 'email':
        if (!value) {
          newErrors.email = 'E-mail é obrigatório';
        } else if (!validateEmail(value)) {
          newErrors.email = 'E-mail inválido';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'telefone':
        if (!value) {
          newErrors.telefone = 'Telefone é obrigatório';
        } else if (!validatePhone(value)) {
          newErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
        } else {
          delete newErrors.telefone;
        }
        break;
        
      case 'cidade':
        if (!value) {
          newErrors.cidade = 'Cidade é obrigatória';
        } else if (value.length < 2) {
          newErrors.cidade = 'Cidade deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.cidade;
        }
        break;
        
      case 'cnpj':
        if (!value) {
          newErrors.cnpj = 'CNPJ é obrigatório';
        } else if (value.replace(/\D/g, '').length !== 14) {
          newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
        } else {
          delete newErrors.cnpj;
        }
        break;
        
      case 'tempoHomeEquity':
        if (!value) {
          newErrors.tempoHomeEquity = 'Tempo de experiência é obrigatório';
        } else {
          delete newErrors.tempoHomeEquity;
        }
        break;
        
      case 'perfilCliente':
        if (!value) {
          newErrors.perfilCliente = 'Perfil de cliente é obrigatório';
        } else {
          delete newErrors.perfilCliente;
        }
        break;
        
      case 'ramoAtuacao':
        if (!value) {
          newErrors.ramoAtuacao = 'Ramo de atuação é obrigatório';
        } else {
          delete newErrors.ramoAtuacao;
        }
        break;
        
      case 'origem':
        if (!value) {
          newErrors.origem = 'Como nos conheceu é obrigatório';
        } else {
          delete newErrors.origem;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Atualizar o valor
    switch (fieldName) {
      case 'nome': setNome(value); break;
      case 'email': setEmail(value); break;
      case 'telefone': setTelefone(value); break;
      case 'cidade': setCidade(value); break;
      case 'cnpj': setCnpj(value); break;
      case 'tempoHomeEquity': setTempoHomeEquity(value); break;
      case 'perfilCliente': setPerfilCliente(value); break;
      case 'ramoAtuacao': setRamoAtuacao(value); break;
      case 'origem': setOrigem(value); break;
      case 'mensagem': setMensagem(value); break;
    }
    
    // Marcar como tocado
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validar se já foi tocado
    if (touched[fieldName] || value) {
      validateField(fieldName, value);
    }
  };

  const validateForm = () => {
    const fields = ['nome', 'email', 'telefone', 'cidade', 'cnpj', 'tempoHomeEquity', 'perfilCliente', 'ramoAtuacao', 'origem'];
    const values = { nome, email, telefone, cidade, cnpj, tempoHomeEquity, perfilCliente, ramoAtuacao, origem };
    
    // Criar um objeto temporário para verificar erros
    const tempErrors: Record<string, string> = {};
    
    // Validar cada campo
    fields.forEach(field => {
      const value = values[field as keyof typeof values];
      
      switch (field) {
        case 'nome':
          if (!value) tempErrors.nome = 'Nome é obrigatório';
          else if (value.length < 3) tempErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
          break;
        case 'email':
          if (!value) tempErrors.email = 'E-mail é obrigatório';
          else if (!validateEmail(value)) tempErrors.email = 'E-mail inválido';
          break;
        case 'telefone':
          if (!value) tempErrors.telefone = 'Telefone é obrigatório';
          else if (!validatePhone(value)) tempErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
          break;
        case 'cidade':
          if (!value) tempErrors.cidade = 'Cidade é obrigatória';
          else if (value.length < 2) tempErrors.cidade = 'Cidade deve ter pelo menos 2 caracteres';
          break;
        case 'cnpj':
          if (!value) tempErrors.cnpj = 'CNPJ é obrigatório';
          else if (value.replace(/\D/g, '').length !== 14) tempErrors.cnpj = 'CNPJ deve ter 14 dígitos';
          break;
        case 'tempoHomeEquity':
          if (!value) tempErrors.tempoHomeEquity = 'Tempo de experiência é obrigatório';
          break;
        case 'perfilCliente':
          if (!value) tempErrors.perfilCliente = 'Perfil de cliente é obrigatório';
          break;
        case 'ramoAtuacao':
          if (!value) tempErrors.ramoAtuacao = 'Ramo de atuação é obrigatório';
          break;
        case 'origem':
          if (!value) tempErrors.origem = 'Como nos conheceu é obrigatório';
          break;
      }
    });
    
    // CNPJ já validado no loop acima
    
    // Marcar todos os campos como tocados
    setTouched(prev => {
      const newTouched = { ...prev };
      fields.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });
    
    // Atualizar os erros
    setErrors(tempErrors);
    
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId) {
      alert('Erro: Session ID não encontrado. Tente recarregar a página.');
      return;
    }
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      alert('Por favor, corrija os erros destacados no formulário.');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = {
        sessionId,
        nome,
        email,
        telefone,
        cidade,
        cnpj,
        tempoHomeEquity,
        perfilCliente,
        ramoAtuacao,
        origem,
        mensagem,
        userAgent: navigator.userAgent,
        ipAddress: undefined
      };
      
      // Usar o serviço de parceiros
      const result = await PartnersService.createPartnership(formData);
      
      // Limpar formulário
      setNome('');
      setEmail('');
      setTelefone('');
      setCidade('');
      setCnpj('');
      setTempoHomeEquity('');
      setPerfilCliente('');
      setRamoAtuacao('');
      setOrigem('');
      setMensagem('');
      setErrors({});
      setTouched({});
      
      setSuccess(true);
      
      // Exibir mensagem de sucesso temporária
      setTimeout(() => {
        setSuccess(false);
      }, 8000);
      
    } catch (error: any) {
      console.error('❌ Erro completo capturado:', {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        originalError: error
      });
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao enviar solicitação. Verifique os dados e tente novamente.';
      
      if (error?.message?.includes('TABELA_NAO_EXISTE')) {
        errorMessage = '🚨 ERRO TÉCNICO: A tabela de parceiros ainda não foi criada no banco de dados. Execute o script CORRECAO_DEFINITIVA_PARCEIROS.sql no Supabase.';
      } else if (error?.message?.includes('DUPLICATE_EMAIL')) {
        errorMessage = '⚠️ Este email já foi cadastrado como parceiro. Use outro email ou entre em contato conosco.';
      } else if (error?.message?.includes('CONEXAO_FALHOU')) {
        errorMessage = '🌐 Problema de conexão. Verifique sua internet e tente novamente.';
      } else if (error?.message?.includes('API_KEY_INVALIDA')) {
        errorMessage = '🔑 Erro de configuração do sistema. Verifique as credenciais do Supabase.';
      } else if (error?.message?.includes('PERMISSAO_NEGADA')) {
        errorMessage = '🚫 Erro de permissão no sistema. Execute o script de correção no Supabase.';
      } else if (error?.code === '42P01') {
        errorMessage = '🚨 Tabela "parceiros" não existe. Execute o script CORRECAO_DEFINITIVA_PARCEIROS.sql no Supabase.';
      } else if (error?.code === '42501') {
        errorMessage = '🚫 Sem permissão para inserir dados. Execute o script de correção no Supabase.';
      }
      
      alert(errorMessage);
      
      // Abrir debug automaticamente em caso de erro
      if (confirm('Erro detectado! Deseja abrir a ferramenta de debug para investigar?')) {
        window.open('debug-parceiros.html', '_blank');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <WaveSeparator variant="hero" height="md" inverted />
      
      <div className="bg-white pb-4 md:pb-8">
        <div className="container mx-auto px-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Formulário para Novos Parceiros */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-libra-navy mb-4">Seja um parceiro</h2>

              {/* Mensagem de sucesso */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-green-800 font-semibold">Solicitação enviada com sucesso!</h4>
                      <p className="text-green-700 text-sm">Nossa equipe entrará em contato em breve. Obrigado pelo interesse!</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ValidatedInput
                    label="Nome completo"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(value) => handleFieldChange('nome', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, nome: true }))}
                    error={errors.nome}
                    touched={touched.nome}
                    required
                  />
                  <ValidatedInput
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(value) => handleFieldChange('email', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    error={errors.email}
                    touched={touched.email}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <ValidatedInput
                    label="Telefone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={telefone}
                    onChange={(value) => handleFieldChange('telefone', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, telefone: true }))}
                    error={errors.telefone}
                    touched={touched.telefone}
                    required
                  />
                  <ValidatedInput
                    label="Cidade"
                    type="text"
                    placeholder="Sua cidade"
                    value={cidade}
                    onChange={(value) => handleFieldChange('cidade', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, cidade: true }))}
                    error={errors.cidade}
                    touched={touched.cidade}
                    required
                  />
                  <ValidatedInput
                    label="CNPJ"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={(value) => handleFieldChange('cnpj', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, cnpj: true }))}
                    error={errors.cnpj}
                    touched={touched.cnpj}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ValidatedSelect
                    label="Tempo de experiência com Home Equity"
                    value={tempoHomeEquity}
                    onChange={(value) => handleFieldChange('tempoHomeEquity', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, tempoHomeEquity: true }))}
                    error={errors.tempoHomeEquity}
                    touched={touched.tempoHomeEquity}
                    placeholder="Selecione o tempo"
                    required
                  >
                    <SelectItem value="menos-1">Menos de 1 ano</SelectItem>
                    <SelectItem value="1-2">1 a 2 anos</SelectItem>
                    <SelectItem value="2-5">2 a 5 anos</SelectItem>
                    <SelectItem value="mais-5">Mais de 5 anos</SelectItem>
                  </ValidatedSelect>

                  <ValidatedSelect
                    label="Perfil de cliente"
                    value={perfilCliente}
                    onChange={(value) => handleFieldChange('perfilCliente', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, perfilCliente: true }))}
                    error={errors.perfilCliente}
                    touched={touched.perfilCliente}
                    placeholder="Selecione o perfil"
                    required
                  >
                    <SelectItem value="pf">Pessoa Física</SelectItem>
                    <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </ValidatedSelect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ValidatedSelect
                    label="Ramo de atuação"
                    value={ramoAtuacao}
                    onChange={(value) => handleFieldChange('ramoAtuacao', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, ramoAtuacao: true }))}
                    error={errors.ramoAtuacao}
                    touched={touched.ramoAtuacao}
                    placeholder="Selecione seu ramo"
                    required
                  >
                    <SelectItem value="correspondente">Correspondente Bancário</SelectItem>
                    <SelectItem value="corretor">Corretor de Imóveis</SelectItem>
                    <SelectItem value="consultor">Consultor Financeiro</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </ValidatedSelect>

                  <ValidatedSelect
                    label="Como chegou até nós?"
                    value={origem}
                    onChange={(value) => handleFieldChange('origem', value)}
                    onBlur={() => setTouched(prev => ({ ...prev, origem: true }))}
                    error={errors.origem}
                    touched={touched.origem}
                    placeholder="Como nos conheceu"
                    required
                  >
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="redes-sociais">Redes Sociais</SelectItem>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </ValidatedSelect>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mensagem (opcional)
                  </label>
                  <Textarea
                    placeholder="Conte-nos mais sobre seu interesse..."
                    className="min-h-[80px] transition-colors"
                    value={mensagem}
                    onChange={(e) => handleFieldChange('mensagem', e.target.value)}
                  />
                </div>

                {/* Resumo de erros */}
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                      Por favor, corrija os seguintes erros:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  className="w-full bg-libra-navy hover:bg-libra-navy/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </div>
                  ) : Object.keys(errors).length > 0 ? (
                    'Corrija os erros para continuar'
                  ) : (
                    'Enviar Solicitação'
                  )}
                </Button>
                
              </form>
            </div>

            {/* Área de Acesso para Parceiros */}
            <div className="lg:flex lg:items-center h-full">
              <div className="bg-libra-navy rounded-xl p-4 md:p-6 text-white text-center w-full">
                <div className="flex justify-center mb-4">
                  <LockKeyhole className="w-12 h-12 text-libra-blue" />
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold mb-3">Área do Parceiro</h2>
                
                <p className="text-libra-silver mb-6 text-sm">
                  Já é nosso parceiro? Acesse a área exclusiva para materiais, 
                  relatórios e ferramentas especiais.
                </p>

                <Button 
                  onClick={() => window.location.href = "https://parceiros.libracredito.com.br/login"}
                  className="w-full bg-[#00ccff] hover:bg-[#00ccff]/90 text-white mb-4"
                >
                  Já sou Parceiro
                </Button>
                
                <div className="text-xs text-libra-silver/80 space-y-2">
                  <p>✓ Material de divulgação</p>
                  <p>✓ Relatórios de comissão</p>
                  <p>✓ Suporte especializado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Parceiros;
