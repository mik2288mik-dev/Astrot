'use client';

import React from 'react';
import { 
  UserIcon, 
  BriefcaseIcon, 
  HeartIcon, 
  SparklesIcon,
  ExclamationTriangleIcon,
  SunIcon
} from '@heroicons/react/24/outline';

interface InterpretationData {
  summary: string;
  personality: string;
  work_money: string;
  love_social: string;
  health_energy: string;
  today_focus: string;
  disclaimers: string[];
}

interface InterpretationCardsProps {
  interpretation: InterpretationData;
  isLoading?: boolean;
}

interface CardData {
  title: string;
  content: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
}

export default function InterpretationCards({ interpretation, isLoading = false }: InterpretationCardsProps) {
  const cards: CardData[] = [
    {
      title: 'Общая характеристика',
      content: interpretation.summary,
      icon: SparklesIcon,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Личность',
      content: interpretation.personality,
      icon: UserIcon,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Работа и финансы',
      content: interpretation.work_money,
      icon: BriefcaseIcon,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Любовь и отношения',
      content: interpretation.love_social,
      icon: HeartIcon,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Здоровье и энергия',
      content: interpretation.health_energy,
      icon: SunIcon,
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Фокус дня',
      content: interpretation.today_focus,
      icon: SparklesIcon,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  if (isLoading) {
    return <SkeletonCards />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {cards.map((card, index) => (
          <InterpretationCard
            key={card.title}
            card={card}
            index={index}
          />
        ))}
      </div>

      {/* Дисклеймеры */}
      {interpretation.disclaimers && interpretation.disclaimers.length > 0 && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-fadeIn">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Важно помнить</h3>
              <ul className="space-y-1">
                {interpretation.disclaimers.map((disclaimer, index) => (
                  <li key={index} className="text-xs text-amber-700">
                    • {disclaimer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InterpretationCardProps {
  card: CardData;
  index: number;
}

function InterpretationCard({ card, index }: InterpretationCardProps) {
  const Icon = card.icon;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn border border-neutral-100 hover:shadow-xl transition-all duration-300"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} bg-opacity-10 mr-4`}>
            <Icon className={`w-6 h-6 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">{card.title}</h3>
        </div>
        
        <p className="text-neutral-700 leading-relaxed text-sm">
          {card.content}
        </p>
      </div>
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-100 animate-pulse"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="h-2 bg-neutral-200"></div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl mr-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-32"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { SkeletonCards };