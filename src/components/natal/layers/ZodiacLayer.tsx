'use client';

import React from 'react';
import type { ChartData } from '../../../../lib/astro/types';
import type { SelectedEntity } from '../NatalWheel';
import { SIGN_SYMBOLS } from '../../../../lib/astro/types';

interface ZodiacLayerProps {
  center: number;
  radius: number;
  chartData: ChartData;
  onSelect: (entity: SelectedEntity) => void;
  isSelected: boolean;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_COLORS = {
  'Aries': '#ff6b6b',
  'Taurus': '#4ecdc4', 
  'Gemini': '#45b7d1',
  'Cancer': '#96ceb4',
  'Leo': '#feca57',
  'Virgo': '#48dbfb',
  'Scorpio': '#ff9ff3',
  'Libra': '#ff6b6b',
  'Sagittarius': '#54a0ff',
  'Capricorn': '#5f27cd',
  'Aquarius': '#00d2d3',
  'Pisces': '#ff9ff3'
};

export function ZodiacLayer({ center, radius, chartData, onSelect, isSelected }: ZodiacLayerProps) {
  const innerRadius = radius - 40;
  
  // Рассчитываем позицию каждого знака (30 градусов каждый)
  const signSections = ZODIAC_SIGNS.map((sign, index) => {
    const startAngle = index * 30;
    const endAngle = (index + 1) * 30;
    const midAngle = startAngle + 15;
    
    // Преобразуем в радианы (астрологический 0° = верх, по часовой стрелке)
    const midAngleRad = ((midAngle - 90) * Math.PI) / 180;
    
    // Позиция текста
    const textRadius = radius - 20;
    const textX = center + Math.cos(midAngleRad) * textRadius;
    const textY = center + Math.sin(midAngleRad) * textRadius;
    
    // Позиция символа
    const symbolRadius = radius - 10;
    const symbolX = center + Math.cos(midAngleRad) * symbolRadius;
    const symbolY = center + Math.sin(midAngleRad) * symbolRadius;
    
    // Путь для сектора
    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180;
    
    const x1 = center + Math.cos(startAngleRad) * radius;
    const y1 = center + Math.sin(startAngleRad) * radius;
    const x2 = center + Math.cos(endAngleRad) * radius;
    const y2 = center + Math.sin(endAngleRad) * radius;
    
    const x3 = center + Math.cos(endAngleRad) * innerRadius;
    const y3 = center + Math.sin(endAngleRad) * innerRadius;
    const x4 = center + Math.cos(startAngleRad) * innerRadius;
    const y4 = center + Math.sin(startAngleRad) * innerRadius;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 0 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
    
    return {
      sign,
      pathData,
      textX,
      textY,
      symbolX,
      symbolY,
      color: SIGN_COLORS[sign as keyof typeof SIGN_COLORS] || '#94a3b8'
    };
  });

  const handleSignClick = (sign: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect({
      type: 'house',
      data: { sign },
      name: sign,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  return (
    <g className="zodiac-layer">
      {signSections.map(({ sign, pathData, textX, textY, symbolX, symbolY, color }) => (
        <g key={sign}>
          {/* Сектор знака */}
          <path
            d={pathData}
            fill={`${color}10`}
            stroke={color}
            strokeWidth="1"
            className="cursor-pointer hover:fill-opacity-20 transition-all duration-200"
            onClick={(e) => handleSignClick(sign, e)}
          />
          
          {/* Разделительные линии */}
          <line
            x1={center + Math.cos(((ZODIAC_SIGNS.indexOf(sign) * 30 - 90) * Math.PI) / 180) * innerRadius}
            y1={center + Math.sin(((ZODIAC_SIGNS.indexOf(sign) * 30 - 90) * Math.PI) / 180) * innerRadius}
            x2={center + Math.cos(((ZODIAC_SIGNS.indexOf(sign) * 30 - 90) * Math.PI) / 180) * radius}
            y2={center + Math.sin(((ZODIAC_SIGNS.indexOf(sign) * 30 - 90) * Math.PI) / 180) * radius}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          
          {/* Символ знака */}
          <text
            x={symbolX}
            y={symbolY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-600 text-lg font-medium cursor-pointer hover:fill-gray-800 transition-colors"
            onClick={(e) => handleSignClick(sign, e)}
          >
            {SIGN_SYMBOLS[sign as keyof typeof SIGN_SYMBOLS] || sign.slice(0, 2)}
          </text>
          
          {/* Название знака (мелкий текст) */}
          <text
            x={textX}
            y={textY + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-500 text-xs cursor-pointer hover:fill-gray-700 transition-colors"
            onClick={(e) => handleSignClick(sign, e)}
          >
            {sign.slice(0, 3)}
          </text>
        </g>
      ))}
      
      {/* Внешняя граница зодиака */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      
      {/* Внутренняя граница зодиака */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
    </g>
  );
}