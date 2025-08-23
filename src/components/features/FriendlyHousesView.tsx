'use client';

import React, { useState } from 'react';
import { FRIENDLY_HOUSES, getFriendlyHouse, getHouseImportance } from '@/lib/astro/friendly-houses';
import '@/styles/boinkers.css';

interface HouseData {
  number: number;
  sign: string;
  planets: string[];
  degree: number;
}

interface FriendlyHousesViewProps {
  houses: HouseData[];
  activeHouse?: number;
  onHouseClick?: (houseNumber: number) => void;
}

export function FriendlyHousesView({ 
  houses, 
  activeHouse,
  onHouseClick 
}: FriendlyHousesViewProps) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(activeHouse || null);

  const handleHouseClick = (houseNumber: number) => {
    setSelectedHouse(houseNumber);
    onHouseClick?.(houseNumber);
  };

  return (
    <div className="friendly-houses-container">
      {/* Заголовок */}
      <div className="boinkers-card mb-6">
        <h2 className="boinkers-title text-center">
          🏠 Твои Дома Судьбы
        </h2>
        <p className="boinkers-text text-center mt-2">
          12 сфер твоей жизни - узнай, где твоя сила!
        </p>
      </div>

      {/* Сетка домов */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {FRIENDLY_HOUSES.map((friendlyHouse) => {
          const houseData = houses.find(h => h.number === friendlyHouse.number);
          const importance = getHouseImportance(houseData?.planets?.length || 0);
          const isSelected = selectedHouse === friendlyHouse.number;

          return (
            <div
              key={friendlyHouse.number}
              onClick={() => handleHouseClick(friendlyHouse.number)}
              className={`
                boinkers-card cursor-pointer transition-all
                ${isSelected ? 'ring-4 ring-purple-400 scale-105' : ''}
                ${importance.level === 'super' ? 'animate-pulse' : ''}
              `}
              style={{
                '--house-number': friendlyHouse.number,
              } as React.CSSProperties}
            >
              {/* Эмодзи дома */}
              <div className="text-center mb-2">
                <span className="house-emoji text-4xl">
                  {friendlyHouse.emoji}
                </span>
              </div>

              {/* Название дома */}
              <h3 className="boinkers-subtitle text-center text-sm">
                {friendlyHouse.number}. {friendlyHouse.title}
              </h3>

              {/* Знак зодиака */}
              {houseData && (
                <div className="text-center mt-2">
                  <span className="text-2xl">{getZodiacEmoji(houseData.sign)}</span>
                  <p className="text-xs text-gray-600 mt-1">{houseData.sign}</p>
                </div>
              )}

              {/* Планеты */}
              {houseData?.planets && houseData.planets.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {houseData.planets.map((planet, idx) => (
                      <span key={idx} className="text-lg" title={planet}>
                        {getPlanetEmoji(planet)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-center mt-1 font-bold text-purple-600">
                    {importance.description}
                  </p>
                </div>
              )}

              {/* Краткое описание */}
              <p className="text-xs text-center text-gray-500 mt-2">
                {friendlyHouse.shortDescription}
              </p>
            </div>
          );
        })}
      </div>

      {/* Детальная информация о выбранном доме */}
      {selectedHouse && (
        <div className="boinkers-card animate-slideInBounce">
          {(() => {
            const house = getFriendlyHouse(selectedHouse);
            const houseData = houses.find(h => h.number === selectedHouse);
            
            if (!house) return null;

            return (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{house.emoji}</span>
                  <div>
                    <h3 className="boinkers-title text-2xl">
                      {house.title}
                    </h3>
                    <p className="text-gray-600">{house.shortDescription}</p>
                  </div>
                </div>

                {/* Сферы жизни */}
                <div className="mb-4">
                  <h4 className="boinkers-subtitle mb-2">
                    📍 Сферы жизни:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {house.lifeAreas.map((area, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500">✓</span>
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Вопросы */}
                <div className="mb-4">
                  <h4 className="boinkers-subtitle mb-2">
                    ❓ Ключевые вопросы:
                  </h4>
                  <div className="space-y-2">
                    {house.questions.map((question, idx) => (
                      <div key={idx} className="daily-tip p-3">
                        <p className="text-sm font-medium">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Планеты в доме */}
                {houseData?.planets && houseData.planets.length > 0 && (
                  <div className="mb-4">
                    <h4 className="boinkers-subtitle mb-2">
                      🌟 Твои планеты здесь:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {houseData.planets.map((planet, idx) => (
                        <div key={idx} className="planet-bubble">
                          <span className="text-xl">{getPlanetEmoji(planet)}</span>
                          <span>{planet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Персональный совет */}
                <div className="boinkers-notification">
                  <span className="text-2xl">💡</span>
                  <p>{house.advice}</p>
                </div>

                {/* Ключевые слова */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {house.keywords.map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Вспомогательные функции для эмодзи
function getZodiacEmoji(sign: string): string {
  const zodiacEmojis: Record<string, string> = {
    'Овен': '♈',
    'Телец': '♉',
    'Близнецы': '♊',
    'Рак': '♋',
    'Лев': '♌',
    'Дева': '♍',
    'Весы': '♎',
    'Скорпион': '♏',
    'Стрелец': '♐',
    'Козерог': '♑',
    'Водолей': '♒',
    'Рыбы': '♓',
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓'
  };
  return zodiacEmojis[sign] || '⭐';
}

function getPlanetEmoji(planet: string): string {
  const planetEmojis: Record<string, string> = {
    'Солнце': '☀️',
    'Луна': '🌙',
    'Меркурий': '💫',
    'Венера': '💕',
    'Марс': '🔥',
    'Юпитер': '🍀',
    'Сатурн': '⏰',
    'Уран': '⚡',
    'Нептун': '🌊',
    'Плутон': '🔮',
    'Sun': '☀️',
    'Moon': '🌙',
    'Mercury': '💫',
    'Venus': '💕',
    'Mars': '🔥',
    'Jupiter': '🍀',
    'Saturn': '⏰',
    'Uranus': '⚡',
    'Neptune': '🌊',
    'Pluto': '🔮'
  };
  return planetEmojis[planet] || '🌟';
}