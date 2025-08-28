/**
 * Calculadora de empréstimos com sistemas SAC e PRICE
 * 
 * @description Implementa cálculos financeiros para simulação de crédito
 * sem dependência de APIs externas. Suporta tanto SAC quanto PRICE.
 */

export interface LoanCalculationResult {
  parcelaSac: {
    inicial: number;
    final: number;
  };
  parcelaPrice: number;
  valorTotal: {
    sac: number;
    price: number;
  };
  jurosTotal: {
    sac: number;
    price: number;
  };
  taxaJurosEfetiva: number;
}

/**
 * Calcula empréstimo usando Sistema SAC (Sistema de Amortização Constante)
 * Na SAC, a amortização é constante e os juros decrescem
 */
function calculateSAC(principal: number, taxaJuros: number, parcelas: number): {
  parcelaInicial: number;
  parcelaFinal: number;
  valorTotal: number;
  jurosTotal: number;
} {
  const amortizacao = principal / parcelas;
  const jurosPrimeiraParcela = principal * taxaJuros;
  const jurosUltimaParcela = amortizacao * taxaJuros;
  
  const parcelaInicial = amortizacao + jurosPrimeiraParcela;
  const parcelaFinal = amortizacao + jurosUltimaParcela;
  
  // Soma dos juros em PA: Sn = n * (primeiro + último) / 2
  const jurosTotal = parcelas * (jurosPrimeiraParcela + jurosUltimaParcela) / 2;
  const valorTotal = principal + jurosTotal;
  
  return {
    parcelaInicial,
    parcelaFinal,
    valorTotal,
    jurosTotal
  };
}

/**
 * Calcula empréstimo usando Tabela PRICE (Sistema Francês)
 * Na PRICE, as parcelas são constantes
 */
function calculatePRICE(principal: number, taxaJuros: number, parcelas: number): {
  parcela: number;
  valorTotal: number;
  jurosTotal: number;
} {
  // Fórmula: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
  const fatorJuros = Math.pow(1 + taxaJuros, parcelas);
  const parcela = principal * (taxaJuros * fatorJuros) / (fatorJuros - 1);
  
  const valorTotal = parcela * parcelas;
  const jurosTotal = valorTotal - principal;
  
  return {
    parcela,
    valorTotal,
    jurosTotal
  };
}

/**
 * Calcula empréstimo com ambos os sistemas
 * 
 * @param valorEmprestimo Valor do empréstimo solicitado
 * @param taxaJurosMensal Taxa de juros mensal (ex: 0.0119 para 1.19%)
 * @param numeroParcelas Número de parcelas (36 a 180)
 * @param valorImovel Valor do imóvel usado como garantia
 * @returns Resultado com cálculos SAC e PRICE já com seguros e taxa administrativa
 */
export function calculateLoan(
  valorEmprestimo: number,
  taxaJurosMensal: number,
  numeroParcelas: number,
  valorImovel: number
): LoanCalculationResult {
  // Aplicar taxa de custo operacional configurável
  const custoOperacionalPercent = getCustoOperacional();
  const custoOperacional = valorEmprestimo * (custoOperacionalPercent / 100);
  const valorComCusto = valorEmprestimo + custoOperacional;

  const dfiPercent = getDfiPercentual() / 100;
  const prestamistaPercent = getPrestamistaPercentual() / 100;
  const taxaAdmin = getTaxaAdministrativa();

  // Calcular SAC
  const sacResult = calculateSAC(valorComCusto, taxaJurosMensal, numeroParcelas);

  // Calcular PRICE
  const priceResult = calculatePRICE(valorComCusto, taxaJurosMensal, numeroParcelas);

  const extraDfi = valorImovel * dfiPercent;
  const extraPrestamistaTotal = valorComCusto * prestamistaPercent;

  const parcelaPrice = priceResult.parcela + extraDfi + extraPrestamistaTotal + taxaAdmin;
  const parcelaSacInicial = sacResult.parcelaInicial + extraDfi + extraPrestamistaTotal + taxaAdmin;
  const parcelaSacFinal = (valorComCusto / numeroParcelas) * (1 + taxaJurosMensal) +
    (valorComCusto / numeroParcelas) * prestamistaPercent +
    extraDfi +
    taxaAdmin;
  
  return {
    parcelaSac: {
      inicial: parcelaSacInicial,
      final: parcelaSacFinal
    },
    parcelaPrice: parcelaPrice,
    valorTotal: {
      sac: sacResult.valorTotal,
      price: priceResult.valorTotal
    },
    jurosTotal: {
      sac: sacResult.jurosTotal,
      price: priceResult.jurosTotal
    },
    taxaJurosEfetiva: taxaJurosMensal
  };
}

