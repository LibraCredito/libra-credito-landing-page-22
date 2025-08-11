import { useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipeGesture = (
  elementRef: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  threshold = 50
) => {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX;
      touchStartY.current = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      touchEndY.current = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if it's a horizontal or vertical swipe
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX > threshold) {
          if (deltaX > 0 && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          } else if (deltaX < 0 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY > threshold) {
          if (deltaY > 0 && handlers.onSwipeDown) {
            handlers.onSwipeDown();
          } else if (deltaY < 0 && handlers.onSwipeUp) {
            handlers.onSwipeUp();
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handlers, threshold]);
};

// Hook for page navigation with swipe
export const useSwipeNavigation = () => {
  const bodyRef = useRef(document.body);
  const pages = ['/', '/simulacao-guiada', '/vantagens', '/quem-somos'];
  
  const getCurrentPageIndex = () => {
    const currentPath = window.location.pathname;
    return pages.indexOf(currentPath);
  };

  const navigateToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      window.location.pathname = pages[index];
    }
  };

  useSwipeGesture(bodyRef, {
    onSwipeLeft: () => {
      const currentIndex = getCurrentPageIndex();
      if (currentIndex !== -1 && currentIndex < pages.length - 1) {
        navigateToPage(currentIndex + 1);
      }
    },
    onSwipeRight: () => {
      const currentIndex = getCurrentPageIndex();
      if (currentIndex > 0) {
        navigateToPage(currentIndex - 1);
      }
    }
  });
};
