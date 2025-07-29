import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function TypewriterText({ strings }: { strings: string[] }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const typed = new Typed(el.current!, {
      strings,
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
    });
    return () => typed.destroy();
  }, [strings]);

  return <span ref={el} />;
}
