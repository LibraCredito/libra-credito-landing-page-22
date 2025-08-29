import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import WaveSeparator from '@/components/ui/WaveSeparator';
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
      <WaveSeparator variant="hero" height="md" inverted />
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 bg-white">
        <h1 className="text-2xl font-bold text-libra-navy">Simulação enviada com sucesso</h1>
        <p className="text-base text-gray-700">
          Recebemos seus dados e em breve, um dos nossos analistas entrará em contato com você.
        </p>
        <p className="text-base text-gray-700">
          Fique atento ao telefone (16) 36007956 para nosso contato.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild variant="default" className="px-6">
            <Link to="/quem-somos">Conheça a Libra</Link>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Confirmacao;
