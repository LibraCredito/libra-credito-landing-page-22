/**
 * Serviço de simulação integrado com Supabase
 * 
 * @service simulationService
 * @description Serviço que combina a API de simulação existente com o armazenamento no Supabase
 * 
 * @features
 * - Integração com API de simulação existente
 * - Armazenamento automático no Supabase
 * - Tracking de jornada do usuário
 * - Validação de dados
 * - Tratamento de erros
 * 
 * @workflow
 * 1. Recebe dados da simulação
 * 2. Chama API de simulação existente
 * 3. Processa resultado
 * 4. Salva no Supabase com session_id
 * 5. Retorna dados para o componente
 */

import { supabaseApi, SimulacaoData } from '@/lib/supabase';
import { simulateCredit } from '@/services/simulationApi';
import { validateEmail, validatePhone, formatPhone } from '@/utils/validations';

// Tipos para o serviço
export interface SimulationInput {
  sessionId: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidade: string;
  valorEmprestimo: number;
  valorImovel: number;
  parcelas: number;
  tipoAmortizacao: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface SimulationResult {
  id: string;
  valor: number;
  amortizacao: string;
  parcelas: number;
  primeiraParcela?: number;
  ultimaParcela?: number;
  valorEmprestimo: number;
  valorImovel: number;
  cidade: string;
  sessionId: string;
}

export interface ContactFormInput {
  simulationId: string;
  sessionId: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  imovelProprio: 'proprio' | 'terceiro';
  observacoes?: string;
}

// Classe principal do serviço
export class SimulationService {
  
  /**
   * Realiza simulação e salva no Supabase
   */
  static async performSimulation(input: SimulationInput): Promise<SimulationResult> {
    try {
      console.log('🎯 Iniciando simulação:', input);
      
      // 1. Validar dados de entrada
      this.validateSimulationInput(input);
      
      // 2. Preparar payload para API existente
      const apiPayload = {
        valor_solicitado: input.valorEmprestimo,
        vlr_imovel: input.valorImovel,
        numero_parcelas: input.parcelas,
        amortizacao: input.tipoAmortizacao,
        juros: 1.09,
        carencia: 2,
        cidade: input.cidade
      };
      
      console.log('📡 Enviando para API:', apiPayload);
      
      // 3. Chamar API de simulação existente
      const apiResult = await simulateCredit(apiPayload);
      
      console.log('✅ Resposta da API:', apiResult);
      
      // 4. Processar resultado da API
      const processedResult = this.processApiResult(apiResult, input.tipoAmortizacao, input.parcelas);
      
      // 5. Preparar dados para Supabase
      const supabaseData: Omit<SimulacaoData, 'id' | 'created_at'> = {
        session_id: input.sessionId,
        nome_completo: input.nomeCompleto,
        email: input.email,
        telefone: this.formatPhoneNumber(input.telefone),
        cidade: input.cidade,
        valor_emprestimo: input.valorEmprestimo,
        valor_imovel: input.valorImovel,
        parcelas: input.parcelas,
        tipo_amortizacao: input.tipoAmortizacao,
        parcela_inicial: processedResult.primeiraParcela,
        parcela_final: processedResult.ultimaParcela || processedResult.valor,
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
        status: 'novo'
      };
      
      console.log('💾 Salvando no Supabase:', supabaseData);
      
      // 6. Salvar no Supabase
      const savedSimulation = await supabaseApi.createSimulacao(supabaseData);
      
      console.log('✅ Simulação salva:', savedSimulation);
      
      // 7. Retornar resultado formatado
      return {
        id: savedSimulation.id!,
        valor: processedResult.valor,
        amortizacao: input.tipoAmortizacao,
        parcelas: input.parcelas,
        primeiraParcela: processedResult.primeiraParcela,
        ultimaParcela: processedResult.ultimaParcela,
        valorEmprestimo: input.valorEmprestimo,
        valorImovel: input.valorImovel,
        cidade: input.cidade,
        sessionId: input.sessionId
      };
      
    } catch (error) {
      console.error('❌ Erro na simulação:', error);
      throw error;
    }
  }
  
