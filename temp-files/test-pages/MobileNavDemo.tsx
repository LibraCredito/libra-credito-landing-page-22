import React from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useDevice } from '@/hooks/useDevice';
import { Calculator, MessageCircle, Home, Menu } from 'lucide-react';

const MobileNavDemo = () => {
  const { isMobile, deviceType, hasNotch } = useDevice();

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-libra-blue to-blue-700 text-white p-6 pb-12">
          <h1 className="text-2xl font-bold mb-4">
            📱 Fase 2: Navegação Mobile Completa!
          </h1>
          <p className="text-lg mb-4">
            Agora temos uma navegação bottom moderna, estilo apps nativos!
          </p>
          {isMobile && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm">
                ✨ Você está vendo a versão mobile com Bottom Navigation
              </p>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="p-6 -mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-libra-blue mb-4">
              🎯 O que foi implementado:
            </h2>
            
            <div className="space-y-4">
              {/* Bottom Navigation */}
              <FeatureCard
                icon="📍"
                title="Bottom Navigation Bar"
                description="Navegação fixa no rodapé com 4 ícones principais"
                active={isMobile}
              />
              
              {/* Special Button */}
              <FeatureCard
                icon="💰"
                title="Botão Especial de Simulação"
                description="Botão destacado no centro para a ação principal"
                active={isMobile}
              />
              
              {/* Safe Areas */}
              <FeatureCard
                icon="📱"
                title="Safe Areas (iPhone X+)"
                description={`Suporte automático para notch ${hasNotch ? '(Detectado!)' : '(Não detectado)'}`}
                active={hasNotch}
              />
              
              {/* Simplified Header */}
              <FeatureCard
                icon="🎨"
                title="Header Simplificado"
                description="Apenas logo e portal do cliente em mobile"
                active={isMobile}
              />
              
              {/* Slide Menu */}
              <FeatureCard
                icon="☰"
                title="Menu Deslizante"
                description="Menu lateral com todas as opções de navegação"
                active={isMobile}
              />
              
              {/* WhatsApp Integration */}
              <FeatureCard
                icon="💬"
                title="Integração WhatsApp"
                description="Link direto para WhatsApp com mensagem pré-definida"
                active={true}
              />
            </div>
          </div>

          {/* Navigation Demo */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-libra-blue mb-4">
              🧭 Demonstração da Navegação
            </h2>
            
            {isMobile ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Olhe para o rodapé da tela! A navegação está lá embaixo.
                </p>
                
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <NavItem icon={Home} label="Início" />
                    <NavItem icon={Calculator} label="Simular" special />
                    <NavItem icon={MessageCircle} label="WhatsApp" />
                    <NavItem icon={Menu} label="Menu" />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 italic">
                  ↑ Representação visual da barra de navegação real no rodapé
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  🖥️ Você está em desktop. Redimensione a janela ou acesse pelo celular para ver a navegação mobile!
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-libra-blue mb-4">
              📖 Como Testar
            </h2>
            
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="font-bold text-libra-blue mr-2">1.</span>
                <span>Clique nos ícones da barra inferior para navegar</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-libra-blue mr-2">2.</span>
                <span>Toque em "Menu" para ver o menu deslizante</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-libra-blue mr-2">3.</span>
                <span>O botão "Simular" está destacado no centro</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-libra-blue mr-2">4.</span>
                <span>WhatsApp abre diretamente com mensagem pronta</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-libra-blue mr-2">5.</span>
                <span>Em iPhone X+, veja o espaço extra no bottom</span>
              </li>
            </ol>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-900 text-white rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold mb-3">⚙️ Detalhes Técnicos</h3>
            <ul className="space-y-2 text-sm font-mono">
              <li>• Device Type: <span className="text-green-400">{deviceType}</span></li>
              <li>• Is Mobile: <span className="text-green-400">{isMobile ? 'true' : 'false'}</span></li>
              <li>• Has Notch: <span className="text-green-400">{hasNotch ? 'true' : 'false'}</span></li>
              <li>• Bottom Nav: <span className="text-green-400">{isMobile ? 'active' : 'hidden'}</span></li>
            </ul>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  active?: boolean;
}> = ({ icon, title, description, active = false }) => (
  <div className={`flex items-start space-x-3 p-3 rounded-lg ${
    active ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
  }`}>
    <span className="text-2xl">{icon}</span>
    <div className="flex-1">
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
      {active && (
        <span className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
          ✓ Ativo
        </span>
      )}
    </div>
  </div>
);

// Nav Item Component
const NavItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  special?: boolean;
}> = ({ icon: Icon, label, special = false }) => (
  <div className="flex flex-col items-center">
    {special ? (
      <div className="w-12 h-12 bg-libra-blue rounded-full flex items-center justify-center -mt-3 shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
    ) : (
      <>
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-xs mt-1 text-gray-600">{label}</span>
      </>
    )}
    {special && <span className="text-xs mt-1 text-libra-blue font-medium">{label}</span>}
  </div>
);

export default MobileNavDemo;
