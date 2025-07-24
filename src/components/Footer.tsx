import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import RASeal from '@/components/RASeal';
import WaveSeparator from '@/components/ui/WaveSeparator';
// import ImageOptimizer from '@/components/ImageOptimizer';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Wave separator before footer */}
      <WaveSeparator variant="footer" height="md" />
      
      <footer className="bg-[#003399] text-white">
        <div className="container mx-auto py-6 lg:py-8 px-4">
        {/* Grid Principal - Layout 3 colunas para mobile e desktop */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 lg:gap-8 mb-6 lg:mb-8 items-start">
          {/* Navegação - Esquerda */}
          <div className="text-left">
            <h3 className="text-sm md:text-xl font-bold mb-2 md:mb-4 text-white">Navegação</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors text-xs md:text-base">Início</Link></li>
              <li><Link to="/simulacao" className="text-white/80 hover:text-white transition-colors text-xs md:text-base">Simulação</Link></li>
              <li><Link to="/vantagens" className="text-white/80 hover:text-white transition-colors text-xs md:text-base">Vantagens</Link></li>
              <li><Link to="/quem-somos" className="text-white/80 hover:text-white transition-colors text-xs md:text-base">Quem Somos</Link></li>
              <li><Link to="/blog" className="text-white/80 hover:text-white transition-colors text-xs md:text-base">Blog</Link></li>
              <li><Link to="/parceiros" className="text-white/80 hover:text-white transition-colors text-xs md:text-base">Parceiros</Link></li>
            </ul>
          </div>

          {/* Logo - Centro (centralizado horizontal e verticalmente) */}
          <div className="text-center flex items-center justify-center h-full">
        <img
          src="/logo-libra.png"
          alt="Libra Crédito"
          className="h-24 md:h-20 lg:h-24 xl:h-32 w-auto max-w-full"
          loading="lazy"
        />
          </div>

          {/* Redes Sociais - Direita */}
          <div className="text-right">
            <h3 className="text-sm md:text-xl font-bold mb-2 md:mb-4 text-white">Redes Sociais</h3>
            {/* Layout mobile: 2 colunas em 3 linhas organizadas da direita para esquerda */}
            <div className="flex flex-col items-end md:hidden mb-2">
              <div className="grid grid-cols-2 gap-1 w-fit" style={{ direction: 'rtl' }}>
                <a href="https://www.facebook.com/LibraCreditoOficial/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/libracredito/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/company/libracredito/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/channel/UCXpuj7LlTLT_kdbwwJHS0qA" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://www.tiktok.com/@libracredito" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <title>TikTok</title>
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <button 
                  onClick={scrollToTop} 
                  className="text-white hover:text-white/70 transition-colors" 
                  aria-label="Voltar ao topo"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Layout desktop: horizontal */}
            <div className="hidden md:flex justify-end items-center gap-4 mb-4">
              <a href="https://www.facebook.com/LibraCreditoOficial/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="Facebook">
                <Facebook className="w-7 h-7" />
              </a>
              <a href="https://www.instagram.com/libracredito/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="Instagram">
                <Instagram className="w-7 h-7" />
              </a>
              <a href="https://www.linkedin.com/company/libracredito/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-7 h-7" />
              </a>
              <a href="https://www.youtube.com/channel/UCXpuj7LlTLT_kdbwwJHS0qA" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="YouTube">
                <Youtube className="w-7 h-7" />
              </a>
              <a href="https://www.tiktok.com/@libracredito" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <title>TikTok</title>
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>

            {/* Selo Reclame Aqui - apenas desktop */}
            <div className="hidden md:flex justify-center mt-4">
              <RASeal id="ra-seal-desktop" />
            </div>

            {/* Botão Voltar ao Topo - apenas desktop */}
            <button
              onClick={scrollToTop}
              className="hidden md:flex items-center gap-1 md:gap-2 ml-auto text-white/80 hover:text-white transition-colors text-xs md:text-sm"
              aria-label="Voltar ao topo"
            >
              <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Voltar ao topo</span>
            </button>
          </div>
          {/* Selo Reclame Aqui - mobile */}
          <div className="col-span-3 md:hidden flex justify-center mt-4">
            <RASeal id="ra-seal-mobile" />
          </div>
        </div>

        {/* Informações Legais */}
        <div className="text-center border-t border-white/20 pt-6 md:pt-8">
          <p className="text-sm md:text-base text-white">&copy; {new Date().getFullYear()} Libra Crédito. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm md:text-base text-white/90">
            CNPJ: 34.308.576/0001-32 | Rua Eliseu Guilherme, 879, sala 01 – Jardim Sumaré, Ribeirão Preto – SP, 14025-020
          </p>
          <div className="mt-4 md:mt-6 flex justify-center gap-4 text-sm">
            <Link to="/politica-privacidade" className="text-white/80 hover:text-white transition-colors underline">
              Política de Privacidade
            </Link>
            <span className="text-white/60">|</span>
            <Link to="/politica-cookies" className="text-white/80 hover:text-white transition-colors underline">
              Política de Cookies
            </Link>
          </div>
          <div className="mt-4 md:mt-6 px-0 md:px-4 text-xs md:text-sm leading-relaxed text-white/80 space-y-2">
            <p>A Libra Crédito é uma plataforma digital que descomplica o processo de contratação de empréstimos com garantia de imóvel. Essas operações são realizadas através de Instituições Financeiras parceiras, autorizadas pelo Banco Central do Brasil.</p>
            <p><strong className="text-white">Informações do produto:</strong> Prazo de 36 a 180 meses | Taxa a partir de 1,19% ao mês + IPCA | Sistema Price ou SAC | Exemplo: R$ 75.000 em 180 meses - Prestação inicial de R$ 1.184,26 | CET de 15,86% ao ano.</p>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;