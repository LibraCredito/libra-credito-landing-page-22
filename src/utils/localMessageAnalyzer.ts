/**
 * Analisador de mensagens para o serviço local
 * Estende o apiMessageAnalyzer para suportar mensagens locais
 */

import { ApiMessageAnalysis } from '@/utils/apiMessageAnalyzer';

/**
 * Analisa mensagens do serviço local e converte para formato compatível
 */
export const analyzeLocalMessage = (message: string): ApiMessageAnalysis => {
  const lowerMessage = message.toLowerCase();
  
  // Padrão 1: Cidade não atendida
  // "Ainda não trabalhamos em [cidade]. Nossa equipe está expandindo nossa cobertura."
  if (lowerMessage.includes('ainda não trabalhamos') || lowerMessage.includes('não trabalhamos')) {
    const cityMatch = message.match(/em\s+([^.]+)/i);
    const cidade = cityMatch ? cityMatch[1].trim() : undefined;
    
    return {
      type: 'no_service',
      originalMessage: message,
      cidade,
      shouldBlockSimulation: true,
      needsRuralConfirmation: false,
      shouldLimitTo30Percent: false
    };
  }
  
  // Padrão 2: Apenas imóveis rurais com limite de 30%
  // "Para a cidade [cidade], trabalhamos apenas com imóveis rurais com limite de empréstimo de até 30% do valor do imóvel. Valor máximo: R$ [valor]"
  if (lowerMessage.includes('apenas com imóveis rurais') && lowerMessage.includes('30%')) {
    const cityMatch = message.match(/cidade\s+([^,]+)/i) || message.match(/em\s+([^,]+)/i);
    const valueMatch = message.match(/r\$?\s*([\d.,]+)/i);

    const cidade = cityMatch ? cityMatch[1].trim() : undefined;
    const valorSugerido = valueMatch ? parseMonetaryValue(valueMatch[1]) : undefined;

    return {
      type: 'limit_30_rural',
      originalMessage: message,
      cidade,
      valorSugerido,
      shouldBlockSimulation: false,
      needsRuralConfirmation: true,
      shouldLimitTo30Percent: true
    };
  }

  // Padrão 2.1: Apenas imóveis rurais sem menção ao limite de 30%
  // "Para a cidade [cidade], trabalhamos apenas com imóveis rurais."
  if (lowerMessage.includes('apenas com imóveis rurais') && !lowerMessage.includes('30%')) {
    const cityMatch = message.match(/cidade\s+([^,]+)/i) || message.match(/em\s+([^,]+)/i);
    const cidade = cityMatch ? cityMatch[1].trim() : undefined;

    return {
      type: 'limit_30_rural',
      originalMessage: message,
      cidade,
      shouldBlockSimulation: false,
      needsRuralConfirmation: true,
      shouldLimitTo30Percent: true
    };
  }
  
  // Padrão 3: LTV máximo de 30%
  // "O valor solicitado excede o LTV máximo de 30% para esta cidade. Valor máximo: R$ [valor]"
  if (lowerMessage.includes('ltv máximo') && lowerMessage.includes('30%')) {
    const cityMatch = message.match(/para\s+([^.]+)/i);
    const valueMatch = message.match(/r\$?\s*([\d.,]+)/i);
    
    const cidade = cityMatch ? cityMatch[1].replace('esta cidade', '').trim() : undefined;
    const valorSugerido = valueMatch ? parseMonetaryValue(valueMatch[1]) : undefined;
    
    return {
      type: 'limit_30_general',
      originalMessage: message,
      cidade,
      valorSugerido,
      shouldBlockSimulation: false,
      needsRuralConfirmation: false,
      shouldLimitTo30Percent: true
    };
  }
  
  // Padrão 4: Erro de validação geral
  if (lowerMessage.includes('cidade não encontrada') || 
      lowerMessage.includes('base de dados') ||
      lowerMessage.includes('parâmetros inválidos')) {
    return {
      type: 'unknown_error',
      originalMessage: message,
      shouldBlockSimulation: true,
      needsRuralConfirmation: false,
      shouldLimitTo30Percent: false
    };
  }
  
  // Padrão 5: Sucesso (não deveria entrar aqui normalmente)
  if (lowerMessage.includes('sucesso') || lowerMessage.includes('calculado')) {
    return {
      type: 'success',
      originalMessage: message,
      shouldBlockSimulation: false,
      needsRuralConfirmation: false,
      shouldLimitTo30Percent: false
    };
  }
  
  // Fallback: erro desconhecido
  return {
    type: 'unknown_error',
    originalMessage: message,
    shouldBlockSimulation: true,
    needsRuralConfirmation: false,
    shouldLimitTo30Percent: false
  };
};

/**
 * Converte valor monetário em string para número
 */
function parseMonetaryValue(valueStr: string): number {
  // Remove tudo exceto dígitos, vírgulas e pontos
  const cleaned = valueStr.replace(/[^\d.,]/g, '');
  
  // Se tem vírgula e ponto, assume formato brasileiro: 1.234.567,89
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const parts = cleaned.split(',');
    const integerPart = parts[0].replace(/\./g, '');
    const decimalPart = parts[1] || '00';
    return parseFloat(`${integerPart}.${decimalPart}`);
  }
  
  // Se tem apenas vírgula, assume formato brasileiro: 1234567,89
  if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(',', '.'));
  }
  
  // Se tem apenas ponto, pode ser separador de milhares ou decimal
  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    // Se última parte tem 2 dígitos, assume que é decimal
    if (parts[parts.length - 1].length === 2 && parts.length > 1) {
      const integerPart = parts.slice(0, -1).join('');
      const decimalPart = parts[parts.length - 1];
      return parseFloat(`${integerPart}.${decimalPart}`);
    } else {
      // Assume que são separadores de milhares
      return parseFloat(cleaned.replace(/\./g, ''));
    }
  }
  
  // Apenas números
  return parseFloat(cleaned);
}

/**
 * Cria uma análise personalizada para casos específicos do serviço local
 */
export const createLocalAnalysis = (
  type: ApiMessageAnalysis['type'],
  message: string,
  options: {
    cidade?: string;
    valorSugerido?: number;
    shouldBlock?: boolean;
    needsRural?: boolean;
    needsLimit?: boolean;
  } = {}
): ApiMessageAnalysis => {
  return {
    type,
    originalMessage: message,
    cidade: options.cidade,
    valorSugerido: options.valorSugerido,
    shouldBlockSimulation: options.shouldBlock || false,
    needsRuralConfirmation: options.needsRural || false,
    shouldLimitTo30Percent: options.needsLimit || false
  };
};