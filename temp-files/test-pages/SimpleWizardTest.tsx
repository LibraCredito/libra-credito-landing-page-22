import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Versão simplificada do wizard para teste
const SimpleWizardTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    value: '',
    term: '',
    name: '',
    phone: ''
  });

  const steps = [
    { id: 'value', title: 'Escolha o Valor' },
    { id: 'term', title: 'Escolha o Prazo' },
    { id: 'contact', title: 'Seus Dados' },
    { id: 'summary', title: 'Resumo' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Wizard completo! Dados: ' + JSON.stringify(data));
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste Simples do Wizard</h1>
      
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Abrir Wizard Simples
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {steps[currentStep].title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-4 py-2">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Passo {currentStep + 1} de {steps.length}
              </p>
            </div>

            {/* Content */}
            <div className="p-4">
              {currentStep === 0 && (
                <div>
                  <p className="mb-4">Selecione o valor desejado:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['R$ 100 mil', 'R$ 300 mil', 'R$ 500 mil', 'R$ 1 milhão'].map((value) => (
                      <button
                        key={value}
                        onClick={() => setData({ ...data, value })}
                        className={`p-3 border rounded ${
                          data.value === value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  {data.value && (
                    <p className="mt-4 text-green-600">✓ Selecionado: {data.value}</p>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <p className="mb-4">Selecione o prazo:</p>
                  <div className="space-y-2">
                    {['12 meses', '24 meses', '36 meses', '48 meses'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setData({ ...data, term })}
                        className={`w-full p-3 border rounded text-left ${
                          data.term === term ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  {data.term && (
                    <p className="mt-4 text-green-600">✓ Selecionado: {data.term}</p>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <p className="mb-4">Preencha seus dados:</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      className="w-full p-3 border rounded"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp"
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                      className="w-full p-3 border rounded"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <p className="mb-4 font-semibold">Resumo da simulação:</p>
                  <div className="space-y-2 bg-gray-50 p-4 rounded">
                    <p>Valor: {data.value || 'Não selecionado'}</p>
                    <p>Prazo: {data.term || 'Não selecionado'}</p>
                    <p>Nome: {data.name || 'Não preenchido'}</p>
                    <p>WhatsApp: {data.phone || 'Não preenchido'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 inline mr-1" />
                  Voltar
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                {currentStep < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 inline ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({ isOpen, currentStep, data }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SimpleWizardTest;
