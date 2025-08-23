'use client';
import BirthHeader from '../birth/BirthHeader';
import type { NatalResult } from '@/lib/api/natal';
import type { BirthData } from '@/lib/birth/types';
import { IconHelpCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { formatBirthLine } from '@/lib/birth/format';

interface NatalResultProps {
  result: NatalResult;
  birthData: BirthData;
  onEditBirth?: () => void;
}

// Функция форматирования знаков зодиака
const formatZodiacSign = (sign: string): string => {
  const signs: Record<string, string> = {
    'aries': 'Овне',
    'taurus': 'Тельце',
    'gemini': 'Близнецах',
    'cancer': 'Раке',
    'leo': 'Льве',
    'virgo': 'Деве',
    'libra': 'Весах',
    'scorpio': 'Скорпионе',
    'sagittarius': 'Стрельце',
    'capricorn': 'Козероге',
    'aquarius': 'Водолее',
    'pisces': 'Рыбах'
  };
  return signs[sign] || sign;
};

// Тексты для знаков
const SUN: Record<string, string> = {
  'aries': 'Ты прирожденный лидер с огненной энергией и неукротимым духом.',
  'taurus': 'Ты ценишь стабильность, красоту и умеешь наслаждаться жизнью.',
  'gemini': 'Ты любознательный и общительный, всегда открыт новым идеям.',
  'cancer': 'Ты чуткий и заботливый, семья и дом для тебя особенно важны.',
  'leo': 'Ты яркая личность с щедрым сердцем и природным обаянием.',
  'virgo': 'Ты практичный и внимательный к деталям, стремишься к совершенству.',
  'libra': 'Ты ценишь гармонию, справедливость и красоту во всех проявлениях.',
  'scorpio': 'Ты глубокий и интенсивный, обладаешь мощной внутренней силой.',
  'sagittarius': 'Ты свободолюбивый философ, стремящийся к новым горизонтам.',
  'capricorn': 'Ты целеустремленный и ответственный, умеешь достигать целей.',
  'aquarius': 'Ты оригинальный мыслитель, стремящийся к прогрессу и свободе.',
  'pisces': 'Ты творческая и чувствительная душа с богатым воображением.'
};

const MOON: Record<string, string> = {
  'aries': 'Твои эмоции яркие и спонтанные, ты быстро реагируешь на события.',
  'taurus': 'Тебе нужна стабильность и комфорт для эмоционального равновесия.',
  'gemini': 'Твое настроение переменчиво, ты нуждаешься в общении и новизне.',
  'cancer': 'Ты глубоко эмоциональный, семья дает тебе чувство безопасности.',
  'leo': 'Тебе важно признание и восхищение, ты щедр в проявлении чувств.',
  'virgo': 'Ты заботлив и практичен в эмоциях, помощь другим тебя успокаивает.',
  'libra': 'Тебе нужна гармония в отношениях для внутреннего покоя.',
  'scorpio': 'Твои эмоции глубоки и интенсивны, ты чувствуешь все очень остро.',
  'sagittarius': 'Тебе нужна свобода и приключения для эмоционального благополучия.',
  'capricorn': 'Ты сдержан в эмоциях, структура и порядок дают тебе покой.',
  'aquarius': 'Ты независим эмоционально, дружба для тебя очень важна.',
  'pisces': 'Ты чувствительный и интуитивный, искусство питает твою душу.'
};

const ASC: Record<string, string> = {
  'aries': 'Ты производишь впечатление энергичного и решительного человека.',
  'taurus': 'Ты кажешься спокойным, надежным и основательным.',
  'gemini': 'Ты выглядишь общительным, любознательным и живым.',
  'cancer': 'Ты производишь впечатление заботливого и чуткого человека.',
  'leo': 'Ты выглядишь уверенным, ярким и харизматичным.',
  'virgo': 'Ты кажешься аккуратным, скромным и внимательным.',
  'libra': 'Ты производишь впечатление обаятельного и дипломатичного человека.',
  'scorpio': 'Ты выглядишь загадочным, интенсивным и магнетичным.',
  'sagittarius': 'Ты кажешься открытым, оптимистичным и авантюрным.',
  'capricorn': 'Ты производишь впечатление серьезного и ответственного человека.',
  'aquarius': 'Ты выглядишь оригинальным, независимым и дружелюбным.',
  'pisces': 'Ты кажешься мечтательным, чувствительным и творческим.'
};

const ELEMENT_TEXTS: Record<string, string> = {
  'fire': 'Огненная стихия делает тебя активным, вдохновенным и инициативным.',
  'earth': 'Земная стихия дает тебе практичность, стабильность и надежность.',
  'air': 'Воздушная стихия наделяет тебя общительностью, любознательностью и гибкостью ума.',
  'water': 'Водная стихия дарит тебе чувствительность, интуицию и эмоциональную глубину.'
};

export default function NatalResult({ result, birthData, onEditBirth: _onEditBirth }: NatalResultProps) {
  const { big3, elements } = result;
  
  // Получаем тексты для знаков
  const sunText = SUN[big3.sun.sign] || "Твоя солнечная энергия уникальна и прекрасна.";
  const moonText = MOON[big3.moon.sign] || "Твоя лунная природа глубока и интуитивна.";
  const ascText = big3.asc.sign ? (ASC[big3.asc.sign] || "Твоя подача естественна и притягательна.") : "";
  
  // Находим доминирующий элемент
  const dominantElement = Object.entries(elements).reduce((max, [element, count]) => 
    (count as number) > max.count ? { element, count: count as number } : max,
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
      <IconHelpCircle size={18} />
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