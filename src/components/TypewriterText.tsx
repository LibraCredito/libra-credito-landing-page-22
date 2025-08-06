import { useEffect, useRef } from 'react';

export default function TypewriterText({ strings }: { strings: string[] }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed: any;
    let isMounted = true;
    let idleId: number | null = null;

    const loadTyped = async () => {
      const { default: Typed } = await import('typed.js');
      if (!isMounted || !el.current) return;

      typed = new Typed(el.current, {
        strings,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true,
      });
    };

    const start = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        idleId = (window as any).requestIdleCallback(() => loadTyped());
      } else {
        loadTyped();
      }
    };

    const onInteract = () => {
      start();
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };

    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });

    return () => {
      isMounted = false;
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      typed?.destroy();
    };
  }, [strings]);

  return <span ref={el}>{strings[0]}</span>;
}
