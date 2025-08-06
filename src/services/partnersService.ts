/**
 * Serviço de parceiros integrado com Supabase
 * 
 * @service partnersService
 * @description Serviço para gerenciar solicitações de parceria
 * 
 * @features
 * - Armazenamento de solicitações de parceria
 * - Tracking de jornada do usuário
 * - Validação de dados
 * - Gestão de status
 */

import type { ParceiroData } from '@/lib/supabase';
import { validateEmail, validatePhone, formatPhone } from '@/utils/validations';
import { EmailService, PartnerEmailData } from './emailService';

// Tipos para o serviço
export interface PartnerInput {
  sessionId: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  cnpj?: string;
  tempoHomeEquity: string;
  perfilCliente: string;
  ramoAtuacao: string;
  origem: string;
  mensagem?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface PartnerResult {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  status: string;
  sessionId: string;
}

// Classe principal do serviço
export class PartnersService {
  
  /**
   * Cria nova solicitação de parceria
   */
  static async createPartnership(input: PartnerInput): Promise<PartnerResult> {
    try {
      console.log('🤝 Criando solicitação de parceria:', input);
      const { supabaseApi } = await import('@/lib/supabase');

      // 0. Testar conexão primeiro
      console.log('🔄 Testando conexão Supabase...');
      await supabaseApi.testConnection();
      
      // 1. Validar dados de entrada
      this.validatePartnerInput(input);
      
      // 2. Preparar dados para Supabase
      const supabaseData: Omit<ParceiroData, 'id' | 'created_at' | 'updated_at'> = {
        session_id: input.sessionId,
        nome: input.nome,
        email: input.email,
        telefone: this.formatPhoneNumber(input.telefone),
        cidade: input.cidade,
        cnpj: input.cnpj?.replace(/\D/g, '') || null, // Limpar CNPJ
        tempo_home_equity: input.tempoHomeEquity,
        perfil_cliente: input.perfilCliente,
        ramo_atuacao: input.ramoAtuacao,
        origem: input.origem,
        mensagem: input.mensagem,
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
        status: 'pendente'
      };
      
      console.log('💾 Salvando no Supabase:', supabaseData);
      
      // 3. Salvar no Supabase
      const savedPartner = await supabaseApi.createParceiro(supabaseData);
      
      console.log('✅ Parceiro salvo:', savedPartner);
      
      // 4. Enviar emails automáticos (não bloqueia o retorno)
      try {
        const emailData: PartnerEmailData = {
          sessionId: input.sessionId,
          nome: input.nome,
          email: input.email,
          telefone: input.telefone,
          cidade: input.cidade,
          cnpj: input.cnpj,
          tempoHomeEquity: input.tempoHomeEquity,
          perfilCliente: input.perfilCliente,
          ramoAtuacao: input.ramoAtuacao,
          origem: input.origem,
          mensagem: input.mensagem,
          dataSubmissao: new Date().toLocaleString('pt-BR'),
          ipAddress: input.ipAddress,
          userAgent: input.userAgent
        };

        // Enviar email para equipe em background (não aguarda resultado)
        EmailService.sendAdminNotification(emailData).then(success => {
          if (success) {
            console.log('✅ Email enviado automaticamente para equipe: contato@libracredito.com.br');
          } else {
            console.warn('⚠️ Falha no envio automático de email para equipe (parceiro foi salvo)');
          }
        }).catch(emailError => {
          console.error('❌ Erro no envio automático de email:', emailError);
        });
        
      } catch (emailError) {
        console.error('❌ Erro ao preparar emails automáticos:', emailError);
        // Não falha o processo - parceiro já foi salvo
      }
      
      // 5. Retornar resultado formatado
      return {
        id: savedPartner.id!,
        nome: savedPartner.nome,
        email: savedPartner.email,
        telefone: savedPartner.telefone,
        cidade: savedPartner.cidade,
        status: savedPartner.status || 'pendente',
        sessionId: savedPartner.session_id
      };
      
    } catch (error: any) {
      console.error('❌ Erro ao criar parceria:', error);
      
      // Tratar erros específicos do Supabase
      if (error?.code === '42P01') {
        throw new Error('TABELA_NAO_EXISTE: A tabela "parceiros" não foi criada no Supabase. Execute o script SQL primeiro.');
      }
      
      if (error?.code === '23505') {
        throw new Error('DUPLICATE_EMAIL: Este email já foi cadastrado como parceiro.');
      }
      
      if (error?.code === '23503') {
        throw new Error('REFERENCIA_INVALIDA: Erro de referência no banco de dados.');
      }
      
      if (error?.code === '42501') {
        throw new Error('PERMISSAO_NEGADA: Sem permissão para inserir dados na tabela parceiros.');
      }
      
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('CONEXAO_FALHOU: Não foi possível conectar com o Supabase. Verifique sua conexão.');
      }
      
      if (error?.message?.includes('Invalid API key')) {
        throw new Error('API_KEY_INVALIDA: Chave de API do Supabase inválida.');
      }
      
      // Erro genérico
      throw new Error(`ERRO_SUPABASE: ${error?.message || 'Erro desconhecido ao salvar parceiro'}`);
    }
  }
  
  /**
   * Buscar parceiros para admin
   */
  static async getParceiros(limit = 50) {
    try {
      const { supabaseApi } = await import('@/lib/supabase');
      return await supabaseApi.getParceiros(limit);
    } catch (error) {
      console.error('❌ Erro ao buscar parceiros:', error);
      throw error;
    }
  }
  
  /**
   * Atualizar status de parceiro
   */
  static async updatePartnerStatus(id: string, status: string) {
    try {
      const { supabaseApi } = await import('@/lib/supabase');
      return await supabaseApi.updateParceiroStatus(id, status);
    } catch (error) {
      console.error('❌ Erro ao atualizar status do parceiro:', error);
      throw error;
    }
  }
  
  /**
   * Buscar estatísticas de parceiros
   */
  static async getPartnersStats() {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.rpc('get_parceiros_stats');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
  
  // Métodos privados
  
  /**
   * Validar dados de entrada
   */
  private static validatePartnerInput(input: PartnerInput): void {
    if (!input.sessionId) throw new Error('Session ID é obrigatório');
    if (!input.nome || input.nome.length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }
    if (!input.email || !validateEmail(input.email)) {
      throw new Error('Email inválido');
    }
    if (!input.telefone || !validatePhone(input.telefone)) {
      throw new Error('Telefone inválido');
    }
    if (!input.cidade) throw new Error('Cidade é obrigatória');
    if (!input.tempoHomeEquity) throw new Error('Tempo de experiência é obrigatório');
    if (!input.perfilCliente) throw new Error('Perfil de cliente é obrigatório');
    if (!input.ramoAtuacao) throw new Error('Ramo de atuação é obrigatório');
    if (!input.origem) throw new Error('Origem é obrigatória');
    
    // Validar CNPJ se fornecido (validação simplificada)
    if (input.cnpj && input.cnpj.replace(/\D/g, '').length > 0 && input.cnpj.replace(/\D/g, '').length !== 14) {
      console.warn('CNPJ com formato não padrão:', input.cnpj);
      // Não bloquear por CNPJ inválido - apenas logar warning
    }
  }
  
  /**
   * Validar CNPJ
   */
  private static validateCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    if (cleanCNPJ.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;
    
    return true;
  }
  
  /**
   * Formatar número de telefone
   */
  private static formatPhoneNumber(phone: string): string {
    return formatPhone(phone);
  }
}

export default PartnersService;
