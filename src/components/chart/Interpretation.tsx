'use client';

import React from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { 
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  HeartIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

interface InterpretationProps {
  data: {
    planets: any[];
    houses: any[];
    aspects: any[];
    interpretation?: {
      summary: string;
      personality: string;
      career: string;
      love: string;
      health: string;
      advice: string;
    };
  };
  onNewChart: () => void;
}

export default function Interpretation({ data, onNewChart }: InterpretationProps) {
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();

  React.useEffect(() => {
    showMainButton('Новый расчет', onNewChart);
    return () => hideMainButton();
  }, []);

  const handleShare = () => {
    hapticFeedback('impact', 'light');
    // Логика шаринга
  };

  const handleSave = () => {
    hapticFeedback('impact', 'light');
    // Логика сохранения
  };

  const sections = [
    {
      icon: SparklesIcon,
      title: 'Общее описание',
      content: data.interpretation?.summary || 'Расчет интерпретации...',
      color: 'bg-pastel-purple'
    },
    {
      icon: UserIcon,
      title: 'Личность',
      content: data.interpretation?.personality || 'Расчет интерпретации...',
      color: 'bg-pastel-pink'
    },
    {
      icon: BriefcaseIcon,
      title: 'Карьера и финансы',
      content: data.interpretation?.career || 'Расчет интерпретации...',
      color: 'bg-pastel-blue'
    },
    {
      icon: HeartIcon,
      title: 'Любовь и отношения',
      content: data.interpretation?.love || 'Расчет интерпретации...',
      color: 'bg-pastel-peach'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Здоровье',
      content: data.interpretation?.health || 'Расчет интерпретации...',
      color: 'bg-pastel-mint'
    },
    {
      icon: LightBulbIcon,
      title: 'Советы',
      content: data.interpretation?.advice || 'Расчет интерпретации...',
      color: 'bg-pastel-lavender'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onNewChart}
            className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="font-semibold text-neutral-900">Ваша натальная карта</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <BookmarkIcon className="w-5 h-5 text-neutral-600" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <ShareIcon className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="page-wrapper pb-24">
        {/* Основные показатели */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-5 rounded-2xl">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Основные показатели
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.planets.slice(0, 4).map((planet: any, index: number) => (
                <div key={index} className="bg-white/70 p-3 rounded-xl">
                  <p className="text-xs text-neutral-600">{planet.name}</p>
                  <p className="text-sm font-semibold text-neutral-800">
                    {planet.sign} {planet.degree}
                  </p>
                  <p className="text-xs text-neutral-500">Дом {planet.house}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Планеты */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">
            Планеты в знаках
          </h2>
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            {data.planets.map((planet: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index !== data.planets.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">{planet.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{planet.name}</p>
                    <p className="text-sm text-neutral-500">
                      {planet.sign} {planet.degree}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary-600">
                  {planet.house} дом
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Дома */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">
            Дома гороскопа
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {data.houses.map((house: any, index: number) => (
              <div key={index} className="bg-white p-3 rounded-xl border border-neutral-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-600">
                    {house.number} дом
                  </span>
                  <span className="text-xs text-primary-600">
                    {house.degree}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {house.sign}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Аспекты */}
        {data.aspects && data.aspects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              Основные аспекты
            </h2>
            <div className="space-y-2">
              {data.aspects.map((aspect: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded-xl border border-neutral-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-800">
                        {aspect.planets[0]}
                      </span>
                      <span className="text-xs text-neutral-500">—</span>
                      <span className="text-sm font-medium text-neutral-800">
                        {aspect.planets[1]}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary-600">
                        {aspect.type}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Орб: {aspect.orb}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Интерпретация */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">
            Интерпретация
          </h2>
          <div className="space-y-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                  <div className={`${section.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-neutral-800">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Действия */}
        <section className="mt-8">
          <button
            onClick={onNewChart}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Рассчитать новую карту
          </button>
        </section>
      </div>
    </div>
  );
}