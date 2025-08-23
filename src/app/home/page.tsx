'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Stars, Moon, Sun, Sparkles, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const quickActions = [
    {
      icon: <Stars className="w-6 h-6" />,
      title: 'Гороскоп дня',
      description: 'Узнай, что готовят звёзды',
      gradient: 'from-purple-400 to-pink-400',
      shadow: 'shadow-purple-200',
      onClick: () => router.push('/horoscope')
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: 'Лунный календарь',
      description: 'Благоприятные дни',
      gradient: 'from-blue-400 to-cyan-400',
      shadow: 'shadow-blue-200',
      onClick: () => router.push('/calendar')
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Таро онлайн',
      description: 'Получи ответ',
      gradient: 'from-yellow-400 to-orange-400',
      shadow: 'shadow-yellow-200',
      onClick: () => router.push('/functions')
    }
  ]

  const todayEnergy = {
    mood: '🌟 Отличное',
    luckyNumber: 7,
    luckyColor: 'Фиолетовый',
    element: '💫 Воздух'
  }

  const insights = [
    { icon: '💕', title: 'Любовь', text: 'День для новых знакомств' },
    { icon: '💼', title: 'Работа', text: 'Удача в начинаниях' },
    { icon: '💡', title: 'Идеи', text: 'Творческий подъём' },
    { icon: '💰', title: 'Финансы', text: 'Приятные сюрпризы' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-32">
      <div className="max-w-screen-md mx-auto px-4 pt-6">
        
        {/* Заголовок с приветствием */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Astrot
          </h1>
          <p className="text-gray-600 font-medium">
            ✨ Твой космический гид ✨
          </p>
        </div>

        {/* Карточка энергии дня */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Энергия дня</h2>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('ru-RU', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-2xl animate-bounce">
                {todayEnergy.mood.split(' ')[0]}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
              <p className="text-gray-700 font-medium leading-relaxed">
                Сегодня звёзды на твоей стороне! Луна в Тельце дарит стабильность и уверенность. 
                Отличный день для важных решений и новых начинаний.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Счастливое число</p>
                <p className="text-2xl font-bold text-purple-600">{todayEnergy.luckyNumber}</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Цвет дня</p>
                <p className="text-lg font-bold text-pink-600">{todayEnergy.luckyColor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Быстрые инсайты */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-yellow-500" />
            Сферы жизни
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{insight.icon}</span>
                  <span className="font-bold text-gray-800">{insight.title}</span>
                </div>
                <p className="text-xs text-gray-600">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Stars className="w-5 h-5 text-purple-500" />
            Исследуй магию
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  relative overflow-hidden rounded-2xl p-5
                  bg-gradient-to-br ${action.gradient}
                  text-white shadow-lg ${action.shadow}
                  hover:scale-105 active:scale-95
                  transition-all duration-300
                  group
                `}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                <div className="relative">
                  <div className="mb-3 transform group-hover:rotate-12 transition-transform">
                    {action.icon}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{action.title}</h4>
                  <p className="text-xs text-white/90">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Мотивационная цитата */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl blur-lg opacity-50" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-3xl">✨</div>
              <div className="flex-1">
                <p className="text-gray-700 italic font-medium mb-2">
                  &ldquo;Звёзды указывают путь, но идти по нему — твой выбор&rdquo;
                </p>
                <p className="text-xs text-gray-500">— Космическая мудрость</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}