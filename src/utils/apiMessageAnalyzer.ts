/**
 * Utilitários para detectar e processar diferentes tipos de resposta da API
 */

export interface ApiMessageAnalysis {
  type: 'success' | 'limit_30_general' | 'limit_30_rural' | 'no_service' | 'unknown_error';
  originalMessage: string;
  cidade?: string;
  valorSugerido?: number;
  shouldLimitTo30Percent?: boolean;
  needsRuralConfirmation?: boolean;
  shouldBlockSimulation?: boolean;
}

/**
 * Analisa a mensagem da API e determina o tipo de resposta
 */
export const analyzeApiMessage = (message: string): ApiMessageAnalysis => {
  
  // Padrão 1: Limite 30% geral
  // "Em Guaxupé - MG, o valor máximo de empréstimo deverá corresponder a no máximo 30 % do valor do imóvel. Ajuste o montante solicitado para R$ 60000.0."
  const pattern30General = /em\s+([^,]+),?\s+o\s+valor\s+máximo.*30\s*%.*ajuste.*r\$?\s*([\d.,]+)/i;
  const match30General = message.match(pattern30General);
  
  if (match30General) {
    const cidade = match30General[1].trim();
    const valorSugerido = extractMonetaryValue(match30General[2]);
    
    return {
      type: 'limit_30_general',
      originalMessage: message,
      cidade,
      valorSugerido,
      shouldLimitTo30Percent: true,
      needsRuralConfirmation: false,
      shouldBlockSimulation: false
    };
  }
  
  // Padrão 2: Limite 30% apenas rurais
  // "Em Jacuí - MG, aceitamos apenas imóveis rurais como garantia, com limite de empréstimo de até 30 % do valor do imóvel. Ajuste o valor solicitado para R$ 60000.0"
  const pattern30Rural = /em\s+([^,]+),?\s+aceitamos\s+apenas\s+imóveis\s+rurais.*30\s*%.*ajuste.*r\$?\s*([\d.,]+)/i;
  const match30Rural = message.match(pattern30Rural);
  
  if (match30Rural) {
    const cidade = match30Rural[1].trim();
    const valorSugerido = extractMonetaryValue(match30Rural[2]);
    
    return {
      type: 'limit_30_rural',
      originalMessage: message,
      cidade,
      valorSugerido,
      shouldLimitTo30Percent: true,
      needsRuralConfirmation: true,
      shouldBlockSimulation: false
    };
  }
  
  // Padrão 3: Não realizamos empréstimo
  // "Em Ribeira do Pombal - BA não realizamos empréstimo"
  const patternNoService = /em\s+([^,]+)\s+não\s+realizamos\s+empréstimo/i;
  const matchNoService = message.match(patternNoService);
  
  if (matchNoService) {
    const cidade = matchNoService[1].trim();
    
    return {
      type: 'no_service',
      originalMessage: message,
      cidade,
      shouldLimitTo30Percent: false,
      needsRuralConfirmation: false,
      shouldBlockSimulation: true
    };
  }
  
  // Caso não reconhecido
  return {
    type: 'unknown_error',
    originalMessage: message,
    shouldLimitTo30Percent: false,
    needsRuralConfirmation: false,
    shouldBlockSimulation: false
  };
};

/**
 * Extrai o valor numérico de uma string de valor monetário
 * Lida com formatos: "600000.0", "600.000,00", "600,000.00"
 */
export const extractMonetaryValue = (text: string): number => {
  // Remove espaços e caracteres não numéricos, exceto pontos e vírgulas
  const cleanText = text.replace(/[^\d.,]/g, '');
  
  // Se tem vírgula como último separador, é formato brasileiro (123.456,78)
  if (cleanText.includes(',') && cleanText.lastIndexOf(',') > cleanText.lastIndexOf('.')) {
    // Formato brasileiro: remove pontos (separadores de milhares) e substitui vírgula por ponto
    const value = cleanText.replace(/\./g, '').replace(',', '.');
    return parseFloat(value) || 0;
  }
  // Senão, assume formato americano/internacional (123,456.78) ou simples (600000.0)
  else {
    // Remove vírgulas (separadores de milhares) e mantém ponto decimal
    const value = cleanText.replace(/,/g, '');
    return parseFloat(value) || 0;
  }
};

/**
 * Calcula 30% de um valor e formata como valor monetário
 */
export const calculate30Percent = (value: number): number => {
  return Math.floor(value * 0.3);
};
