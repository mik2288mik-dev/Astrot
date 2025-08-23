'use client';

import React from 'react';
import type { ChartData, Aspect } from '@/lib/astro/types';
import type { SelectEntity } from '../NatalWheel';

interface AspectsLayerProps {
  center: number;
  radius: number;
  chartData: ChartData;
  onSelect: (entity: SelectEntity) => void;
  isSelected: boolean;
}

const ASPECT_COLORS = {
  'conjunction': '#8b5cf6',
  'sextile': '#10b981', 
  'square': '#ef4444',
  'trine': '#3b82f6',
  'opposition': '#f59e0b',
  'quincunx': '#6b7280'
};

const ASPECT_PATTERNS = {
  'conjunction': '0',
  'sextile': '5,5',
  'square': '3,3',
  'trine': '8,4',
  'opposition': '10,5',
  'quincunx': '2,2'
};

const ASPECT_WIDTHS = {
  'tight': 2,
  'moderate': 1.5,
  'wide': 1
};

export function AspectsLayer({ 
  center, 
  radius, 
  chartData, 
  onSelect, 
  isSelected: _isSelected
}: AspectsLayerProps) {
  
  if (!chartData.aspects.length || !chartData.planets.length) {
    return null;
  }

  // Фильтруем только значимые аспекты
  const significantAspects = chartData.aspects.filter(aspect => 
    aspect.strength === 'tight' || 
    (aspect.strength === 'moderate' && ['conjunction', 'opposition', 'square', 'trine'].includes(aspect.type))
  );

  const handleAspectClick = (aspect: Aspect, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect({
      kind: 'planet',
      id: `${aspect.planet1}-${aspect.planet2}`,
      lon: 0
    });
  };

  return (
    <g className="aspects-layer">
      {/* Фон для аспектов */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="none"
      />
      
      {significantAspects.map((aspect, index) => {
        // Находим позиции планет
        const planet1 = chartData.planets.find(p => p.name === aspect.planet1);
        const planet2 = chartData.planets.find(p => p.name === aspect.planet2);
        
        if (!planet1 || !planet2) return null;
        
        // Преобразуем позиции в координаты
        const angle1Rad = ((planet1.lon - 90) * Math.PI) / 180;
        const angle2Rad = ((planet2.lon - 90) * Math.PI) / 180;
        
        const x1 = center + Math.cos(angle1Rad) * radius;
        const y1 = center + Math.sin(angle1Rad) * radius;
        const x2 = center + Math.cos(angle2Rad) * radius;
        const y2 = center + Math.sin(angle2Rad) * radius;
        
        // Стиль линии аспекта
        const aspectColor = ASPECT_COLORS[aspect.type] || '#6b7280';
        const strokeDasharray = ASPECT_PATTERNS[aspect.type] || '0';
        const strokeWidth = ASPECT_WIDTHS[aspect.strength] || 1;
        const opacity = aspect.strength === 'tight' ? 0.8 : aspect.strength === 'moderate' ? 0.6 : 0.4;
        
        // Для соединений рисуем дугу вместо прямой линии
        const isConjunction = aspect.type === 'conjunction';
        
        return (
          <g key={`${aspect.planet1}-${aspect.planet2}-${aspect.type}-${index}`}>
            {isConjunction ? (
              // Дуга для соединения
              <path
                d={`M ${x1} ${y1} A ${radius * 0.3} ${radius * 0.3} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={aspectColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                opacity={opacity}
                className="cursor-pointer hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => handleAspectClick(aspect, e)}
              />
            ) : (
              // Прямая линия для других аспектов
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={aspectColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                opacity={opacity}
                className="cursor-pointer hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => handleAspectClick(aspect, e)}
              />
            )}
            
            {/* Точка в центре аспекта для лучшего взаимодействия */}
            <circle
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              r="4"
              fill={aspectColor}
              opacity="0"
              className="cursor-pointer hover:opacity-30 transition-opacity duration-200"
              onClick={(e) => handleAspectClick(aspect, e)}
            />
            
            {/* Индикатор силы аспекта */}
            {aspect.strength === 'tight' && (
              <circle
                cx={(x1 + x2) / 2}
                cy={(y1 + y2) / 2}
                r="2"
                fill={aspectColor}
                opacity="0.6"
                className="cursor-pointer"
                onClick={(e) => handleAspectClick(aspect, e)}
              />
            )}
          </g>
        );
      })}
      
      {/* Легенда аспектов (в углу) */}
      <g className="aspects-legend" transform={`translate(${center + radius - 80}, ${center - radius + 20})`}>
        <rect
          x="0"
          y="0"
          width="75"
          height="120"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="1"
          rx="4"
          opacity="0.9"
        />
        
        <text x="37" y="15" textAnchor="middle" className="fill-gray-700 text-xs font-semibold">
          Аспекты
        </text>
        
        {Object.entries(ASPECT_COLORS).slice(0, 5).map(([type, color], index) => (
          <g key={type} transform={`translate(10, ${25 + index * 18})`}>
            <line
              x1="0"
              y1="0"
              x2="15"
              y2="0"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={ASPECT_PATTERNS[type as keyof typeof ASPECT_PATTERNS]}
            />
            <text x="20" y="2" className="fill-gray-600 text-xs">
              {getAspectName(type)}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

// Вспомогательная функция для получения русского названия аспекта
function getAspectName(type: string): string {
  const names = {
    'conjunction': 'Соединение',
    'sextile': 'Секстиль',
    'square': 'Квадрат',
    'trine': 'Трин',
    'opposition': 'Оппозиция',
    'quincunx': 'Квинкунс'
  };
  return names[type as keyof typeof names] || type;
}