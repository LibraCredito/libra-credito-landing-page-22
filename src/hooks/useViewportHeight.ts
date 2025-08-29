import { useEffect } from 'react';

/**
 * Hook to set a CSS custom property `--vh` representing 1% of the viewport height.
 * Updates the value on window resize to address mobile browser UI chrome.
 */
export const useViewportHeight = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);
};
