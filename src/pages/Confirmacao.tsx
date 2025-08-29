import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import WaveSeparator from '@/components/ui/WaveSeparator';

interface Summary {
  nome: string;
  email: string;
  telefone: string;
  valorEmprestimo: number;
  valorImovel: number;
  cidade: string;
  parcelas: number;
  valorParcela: number;
  amortizacao: string;
  imovelProprio: 'proprio' | 'terceiro';
  emailValido: boolean;
}

const Confirmacao = () => {
  const location = useLocation();
  const summary = (location.state as { summary?: Summary })?.summary;

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const summaryText = summary
    ? (() => {
        const modalidade = summary.amortizacao.toLowerCase() === 'sac' ? 'saque' : 'price';
        const tipoImovel = summary.imovelProprio === 'proprio' ? 'um imóvel próprio' : 'um imóvel de terceiro';
        return `${summary.nome}, você solicitou um crédito de ${formatCurrency(summary.valorEmprestimo)} na modalidade ${modalidade} utilizando ${tipoImovel} de ${formatCurrency(summary.valorImovel)} em ${summary.cidade}, em ${summary.parcelas} parcelas de ${formatCurrency(summary.valorParcela)}. E-mail ${summary.emailValido ? 'validado' : 'inválido'}: ${summary.email}.`;
      })()
    : '';

  const whatsappLink = `https://wa.me/5516997338791?text=${encodeURIComponent(summaryText)}`;

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
        <h1 className="text-2xl font-bold text-libra-navy">✅ Simulação enviada com sucesso!</h1>
        <p className="text-base text-gray-700">Recebemos seus dados e já estamos analisando sua solicitação.</p>
        {summaryText && (
          <p className="text-base text-gray-700">{summaryText}</p>
        )}
        <p className="text-base text-gray-700">Em breve, um de nossos especialistas entrará em contato com você.</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild variant="default" className="px-6">
            <Link to="/quem-somos">Conheça a Libra</Link>
          </Button>
          {summaryText && (
            <Button asChild variant="secondary" className="px-6">
              <Link to={whatsappLink} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </Link>
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          📞 Fique atento ao telefone (16) 3600-7956 para nosso contato.
        </p>
      </div>
    </MobileLayout>
  );
};

export default Confirmacao;
