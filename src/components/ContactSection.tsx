import React from 'react';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Youtube from 'lucide-react/dist/esm/icons/youtube';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
const ContactSection: React.FC = () => {
  return <section className="py-16 md:py-24 bg-libra-navy text-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fale Conosco</h2>
          <p className="text-lg text-libra-silver max-w-3xl mx-auto">
            Tire suas dúvidas e descubra como podemos ajudar você a conquistar seus objetivos financeiros.
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <div className="bg-libra-blue/20 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6">Entre em contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-libra-gold rounded-full p-2 mt-1">
                  <Phone className="w-5 h-5 text-libra-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Telefone</h4>
                  <p className="text-libra-silver">16 99636 0424</p>
                  <p className="text-sm text-libra-silver mt-1">Segunda a sexta, das 9h às 18h</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-libra-gold rounded-full p-2 mt-1">
                  <Mail className="w-5 h-5 text-libra-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">E-mail</h4>
                  <p className="text-libra-silver">contato@libracredito.com.br</p>
                  <p className="text-sm text-libra-silver mt-1">Respondemos em até 24 horas úteis</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-libra-blue/30">
              <h4 className="font-bold text-lg mb-4">Acompanhe nas redes sociais</h4>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/LibraCreditoOficial/" target="_blank" rel="noopener noreferrer" className="bg-libra-blue/30 hover:bg-libra-gold p-3 rounded-full transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.instagram.com/libracredito/" target="_blank" rel="noopener noreferrer" className="bg-libra-blue/30 hover:bg-libra-gold p-3 rounded-full transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.linkedin.com/company/libracredito/" target="_blank" rel="noopener noreferrer" className="bg-libra-blue/30 hover:bg-libra-gold p-3 rounded-full transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.youtube.com/channel/UCXpuj7LlTLT_kdbwwJHS0qA" target="_blank" rel="noopener noreferrer" className="bg-libra-blue/30 hover:bg-libra-gold p-3 rounded-full transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.reclameaqui.com.br/empresa/libra-credito-solucoes-financeiras/" target="_blank" rel="noopener noreferrer" className="bg-libra-blue/30 hover:bg-libra-gold p-3 rounded-full transition-colors" aria-label="Reclame Aqui">
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;