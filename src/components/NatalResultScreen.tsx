import React, { useState, useEffect } from 'react';
import { NatalResult } from '../services/ApiService';

interface NatalResultScreenProps {
  result: NatalResult;
  onBack: () => void;
}

const NatalResultScreen: React.FC<NatalResultScreenProps> = ({ result, onBack }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'interpretation'>('chart');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Простая SVG натальная карта
  const NatalChart: React.FC = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    
    return (
      <div className="relative">
        <svg width="300" height="300" className="mx-auto">
          {/* Основной круг */}
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill="none" 
            stroke="white" 
            strokeWidth="2"
            opacity="0.8"
          />
          
          {/* Внутренний круг */}
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius * 0.6} 
            fill="none" 
            stroke="white" 
            strokeWidth="1"
            opacity="0.5"
          />
          
          {/* Линии домов (12 секторов) */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = centerX + (radius * 0.6) * Math.cos(angle);
            const y1 = centerY + (radius * 0.6) * Math.sin(angle);
            const x2 = centerX + radius * Math.cos(angle);
            const y2 = centerY + radius * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })}
          
          {/* Планеты */}
          {result.planets.map((planet, index) => {
            const angle = (index * 30) * Math.PI / 180; // Упрощенное размещение
            const planetRadius = radius * 0.8;
            const x = centerX + planetRadius * Math.cos(angle);
            const y = centerY + planetRadius * Math.sin(angle);
            
            return (
              <g key={planet.name}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={getPlanetColor(planet.name)}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer hover:r-10 transition-all duration-200"
                  onClick={() => setSelectedPlanet(planet.name)}
                />
                <text
                  x={x}
                  y={y + 25}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  className="pointer-events-none"
                >
                  {getPlanetSymbol(planet.name)}
                </text>
              </g>
            );
          })}
          
          {/* Номера домов */}
          {result.houses.map((house) => {
            const angle = ((house.number - 1) * 30 + 15) * Math.PI / 180;
            const houseRadius = radius * 0.3;
            const x = centerX + houseRadius * Math.cos(angle);
            const y = centerY + houseRadius * Math.sin(angle);
            
            return (
              <text
                key={house.number}
                x={x}
                y={y}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                opacity="0.7"
              >
                {house.number}
              </text>
            );
          })}
          
          {/* Центральный символ */}
          <circle
            cx={centerX}
            cy={centerY}
            r="15"
            fill="url(#centerGradient)"
            stroke="white"
            strokeWidth="2"
          />
          
          <defs>
            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Информация о выбранной планете */}
        {selectedPlanet && (
          <div className="mt-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            {(() => {
              const planet = result.planets.find(p => p.name === selectedPlanet);
              return planet ? (
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    {planet.name} {getPlanetSymbol(planet.name)}
                  </h4>
                  <p className="text-blue-200 text-sm">
                    <strong>Знак:</strong> {planet.sign}<br/>
                    <strong>Градус:</strong> {planet.degree.toFixed(1)}°<br/>
                    <strong>Дом:</strong> {planet.house}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    );
  };

  const getPlanetColor = (planetName: string): string => {
    const colors: {[key: string]: string} = {
      'Солнце': '#fbbf24',
      'Луна': '#e5e7eb',
      'Меркурий': '#06b6d4',
      'Венера': '#ec4899',
      'Марс': '#ef4444',
      'Юпитер': '#8b5cf6',
      'Сатурн': '#6b7280',
      'Уран': '#10b981',
      'Нептун': '#3b82f6',
      'Плутон': '#7c2d12'
    };
    return colors[planetName] || '#9ca3af';
  };

  const getPlanetSymbol = (planetName: string): string => {
    const symbols: {[key: string]: string} = {
      'Солнце': '☉',
      'Луна': '☽',
      'Меркурий': '☿',
      'Венера': '♀',
      'Марс': '♂',
      'Юпитер': '♃',
      'Сатурн': '♄',
      'Уран': '♅',
      'Нептун': '♆',
      'Плутон': '♇'
    };
    return symbols[planetName] || '●';
  };

  const TabButton: React.FC<{
    id: 'chart' | 'interpretation';
    label: string;
    icon: string;
  }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        activeTab === id
          ? 'bg-white bg-opacity-20 text-white'
          : 'bg-white bg-opacity-5 text-blue-200 hover:bg-opacity-10'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/bg-main.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Основной контент */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Заголовок */}
        <div className="text-center p-6 pb-4">
          <h1 className="text-white text-2xl font-bold mb-2">
            🌟 Натальная карта
          </h1>
          <p className="text-blue-200 text-sm">
            {result.name} • {result.birthData.date} • {result.birthData.time}
          </p>
          <p className="text-blue-300 text-xs opacity-80">
            {result.birthData.city}
          </p>
        </div>

        {/* Вкладки */}
        <div className="px-6 mb-4">
          <div className="flex gap-2 bg-black bg-opacity-30 rounded-lg p-1">
            <TabButton id="chart" label="Карта" icon="🌌" />
            <TabButton id="interpretation" label="Толкование" icon="📖" />
          </div>
        </div>

        {/* Контент вкладок */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {activeTab === 'chart' ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <NatalChart />
              
              {/* Список планет */}
              <div className="mt-6">
                <h3 className="text-white font-bold mb-4">Планеты в знаках:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {result.planets.map((planet) => (
                    <div
                      key={planet.name}
                      className="bg-white bg-opacity-10 rounded-lg p-3 cursor-pointer hover:bg-opacity-20 transition-all duration-200"
                      onClick={() => setSelectedPlanet(planet.name)}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: getPlanetColor(planet.name) }}>
                          {getPlanetSymbol(planet.name)}
                        </span>
                        <div className="text-xs">
                          <div className="text-white font-medium">{planet.name}</div>
                          <div className="text-blue-200">{planet.sign}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Общее описание */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">📝 Общая характеристика</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {result.interpretation.summary}
                </p>
              </div>

              {/* Личность */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">👤 Личность</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {result.interpretation.personality}
                </p>
              </div>

              {/* Отношения */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">💕 Отношения</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {result.interpretation.relationships}
                </p>
              </div>

              {/* Карьера */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">💼 Карьера</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {result.interpretation.career}
                </p>
              </div>

              {/* Здоровье */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">🌿 Здоровье</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {result.interpretation.health}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка назад */}
        <div className="p-6 pt-0">
          <button
            onClick={onBack}
            className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium transition-all duration-200 hover:from-gray-700 hover:to-gray-800 active:scale-95"
          >
            ← Назад в меню
          </button>
        </div>
      </div>
    </div>
  );
};

export default NatalResultScreen;
