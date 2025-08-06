import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPremiumDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile-sm' | 'mobile-md' | 'mobile-lg' | 'tablet' | 'desktop';
  isIOS: boolean;
  isAndroid: boolean;
  hasNotch: boolean;
  isTouchDevice: boolean;
}

export const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPremiumDevice: false,
        screenWidth: 1920,
        screenHeight: 1080,
        deviceType: 'desktop',
        isIOS: false,
        isAndroid: false,
        hasNotch: false,
        isTouchDevice: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const uaData = (navigator as any).userAgentData;
    const platform = uaData?.platform || navigator.userAgent;

    // Detectar sistema operacional utilizando userAgentData com fallback
    const isIOS = /iPad|iPhone|iPod/.test(platform);
    const isAndroid = /Android/.test(platform);

    // Detectar dispositivo premium
    const isPremiumDevice = 
      (isIOS && (width >= 375 || height >= 812)) || // iPhone X e superiores
      (isAndroid && width >= 360 && window.devicePixelRatio >= 3); // Android premium

    // Detectar notch (iPhone X+)
    const hasNotch = isIOS && (
      (width === 375 && height === 812) || // iPhone X/XS/11 Pro
      (width === 414 && height === 896) || // iPhone XR/XS Max/11/11 Pro Max
      (width === 390 && height === 844) || // iPhone 12/13/14
      (width === 393 && height === 852) || // iPhone 14 Pro
      (width === 430 && height === 932)    // iPhone 14 Pro Max
    );

    // Detectar touch com verificação de suporte a maxTouchPoints
    const maxTouchPoints =
      'maxTouchPoints' in navigator ? navigator.maxTouchPoints : 0;
    const isTouchDevice = 'ontouchstart' in window || maxTouchPoints > 0;

    // Determinar tipo de dispositivo
    let deviceType: DeviceInfo['deviceType'];
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;

    if (width < 768) {
      isMobile = true;
      if (width < 375) {
        deviceType = 'mobile-sm';
      } else if (width < 414) {
        deviceType = 'mobile-md';
      } else {
        deviceType = 'mobile-lg';
      }
    } else if (width < 1024) {
      isTablet = true;
      deviceType = 'tablet';
    } else {
      isDesktop = true;
      deviceType = 'desktop';
    }

    return {
      isMobile,
      isTablet,
      isDesktop,
      isPremiumDevice,
      screenWidth: width,
      screenHeight: height,
      deviceType,
      isIOS,
      isAndroid,
      hasNotch,
      isTouchDevice,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const uaData = (navigator as any).userAgentData;
      const platform = uaData?.platform || navigator.userAgent;

      const isIOS = /iPad|iPhone|iPod/.test(platform);
      const isAndroid = /Android/.test(platform);

      const isPremiumDevice = 
        (isIOS && (width >= 375 || height >= 812)) ||
        (isAndroid && width >= 360 && window.devicePixelRatio >= 3);

      const hasNotch = isIOS && (
        (width === 375 && height === 812) ||
        (width === 414 && height === 896) ||
        (width === 390 && height === 844) ||
        (width === 393 && height === 852) ||
        (width === 430 && height === 932)
      );

      const maxTouchPoints =
        'maxTouchPoints' in navigator ? navigator.maxTouchPoints : 0;
      const isTouchDevice = 'ontouchstart' in window || maxTouchPoints > 0;

      let deviceType: DeviceInfo['deviceType'];
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < 768) {
        isMobile = true;
        if (width < 375) {
          deviceType = 'mobile-sm';
        } else if (width < 414) {
          deviceType = 'mobile-md';
        } else {
          deviceType = 'mobile-lg';
        }
      } else if (width < 1024) {
        isTablet = true;
        deviceType = 'tablet';
      } else {
        isDesktop = true;
        deviceType = 'desktop';
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isPremiumDevice,
        screenWidth: width,
        screenHeight: height,
        deviceType,
        isIOS,
        isAndroid,
        hasNotch,
        isTouchDevice,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

// Hook para verificar se é só mobile
export const useMobileOnly = () => {
  const { isMobile } = useDevice();
  return isMobile;
};

// Hook para media queries customizadas
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
