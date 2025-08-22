'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, Moon, Star, Sparkles, Heart, Briefcase, Brain, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Гороскоп дня',
      description: 'Узнайте, что готовят звёзды',
      href: '/horoscope',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: 'Лунный календарь',
      description: 'Благоприятные дни',
      href: '/calendar',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Натальная карта',
      description: 'Ваш космический паспорт',
      href: '/natal-chart',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Совместимость',
      description: 'Проверьте вашу пару',
      href: '/compat',
      color: 'from-yellow-400 to-orange-500'
    }
  ]

  const dailyInsights = [
    {
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      title: 'Любовь',
      message: 'День благоприятен для новых знакомств'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-blue-500" />,
      title: 'Работа',
      message: 'Удачное время для начинаний'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: 'Идеи',
      message: 'Творческий подъём и вдохновение'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Финансы',
      message: 'Возможны неожиданные поступления'
    }
  ]

  return (
    <div className="min-h-screen p-4 pt-8">
      {/* Приветствие */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Astrot
        </h1>
        <p className="text-gray-600 text-lg">
          Ваш персональный астролог
        </p>
      </div>

      {/* Карточка дня */}
      <div className="mb-8 p-6 bg-white rounded-3xl shadow-xl border border-purple-100">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className="ml-4">
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
        
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <p className="text-gray-700 leading-relaxed">
              Сегодня звёзды благоволят новым начинаниям. Луна в знаке Тельца 
              дарит стабильность и уверенность. Отличный день для принятия 
              важных решений!
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Счастливое число: 7</span>
            <span className="text-sm text-gray-500">Цвет дня: Фиолетовый</span>
          </div>
        </div>
      </div>

      {/* Быстрые инсайты */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Сферы жизни</h3>
        <div className="grid grid-cols-2 gap-3">
          {dailyInsights.map((insight, index) => (
            <div 
              key={index}
              className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-2">
                {insight.icon}
                <span className="ml-2 font-semibold text-gray-800">
                  {insight.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Основные функции */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Исследуйте</h3>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90`} />
              <div className="relative p-6 text-white">
                <div className="mb-3 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/90">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Мотивационная цитата */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl">
        <div className="flex items-start">
          <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
          <div className="ml-3">
            <p className="text-gray-700 italic leading-relaxed">
              "Звёзды склоняют, но не обязывают. Ваша судьба в ваших руках!"
            </p>
            <p className="text-sm text-gray-500 mt-2">— Древняя мудрость</p>
          </div>
        </div>
      </div>
    </div>
  )
}