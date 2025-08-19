'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ChartData } from '../../../lib/astro/types';
import { ZodiacLayer } from './layers/ZodiacLayer';
import { HousesLayer } from './layers/HousesLayer';
import { PlanetsLayer } from './layers/PlanetsLayer';
import { AspectsLayer } from './layers/AspectsLayer';

interface NatalWheelProps {
  chartData: ChartData | null;
  onSelect?: (entity: SelectedEntity) => void;
  className?: string;
}

export type SelectedEntity = {
  type: 'planet' | 'house' | 'aspect';
  data: any;
  name: string;
  position?: { x: number; y: number };
};

export default function NatalWheel({ chartData, onSelect, className = '' }: NatalWheelProps) {
  const [scale, setScale] = useState(1);
  const [showAspects, setShowAspects] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Размеры колеса
  const wheelSize = 320;
  const center = wheelSize / 2;

  // Обработка выбора сущности
  const handleEntitySelect = useCallback((entity: SelectedEntity) => {
    setSelectedEntity(entity);
    onSelect?.(entity);
  }, [onSelect]);

  // Обработка масштабирования (pinch)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(0.5, Math.min(2, scale + delta));
    setScale(newScale);
  }, [scale]);

  // Toggle аспектов
  const toggleAspects = useCallback(() => {
    setShowAspects(prev => !prev);
  }, []);

  if (!chartData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-80 h-80 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
          <p className="text-gray-500">Загрузите данные рождения</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Контролы */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={toggleAspects}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            showAspects 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          Аспекты
        </button>
        <div className="text-xs text-gray-500 text-center">
          {(scale * 100).toFixed(0)}%
        </div>
      </div>

      {/* Основное колесо */}
      <motion.div
        className="relative"
        style={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <svg
          ref={wheelRef}
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          className="drop-shadow-lg"
          onWheel={handleWheel}
          style={{ touchAction: 'none' }}
        >
          {/* Градиентные определения */}
          <defs>
            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.95" />
            </radialGradient>
            <filter id="softShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
            </filter>
          </defs>

          {/* Фон колеса */}
          <circle
            cx={center}
            cy={center}
            r={center - 10}
            fill="url(#wheelGradient)"
            stroke="#e2e8f0"
            strokeWidth="2"
            filter="url(#softShadow)"
          />

          {/* Слой зодиака (внешний) */}
          <ZodiacLayer
            center={center}
            radius={center - 20}
            chartData={chartData}
            onSelect={handleEntitySelect}
            isSelected={selectedEntity?.type === 'house'}
          />

          {/* Слой домов */}
          <HousesLayer
            center={center}
            innerRadius={center - 80}
            outerRadius={center - 20}
            chartData={chartData}
            onSelect={handleEntitySelect}
            isSelected={selectedEntity?.type === 'house'}
          />

          {/* Слой аспектов (если включён) */}
          {showAspects && (
            <AspectsLayer
              center={center}
              radius={center - 100}
              chartData={chartData}
              onSelect={handleEntitySelect}
              isSelected={selectedEntity?.type === 'aspect'}
            />
          )}

          {/* Слой планет (внутренний) */}
          <PlanetsLayer
            center={center}
            radius={center - 90}
            chartData={chartData}
            onSelect={handleEntitySelect}
            selectedPlanet={selectedEntity?.type === 'planet' ? selectedEntity.name : null}
          />

          {/* Центральный круг */}
          <circle
            cx={center}
            cy={center}
            r="30"
            fill="#fefefe"
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Центральная информация */}
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            className="fill-gray-600 text-xs font-medium"
          >
            {chartData.sunSign}
          </text>
          <text
            x={center}
            y={center + 8}
            textAnchor="middle"
            className="fill-gray-400 text-xs"
          >
            {chartData.risingSign} ASC
          </text>
        </svg>
      </motion.div>

      {/* Информационная панель */}
      {selectedEntity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">{selectedEntity.name}</h4>
              <p className="text-sm text-gray-600 capitalize">{selectedEntity.type}</p>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}