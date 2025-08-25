'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';

const CARTOON_COLORS = {
  pastelPink: '#FFE0EC',
  pastelPurple: '#E8D5FF',
  pastelBlue: '#D6ECFF',
  pastelMint: '#D6FFE8',
  pastelPeach: '#FFE5D6',
  pastelLemon: '#FFF9D6',
  accent: '#B794F6',
  accentDark: '#9F7AEA',
  text: '#4A3D5C',
  textLight: '#9B8FAB'
};

const ZODIAC_EMOJIS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const PLANET_EMOJIS: Record<string, string> = {
  Sun: '☀️', Moon: '🌙', Mercury: '💫', Venus: '💝', Mars: '🔥',
  Jupiter: '🌟', Saturn: '⏳', Uranus: '⚡', Neptune: '🌊', Pluto: '🌑',
  Node: '🔮', ASC: '⬆️', MC: '👑'
};

type PlanetData = {
  id: string;
  lon: number;
  speed?: number;
  sign?: string;
  house?: number;
};

interface AspectData {
  p1: string;
  p2: string;
  type: string;
  angle: number;
  orb?: number;
}

type NatalWheelProps = {
  data: {
    planets: Array<{ id: string; lon: number; speed?: number }>;
    houses?: Array<{ index: number; lon: number }>;
    aspects?: Array<AspectData>;
  };
  size?: number;
  onPlanetClick?: (planet: PlanetData) => void;
};

export default function CartoonNatalWheel({ data, size = 320, onPlanetClick }: NatalWheelProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastAngleRef = useRef(0);

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.45;
  const innerRadius = outerRadius * 0.6;
  const planetRadius = innerRadius - 30;

  // Функция для получения знака зодиака по градусам
  const getZodiacSign = (lon: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const index = Math.floor(lon / 30);
    return signs[index];
  };

  // Функция для получения дома по градусам
  const getHouse = (lon: number, houses?: Array<{ index: number; lon: number }>): number => {
    if (!houses || houses.length === 0) return 1;
    
    for (let i = 0; i < houses.length; i++) {
      const nextIndex = (i + 1) % houses.length;
      const start = houses[i].lon;
      const end = houses[nextIndex].lon;
      
      if (start <= end) {
        if (lon >= start && lon < end) return i + 1;
      } else {
        if (lon >= start || lon < end) return i + 1;
      }
    }
    return 1;
  };

  // Обработка перетаскивания для вращения
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    setIsDragging(true);
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    lastAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    const deltaAngle = currentAngle - lastAngleRef.current;
    
    setRotation(prev => prev + deltaAngle);
    lastAngleRef.current = currentAngle;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Обработка клика по планете
  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(planet.id);
    onPlanetClick?.(planet);
  };

  // Показ подсказки
  const showTooltip = (e: React.MouseEvent, text: string) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 30,
        text
      });
    }
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  // Функция для позиционирования по углу
  const polarToCartesian = (r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  return (
    <div className="cartoon-wheel-container" style={{ width: size, height: size, position: 'relative' }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        <defs>
          {/* Градиенты для мультяшного стиля */}
          <radialGradient id="wheelGradient">
            <stop offset="0%" stopColor={CARTOON_COLORS.pastelPurple} />
            <stop offset="100%" stopColor={CARTOON_COLORS.pastelBlue} />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="cartoonShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Фоновый круг с градиентом */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="url(#wheelGradient)"
          opacity="0.3"
        />

        {/* Внешний круг зодиака */}
        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          {/* Знаки зодиака */}
          {Array.from({ length: 12 }, (_, i) => {
            const startAngle = i * 30;
            const endAngle = (i + 1) * 30;
            const midAngle = startAngle + 15;
            const signName = Object.keys(ZODIAC_EMOJIS)[i];
            const emoji = Object.values(ZODIAC_EMOJIS)[i];
            
            const start = polarToCartesian(outerRadius, startAngle);
            const end = polarToCartesian(outerRadius, endAngle);
            const innerStart = polarToCartesian(innerRadius, startAngle);
            const innerEnd = polarToCartesian(innerRadius, endAngle);
            
            const pathData = [
              `M ${start.x} ${start.y}`,
              `A ${outerRadius} ${outerRadius} 0 0 1 ${end.x} ${end.y}`,
              `L ${innerEnd.x} ${innerEnd.y}`,
              `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
              'Z'
            ].join(' ');

            const textPos = polarToCartesian((outerRadius + innerRadius) / 2, midAngle);

            return (
              <g key={i}>
                <path
                  d={pathData}
                  fill={i % 2 === 0 ? CARTOON_COLORS.pastelPink : CARTOON_COLORS.pastelLemon}
                  stroke={CARTOON_COLORS.accent}
                  strokeWidth="2"
                  opacity="0.6"
                  className="zodiac-segment"
                  onMouseEnter={(e) => showTooltip(e, signName)}
                  onMouseLeave={hideTooltip}
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  className="zodiac-emoji"
                  style={{ pointerEvents: 'none' }}
                >
                  {emoji}
                </text>
              </g>
            );
          })}

          {/* Планеты */}
          {data.planets.map((planet) => {
            const pos = polarToCartesian(planetRadius, planet.lon);
            const isSelected = selectedPlanet === planet.id;
            const emoji = PLANET_EMOJIS[planet.id] || '⭐';
            const sign = getZodiacSign(planet.lon);
            const house = getHouse(planet.lon, data.houses);
            
            const planetData: PlanetData = {
              ...planet,
              sign,
              house
            };

            return (
              <g key={planet.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 25 : 20}
                  fill={isSelected ? CARTOON_COLORS.accent : CARTOON_COLORS.pastelPurple}
                  filter="url(#cartoonShadow)"
                  className="planet-circle"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                  }}
                  onClick={() => handlePlanetClick(planetData)}
                  onMouseEnter={(e) => showTooltip(e, `${planet.id} в ${sign}`)}
                  onMouseLeave={hideTooltip}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isSelected ? "18" : "16"}
                  style={{ pointerEvents: 'none' }}
                >
                  {emoji}
                </text>
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="30"
                    fill="none"
                    stroke={CARTOON_COLORS.accent}
                    strokeWidth="2"
                    opacity="0.5"
                    filter="url(#glow)"
                    className="selection-ring"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Центральный декоративный элемент */}
        <circle
          cx={cx}
          cy={cy}
          r="30"
          fill={CARTOON_COLORS.pastelPurple}
          opacity="0.3"
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
        >
          ✨
        </text>
      </svg>

      {/* Подсказка */}
      {tooltip && (
        <div
          className="cartoon-tooltip"
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: 'white',
            padding: '8px 12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontFamily: 'Comic Neue, sans-serif',
            color: CARTOON_COLORS.text,
            pointerEvents: 'none',
            zIndex: 10,
            border: `2px solid ${CARTOON_COLORS.accent}`,
            whiteSpace: 'nowrap'
          }}
        >
          {tooltip.text}
        </div>
      )}

      <style jsx>{`
        .cartoon-wheel-container {
          position: relative;
          user-select: none;
        }

        .zodiac-segment {
          transition: all 0.3s ease;
        }

        .zodiac-segment:hover {
          opacity: 0.8 !important;
          filter: brightness(1.1);
        }

        .planet-circle:hover {
          transform: scale(1.2);
        }

        .zodiac-emoji {
          user-select: none;
          pointer-events: none;
        }

        .selection-ring {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}