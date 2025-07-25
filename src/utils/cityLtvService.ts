/**
 * Serviço para consulta de LTV por cidade
 * 
 * @description Gerencia a consulta ao arquivo LTV_Cidades.json
 * e implementa a lógica de validação por cidade
 * 
 * OTIMIZAÇÃO: JSON carregado dinamicamente para reduzir bundle inicial
 */

// Lazy loading do arquivo JSON para reduzir bundle inicial
let ltvCidades: CityLtvData[] | null = null;
let loadingPromise: Promise<CityLtvData[]> | null = null;

async function loadCityData(): Promise<CityLtvData[]> {
  // Se já está em cache, retorna imediatamente
  if (ltvCidades) {
    return ltvCidades;
  }
  
  // Se já está carregando, retorna a mesma promise
  if (loadingPromise) {
    return loadingPromise;
  }
  
  // Inicia o carregamento
  loadingPromise = fetch('/data/ltv-cidades.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load city data: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      ltvCidades = data as CityLtvData[];
      loadingPromise = null; // Limpa a promise após sucesso
      return ltvCidades;
    })
    .catch(error => {
      loadingPromise = null; // Limpa a promise em caso de erro
      console.error('Error loading city data:', error);
      throw error;
    });
  
  return loadingPromise;
}

export interface CityLtvData {
  'CIDADE - UF': string;
  LTV: number;
}

export interface CityValidationResult {
  found: boolean;
  city?: string;
  ltv?: number;
  status: 'not_found' | 'not_working' | 'rural_only' | 'ltv_30' | 'success';
  message: string;
  allowCalculation: boolean;
}

/**
 * Lista todas as cidades disponíveis para autocomplete
 */
export async function getAllCities(): Promise<string[]> {
  const cities = await loadCityData();
  return cities.map(item => item['CIDADE - UF']);
}

/**
 * Busca cidades que correspondem ao termo de pesquisa
 */
export async function searchCities(searchTerm: string): Promise<string[]> {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const term = searchTerm.toLowerCase();
  const allCities = await getAllCities();
  return allCities.filter(city => 
    city.toLowerCase().includes(term)
  ).slice(0, 10); // Limita a 10 resultados
}

/**
 * Valida uma cidade e retorna seu status de LTV
 */
export async function validateCity(cityName: string): Promise<CityValidationResult> {
  if (!cityName || cityName.trim() === '') {
    return {
      found: false,
      status: 'not_found',
      message: 'Por favor, selecione uma cidade',
      allowCalculation: false
    };
  }

  // Buscar cidade no JSON
  const cities = await loadCityData();
  const cityData = cities.find(
    item => item['CIDADE - UF'].toLowerCase() === cityName.toLowerCase()
  );

  if (!cityData) {
    return {
      found: false,
      status: 'not_found',
      message: 'Cidade não encontrada em nossa base de dados',
      allowCalculation: false
    };
  }

  const { LTV } = cityData;

  // Aplicar regras de negócio baseadas no LTV
  switch (LTV) {
    case 0:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'not_working',
        message: 'Infelizmente ainda não trabalhamos nesta cidade. Nossa equipe está trabalhando para expandir nossa cobertura.',
        allowCalculation: false
      };

    case 1:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'rural_only',
        message: 'Para esta cidade, trabalhamos apenas com imóveis rurais. Verifique se seu imóvel se enquadra nesta categoria.',
        allowCalculation: false
      };

    case 30:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'ltv_30',
        message: 'Para esta cidade, o LTV máximo é de 30%. Certifique-se de que o valor do empréstimo não exceda 30% do valor do imóvel.',
        allowCalculation: true
      };

    case 50:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'success',
        message: 'Cidade válida para simulação. Você pode prosseguir com o cálculo.',
        allowCalculation: true
      };

    default:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'not_found',
        message: 'Configuração de LTV não reconhecida para esta cidade',
        allowCalculation: false
      };
  }
}

/**
 * Valida se o LTV do empréstimo está dentro do limite da cidade
 */
export async function validateLTV(
  valorEmprestimo: number,
  valorImovel: number,
  cityName: string
): Promise<{ valid: boolean; message: string; suggestedLoanAmount?: number }> {
  const cityValidation = await validateCity(cityName);
  
  if (!cityValidation.found || !cityValidation.allowCalculation) {
    return {
      valid: false,
      message: cityValidation.message
    };
  }

  const ltvSolicitado = (valorEmprestimo / valorImovel) * 100;
  const ltvMaximo = cityValidation.ltv!;

  if (ltvSolicitado > ltvMaximo) {
    const valorMaximoEmprestimo = Math.floor((valorImovel * ltvMaximo) / 100);
    
    return {
      valid: false,
      message: `O valor solicitado excede o LTV máximo de ${ltvMaximo}% para esta cidade. Valor máximo: R$ ${valorMaximoEmprestimo.toLocaleString('pt-BR')}`,
      suggestedLoanAmount: valorMaximoEmprestimo
    };
  }

  return {
    valid: true,
    message: 'LTV dentro do limite permitido para esta cidade'
  };
}

/**
 * Obtém informações completas sobre uma cidade
 */
export async function getCityInfo(cityName: string): Promise<CityLtvData | null> {
  const cities = await loadCityData();
  return cities.find(
    item => item['CIDADE - UF'].toLowerCase() === cityName.toLowerCase()
  ) || null;
}

/**
 * Estatísticas do arquivo de cidades
 */
export async function getCityStats() {
  const cities = await loadCityData();
  const stats = {
    total: cities.length,
    notWorking: cities.filter(c => c.LTV === 0).length,
    ruralOnly: cities.filter(c => c.LTV === 1).length,
    ltv30: cities.filter(c => c.LTV === 30).length,
    ltv50: cities.filter(c => c.LTV === 50).length,
  };

  return {
    ...stats,
    workingCities: stats.ltv30 + stats.ltv50,
    coverage: ((stats.ltv30 + stats.ltv50) / stats.total * 100).toFixed(1)
  };
}