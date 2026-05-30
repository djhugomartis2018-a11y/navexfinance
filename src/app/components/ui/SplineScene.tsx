import { Suspense, lazy, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: () => void;
}

function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-accent-purple/30 border-t-accent-purple animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-accent-purple/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  function handleLoad() {
    setLoaded(true);
    onLoad?.();
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10">
          <SplineLoader />
        </div>
      )}
      <Suspense fallback={<SplineLoader />}>
        <Spline
          scene={scene}
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        />
      </Suspense>
    </div>
  );
}
