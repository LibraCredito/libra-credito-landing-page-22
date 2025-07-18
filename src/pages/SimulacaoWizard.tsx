import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileWizard } from '@/components/MobileWizard';
import { ValueStep, TermStep, ContactStep, SummaryStep } from '@/components/MobileWizard/steps';
import { useDevice } from '@/hooks/useDevice';
import { AdaptiveView } from '@/components/AdaptiveView';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calculator, Smartphone, Monitor } from 'lucide-react';

// Validações dos steps
const validateValue = (data: any) => !!data.loanAmount;
const validateTerm = (data: any) => !!data.loanTerm;
const validateContact = (data: any) => {
  return !!(data.name && data.phone && data.phone.length >= 14);
};

const wizardSteps = [
  {
    id: 'value',
    title: 'Valor Necessário',
    component: ValueStep,
    validation: validateValue
  },
  {
    id: 'term',
    title: 'Prazo de Pagamento',
    component: TermStep,
    validation: validateTerm
  },
  {
    id: 'contact',
    title: 'Seus Dados',
    component: ContactStep,
    validation: validateContact
  },
  {
    id: 'summary',
    title: 'Resumo da Simulação',
    component: SummaryStep,
    validation: () => true
  }
];

const SimulacaoWizard = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const [showWizard, setShowWizard] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [forceWizard, setForceWizard] = useState(false); // Para testar forçando o wizard

  const handleComplete = async (data: any) => {
    console.log('Simulação completa:', data);

    setSimulationResult(data);
    setShowWizard(false);

    // Redirecionar para a página de confirmação
    navigate('/confirmacao');
  };

  const handleClose = () => {
    setShowWizard(false);
  };

  // Debug info
  const debugInfo = {
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    deviceType: device.deviceType,
    screenWidth: device.screenWidth,
    screenHeight: device.screenHeight,
    userAgent: navigator.userAgent,
    isTouchDevice: device.isTouchDevice,
    forceWizard
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Debug Panel */}
          <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-2">🔍 Debug Info:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-yellow-700">{key}:</span>
                  <span className="text-yellow-900">{String(value)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setForceWizard(!forceWizard)}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                {forceWizard ? '✅ Forçando Wizard Mobile' : '❌ Usando Detecção Automática'}
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('wizard-data');
                  alert('Cache do wizard limpo!');
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🗑️ Limpar Cache do Wizard
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-libra-blue mb-4">
              Simule seu Crédito com Garantia
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra em poucos passos quanto você pode obter com as melhores taxas do mercado
            </p>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto">
            {/* Sempre mostrar ambas as opções para debug */}
            <div className="space-y-6">
              {/* Opção Mobile */}
              <div className={`p-6 rounded-xl border-2 ${
                device.isMobile || forceWizard ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Versão Mobile</h3>
                  </div>
                  {(device.isMobile || forceWizard) && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Ativo
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => setShowWizard(true)}
                  className="w-full bg-gradient-to-r from-libra-blue to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!device.isMobile && !forceWizard}
                >
                  <Calculator className="w-12 h-12 mx-auto mb-3" />
                  <span className="text-2xl font-bold block mb-2">
                    Iniciar Simulação Mobile
                  </span>
                  <span className="text-sm opacity-90">
                    {device.isMobile || forceWizard ? 'Processo rápido e 100% online' : 'Disponível apenas em dispositivos móveis'}
                  </span>
                </button>
              </div>

              {/* Opção Desktop */}
              <div className={`p-6 rounded-xl border-2 ${
                device.isDesktop && !forceWizard ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Versão Desktop</h3>
                  </div>
                  {(device.isDesktop && !forceWizard) && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      Ativo
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => navigate('/simulacao')}
                  className="w-full bg-white border-2 border-libra-blue text-libra-blue p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  <Calculator className="w-12 h-12 mx-auto mb-3" />
                  <span className="text-xl font-bold block mb-2">
                    Acessar Calculadora Desktop
                  </span>
                  <span className="text-sm">
                    Interface completa com mais recursos
                  </span>
                </button>
              </div>
            </div>

            {/* Instruções */}
            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-800 mb-3">💡 Como Funciona o Wizard:</h3>
              <ol className="space-y-2 text-sm text-blue-700">
                <li>1. <strong>Detecção:</strong> O sistema detecta se você está em mobile</li>
                <li>2. <strong>Abertura:</strong> Clique em "Iniciar Simulação Mobile"</li>
                <li>3. <strong>Navegação:</strong> Use botões ou arraste (swipe) para navegar</li>
                <li>4. <strong>Auto-save:</strong> Dados são salvos automaticamente</li>
                <li>5. <strong>Validação:</strong> Campos obrigatórios são validados</li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Dica:</strong> Se não estiver funcionando, ative "Forçar Wizard Mobile" acima para testar!
                </p>
              </div>
            </div>

            {/* Resultado da simulação (se houver) */}
            {simulationResult && (
              <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  ✅ Simulação Enviada com Sucesso!
                </h3>
                <p className="text-green-700">
                  Obrigado, {simulationResult.name}! Entraremos em contato pelo WhatsApp {simulationResult.phone} em até 24 horas úteis.
                </p>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <h4 className="font-semibold text-green-800 mb-2">Dados recebidos:</h4>
                  <pre className="text-xs text-green-700 overflow-auto">
                    {JSON.stringify(simulationResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Wizard Mobile */}
      {showWizard && (device.isMobile || forceWizard) && (
        <MobileWizard
          steps={wizardSteps}
          onComplete={handleComplete}
          onClose={handleClose}
          saveKey="libra-simulation"
        />
      )}
    </>
  );
};

export default SimulacaoWizard;
