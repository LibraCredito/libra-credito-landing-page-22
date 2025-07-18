import React, { useEffect, useState, useMemo } from 'react';
import MobileLayout from '@/components/MobileLayout';
import WaveSeparator from '@/components/ui/WaveSeparator';
import { Button } from '@/components/ui/button';
import { TrendingDown, Clock, Calculator, ShieldCheck, Wallet, BadgeCheck, FileText, MessageCircle, CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Vantagens: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);

  // Dados das taxas de juros (movido para cima e memoizado)
  const taxasJuros = useMemo(() => [
    {
      nome: "Cartão de Crédito Rotativo",
      taxa: 14.84,
      destaque: false
    },
    {
      nome: "Cheque Especial",
      taxa: 6.74,
      destaque: false
    },
    {
      nome: "Crédito Pessoal",
      taxa: 6.72,
      destaque: false
    },
    {
      nome: "Crédito Consignado",
      taxa: 2.24,
      destaque: false
    },
    {
      nome: "Libra Crédito",
      taxa: 1.19,
      destaque: true
    }
  ], []);

  // Cálculo do valor máximo para animação das barras
  const maxTaxa = useMemo(() => Math.max(...taxasJuros.map(item => item.taxa)), [taxasJuros]);

  useEffect(() => {
    // Meta Title otimizado para vantagens - 57 caracteres
    document.title = "Vantagens Home Equity | Libra Crédito 1,19% a.m.";
    
    // Meta Description otimizada - 153 caracteres
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Vantagens do crédito com garantia de imóvel: taxa mínima 1,19% a.m., até 180 meses, valores até 50% do imóvel. Compare as taxas agora.');
    }
  }, []);

  // Animação das barras da tabela
  useEffect(() => {
    if (!isTableVisible) return;

    // Inicializar valores em 0
    setAnimatedValues(new Array(taxasJuros.length).fill(0));

    // Animar cada barra sequencialmente com delay para garantir visibilidade
    setTimeout(() => {
      taxasJuros.forEach((item, index) => {
        setTimeout(() => {
          const targetValue = (item.taxa / maxTaxa) * 100;
          let currentValue = 0;
          const increment = targetValue / 20; // Reduzido para animação mais rápida
          
          const animationTimer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
              currentValue = targetValue;
              clearInterval(animationTimer);
            }
            
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = currentValue;
              return newValues;
            });
          }, 50); // Aumentado para animação mais suave
        }, index * 300); // Aumentado delay para melhor visualização
      });
    }, 500); // Delay inicial para garantir que a tabela foi renderizada
  }, [isTableVisible, taxasJuros, maxTaxa]);

  // Observer para detectar quando a tabela entra na tela
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTableVisible) {
          setIsTableVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Usar timeout para garantir que os elementos foram renderizados
    setTimeout(() => {
      const desktopTable = document.getElementById('comparison-table-desktop');
      const mobileTable = document.getElementById('comparison-table-mobile');
      
      if (desktopTable) {
        observer.observe(desktopTable);
      }
      if (mobileTable) {
        observer.observe(mobileTable);
      }
      
      // Fallback: se não detectar em 3 segundos, ativar animação
      setTimeout(() => {
        if (!isTableVisible) {
          setIsTableVisible(true);
        }
      }, 3000);
    }, 100);

    return () => observer.disconnect();
  }, [isTableVisible]);

  const vantagens = [
    {
      icon: TrendingDown,
      title: "Menores Taxas",
      description: "Taxa a partir de 1,19% a.m. + IPCA",
      benefit: "Economia de até 90%"
    },
    {
      icon: Clock,
      title: "Prazo Estendido",
      description: "Até 180 meses para pagar",
      benefit: "Parcelas menores"
    },
    {
      icon: Calculator,
      title: "Valores Maiores",
      description: "Até 50% do valor do imóvel",
      benefit: "Realize grandes projetos"
    },
    {
      icon: ShieldCheck,
      title: "Aprovação Facilitada",
      description: "Análise personalizada",
      benefit: "Maior Flexibilidade"
    },
    {
      icon: Wallet,
      title: "Uso Livre",
      description: "Dinheiro na conta",
      benefit: "Liberdade financeira"
    },
    {
      icon: BadgeCheck,
      title: "Credibilidade",
      description: "Grupo Stéfani - 40+ anos",
      benefit: (
        <a
          href="https://www.construtorastefani.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:underline"
        >
          Tradição e confiança
        </a>
      )
    }
  ];

  const handleSimular = () => {
    navigate('/simulacao');
  };

  return (
    <MobileLayout>
      {/* Faixa Separadora Superior Invertida - Exatamente como na home */}
      <WaveSeparator variant="hero" height={isMobile ? "sm" : "md"} inverted />
      
      <div className="bg-white">
        {/* Hero Section - Otimizado */}
        <section className={`${isMobile ? 'py-6' : 'py-8'}`}>
          <div className="container mx-auto px-4">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold text-libra-navy text-center mb-3`}>
              Vantagens do Crédito com Garantia
            </h1>
              <p className={`${isMobile ? 'text-base px-2' : 'text-lg'} text-libra-navy max-w-3xl mx-auto text-center`}>
                As melhores condições do mercado para realizar seus projetos.
              </p>
          </div>
        </section>

        {/* Vantagens e Comparativo */}
        <section className={`${isMobile ? 'pt-1 pb-4' : 'pt-1 pb-6'}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6">
              {/* Vantagens */}
              <div>
                <div
                  className={`${
                    isMobile ? 'grid grid-cols-2 gap-3' : 'flex justify-between space-x-4'
                  }`}
                >
                  {vantagens.map((vantagem, index) => {
                    const Icon = vantagem.icon;
                    return (
                      <div
                        key={index}
                        className={`bg-blue-50 ${isMobile ? 'p-3' : 'p-4 flex-1'} rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between`}
                      >
                        <div className={`flex items-center ${isMobile ? 'mb-2' : 'mb-3'}`}>
                          <div className={`bg-white ${isMobile ? 'p-1.5' : 'p-2'} rounded-lg`}>
                            <Icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
                          </div>
                          <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-libra-navy ml-2`}>{vantagem.title}</h3>
                        </div>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-libra-navy ${isMobile ? 'mb-2' : 'mb-3'}`}>{vantagem.description}</p>
                        <div className={`bg-white rounded-lg ${isMobile ? 'p-2' : 'p-2'}`}>
                          <p className={`text-green-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{vantagem.benefit}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Comparativo de Taxas com ondas */}
        <>
          <WaveSeparator variant="hero" height="md" />
          <div className={`${isMobile ? 'py-8' : 'py-12'}`} style={{ backgroundColor: '#003399' }}>
            <div className="container mx-auto px-4">
              <div
                id={`comparison-table-${isMobile ? 'mobile' : 'desktop'}`}
                className={`bg-white rounded-lg shadow-lg ${isMobile ? 'p-4' : 'p-6'}`}
              >
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-libra-navy mb-2`}>Comparativo de Taxas de Juros</h2>
                <p className="text-sm text-gray-500 mb-4">Fonte: Dados abertos do BACEN - Janeiro 2025</p>
                <div className="space-y-3">
                  {taxasJuros.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} ${item.destaque ? 'text-libra-navy font-bold' : 'text-gray-700'}`}>
                          {item.nome}
                        </span>
                        <span className={`font-bold ${isMobile ? 'text-sm' : 'text-base'} ${item.destaque ? 'text-libra-navy' : 'text-gray-700'}`}>
                          {item.taxa.toFixed(2)}% a.m.
                        </span>
                      </div>
                      <div className={`${isMobile ? 'h-2' : 'h-3'} rounded-full bg-gray-100 overflow-hidden`}>
                        <div
                          className={`h-full transition-all duration-500 ease-out ${
                            item.destaque ? 'bg-libra-navy' : 'bg-red-400/70'
                          }`}
                          style={{
                            width: `${animatedValues[index] ?? 0}%`,
                            minWidth: animatedValues[index] ? '2px' : '0px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <WaveSeparator variant="hero" height="md" inverted />
        </>

        {/* Seção de Passos para Obter Crédito */}
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-libra-navy mb-3`}>
                Como obter seu crédito em 4 passos simples
              </h2>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 max-w-2xl mx-auto`}>
                Processo rápido e descomplicado para realizar seus projetos
              </p>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
              {/* Passo 1 */}
              <div className="relative h-full">
                <div className={`bg-libra-blue rounded-xl ${isMobile ? 'p-4' : 'p-6'} shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col`}>
                  <div className="flex flex-col items-center text-center flex-grow">
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-white/20 rounded-full flex items-center justify-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
                      <FileText className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
                    </div>
                    <div className={`bg-white text-libra-blue rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-sm font-bold ${isMobile ? 'mb-2' : 'mb-3'}`}>
                      1
                    </div>
                    <h3 className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-white ${isMobile ? 'mb-1' : 'mb-2'}`}>
                      Faça uma simulação
                    </h3>
                    <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                      Simule gratuitamente suas condições personalizadas
                    </p>
                  </div>
                </div>
                {!isMobile && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Passo 2 */}
              <div className="relative h-full">
                <div className={`bg-libra-blue rounded-xl ${isMobile ? 'p-4' : 'p-6'} shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col`}>
                  <div className="flex flex-col items-center text-center flex-grow">
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-white/20 rounded-full flex items-center justify-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
                      <MessageCircle className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
                    </div>
                    <div className={`bg-white text-libra-blue rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-sm font-bold ${isMobile ? 'mb-2' : 'mb-3'}`}>
                      2
                    </div>
                    <h3 className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-white ${isMobile ? 'mb-1' : 'mb-2'}`}>
                      Fale com o consultor
                    </h3>
                    <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                      Converse com nosso especialista e envie sua documentação.
                    </p>
                  </div>
                </div>
                {!isMobile && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Passo 3 */}
              <div className="relative h-full">
                <div className={`bg-libra-blue rounded-xl ${isMobile ? 'p-4' : 'p-6'} shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col`}>
                  <div className="flex flex-col items-center text-center flex-grow">
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-white/20 rounded-full flex items-center justify-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
                      <CheckCircle className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
                    </div>
                    <div className={`bg-white text-libra-blue rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-sm font-bold ${isMobile ? 'mb-2' : 'mb-3'}`}>
                      3
                    </div>
                    <h3 className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-white ${isMobile ? 'mb-1' : 'mb-2'}`}>
                      Receba proposta gratuita
                    </h3>
                    <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                      Proposta personalizada para realizar seus projetos
                    </p>
                  </div>
                </div>
                {!isMobile && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Passo 4 */}
              <div className="relative h-full">
                <div className={`bg-libra-blue rounded-xl ${isMobile ? 'p-4' : 'p-6'} shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col`}>
                  <div className="flex flex-col items-center text-center flex-grow">
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-white/20 rounded-full flex items-center justify-center ${isMobile ? 'mb-2' : 'mb-4'}`}>
                      <CreditCard className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
                    </div>
                    <div className={`bg-white text-libra-blue rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-sm font-bold ${isMobile ? 'mb-2' : 'mb-3'}`}>
                      4
                    </div>
                    <h3 className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-white ${isMobile ? 'mb-1' : 'mb-2'}`}>
                      Dinheiro na conta
                    </h3>
                    <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>
                      Assinatura, avaliação do imóvel e liberação do crédito
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action dentro da seção de passos */}
            <div className={`text-center ${isMobile ? 'mt-6' : 'mt-8'}`}>
              <Button 
                onClick={handleSimular}
                size="lg"
                className="bg-libra-blue text-white hover:bg-libra-navy font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Começar agora - É grátis
              </Button>
            </div>
          </div>
        </section>

      </div>
    </MobileLayout>
  );
};

export default Vantagens;
