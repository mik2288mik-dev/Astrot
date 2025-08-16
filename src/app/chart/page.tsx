'use client';

import React, { useState } from 'react';
import FormCard from '@/components/chart/FormCard';
import Interpretation from '@/components/chart/Interpretation';
import { useTelegram } from '@/hooks/useTelegram';

interface Planet {
  name: string;
  sign: string;
  degree: string;
  house: number;
}

interface House {
  number: number;
  sign: string;
  degree: string;
}

interface Aspect {
  planets: [string, string];
  type: string;
  orb: string;
}

interface ChartInterpretation {
  summary: string;
  personality: string;
  career: string;
  love: string;
  health: string;
  advice: string;
}

interface ChartData {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  interpretation?: ChartInterpretation;
}

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  houseSystem: string;
  unknownTime: boolean;
}

export default function ChartPage() {
  const { hapticFeedback } = useTelegram();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleFormSubmit = async (formData: FormData) => {
    hapticFeedback('impact', 'medium');
    setIsLoading(true);

    try {
      // Логируем данные формы для будущего использования в API
      console.log('Form data:', formData);
      
      // Здесь будет вызов API для расчета карты
      // Пока используем заглушку
      setTimeout(() => {
        const mockData: ChartData = {
          planets: [
            { name: 'Солнце', sign: 'Близнецы', degree: '21°', house: 10 },
            { name: 'Луна', sign: 'Скорпион', degree: '15°', house: 3 },
            { name: 'Меркурий', sign: 'Близнецы', degree: '18°', house: 10 },
            { name: 'Венера', sign: 'Рак', degree: '25°', house: 11 },
            { name: 'Марс', sign: 'Лев', degree: '8°', house: 12 },
            { name: 'Юпитер', sign: 'Стрелец', degree: '12°', house: 4 },
            { name: 'Сатурн', sign: 'Водолей', degree: '3°', house: 6 },
          ],
          houses: [
            { number: 1, sign: 'Дева', degree: '12°' },
            { number: 2, sign: 'Весы', degree: '8°' },
            { number: 3, sign: 'Скорпион', degree: '9°' },
            { number: 4, sign: 'Стрелец', degree: '13°' },
            { number: 5, sign: 'Козерог', degree: '18°' },
            { number: 6, sign: 'Водолей', degree: '17°' },
            { number: 7, sign: 'Рыбы', degree: '12°' },
            { number: 8, sign: 'Овен', degree: '8°' },
            { number: 9, sign: 'Телец', degree: '9°' },
            { number: 10, sign: 'Близнецы', degree: '13°' },
            { number: 11, sign: 'Рак', degree: '18°' },
            { number: 12, sign: 'Лев', degree: '17°' },
          ],
          aspects: [
            { planets: ['Солнце', 'Луна'], type: 'Квадрат', orb: '2°' },
            { planets: ['Венера', 'Марс'], type: 'Соединение', orb: '3°' },
            { planets: ['Меркурий', 'Юпитер'], type: 'Трин', orb: '1°' },
          ],
          interpretation: {
            summary: 'Вы обладаете ярким интеллектом и коммуникативными способностями. Солнце в Близнецах в 10 доме указывает на карьеру, связанную с общением и информацией.',
            personality: 'Любознательная и многогранная личность с глубокими эмоциями (Луна в Скорпионе). Стремление к знаниям и новым впечатлениям.',
            career: 'Успех в областях, связанных с коммуникациями, медиа, образованием или торговлей. Возможность нескольких карьерных путей.',
            love: 'В отношениях цените эмоциональную глубину и интеллектуальную совместимость. Венера в Раке говорит о потребности в заботе и безопасности.',
            health: 'Обратите внимание на нервную систему и дыхательные пути. Полезны медитация и дыхательные практики.',
            advice: 'Развивайте свои коммуникативные таланты, но не забывайте о важности эмоциональной глубины и стабильности.'
          }
        };

        setChartData(mockData);
        setShowForm(false);
        setIsLoading(false);
        hapticFeedback('notification', 'success');
      }, 2000);
    } catch (error) {
      console.error('Error calculating chart:', error);
      setIsLoading(false);
      hapticFeedback('notification', 'error');
    }
  };

  const handleNewChart = () => {
    hapticFeedback('impact', 'light');
    setChartData(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Рассчитываю вашу натальную карту...</p>
        </div>
      </div>
    );
  }

  if (!showForm && chartData) {
    return <Interpretation data={chartData} onNewChart={handleNewChart} />;
  }

  return <FormCard onSubmit={handleFormSubmit} />;
}