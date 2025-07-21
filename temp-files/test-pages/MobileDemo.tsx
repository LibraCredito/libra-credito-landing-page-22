import React from 'react';
import { useDevice } from '@/hooks/useDevice';
import { useOrientation, useVirtualKeyboard } from '@/components/MobileOptimized';
import { AdaptiveView, MobileOnly, DesktopOnly } from '@/components/AdaptiveView';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MobileDemo = () => {
  const device = useDevice();
  const orientation = useOrientation();
  const { isKeyboardVisible, keyboardHeight } = useVirtualKeyboard();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 text-libra-blue">
            Demonstração Mobile - Fase 1
          </h1>

          {/* Alerta Visual por Dispositivo */}
          <AdaptiveView
            mobile={
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold text-green-800 mb-2">
                  📱 Você está em um MOBILE!
                </h2>
                <p className="text-green-700">
                  A experiência está otimizada para toque. Todos os botões têm no mínimo 48px de altura.
                </p>
              </div>
            }
            tablet={
              <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold text-blue-800 mb-2">
                  📱 Você está em um TABLET!
                </h2>
                <p className="text-blue-700">
                  Interface adaptada para telas médias com mais espaço visual.
                </p>
              </div>
            }
            desktop={
              <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold text-purple-800 mb-2">
                  💻 Você está em um DESKTOP!
                </h2>
                <p className="text-purple-700">
                  Experiência completa com todos os recursos visuais.
                </p>
              </div>
            }
          />

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Device Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-libra-blue">
                📊 Informações do Dispositivo
              </h3>
              <div className="space-y-2">
                <InfoRow label="Tipo" value={device.deviceType} />
                <InfoRow label="Largura" value={`${device.screenWidth}px`} />
                <InfoRow label="Altura" value={`${device.screenHeight}px`} />
                <InfoRow label="Touch" value={device.isTouchDevice ? '✅ Sim' : '❌ Não'} />
                <InfoRow label="Premium" value={device.isPremiumDevice ? '✅ Sim' : '❌ Não'} />
                <InfoRow label="Sistema" value={
                  device.isIOS ? '🍎 iOS' : 
                  device.isAndroid ? '🤖 Android' : 
                  '💻 Desktop'
                } />
              </div>
            </div>

            {/* Dynamic State Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-libra-blue">
                🔄 Estado Dinâmico
              </h3>
              <div className="space-y-2">
                <InfoRow label="Orientação" value={
                  orientation === 'portrait' ? '📱 Retrato' : '📱 Paisagem'
                } />
                <InfoRow label="Teclado" value={
                  isKeyboardVisible ? `⌨️ Visível (${keyboardHeight}px)` : '❌ Oculto'
                } />
                <InfoRow label="Notch" value={
                  device.hasNotch ? '✅ Detectado' : '❌ Não detectado'
                } />
              </div>
            </div>
          </div>

          {/* Demonstração de Componentes Mobile */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-libra-blue">
              🎨 Componentes Touch-Friendly
            </h3>
            
            <div className="space-y-4">
              {/* Botões com tamanho mínimo de 48px */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Botões otimizados (min 48px altura):</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="mobile-button-primary flex-1">
                    Simular Agora
                  </button>
                  <button className="mobile-button-secondary flex-1">
                    Falar no WhatsApp
                  </button>
                </div>
              </div>

              {/* Input otimizado */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Inputs sem zoom (font-size: 16px):</p>
                <input 
                  type="text" 
                  className="mobile-input w-full" 
                  placeholder="Digite seu nome (sem zoom no iOS)"
                />
              </div>

              {/* Select otimizado */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Select customizado:</p>
                <select className="mobile-select w-full">
                  <option>Selecione o valor desejado</option>
                  <option>R$ 100.000</option>
                  <option>R$ 300.000</option>
                  <option>R$ 500.000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Demonstração de Visibilidade Condicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <MobileOnly>
              <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  📱 Conteúdo Exclusivo Mobile
                </h3>
                <p className="text-orange-700">
                  Este card só aparece em dispositivos mobile! 
                  Perfect para CTAs simplificados.
                </p>
                <button className="w-full mt-4 mobile-button-primary">
                  Ligar Agora
                </button>
              </div>
            </MobileOnly>

            <DesktopOnly>
              <div className="bg-indigo-100 border-2 border-indigo-500 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                  💻 Conteúdo Exclusivo Desktop
                </h3>
                <p className="text-indigo-700">
                  Este card só aparece em desktop! 
                  Ideal para informações detalhadas.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">• Análise completa</p>
                  <p className="text-sm">• Gráficos detalhados</p>
                  <p className="text-sm">• Tabelas comparativas</p>
                </div>
              </div>
            </DesktopOnly>
          </div>

          {/* Performance Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-libra-blue">
              ⚡ Otimizações de Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>CSS Containment</span>
                <span className="text-green-600 font-semibold">✅ Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Touch Optimization</span>
                <span className="text-green-600 font-semibold">✅ Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>GPU Acceleration</span>
                <span className="text-green-600 font-semibold">✅ Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Safe Areas (iPhone X+)</span>
                <span className={device.hasNotch ? "text-green-600 font-semibold" : "text-gray-400"}>
                  {device.hasNotch ? '✅ Ativo' : '➖ N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              💡 Como Testar
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Redimensione a janela do navegador para ver as mudanças</li>
              <li>Use o DevTools em modo mobile (F12 → Toggle device)</li>
              <li>Teste em um dispositivo mobile real</li>
              <li>Tente digitar nos inputs (sem zoom no iOS!)</li>
              <li>Gire o dispositivo para testar orientação</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Componente auxiliar para linhas de informação
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-gray-100">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default MobileDemo;