  /**
   * Processa formulário de contato pós-simulação
   */
  static async submitContactForm(input: ContactFormInput): Promise<void> {
    try {
      console.log('📋 Processando formulário de contato:', input);
      
      // Importar o cliente Supabase
      const { supabase } = await import('@/lib/supabase');
      
      // Atualizar dados pessoais da simulação
      const { data: updatedSimulation, error: updateError } = await supabase
        .from('simulacoes')
        .update({
          nome_completo: input.nomeCompleto,
          email: input.email,
          telefone: this.formatPhoneNumber(input.telefone),
          imovel_proprio: input.imovelProprio,
          status: 'interessado'
        })
        .eq('id', input.simulationId)
        .select()
        .single();
      
      if (updateError) {
        console.error('Erro na atualização:', updateError);
        throw updateError;
      }
      
      console.log('✅ Dados pessoais atualizados na simulação:', updatedSimulation);
      
      // Aqui você pode adicionar integração com:
      // - Email marketing (Mailchimp, SendGrid)
      // - CRM (Ploomes, que você mencionou)
      // - WhatsApp Business API
      // - Webhook para notificações
      
    } catch (error) {
      console.error('❌ Erro ao processar contato:', error);
      throw error;
    }
  }
  
  /**
   * Buscar simulações para admin
   */
  static async getSimulacoes(limit = 50) {
    try {
      return await supabaseApi.getSimulacoes(limit);
    } catch (error) {
      console.error('❌ Erro ao buscar simulações:', error);
      throw error;
    }
  }
  
  /**
   * Atualizar status de simulação
   */
  static async updateSimulationStatus(id: string, status: string) {
    try {
      return await supabaseApi.updateSimulacaoStatus(id, status);
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      throw error;
    }
  }
  
  // Métodos privados
  
  /**
   * Validar dados de entrada
   */
  private static validateSimulationInput(input: SimulationInput): void {
    if (!input.sessionId) throw new Error('Session ID é obrigatório');
    if (!input.nomeCompleto || input.nomeCompleto.length < 3) {
      throw new Error('Nome completo deve ter pelo menos 3 caracteres');
    }
    if (!input.email || !this.validateEmail(input.email)) {
      throw new Error('Email inválido');
    }
    if (!input.telefone || input.telefone.length < 10) {
      throw new Error('Telefone inválido');
    }
    if (!input.cidade) throw new Error('Cidade é obrigatória');
    if (input.valorEmprestimo < 100000 || input.valorEmprestimo > 5000000) {
      throw new Error('Valor do empréstimo deve estar entre R$ 100.000 e R$ 5.000.000');
    }
    if (input.valorImovel < input.valorEmprestimo * 2) {
      throw new Error('Valor do imóvel deve ser pelo menos 2x o valor do empréstimo');
    }
  }
  
  /**
   * Processar resultado da API
   */
  private static processApiResult(apiResult: any, amortizacao: string, parcelas: number) {
    if (!apiResult || !apiResult.parcelas || !Array.isArray(apiResult.parcelas)) {
      throw new Error('API retornou estrutura de dados inválida');
    }
    
    // Buscar parcela com valor válido
    const parcelaComValor = apiResult.parcelas.find((p: any, index: number) => 
      index > 0 && p.parcela_final && p.parcela_final[0] > 0
    );
    
    if (!parcelaComValor) {
      throw new Error('API não retornou parcelas com valores válidos');
    }
    
    const valor = parcelaComValor.parcela_final[0];
    
    let primeiraParcela: number | undefined;
    let ultimaParcela: number | undefined;
    
    if (amortizacao === 'SAC') {
      // Para SAC, buscar primeira e última parcela
      const primeiraParcelaObj = apiResult.parcelas.find((p: any, index: number) => 
        index > 0 && p.parcela_final && p.parcela_final[0] > 0
      );
      
      if (primeiraParcelaObj?.parcela_final?.[0]) {
        primeiraParcela = primeiraParcelaObj.parcela_final[0];
      }
      
      const ultimaParcelaObj = apiResult.parcelas.slice().reverse().find((p: any) => 
        p.parcela_final && p.parcela_final[0] > 0
      );
      
      if (ultimaParcelaObj?.parcela_final?.[0]) {
        ultimaParcela = ultimaParcelaObj.parcela_final[0];
      }
    }
    
    return {
      valor,
      primeiraParcela,
      ultimaParcela
    };
  }
  
  /**
   * Validar email
   */
  private static validateEmail(email: string): boolean {
    return validateEmail(email);
  }
  
  /**
   * Formatar número de telefone
   */
  private static formatPhoneNumber(phone: string): string {
    return formatPhone(phone);
  }
}

export default SimulationService;
