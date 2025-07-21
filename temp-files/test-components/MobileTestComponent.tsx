import React from 'react';
import { useDevice, useOrientation, useVirtualKeyboard } from '@/hooks';
import { AdaptiveView, MobileOnly, DesktopOnly } from '@/components/AdaptiveView';
import { performanceMonitor } from '@/utils/performance';

export const MobileTestComponent = () => {
  const device = useDevice();
  const orientation = useOrientation();
  const { isKeyboardVisible, keyboardHeight } = useVirtualKeyboard();
  const [fps, setFps] = React.useState(60);
  const [connectionSpeed, setConnectionSpeed] = React.useState<string>('medium');

  React.useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((metrics) => {
      setFps(metrics.fps);
      setConnectionSpeed(metrics.connectionSpeed);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-libra-blue mb-4">
        Teste de Infraestrutura Mobile
      </h2>

      {/* Device Info */}
      <div className="mobile-card">
        <h3 className="font-semibold mb-2">Informações do Dispositivo:</h3>
        <ul className="space-y-1 text-sm">
          <li>Tipo: <span className="font-medium">{device.deviceType}</span></li>
          <li>Mobile: <span className="font-medium">{device.isMobile ? 'Sim' : 'Não'}</span></li>
          <li>Premium: <span className="font-medium">{device.isPremiumDevice ? 'Sim' : 'Não'}</span></li>
          <li>iOS: <span className="font-medium">{device.isIOS ? 'Sim' : 'Não'}</span></li>
          <li>Android: <span className="font-medium">{device.isAndroid ? 'Sim' : 'Não'}</span></li>
          <li>Notch: <span className="font-medium">{device.hasNotch ? 'Sim' : 'Não'}</span></li>
          <li>Touch: <span className="font-medium">{device.isTouchDevice ? 'Sim' : 'Não'}</span></li>
          <li>Tela: <span className="font-medium">{device.screenWidth}x{device.screenHeight}</span></li>
        </ul>
      </div>

      {/* Orientation & Keyboard */}
      <div className="mobile-card">
        <h3 className="font-semibold mb-2">Estado Dinâmico:</h3>
        <ul className="space-y-1 text-sm">
          <li>Orientação: <span className="font-medium">{orientation}</span></li>
          <li>Teclado Virtual: <span className="font-medium">{isKeyboardVisible ? `Visível (${keyboardHeight}px)` : 'Oculto'}</span></li>
        </ul>
      </div>

      {/* Performance */}
      <div className="mobile-card">
        <h3 className="font-semibold mb-2">Performance:</h3>
        <ul className="space-y-1 text-sm">
          <li>FPS: <span className="font-medium">{fps}</span></li>
          <li>Conexão: <span className="font-medium">{connectionSpeed}</span></li>
          <li>Motion Reduzido: <span className="font-medium">{performanceMonitor.shouldReduceMotion() ? 'Sim' : 'Não'}</span></li>
        </ul>
      </div>

      {/* Adaptive Components Test */}
      <div className="mobile-card">
        <h3 className="font-semibold mb-2">Componentes Adaptativos:</h3>
        
        <MobileOnly>
          <p className="text-sm text-green-600 mb-2">✅ Este texto só aparece em MOBILE</p>
        </MobileOnly>
        
        <DesktopOnly>
          <p className="text-sm text-blue-600 mb-2">💻 Este texto só aparece em DESKTOP</p>
        </DesktopOnly>

        <AdaptiveView
          mobile={<p className="text-sm text-orange-600">📱 Versão Mobile</p>}
          tablet={<p className="text-sm text-purple-600">📱 Versão Tablet</p>}
          desktop={<p className="text-sm text-indigo-600">🖥️ Versão Desktop</p>}
        />
      </div>

      {/* Touch Targets Test */}
      <div className="mobile-card">
        <h3 className="font-semibold mb-2">Touch Targets:</h3>
        <div className="space-y-2">
          <button className="mobile-button-primary w-full">
            Botão Mobile Primário
          </button>
          <button className="mobile-button-secondary w-full">
            Botão Mobile Secundário
          </button>
          <input 
            type="text" 
            className="mobile-input" 
            placeholder="Input otimizado para mobile"
          />
          <select className="mobile-select">
            <option>Opção 1</option>
            <option>Opção 2</option>
            <option>Opção 3</option>
          </select>
        </div>
      </div>

      {/* Safe Areas Demo */}
      {device.hasNotch && (
        <div className="mobile-card bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold mb-2">Safe Areas Detectadas:</h3>
          <p className="text-sm">
            Seu dispositivo tem notch! As safe areas estão sendo aplicadas automaticamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileTestComponent;
