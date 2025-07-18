import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';

const Confirmacao = () => {
  useEffect(() => {
    document.title = 'Simulação Enviada | Libra Crédito';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Confirmação de envio da simulação. Em breve nossa equipe entrará em contato.'
      );
    }
  }, []);

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 bg-white">
        <h1 className="text-2xl font-bold text-libra-navy">✅ Simulação enviada com sucesso!</h1>
        <p className="text-base text-gray-700">Recebemos seus dados e já estamos analisando sua solicitação.</p>
        <p className="text-base text-gray-700">Em breve, um de nossos especialistas entrará em contato com você.</p>
        <p className="text-base text-gray-700">Você também pode falar com a gente agora mesmo pelo WhatsApp:</p>
        <a
          href="https://wa.me/5516996360424?text=Olá,%20acabei%20de%20fazer%20uma%20simulação%20no%20site%20e%20gostaria%20de%20falar%20com%20um%20especialista"
          target="_blank"
          rel="noopener noreferrer"
          className="botao-principal bg-libra-blue text-white font-semibold rounded-full px-8 py-3 hover:bg-libra-blue/90 transition-colors"
        >
          Falar com um especialista no WhatsApp
        </a>
        <p className="text-sm text-gray-600 mt-4">
          📞 Importante: você receberá tentativas de contato pelo número (16) 3600-7956. Fique atento!
        </p>
      </div>
    </MobileLayout>
  );
};

export default Confirmacao;
