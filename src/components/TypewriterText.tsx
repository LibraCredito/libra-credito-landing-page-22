import { useEffect, useRef } from 'react';

export default function TypewriterText({ strings }: { strings: string[] }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed: any;
    let isMounted = true;

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

    loadTyped();

    return () => {
      isMounted = false;
      typed?.destroy();
    };
  }, [strings]);

  return <span ref={el}>{strings[0]}</span>;
}
