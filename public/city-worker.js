// Web Worker para processamento de cidades
// Reduz Script Evaluation na main thread

let cityData = null;

// Função para carregar dados das cidades
async function loadCityData() {
  if (!cityData) {
    try {
      const response = await fetch('/data/ltv-cidades.json');
      cityData = await response.json();
    } catch (error) {
      console.error('Worker: Erro ao carregar dados das cidades:', error);
      throw error;
    }
  }
  return cityData;
}

// Função para buscar cidades
async function searchCities(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const cities = await loadCityData();
  const term = searchTerm.toLowerCase();
  
  return cities
    .filter(city => city['CIDADE - UF'].toLowerCase().includes(term))
    .slice(0, 10)
    .map(city => city['CIDADE - UF']);
}

// Função para validar cidade
async function validateCity(cityName) {
  if (!cityName || cityName.trim() === '') {
    return {
      found: false,
      status: 'not_found',
      message: 'Por favor, selecione uma cidade',
      allowCalculation: false
    };
  }

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

  switch (LTV) {
    case 0:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'not_working',
        message: 'Infelizmente ainda não trabalhamos nesta cidade.',
        allowCalculation: false
      };

    case 1:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'rural_only',
        message: 'Para esta cidade, trabalhamos apenas com imóveis rurais.',
        allowCalculation: false
      };

    case 30:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'ltv_30',
        message: 'Para esta cidade, o LTV máximo é de 30%.',
        allowCalculation: true
      };

    default:
      return {
        found: true,
        city: cityData['CIDADE - UF'],
        ltv: LTV,
        status: 'success',
        message: 'Cidade válida para simulação',
        allowCalculation: true
      };
  }
}

// Listener para mensagens do thread principal
self.onmessage = async function(e) {
  const { id, type, payload } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'SEARCH_CITIES':
        result = await searchCities(payload.searchTerm);
        break;
        
      case 'VALIDATE_CITY':
        result = await validateCity(payload.cityName);
        break;
        
      case 'LOAD_CITIES':
        result = await loadCityData();
        break;
        
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
    
    self.postMessage({ id, success: true, result });
  } catch (error) {
    self.postMessage({ 
      id, 
      success: false, 
      error: error.message 
    });
  }
};