/**
 * Obtém configuração de taxa de juros do painel admin
 * Fallback para 1.19% a.m. se não configurado
 */
export function getInterestRate(): number {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return parsed.juros ? parsed.juros / 100 : 0.0119; // Converte % para decimal
    }
  } catch (error) {
    console.warn('Erro ao obter configuração de juros:', error);
  }
  
  // Fallback padrão: 1.19% a.m.
  return 0.0119;
}

/**
 * Obtém configuração de custo operacional do painel admin
 * Fallback para 11% se não configurado
 */
export function getCustoOperacional(): number {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return parsed.custoOperacional || 11.0;
    }
  } catch (error) {
    console.warn('Erro ao obter configuração de custo operacional:', error);
  }
  
  // Fallback padrão: 11%
  return 11.0;
}

/**
 * Percentual do seguro DFI configurado no painel admin
 */
export function getDfiPercentual(): number {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return parsed.dfiPercentual || 0.014;
    }
  } catch (error) {
    console.warn('Erro ao obter percentual DFI:', error);
  }
  return 0.014;
}

/**
 * Percentual do seguro prestamista configurado no painel admin
 */
export function getPrestamistaPercentual(): number {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return parsed.prestamistaPercentual || 0.035;
    }
  } catch (error) {
    console.warn('Erro ao obter percentual prestamista:', error);
  }
  return 0.035;
}

/**
 * Valor da taxa administrativa configurada no painel admin
 */
export function getTaxaAdministrativa(): number {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return parsed.taxaAdministrativa || 40;
    }
  } catch (error) {
    console.warn('Erro ao obter taxa administrativa:', error);
  }
  return 40;
}

/**
 * Obtém limites de valor configurados no painel admin
 */
export function getValorLimits(): { min: number; max: number } {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return {
        min: parsed.valorMinimo || 100000,
        max: parsed.valorMaximo || 5000000
      };
    }
  } catch (error) {
    console.warn('Erro ao obter limites de valor:', error);
  }
  
  return { min: 100000, max: 5000000 };
}

/**
 * Obtém limites de parcelas configurados no painel admin
 */
export function getParcelasLimits(): { min: number; max: number } {
  try {
    const config = localStorage.getItem('libra_simulation_config');
    if (config) {
      const parsed = JSON.parse(config);
      return {
        min: parsed.parcelasMin || 36,
        max: parsed.parcelasMax || 180
      };
    }
  } catch (error) {
    console.warn('Erro ao obter limites de parcelas:', error);
  }
  
  return { min: 36, max: 180 };
}

/**
 * Valida se os parâmetros de cálculo estão dentro dos limites configurados
 */
export function validateLoanParameters(
  valorEmprestimo: number,
  numeroParcelas: number
): { valid: boolean; error?: string } {
  if (valorEmprestimo <= 0) {
    return { valid: false, error: 'Valor do empréstimo deve ser maior que zero' };
  }
  
  const valorLimits = getValorLimits();
  if (valorEmprestimo < valorLimits.min || valorEmprestimo > valorLimits.max) {
    return { 
      valid: false, 
      error: `Valor do empréstimo deve estar entre R$ ${valorLimits.min.toLocaleString()} e R$ ${valorLimits.max.toLocaleString()}` 
    };
  }
  
  const parcelasLimits = getParcelasLimits();
  if (numeroParcelas < parcelasLimits.min || numeroParcelas > parcelasLimits.max) {
    return { 
      valid: false, 
      error: `Número de parcelas deve estar entre ${parcelasLimits.min} e ${parcelasLimits.max} meses` 
    };
  }
  
  return { valid: true };
}