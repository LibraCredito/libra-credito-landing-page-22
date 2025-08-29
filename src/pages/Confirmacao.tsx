import React, { useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import WaveSeparator from '@/components/ui/WaveSeparator';

interface SummaryData {
  name: string;
  email: string;
  phone: string;
  loanAmount: number;
  propertyValue: number;
  city: string;
  installments: number;
  installmentValue: number;
}

const Confirmacao = () => {
  const location = useLocation();
  const summary = (location.state as { summary?: SummaryData } | undefined)?.summary;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

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

  const whatsappNumber = '5516997338791';
  const whatsappMessage = summary
    ? encodeURIComponent(
        `Olá, meu nome é ${summary.name}. Solicitei um crédito de ${formatCurrency(summary.loanAmount)} utilizando como garantia um imóvel de ${formatCurrency(summary.propertyValue)} em ${summary.city}. O empréstimo foi feito em ${summary.installments} vezes, com parcela estimada de ${formatCurrency(summary.installmentValue)}. Meu e-mail é ${summary.email || 'não informado'} e meu telefone é ${summary.phone}.`
      )
    : '';
  const whatsappLink = `https://wa.me/${whatsappNumber}${whatsappMessage ? `?text=${whatsappMessage}` : ''}`;

  return (
    <MobileLayout>
      <WaveSeparator variant="hero" height="md" inverted />
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 bg-white">
        <h1 className="text-2xl font-bold text-libra-navy">✅ Simulação enviada com sucesso!</h1>
        <p className="text-base text-gray-700">
          Recebemos seus dados e já estamos analisando sua solicitação.
        </p>
        {summary && (
          <div className="text-base text-gray-700 max-w-md">
            <p>
              {summary.name}, você solicitou um crédito de {formatCurrency(summary.loanAmount)}
              {' '}utilizando como garantia um imóvel de {formatCurrency(summary.propertyValue)} em {summary.city}.
            </p>
            <p className="mt-2">
              O empréstimo foi feito em {summary.installments} vezes, com parcela estimada de {formatCurrency(summary.installmentValue)}.
            </p>
            <p className="mt-2">
              Entraremos em contato pelo e-mail {summary.email || 'não informado'} e telefone {summary.phone}.
            </p>
          </div>
        )}
        <p className="text-base text-gray-700">
          Em breve, um de nossos especialistas entrará em contato com você.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild variant="default" className="px-6">
            <Link to="/quem-somos">Conheça a Libra</Link>
          </Button>
          <Button asChild variant="outline" className="px-6">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale no WhatsApp
            </a>
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
