import { useEffect, useRef } from 'react';

export default function TypewriterText({ strings }: { strings: string[] }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed: any;

    import('typed.js').then(({ default: Typed }) => {
      typed = new Typed(el.current!, {
        strings,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true,
      });
    });

    return () => typed?.destroy();
  }, [strings]);

  return <span ref={el}>{strings[0]}</span>;
}
