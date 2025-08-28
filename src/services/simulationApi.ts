/**
 * Interface para payload de simulação de crédito
 * 
 * @interface SimulationPayload
 * @description Define a estrutura de dados necessária para realizar uma simulação de crédito
 * 
 * @property {number} valor_solicitado - Valor do empréstimo solicitado (R$ 100.000 a R$ 5.000.000)
 * @property {number} vlr_imovel - Valor do imóvel em garantia (mínimo 2x valor solicitado)
 * @property {number} numero_parcelas - Quantidade de parcelas (36 a 180 meses)
 * @property {string} amortizacao - Sistema de amortização ('SAC' ou 'PRICE')
 * @property {number} juros - Taxa de juros mensal (em %)
 * @property {number} carencia - Período de carência em meses
 */
export interface SimulationPayload {
  valor_solicitado: number;
  vlr_imovel: number;
  numero_parcelas: number;
  amortizacao: string;
  juros: number;
  carencia: number;
  cidade: string;
}

/**
 * Interface para resposta da simulação
 * 
 * @interface ParcelaItem
 * @description Define a estrutura de uma parcela no resultado da simulação
 * 
 * @property {number[]} parcela - Array com valores da parcela normal
 * @property {number[]} [parcela_normal] - Array com valores da parcela sem carência
 * @property {number[]} [parcela_final] - Array com valores da parcela final
 */
export interface ParcelaItem {
  parcela: number[];
  parcela_normal?: number[];
  parcela_final?: number[];
}

export interface SimulationResponse {
  parcelas: ParcelaItem[];
}

/**
 * Interface para resposta de erro da API
 */
export interface ApiErrorResponse {
  message?: string;
  erro?: string;
  error?: string;
  msg?: string;
  mensagem?: string;
  detail?: string;
  details?: string;
}

/**
 * Type union para todas as possíveis respostas da API
 */
export type ApiResponse = SimulationResponse | ApiErrorResponse | string;

/**
 * Verifica se a resposta é uma mensagem de erro ou não contém dados válidos
 */
export const isErrorResponse = (response: any): boolean => {
  // Se é uma string, considerar como mensagem
  if (typeof response === 'string') {
    return true;
  }
  
  // Se é um objeto mas não tem parcelas, verificar se tem mensagem
  if (response && typeof response === 'object') {
    // Se tem parcelas válidas, não é erro
    if (response.parcelas && Array.isArray(response.parcelas) && response.parcelas.length > 0) {
      return false;
    }
    
    // Se tem algum campo de mensagem, é erro
    if (response.message || response.erro || response.error || 
        response.msg || response.mensagem || response.detail || response.details) {
      return true;
    }
    
    // Se é um objeto mas não tem parcelas nem mensagem, considerar inválido
    return true;
  }
  
  // Para outros tipos, considerar erro
  return true;
};

/**
 * Extrai a mensagem de erro da resposta
 */
export const getErrorMessage = (response: any): string => {
  // Se é uma string, retornar diretamente
  if (typeof response === 'string') {
    return response;
  }
  
  // Se é um objeto, tentar extrair a mensagem de diferentes campos
  if (response && typeof response === 'object') {
    return response.message || 
           response.erro || 
           response.error || 
           response.msg || 
           response.mensagem || 
           response.detail || 
           response.details || 
           'Mensagem não disponível para esta cidade';
  }
  
  return 'Resposta inválida da API';
};

/**
 * Realiza simulação de crédito com garantia de imóvel
 * 
 * @async
 * @function simulateCredit
 * @description Envia requisição para API de simulação e processa o resultado
 * 
 * @param {SimulationPayload} payload - Dados para simulação
 * @returns {Promise<{parcelas: ParcelaItem[]}>} Resultado da simulação com valores das parcelas
 * 
 * @throws {Error} Se a API retornar erro ou dados inválidos
 * 
 * @example
 * ```typescript
 * const resultado = await simulateCredit({
 *   valor_solicitado: 200000,
 *   vlr_imovel: 500000,
 *   numero_parcelas: 120,
 *   amortizacao: 'SAC',
 *   juros: 1.19,
 *   carencia: 1
 * });
 * ```
 */
export const simulateCredit = async (payload: SimulationPayload): Promise<SimulationResponse> => {
  console.log('Payload enviado:', payload);
  
  // Formatar dados como números simples, não strings
  const formattedData = {
    vlr_imovel: Number(payload.vlr_imovel),
    valor_solicitado: Number(payload.valor_solicitado),
    juros: Number(payload.juros),
    numero_parcelas: Number(payload.numero_parcelas),
    carencia: Number(payload.carencia),
    amortizacao: payload.amortizacao,
    cidade: payload.cidade
  };

  console.log('Dados formatados para envio:', formattedData);

  try {
    const response = await fetch('https://api-calculos.vercel.app/simulacao', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta completa da API:', JSON.stringify(data, null, 2));
    console.log('Tipo da resposta:', typeof data);
    console.log('Tem parcelas?', data?.parcelas ? 'Sim' : 'Não');
    console.log('É array?', Array.isArray(data?.parcelas));
    console.log('Quantidade de parcelas:', data?.parcelas?.length || 0);
    
    // Verificar se a resposta é uma mensagem de erro ou dados inválidos
    if (isErrorResponse(data)) {
      const errorMessage = getErrorMessage(data);
      console.log('API retornou mensagem ou dados inválidos:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Validação adicional para garantir que temos dados válidos
    if (!data.parcelas || !Array.isArray(data.parcelas) || data.parcelas.length === 0) {
      console.error('Estrutura de parcelas inválida:', data);
      throw new Error('API não retornou dados de parcelas válidos');
    }
    
    console.log('✅ Dados válidos recebidos da API');
    return data;
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    throw error;
  }
};
