'use client';
import BirthHeader from '../birth/BirthHeader';
import { formatZodiacSign } from '../../../lib/zodiac/format';
import { SUN, MOON, ASC } from '../../../lib/texts/signs';
import { ELEMENT_TEXTS } from '../../../lib/texts/elements';
import type { NatalResult } from '../../../lib/natal/types';
import type { BirthData } from '../../../lib/birth/types';
import { HelpCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { formatBirthLine } from '../../../lib/birth/format';

interface NatalResultProps {
  result: NatalResult;
  birthData: BirthData;

export default function NatalResult({ result, birthData }: NatalResultProps) {
  const { big3, elements } = result;
  
  // Получаем тексты для знаков
  const sunText = SUN[big3.sun.sign] || "Твоя солнечная энергия уникальна и прекрасна.";
  const moonText = MOON[big3.moon.sign] || "Твоя лунная природа глубока и интуитивна.";
  const ascText = big3.asc.sign ? (ASC[big3.asc.sign] || "Твоя подача естественна и притягательна.") : "";
  
  // Находим доминирующий элемент
  const dominantElement = Object.entries(elements).reduce((max, [element, count]) => 
    count > max.count ? { element, count } : max,
    { element: '', count: 0 }
  );
  
  const elementText = ELEMENT_TEXTS[dominantElement.element] || "";
  
  // Состояние для подсказок
  const [activeHelp, setActiveHelp] = useState<string | null>(null);
  
  const helpTexts = {
    sun: "Солнце — это твоя суть, центр личности. Знак Солнца показывает, кто ты есть на самом глубоком уровне.",
    moon: "Луна — это твои эмоции и подсознание. Знак Луны раскрывает, как ты чувствуешь и что тебе нужно для комфорта.",
    asc: "Асцендент — это твоя внешняя маска, первое впечатление. Показывает, как тебя видят другие.",
    elements: "Стихии показывают баланс энергий в твоей карте. Доминирующая стихия определяет твой основной способ взаимодействия с миром."
  };
  
  const toggleHelp = (key: string) => {
    setActiveHelp(activeHelp === key ? null : key);
  };
  
  const renderHelpIcon = (key: string) => (
    <button
      onClick={() => toggleHelp(key)}
      className="ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
      aria-label="Показать подсказку"
    >
      <HelpCircle size={18} />
    </button>
  );
  
  const renderHelpText = (key: string) => (
    activeHelp === key && (
      <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm text-purple-700">
        {helpTexts[key as keyof typeof helpTexts]}
      </div>
    )
  );
  
  return (
    <div className="w-full max-w-[320px] mx-auto space-y-6">
      {/* Birth Header */}
      <BirthHeader 
        birth={birthData} 
      />
      
      {/* Секция Big-3 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-800 text-center mb-6">
          Твои три кита
        </h2>
        
        {/* Солнце */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">☉</span>
              <h3 className="text-lg font-semibold text-neutral-800">
                Солнце в {formatZodiacSign(big3.sun.sign)}
              </h3>
              {renderHelpIcon('sun')}
            </div>
          </div>
          {renderHelpText('sun')}
          <p className="text-sm text-neutral-600 leading-relaxed">
            {sunText}
          </p>
        </div>
        
        {/* Луна */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">☽</span>
              <h3 className="text-lg font-semibold text-neutral-800">
                Луна в {formatZodiacSign(big3.moon.sign)}
              </h3>
              {renderHelpIcon('moon')}
            </div>
          </div>
          {renderHelpText('moon')}
          <p className="text-sm text-neutral-600 leading-relaxed">
            {moonText}
          </p>
        </div>
        
        {/* Асцендент */}
        {big3.asc.sign && (
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">↑</span>
                <h3 className="text-lg font-semibold text-neutral-800">
                  Асцендент в {formatZodiacSign(big3.asc.sign)}
                </h3>
                {renderHelpIcon('asc')}
              </div>
            </div>
            {renderHelpText('asc')}
            <p className="text-sm text-neutral-600 leading-relaxed">
              {ascText}
            </p>
          </div>
        )}
      </section>
      
      {/* Секция Стихий */}
      <section className="space-y-4">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-bold text-neutral-800">
            Баланс стихий
          </h2>
          {renderHelpIcon('elements')}
        </div>
        {renderHelpText('elements')}
        
        <div className="glass p-5">
          <div className="space-y-3">
            {Object.entries(elements).map(([element, count]) => {
              const percentage = Math.round((count / 10) * 100);
              const isMax = element === dominantElement.element;
              
              const elementEmojis: Record<string, string> = {
                'fire': '🔥',
                'earth': '🌍',
                'air': '💨',
                'water': '💧'
              };
              
              const elementNames: Record<string, string> = {
                'fire': 'Огонь',
                'earth': 'Земля',
                'air': 'Воздух',
                'water': 'Вода'
              };
              
              return (
                <div key={element}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700 flex items-center">
                      <span className="mr-1">{elementEmojis[element]}</span>
                      {elementNames[element]}
                    </span>
                    <span className={`text-sm font-bold ${isMax ? 'text-purple-600' : 'text-neutral-600'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isMax ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-neutral-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {dominantElement.element && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {elementText}
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Дополнительная информация */}
      <section className="glass p-5 text-center">
        <p className="text-xs text-neutral-500">
          Расчёт выполнен для
        </p>
        <p className="text-sm font-medium text-neutral-700 mt-1">
          {formatBirthLine(birthData)}
        </p>
      </section>
    </div>
  );
}