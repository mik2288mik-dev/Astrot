'use client';

import { useMemo } from "react";

type Props = {
  message?: string;
};

export default function CosmicLoader({ message = "Подключение к космосу..." }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        size: 1 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-black via-indigo-950 to-black text-white">
      <div
        className="absolute inset-0 -z-20 opacity-40"
        style={{
          background:
            "conic-gradient(at 50% 50%, rgba(79,70,229,0.6), rgba(147,51,234,0.6), rgba(59,7,100,0.6), rgba(79,70,229,0.6))",
          animation: "spin 30s linear infinite",
        }}
      />
      <div className="absolute inset-0 -z-10">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white opacity-70 animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>
      <div className="text-center">
        <svg
          className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
}

