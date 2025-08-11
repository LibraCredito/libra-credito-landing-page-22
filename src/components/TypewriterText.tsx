import { useEffect, useRef } from 'react';
import type Typed from 'typed.js';

export default function TypewriterText({ strings }: { strings: string[] }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed: Typed | undefined;
    let isMounted = true;

    const setMinWidth = () => {
      if (!el.current) return;
      const span = document.createElement('span');
      const computed = window.getComputedStyle(el.current);
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'pre';
      span.style.font = computed.font;
      document.body.appendChild(span);
      let maxWidth = 0;
      strings.forEach((str) => {
        span.textContent = str;
        maxWidth = Math.max(maxWidth, span.getBoundingClientRect().width);
      });
      document.body.removeChild(span);
      el.current.style.display = 'inline-block';
      el.current.style.minWidth = `${Math.ceil(maxWidth)}px`;
    };

    const loadTyped = async () => {
      setMinWidth();
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
