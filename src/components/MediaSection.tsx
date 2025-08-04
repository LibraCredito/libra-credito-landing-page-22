import React from 'react';
import { Button } from '@/components/ui/button';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';

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
  return (
    <section className="py-8 md:py-10 bg-[#003399]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-white" />
            <h2 className="text-xl md:text-3xl font-bold text-white">
              A Libra na Mídia
            </h2>
          </div>
          <p className="text-sm md:text-base px-2 md:px-0 text-white/80 max-w-2xl mx-auto">
            Confira as principais matérias sobre a Libra Crédito
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md md:max-w-6xl mx-auto place-items-center">
          {mediaLinks.map((media) => (
            <div
              key={media.name}
              className="aspect-square w-full flex items-center justify-center bg-white md:aspect-auto md:flex-col md:p-6 md:rounded-lg md:shadow-sm md:text-center"
            >
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver matéria da ${media.name}`}
                className="flex h-full w-full items-center justify-center md:h-20 md:mb-4"
              >
                <img
                  src={media.logo}
                  alt={`${media.name} - acesse matéria sobre Libra Crédito`}
                  className="max-h-14 w-auto object-contain md:max-h-full"
                  loading="lazy"
                  width="200"
                  height="80"
                />
              </a>
              <p
                className="hidden md:block text-[#003399] font-medium mb-4 flex-grow text-sm leading-tight"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {media.title}
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:inline-flex w-full border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white transition-colors text-xs py-2"
              >
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Acessar matéria da ${media.name}`}
                >
                  ACESSAR
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
