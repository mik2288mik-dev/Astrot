'use client';

import React from 'react';
import type { NatalResult } from '../../../lib/api/natal';
import type { BirthData } from '../../../lib/birth/types';
import { SUN, MOON, ASC } from '../../../lib/copy/big3';
import { notificationOccurred } from '../../../lib/haptics';
import BirthHeader from '../birth/BirthHeader';
import { saveChart, setActiveChart } from '../../../lib/birth/storage';
import { formatBirthLine } from '../../../lib/birth/format';

interface NatalResultProps {
  result: NatalResult;
  birthData: BirthData;
  onEditBirth?: () => void;
}

export default function NatalResult({ result, birthData, onEditBirth }: NatalResultProps) {
  const { big3, elements } = result;
  
  // Получаем тексты для знаков
  const sunText = SUN[big3.sun.sign] || "Твоя солнечная энергия уникальна и прекрасна.";
  const moonText = MOON[big3.moon.sign] || "Твоя лунная природа глубока и интуитивна.";
  const ascText = big3.asc.sign ? (ASC[big3.asc.sign] || "Твоя подача естественна и притягательна.") : "";
  
  // Максимальное значение для стихий (для нормализации баров)
  const maxElement = Math.max(elements.fire, elements.earth, elements.air, elements.water, 1);
  
  const handleTelegramShare = () => {
    try {
      const birthLine = formatBirthLine(birthData);
      const shareText = `🔮 ${birthLine}\n☀️ Солнце: ${big3.sun.sign}\n🌙 Луна: ${big3.moon.sign}${big3.asc.sign ? `\n↗️ Асцендент: ${big3.asc.sign}` : ''}\n\nРассчитано в @deepsoul_bot ✨`;
      
      const tg = (typeof window !== 'undefined' ? (window as { Telegram?: { WebApp?: { switchInlineQuery?: (text: string) => void } } })?.Telegram?.WebApp : null);
      if (tg?.switchInlineQuery) {
        tg.switchInlineQuery(shareText);
        return;
      }
      
      // Fallback - copy to clipboard
      navigator.clipboard?.writeText(shareText);
      notificationOccurred('success');
    } catch (error) {
      console.error('Share error:', error);
      notificationOccurred('error');
    }
  };
  
  const handleSaveResult = () => {
    try {
      const savedChart = saveChart(birthData, result);
      setActiveChart(savedChart);
      notificationOccurred('success');
    } catch (error) {
      console.error('Save error:', error);
      notificationOccurred('error');
    }
  };
  
  return (
    <div className="w-full max-w-[320px] mx-auto space-y-6">
      {/* Birth Header */}
      <BirthHeader 
        birth={birthData} 
        showEdit={!!onEditBirth} 
        {...(onEditBirth && { onEdit: onEditBirth })}
      />
      
      {/* Секция Big-3 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-800 text-center mb-6">
          Твои три кита
        </h2>
        
        {/* Карточка Солнца */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-2xl border border-orange-200/50 shadow-soft animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="text-3xl">☀️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-800 text-lg">
                Солнце в {big3.sun.sign}
              </h3>
              <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                {sunText}
              </p>
            </div>
          </div>
        </div>
        
        {/* Карточка Луны */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200/50 shadow-soft animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-3">
            <div className="text-3xl">🌙</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 text-lg">
                Луна в {big3.moon.sign}
              </h3>
              <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                {moonText}
              </p>
            </div>
          </div>
        </div>
        
        {/* Карточка Асцендента */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200/50 shadow-soft animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-3">
            <div className="text-3xl">↗️</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-purple-800 text-lg">
                  {big3.asc.sign ? `Асцендент в ${big3.asc.sign}` : 'Асцендент'}
                </h3>
                {big3.asc.approx && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    приблизительно
                  </span>
                )}
              </div>
              <p className="text-sm text-purple-700 leading-relaxed">
                {big3.asc.sign 
                  ? ascText 
                  : "Без точного времени рождения асцендент определить невозможно."
                }
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция баланса стихий */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-800 text-center mb-6">
          Баланс стихий
        </h2>
        
        <div className="space-y-3">
          {/* Огонь */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-800">🔥 Огонь</span>
              <span className="text-sm text-red-600">{elements.fire}</span>
            </div>
            <div className="h-2 bg-red-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(elements.fire / maxElement) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Земля */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">🌍 Земля</span>
              <span className="text-sm text-green-600">{elements.earth}</span>
            </div>
            <div className="h-2 bg-green-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700 ease-out delay-100"
                style={{ width: `${(elements.earth / maxElement) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Воздух */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-sky-800">💨 Воздух</span>
              <span className="text-sm text-sky-600">{elements.air}</span>
            </div>
            <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all duration-700 ease-out delay-200"
                style={{ width: `${(elements.air / maxElement) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Вода */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-800">💧 Вода</span>
              <span className="text-sm text-blue-600">{elements.water}</span>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700 ease-out delay-300"
                style={{ width: `${(elements.water / maxElement) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Кнопки действий */}
      <section className="space-y-3 pt-4">
        <button
          onClick={handleTelegramShare}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          📱 Поделиться в Telegram
        </button>
        
        <button
          onClick={handleSaveResult}
          className="w-full bg-neutral-500 hover:bg-neutral-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          💾 Сохранить результат
        </button>
      </section>
    </div>
  );
}