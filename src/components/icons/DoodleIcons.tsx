// Doodle-style icons for cartoon bottom bar
import React from 'react';

// Домик в стиле doodle - неровные линии, как нарисовано маркером
export const DoodleHomeIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 48 48" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Крыша - кривой треугольник */}
    <path 
      d="M 6 22 Q 7 20, 10 17 T 15 12 Q 20 7, 24 5 Q 28 7, 33 12 T 38 17 Q 41 20, 42 22"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Стены дома - неровный прямоугольник */}
    <path 
      d="M 9 22 Q 9 22, 9 38 Q 9 40, 11 40 L 37 40 Q 39 40, 39 38 L 39 22"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Дверь - кривой прямоугольник */}
    <path 
      d="M 20 40 L 20 28 Q 20 26, 22 26 L 26 26 Q 28 26, 28 28 L 28 40"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Окошко - неровный круг */}
    <path 
      d="M 24 18 Q 27 18, 27 20 Q 27 22, 24 22 Q 21 22, 21 20 Q 21 18, 24 18"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Дымоход */}
    <path 
      d="M 34 10 L 34 15 L 37 15 L 37 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Три точки меню в стиле doodle - неровные круги
export const DoodleMoreIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 48 48" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Первая точка - слегка овальная */}
    <ellipse 
      cx="12" 
      cy="24" 
      rx="4.2" 
      ry="3.8" 
      style={{
        transform: 'rotate(-15deg)',
        transformOrigin: '12px 24px'
      }}
    />
    {/* Вторая точка - немного больше */}
    <ellipse 
      cx="24" 
      cy="24" 
      rx="4.5" 
      ry="4.3" 
      style={{
        transform: 'rotate(20deg)',
        transformOrigin: '24px 24px'
      }}
    />
    {/* Третья точка - неровная */}
    <ellipse 
      cx="36" 
      cy="24" 
      rx="3.9" 
      ry="4.4" 
      style={{
        transform: 'rotate(-10deg)',
        transformOrigin: '36px 24px'
      }}
    />
  </svg>
);

// Лого Astrot в мультяшном стиле - большая звезда с кривыми лучами
export const DoodleAstrotLogo = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 64 64" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Градиент для заливки */}
      <linearGradient id="astrotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B9D" />
        <stop offset="33%" stopColor="#C66EFD" />
        <stop offset="66%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
      
      {/* Фильтр для свечения */}
      <filter id="astrotGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Фильтр для неровности */}
      <filter id="roughness">
        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turbulence"/>
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    
    {/* Звезда с кривыми лучами */}
    <path
      d="M32 4c1.5 0 2.8 0.9 3.4 2.3l5.8 13.2c0.3 0.6 0.8 1.1 1.5 1.2l14.2 2.3c1.5 0.2 2.7 1.3 3 2.8 0.3 1.5-0.3 3-1.5 3.9L48 39.3c-0.5 0.4-0.7 1.1-0.6 1.7l2.8 14c0.3 1.5-0.4 3-1.7 3.8-1.3 0.8-3 0.9-4.3 0.1L32 52.3c-0.6-0.3-1.3-0.3-1.9 0l-12.2 6.6c-1.3 0.7-3 0.7-4.3-0.1-1.3-0.8-2-2.3-1.7-3.8l2.8-14c0.1-0.6-0.1-1.3-0.6-1.7L3.6 29.7c-1.2-0.9-1.8-2.4-1.5-3.9 0.3-1.5 1.5-2.6 3-2.8l14.2-2.3c0.7-0.1 1.2-0.6 1.5-1.2l5.8-13.2C27.2 4.9 28.5 4 30 4h2z"
      fill="url(#astrotGradient)"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#astrotGlow)"
      style={{
        filter: 'url(#roughness) url(#astrotGlow)',
      }}
    />
    
    {/* Центральная буква A стилизованная */}
    <text
      x="32"
      y="38"
      fontFamily="'Comic Neue', cursive"
      fontSize="20"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      }}
    >
      A
    </text>
  </svg>
);