import { lazy, Suspense, useEffect, useState } from 'react';

const GlobalTracker = lazy(() => import('./GlobalTracker'));

const LazyGlobalTracker = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const load = () => setShouldLoad(true);
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(load);
      return () => (window as any).cancelIdleCallback(id);
    }
    const id = window.setTimeout(load, 1000);
    return () => window.clearTimeout(id);
  }, []);

  return shouldLoad ? (
    <Suspense fallback={null}>
      <GlobalTracker />
    </Suspense>
  ) : null;
};

export default LazyGlobalTracker;
