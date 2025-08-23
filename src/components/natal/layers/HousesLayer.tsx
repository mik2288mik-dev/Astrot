'use client';

import React from 'react';
import type { ChartData } from '../../../../lib/astro/types';
import type { SelectEntity } from '../NatalWheel';

interface HousesLayerProps {
  center: number;
  innerRadius: number;
  outerRadius: number;
  chartData: ChartData;
  onSelect: (entity: SelectEntity) => void;
  isSelected: boolean;
}

const HOUSE_MEANINGS = [
  'Я, личность', 'Деньги, ресурсы', 'Общение, обучение', 'Дом, семья',
  'Творчество, дети', 'Здоровье, работа', 'Партнерство', 'Трансформация',
  'Философия, путешествия', 'Карьера, статус', 'Друзья, цели', 'Подсознание, духовность'
];

export function HousesLayer({ 
  center, 
  innerRadius, 
  outerRadius, 
  chartData, 
  onSelect, 
  isSelected 
}: HousesLayerProps) {
  
  if (!chartData.houses.cusps.length) {
    return null;
  }

  // Рассчитываем углы домов на основе куспидов
  const houseAngles = chartData.houses.cusps.map((cusp, index) => {
    const nextCusp = chartData.houses.cusps[(index + 1) % 12];
    
    // Преобразуем астрологические градусы в SVG углы
    const startAngle = cusp.degree - 90; // -90 чтобы 0° был сверху
    let endAngle = (nextCusp?.degree || cusp.degree + 30) - 90;
    
    // Обрабатываем переход через 0°
    if (endAngle < startAngle) {
      endAngle += 360;
    }
    
    const midAngle = (startAngle + endAngle) / 2;
    
    return {
      houseNumber: cusp.number,
      startAngle,
      endAngle,
      midAngle,
      cusp,
      meaning: HOUSE_MEANINGS[index] || `Дом ${cusp.number}`
    };
  });

  const handleHouseClick = (houseData: { houseNumber: number; lon?: number }, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect({
      kind: 'house',
      id: `${houseData.houseNumber}`,
      lon: houseData.lon || 0
    });
  };

  return (
    <g className="houses-layer">
      {houseAngles.map(({ houseNumber, startAngle, endAngle, midAngle, cusp, meaning }) => {
        // Преобразуем в радианы
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const midRad = (midAngle * Math.PI) / 180;
        
        // Координаты для линий куспидов
        const startX1 = center + Math.cos(startRad) * innerRadius;
        const startY1 = center + Math.sin(startRad) * innerRadius;
        const startX2 = center + Math.cos(startRad) * outerRadius;
        const startY2 = center + Math.sin(startRad) * outerRadius;
        
        // Позиция номера дома
        const numberRadius = (innerRadius + outerRadius) / 2;
        const numberX = center + Math.cos(midRad) * numberRadius;
        const numberY = center + Math.sin(midRad) * numberRadius;
        
        // Позиция текста значения дома (ближе к центру)
        const meaningRadius = innerRadius + 15;
        const meaningX = center + Math.cos(midRad) * meaningRadius;
        const meaningY = center + Math.sin(midRad) * meaningRadius;
        
        // Путь для сектора дома
        const outerX1 = center + Math.cos(startRad) * outerRadius;
        const outerY1 = center + Math.sin(startRad) * outerRadius;
        const outerX2 = center + Math.cos(endRad) * outerRadius;
        const outerY2 = center + Math.sin(endRad) * outerRadius;
        
        const innerX1 = center + Math.cos(startRad) * innerRadius;
        const innerY1 = center + Math.sin(startRad) * innerRadius;
        const innerX2 = center + Math.cos(endRad) * innerRadius;
        const innerY2 = center + Math.sin(endRad) * innerRadius;
        
        // Определяем большую дугу
        const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
        
        const sectorPath = [
          `M ${outerX1} ${outerY1}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}`,
          `L ${innerX2} ${innerY2}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
          'Z'
        ].join(' ');
        
        // Цвет дома (чередующиеся оттенки)
        const houseColor = houseNumber % 2 === 1 ? '#f1f5f9' : '#f8fafc';
        const strokeColor = houseNumber % 3 === 1 ? '#8b5cf6' : '#64748b';
        
        return (
          <g key={houseNumber}>
            {/* Сектор дома */}
            <path
              d={sectorPath}
              fill={houseColor}
              stroke="transparent"
              className="cursor-pointer hover:fill-purple-50 transition-all duration-200"
              onClick={(e) => handleHouseClick({ houseNumber, cusp, meaning }, e)}
            />
            
            {/* Линия куспида */}
            <line
              x1={startX1}
              y1={startY1}
              x2={startX2}
              y2={startY2}
              stroke={strokeColor}
              strokeWidth={houseNumber === 1 || houseNumber === 7 || houseNumber === 4 || houseNumber === 10 ? "2" : "1"}
              className="cursor-pointer"
              onClick={(e) => handleHouseClick({ houseNumber, cusp, meaning }, e)}
            />
            
            {/* Номер дома */}
            <circle
              cx={numberX}
              cy={numberY}
              r="12"
              fill="white"
              stroke={strokeColor}
              strokeWidth="1"
              className="cursor-pointer hover:fill-purple-50 transition-colors"
              onClick={(e) => handleHouseClick({ houseNumber, cusp, meaning }, e)}
            />
            
            <text
              x={numberX}
              y={numberY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-700 text-sm font-semibold cursor-pointer"
              onClick={(e) => handleHouseClick({ houseNumber, cusp, meaning }, e)}
            >
              {houseNumber}
            </text>
            
            {/* Краткое значение дома */}
            <text
              x={meaningX}
              y={meaningY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-500 text-xs cursor-pointer hover:fill-gray-700 transition-colors"
              style={{
                fontSize: '10px',
                transform: `rotate(${midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle}deg)`,
                transformOrigin: `${meaningX}px ${meaningY}px`
              }}
              onClick={(e) => handleHouseClick({ houseNumber, cusp, meaning }, e)}
            >
              {meaning.split(',')[0]}
            </text>
          </g>
        );
      })}
      
      {/* Особые линии (ASC/DESC, MC/IC) */}
      {/* ASC-DESC линия */}
      <line
        x1={center + outerRadius}
        y1={center}
        x2={center - outerRadius}
        y2={center}
        stroke="#8b5cf6"
        strokeWidth="3"
        strokeDasharray="5,5"
        opacity="0.7"
      />
      
      {/* MC-IC линия */}
      <line
        x1={center}
        y1={center - outerRadius}
        x2={center}
        y2={center + outerRadius}
        stroke="#8b5cf6"
        strokeWidth="3"
        strokeDasharray="5,5"
        opacity="0.7"
      />
      
      {/* ASC маркер */}
      <circle
        cx={center + outerRadius}
        cy={center}
        r="6"
        fill="#8b5cf6"
      />
      <text
        x={center + outerRadius + 15}
        y={center + 2}
        textAnchor="start"
        dominantBaseline="middle"
        className="fill-purple-600 text-xs font-semibold"
      >
        ASC
      </text>
      
      {/* MC маркер */}
      <circle
        cx={center}
        cy={center - outerRadius}
        r="6"
        fill="#8b5cf6"
      />
      <text
        x={center}
        y={center - outerRadius - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-purple-600 text-xs font-semibold"
      >
        MC
      </text>
    </g>
  );
}