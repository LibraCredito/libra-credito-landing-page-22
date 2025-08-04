import React from 'react';
import { Button } from '@/components/ui/button';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import { useIsMobile } from '@/hooks/use-mobile';

const mediaLinks = [
  {
    name: 'G1 Globo',
    logo: '/images/media/G1-logo-1.png',
    title: 'A Libra Crédito tem soluções financeiras com as menores taxas no pós-pandemia',
    url: 'https://g1.globo.com/sp/ribeirao-preto-franca/especial-publicitario/libra-credito-solucoes-financeiras/noticia/2022/10/28/a-libra-credito-tem-solucoes-financeiras-com-as-menores-taxas-no-pos-pandemia.ghtml'
  },
  {
    name: 'Estadão',
    logo: '/images/media/estadao-logo.png',
    title: 'Libra simplifica processo para empréstimo com garantia de imóvel',
    url: 'https://bluestudioexpress.estadao.com.br/conteudo/2023/08/24/libra-simplifica-processo-para-emprestimo-com-garantia-de-imovel/'
  },
  {
    name: 'A Cidade ON',
    logo: '/images/media/acidadeon-logo.png',
    title: 'Libra Crédito oferece empréstimo de baixo custo e personalizado',
    url: 'https://www.acidadeon.com/ribeiraopreto/conteudo-patrocinado/libracredito/libra-credito-oferece-emprestimo-de-baixo-custo-e-personalizado/'
  },
  {
    name: 'Revide',
    logo: '/images/media/revide-logo.webp',
    title: 'A revolução do crédito',
    url: 'https://www.revide.com.br/noticias/revista/a-revolucao-do-credito/'
  }
];

const MediaSection: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section className={`${isMobile ? 'py-8' : 'py-10'} bg-[#003399]`}>
      <div className="container mx-auto px-4">
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-6'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
            <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-white`}>
              A Libra na Mídia
            </h2>
          </div>
          <p className={`${isMobile ? 'text-sm px-2' : 'text-base'} text-white/80 max-w-2xl mx-auto`}>
            Confira as principais matérias sobre a Libra Crédito
          </p>
        </div>

        {isMobile ? (
          // Layout Mobile - Grid 2x2 apenas com logos
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {mediaLinks.map((media) => (
              <a
                key={media.name}
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center"
                aria-label={`Ver matéria da ${media.name}`}
              >
                <div
                  className={`w-full flex items-center justify-center ${media.name === 'G1 Globo' ? 'h-14' : 'h-12'}`}
                >
                  <img
                    src={media.logo}
                    alt={`${media.name} - acesse matéria sobre Libra Crédito`}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>
        ) : (
          // Layout Desktop - 4 Cards horizontais
          <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
            {mediaLinks.map((media) => (
              <div key={media.name} className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
                <div className="h-20 mb-4 flex items-center justify-center">
                  <img
                    src={media.logo}
                    alt={`${media.name} - veículo de mídia que destaca a Libra Crédito`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-[#003399] font-medium mb-4 flex-grow text-sm leading-tight" 
                   style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  {media.title}
                </p>
                <Button
                  onClick={() => window.open(media.url, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white transition-colors text-xs py-2"
                >
                  ACESSAR
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaSection;
