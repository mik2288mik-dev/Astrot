import React, { useMemo } from 'react';

export default function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      size: Math.random() * 0.5 + 0.5,
      opacity: 0.6 + Math.random() * 0.4
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute text-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
            fontSize: `${star.size}rem`,
            transform: `scale(${star.size})`
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
