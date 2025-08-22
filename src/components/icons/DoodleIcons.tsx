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
    viewBox="0 0 80 80" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Супер-градиент для заливки */}
      <radialGradient id="astrotSuperGradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#FFD60A" />
        <stop offset="20%" stopColor="#FF006E" />
        <stop offset="40%" stopColor="#8B5CF6" />
        <stop offset="60%" stopColor="#00F5FF" />
        <stop offset="80%" stopColor="#FF6B35" />
        <stop offset="100%" stopColor="#00F593" />
      </radialGradient>

      {/* Градиент для внутреннего свечения */}
      <radialGradient id="innerGlow" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#FFD60A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FF006E" stopOpacity="0.2" />
      </radialGradient>
      
      {/* Фильтр для супер-свечения */}
      <filter id="superGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feFlood floodColor="#FFD60A" floodOpacity="0.5"/>
        <feComposite in2="coloredBlur" operator="in"/>
        <feComposite in2="SourceGraphic" operator="over" result="glow1"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2"/>
        <feFlood floodColor="#FF006E" floodOpacity="0.3"/>
        <feComposite in2="blur2" operator="in"/>
        <feComposite in2="glow1" operator="over"/>
      </filter>

      {/* Паттерн звездочек */}
      <pattern id="sparkles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1" fill="#FFD60A" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="15" cy="15" r="0.5" fill="#FF006E" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </pattern>
    </defs>
    
    {/* Внешнее свечение ореол */}
    <circle
      cx="40"
      cy="40"
      r="38"
      fill="none"
      stroke="url(#astrotSuperGradient)"
      strokeWidth="2"
      opacity="0.3"
      filter="url(#superGlow)"
    >
      <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
    </circle>

    {/* Основная звезда-супергерой с неровными краями */}
    <path
      d="M 40 8 
         Q 42 15, 45 20 
         L 52 22 
         Q 58 23, 62 26 
         L 60 32 
         Q 58 38, 60 44 
         L 65 50 
         Q 66 56, 62 60 
         L 56 58 
         Q 50 58, 44 60 
         L 40 65 
         Q 36 60, 32 58 
         L 26 58 
         Q 20 56, 18 50 
         L 22 44 
         Q 20 38, 18 32 
         L 20 26 
         Q 24 23, 28 22 
         L 35 20 
         Q 38 15, 40 8 Z"
      fill="url(#astrotSuperGradient)"
      stroke="#2D3748"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#superGlow)"
      style={{
        transformOrigin: 'center',
      }}
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 40 40"
        to="360 40 40"
        dur="20s"
        repeatCount="indefinite"
      />
    </path>

    {/* Внутренний блик */}
    <ellipse
      cx="35"
      cy="30"
      rx="12"
      ry="8"
      fill="url(#innerGlow)"
      opacity="0.8"
    >
      <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
    </ellipse>
    
    {/* Милые глазки */}
    <g className="eyes">
      {/* Левый глаз */}
      <ellipse cx="32" cy="35" rx="5" ry="7" fill="#2D3748" />
      <ellipse cx="33" cy="33" rx="2" ry="3" fill="#FFFFFF" />
      <circle cx="32" cy="36" r="1" fill="#FFD60A">
        <animate attributeName="r" values="1;1.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Правый глаз */}
      <ellipse cx="48" cy="35" rx="5" ry="7" fill="#2D3748" />
      <ellipse cx="49" cy="33" rx="2" ry="3" fill="#FFFFFF" />
      <circle cx="48" cy="36" r="1" fill="#FFD60A">
        <animate attributeName="r" values="1;1.5;1" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* Улыбка */}
    <path
      d="M 30 45 Q 40 52, 50 45"
      stroke="#2D3748"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    >
      <animate attributeName="d" 
        values="M 30 45 Q 40 52, 50 45;M 30 45 Q 40 54, 50 45;M 30 45 Q 40 52, 50 45" 
        dur="3s" 
        repeatCount="indefinite" />
    </path>

    {/* Румянец */}
    <ellipse cx="22" cy="40" rx="4" ry="3" fill="#FF6B9D" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.7;0.5" dur="4s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="58" cy="40" rx="4" ry="3" fill="#FF6B9D" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.7;0.5" dur="4s" begin="0.5s" repeatCount="indefinite" />
    </ellipse>

    {/* Маленькие звездочки вокруг */}
    <text x="10" y="20" fontSize="12" fill="#FFD60A" className="animate-cartoon-float">✨</text>
    <text x="65" y="25" fontSize="10" fill="#FF006E" className="animate-cartoon-float" style={{ animationDelay: '0.5s' }}>⭐</text>
    <text x="60" y="70" fontSize="11" fill="#00F5FF" className="animate-cartoon-float" style={{ animationDelay: '1s' }}>💫</text>
    <text x="15" y="65" fontSize="9" fill="#8B5CF6" className="animate-cartoon-float" style={{ animationDelay: '1.5s' }}>✨</text>

    {/* Комета-хвостик */}
    <path
      d="M 55 15 Q 60 12, 65 8 Q 68 6, 70 5"
      stroke="url(#astrotSuperGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
      fill="none"
    >
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);