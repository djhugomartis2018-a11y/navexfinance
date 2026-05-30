import { useRef, useState, useCallback } from 'react';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = 'rgba(124,58,237,0.15)' }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = divRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={divRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}% ${position.y}%, ${fill}, transparent 70%)`,
        }}
      />
      {/* Static ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(800px circle at 70% 40%, rgba(124,58,237,0.06), transparent 70%)`,
        }}
      />
      {/* Invisible mouse tracker */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
