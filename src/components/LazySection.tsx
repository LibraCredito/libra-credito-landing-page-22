import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  load: () => Promise<{ default: React.ComponentType<unknown> }>;
  children?: ReactNode;
}

const LazySection: React.FC<LazySectionProps> = ({ load, children }) => {
  const [Component, setComponent] = useState<React.ComponentType<unknown> | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadRef.current().then(({ default: Loaded }) => {
            setComponent(() => Loaded);
          });
          obs.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{Component ? (children ? children : <Component />) : null}</div>;
};

export default LazySection;
