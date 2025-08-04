import React from 'react';

export default function StarField() {
  const stars = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((_, i) => (
        <span
          key={i}
          className="absolute text-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            opacity: 0.8,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
