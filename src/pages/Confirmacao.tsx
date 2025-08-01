import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild variant="default" className="px-6">
            <Link to="/quem-somos">Conheça a Libra</Link>
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          📞 Fique atento ao telefone (16) 3600-7956 para nosso contato.
        </p>
      </div>
    </MobileLayout>
  );
};

export default Confirmacao;
