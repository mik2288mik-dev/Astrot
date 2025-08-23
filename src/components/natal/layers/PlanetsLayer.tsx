'use client';

import React from 'react';
import type { ChartData, PlanetPos } from '@/lib/astro/types';
import type { SelectEntity } from '../NatalWheel';
import { PLANET_SYMBOLS } from '@/lib/astro/types';

interface PlanetsLayerProps {
  center: number;
  radius: number;
  chartData: ChartData;
  onSelect: (entity: SelectEntity) => void;
  selectedPlanet: string | null;
}

const PLANET_COLORS = {
  'Sun': '#fbbf24',
  'Moon': '#e5e7eb',
  'Mercury': '#60a5fa',
  'Venus': '#f87171',
  'Mars': '#ef4444',
  'Jupiter': '#8b5cf6',
  'Saturn': '#6b7280',
  'Uranus': '#06b6d4',
  'Neptune': '#3b82f6',
  'Pluto': '#7c3aed'
};

const PLANET_SIZES = {
  'Sun': 8,
  'Moon': 7,
  'Mercury': 5,
  'Venus': 6,
  'Mars': 6,
  'Jupiter': 7,
  'Saturn': 7,
  'Uranus': 5,
  'Neptune': 5,
  'Pluto': 4
};

export function PlanetsLayer({ 
  center, 
  radius, 
  chartData, 
  onSelect, 
  selectedPlanet 
}: PlanetsLayerProps) {
  
  if (!chartData.planets.length) {
    return null;
  }

  // Группируем планеты по близким позициям для предотвращения перекрытия
  const groupedPlanets = groupCloseplanets(chartData.planets, 15); // 15° минимальное расстояние
  
  const handlePlanetClick = (planet: PlanetPos, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect({
      kind: 'planet',
      id: planet.name,
      lon: planet.lon
    });
  };

  return (
    <g className="planets-layer">
      {groupedPlanets.map((planetGroup, groupIndex) => {
        const isGroup = planetGroup.planets.length > 1;
        const baseAngle = planetGroup.averageAngle;
        
        return (
          <g key={groupIndex}>
            {planetGroup.planets.map((planet, planetIndex) => {
              // Если планеты в группе, разводим их по дуге
              let adjustedAngle = baseAngle;
              if (isGroup) {
                const spread = Math.min(planetGroup.planets.length * 8, 30); // максимум 30° разброс
                const step = spread / (planetGroup.planets.length - 1 || 1);
                adjustedAngle = baseAngle - spread/2 + step * planetIndex;
              }
              
              // Преобразуем астрологический угол в SVG координаты
              const angleRad = ((adjustedAngle - 90) * Math.PI) / 180;
              
              // Позиция планеты
              const planetX = center + Math.cos(angleRad) * radius;
              const planetY = center + Math.sin(angleRad) * radius;
              
              // Позиция текста (чуть дальше от центра)
              const textRadius = radius + 20;
              const textX = center + Math.cos(angleRad) * textRadius;
              const textY = center + Math.sin(angleRad) * textRadius;
              
              // Линия от планеты к краю
              const lineEndRadius = radius + 15;
              const lineEndX = center + Math.cos(angleRad) * lineEndRadius;
              const lineEndY = center + Math.sin(angleRad) * lineEndRadius;
              
              const planetColor = PLANET_COLORS[planet.name as keyof typeof PLANET_COLORS] || '#64748b';
              const planetSize = PLANET_SIZES[planet.name as keyof typeof PLANET_SIZES] || 5;
              const isSelected = selectedPlanet === planet.name;
              
              return (
                <g key={planet.name}>
                  {/* Линия к планете */}
                  <line
                    x1={planetX}
                    y1={planetY}
                    x2={lineEndX}
                    y2={lineEndY}
                    stroke={planetColor}
                    strokeWidth={isSelected ? "2" : "1"}
                    opacity={isSelected ? "1" : "0.6"}
                    className="transition-all duration-200"
                  />
                  
                  {/* Планета */}
                  <circle
                    cx={planetX}
                    cy={planetY}
                    r={planetSize}
                    fill={planetColor}
                    stroke="white"
                    strokeWidth="2"
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'drop-shadow-lg scale-110' 
                        : 'hover:scale-110 hover:drop-shadow-md'
                    }`}
                    onClick={(e) => handlePlanetClick(planet, e)}
                    style={{
                      filter: isSelected ? 'brightness(1.2)' : undefined
                    }}
                  />
                  
                  {/* Символ планеты */}
                  <text
                    x={planetX}
                    y={planetY + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`fill-white text-xs font-bold cursor-pointer ${
                      isSelected ? 'drop-shadow-sm' : ''
                    }`}
                    onClick={(e) => handlePlanetClick(planet, e)}
                    style={{ pointerEvents: 'none' }}
                  >
                    {PLANET_SYMBOLS[planet.name as keyof typeof PLANET_SYMBOLS] || planet.name[0]}
                  </text>
                  
                  {/* Ретроградный индикатор */}
                  {planet.isRetrograde && (
                    <text
                      x={planetX + planetSize + 3}
                      y={planetY - planetSize - 3}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-red-500 text-xs font-bold"
                    >
                      R
                    </text>
                  )}
                  
                  {/* Информация о планете */}
                  <g
                    className={`transition-opacity duration-200 ${
                      isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                    }`}
                  >
                    {/* Фон для текста */}
                    <rect
                      x={textX - 25}
                      y={textY - 8}
                      width="50"
                      height="16"
                      fill="white"
                      stroke={planetColor}
                      strokeWidth="1"
                      rx="8"
                      opacity="0.9"
                    />
                    
                    {/* Название и знак */}
                    <text
                      x={textX}
                      y={textY + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-700 text-xs font-medium"
                    >
                      {planet.name} {planet.sign.slice(0, 3)}
                    </text>
                  </g>
                  
                  {/* Градус планеты (при выборе) */}
                  {isSelected && (
                    <text
                      x={textX}
                      y={textY + 20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-600 text-xs"
                    >
                      {Math.floor(planet.signDegree)}°{Math.floor((planet.signDegree % 1) * 60)}&#39;
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// Вспомогательная функция для группировки близких планет
function groupCloseplanets(planets: PlanetPos[], minDistance: number) {
  const groups: { planets: PlanetPos[]; averageAngle: number }[] = [];
  const processed = new Set<string>();
  
  for (const planet of planets) {
    if (processed.has(planet.name)) continue;
    
    const group = [planet];
    processed.add(planet.name);
    
    // Ищем близкие планеты
    for (const otherPlanet of planets) {
      if (processed.has(otherPlanet.name)) continue;
      
      const distance = Math.abs(planet.lon - otherPlanet.lon);
      const wrappedDistance = Math.min(distance, 360 - distance);
      
      if (wrappedDistance <= minDistance) {
        group.push(otherPlanet);
        processed.add(otherPlanet.name);
      }
    }
    
    // Вычисляем средний угол группы
    const averageAngle = group.reduce((sum, p) => sum + p.lon, 0) / group.length;
    
    groups.push({ planets: group, averageAngle });
  }
  
  return groups;
}