import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection2: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqItems: FAQItem[] = [
    {
      question: "Como funciona?",
      answer: "O empréstimo com garantia de imóvel funciona usando seu imóvel como garantia para obter crédito com taxas mais baixas. Você continua morando no imóvel normalmente durante todo o período do empréstimo."
    },
    {
      question: "Posso morar no imóvel?",
      answer: "Sim! Você continua morando normalmente no seu imóvel. A garantia não interfere no seu direito de uso e habitação do imóvel durante todo o período do contrato."
    },
    {
      question: "Como iniciar o atendimento?",
      answer: "É muito simples! Faça a simulação online, preencha seus dados e um de nossos consultores entrará em contato para dar continuidade ao processo e esclarecer todas suas dúvidas."
    },
    {
      question: "Como iniciar o atendimento?",
      answer: "Você pode iniciar através da nossa simulação online ou entrando em contato direto conosco. Nossa equipe está preparada para orientá-lo em cada etapa do processo de forma clara e transparente."
    },
    {
      question: "Posso morar no imóvel?",
      answer: "Absolutamente! O imóvel continua sendo seu e você mantém todos os direitos de uso. A garantia é apenas uma formalidade jurídica que nos permite oferecer taxas mais competitivas."
    },
    {
      question: "Como funciona?",
      answer: "Nosso processo é 100% digital e seguro. Após a análise da documentação, liberamos o crédito de forma rápida e você pode usar o valor para qualquer finalidade que desejar."
    }
  ];

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Perguntas <span className="text-green-500">frequentes:</span>
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 text-lg">
                  {item.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    {openItems.includes(index) ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-5">
                  <div className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ainda tem dúvidas? Nossa equipe está pronta para ajudar!
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full transition-colors">
            Falar com Consultor
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection2;