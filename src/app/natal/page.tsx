'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, MapPin, Sparkles, Star, Heart, Zap, Trophy, Gift } from 'lucide-react'
import '@/styles/astrot-boinkers.css'

interface FormData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  timeUnknown: boolean
}

// Дружелюбные описания вместо астрологических терминов
const FRIENDLY_TRAITS = {
  sun: {
    aries: { emoji: '🔥', title: 'Огненный лидер', desc: 'Ты прирожденный первопроходец! Энергия бьет ключом, а смелость зашкаливает.' },
    taurus: { emoji: '🌺', title: 'Надежная скала', desc: 'Ты как уютный плед - надежный, теплый и всегда знаешь, где вкусно поесть!' },
    gemini: { emoji: '💫', title: 'Социальная бабочка', desc: 'Твой мозг работает быстрее интернета, а юмор острее самурайского меча!' },
    cancer: { emoji: '🌙', title: 'Душевный обнимашка', desc: 'У тебя золотое сердце и суперспособность - чувствовать настроение людей.' },
    leo: { emoji: '👑', title: 'Звезда сцены', desc: 'Ты светишься ярче солнца! Харизма 100 уровня и сердце льва.' },
    virgo: { emoji: '✨', title: 'Мастер порядка', desc: 'Ты замечаешь детали, которые другие пропускают. Перфекционизм - твое второе имя!' },
    libra: { emoji: '⚖️', title: 'Дипломат красоты', desc: 'Ты создаешь гармонию везде! Эстет, романтик и лучший советчик.' },
    scorpio: { emoji: '🦂', title: 'Магнетическая тайна', desc: 'В тебе есть глубина океана и притягательность черной дыры. Интенсивность на максимум!' },
    sagittarius: { emoji: '🏹', title: 'Вечный искатель', desc: 'Приключения - твое все! Оптимизм зашкаливает, а жажда знаний безгранична.' },
    capricorn: { emoji: '🏔️', title: 'Босс жизни', desc: 'Ты покоряешь вершины с упорством горного козла. Амбиции и дисциплина - твои суперсилы!' },
    aquarius: { emoji: '🛸', title: 'Гений из будущего', desc: 'Твои идеи опережают время! Оригинальность и свободолюбие - твой стиль.' },
    pisces: { emoji: '🐠', title: 'Творческий мечтатель', desc: 'У тебя душа художника и сердце эмпата. Фантазия безгранична, интуиция на высоте!' }
  }
}

export default function NatalPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    timeUnknown: false
  })

  const [showResult, setShowResult] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [userSign, setUserSign] = useState<string>('')
  const [showWelcome, setShowWelcome] = useState(true)

  // Загрузка данных из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('natalFormData')
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  // Определение знака зодиака по дате
  const getZodiacSign = (date: string): string => {
    const [year, month, day] = date.split('-').map(Number)
    const signs = [
      { name: 'capricorn', start: [1, 1], end: [1, 19] },
      { name: 'aquarius', start: [1, 20], end: [2, 18] },
      { name: 'pisces', start: [2, 19], end: [3, 20] },
      { name: 'aries', start: [3, 21], end: [4, 19] },
      { name: 'taurus', start: [4, 20], end: [5, 20] },
      { name: 'gemini', start: [5, 21], end: [6, 20] },
      { name: 'cancer', start: [6, 21], end: [7, 22] },
      { name: 'leo', start: [7, 23], end: [8, 22] },
      { name: 'virgo', start: [8, 23], end: [9, 22] },
      { name: 'libra', start: [9, 23], end: [10, 22] },
      { name: 'scorpio', start: [10, 23], end: [11, 21] },
      { name: 'sagittarius', start: [11, 22], end: [12, 21] },
      { name: 'capricorn', start: [12, 22], end: [12, 31] }
    ]
    
    for (const sign of signs) {
      if ((month === sign.start[0] && day >= sign.start[1]) || 
          (month === sign.end[0] && day <= sign.end[1])) {
        return sign.name
      }
    }
    return 'aries'
  }

  const handleCalculate = async () => {
    if (!formData.name || !formData.birthDate || !formData.birthPlace) {
      alert('Эй, друг! Заполни все поля, чтобы я смог рассказать о тебе! 🌟')
      return
    }

    localStorage.setItem('natalFormData', JSON.stringify(formData))
    setIsCalculating(true)
    
    // Анимация расчета
    setTimeout(() => {
      const sign = getZodiacSign(formData.birthDate)
      setUserSign(sign)
      setIsCalculating(false)
      setShowResult(true)
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #0F0F1E 0%, #1A1A2E 100%)' }}>
        <div className="text-center">
          <div className="astrot-wheel mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-pulse">🔮</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Читаю звезды...</h2>
          <p className="text-gray-400">Твоя космическая карта почти готова!</p>
          <div className="astrot-progress mt-6 max-w-xs mx-auto">
            <div className="astrot-progress-fill" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (showResult && userSign) {
    const traits = FRIENDLY_TRAITS.sun[userSign as keyof typeof FRIENDLY_TRAITS.sun]
    
    return (
      <div className="min-h-screen p-4" style={{ background: 'linear-gradient(180deg, #0F0F1E 0%, #1A1A2E 100%)' }}>
        <div className="astrot-stars"></div>
        
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Привет, {formData.name}! 👋
            </h1>
            <p className="text-xl text-gray-400">Твоя космическая история готова!</p>
          </div>

          {/* Основная карточка с результатом */}
          <div className="astrot-card mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Твой космический профиль</h2>
                <div className="astrot-badge">
                  <Trophy className="w-4 h-4 mr-2" />
                  Уровень: Звездный
                </div>
              </div>
              <div className="astrot-planet text-6xl">
                {traits.emoji}
              </div>
            </div>

            <div className="space-y-4">
              <div className="astrot-message">
                <span className="astrot-message-emoji">{traits.emoji}</span>
                <span className="text-xl font-bold text-white">{traits.title}</span>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                {traits.desc}
              </p>
            </div>
          </div>

          {/* Карточки с характеристиками */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Heart className="w-6 h-6 text-pink-400 mr-3" />
                <h3 className="text-lg font-bold text-white">В любви ты...</h3>
              </div>
              <p className="text-gray-300">
                Страстный и преданный! Любишь всем сердцем и ждешь того же взамен. 
                Романтика для тебя - это не просто слова, а действия!
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Твоя суперсила</h3>
              </div>
              <p className="text-gray-300">
                Умение вдохновлять других! Люди тянутся к твоей энергии как мотыльки к свету. 
                Ты заряжаешь позитивом всех вокруг!
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Gift className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Твой талант</h3>
              </div>
              <p className="text-gray-300">
                Креативность на максимум! У тебя есть дар видеть красоту там, где другие её не замечают. 
                Твои идеи способны изменить мир!
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Star className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Совет от звезд</h3>
              </div>
              <p className="text-gray-300">
                Доверься интуиции! Твой внутренний компас никогда не подводит. 
                Смелее иди к своим мечтам - вселенная на твоей стороне!
              </p>
            </div>
          </div>

          {/* Дружелюбное сообщение */}
          <div className="astrot-chat mb-6">
            <div className="astrot-chat-avatar">🌟</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Личное послание для тебя</h3>
              <p className="text-gray-300">
                {formData.name}, ты уникальный человек с невероятным потенциалом! 
                Звезды говорят, что впереди тебя ждут удивительные возможности. 
                Главное - оставайся собой и не бойся сиять! ✨
              </p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowResult(false)}
              className="astrot-button flex-1"
            >
              <Sparkles className="w-5 h-5 mr-2 inline" />
              Пересчитать
            </button>
            <button className="astrot-button flex-1" style={{ background: 'var(--astrot-gradient-pink)' }}>
              <Heart className="w-5 h-5 mr-2 inline" />
              Сохранить
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(180deg, #0F0F1E 0%, #1A1A2E 100%)' }}>
      <div className="astrot-stars"></div>
      
      <div className="max-w-2xl mx-auto">
        {/* Приветствие */}
        {showWelcome && (
          <div className="astrot-message mb-6">
            <span className="astrot-message-emoji">👋</span>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Привет, друг!</h2>
              <p className="text-gray-300">
                Я ASTROT - твой космический приятель! Расскажи мне о себе, и я покажу, 
                какие классные штуки написаны в звездах специально для тебя! 🌟
              </p>
            </div>
          </div>
        )}

        {/* Форма ввода данных */}
        <div className="astrot-card">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Твоя натальная карта 🔮
          </h1>

          <div className="space-y-6">
            {/* Имя */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Как тебя зовут? 
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Например: Александр"
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                />
                <span className="absolute right-3 top-3 text-2xl">😊</span>
              </div>
            </div>

            {/* Дата рождения */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Когда ты родился?
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-purple-400" />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Время рождения */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Во сколько? (необязательно)
              </label>
              <div className="space-y-3">
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleInputChange}
                  disabled={formData.timeUnknown}
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
                />
                <label className="flex items-center text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    name="timeUnknown"
                    checked={formData.timeUnknown}
                    onChange={handleInputChange}
                    className="mr-2 w-5 h-5 rounded border-purple-500"
                  />
                  <span>Не знаю точное время 🤷</span>
                </label>
              </div>
            </div>

            {/* Место рождения */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Где это было?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                  placeholder="Например: Москва, Россия"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Кнопка расчета */}
            <button 
              onClick={handleCalculate}
              className="astrot-button w-full text-lg"
            >
              <Sparkles className="w-6 h-6 mr-2 inline" />
              Узнать мою космическую историю!
            </button>

            {/* Подсказка */}
            <div className="text-center text-sm text-gray-500">
              <p>🔒 Твои данные в полной безопасности</p>
              <p>Мы храним их только на твоем устройстве</p>
            </div>
          </div>
        </div>

        {/* Забавные факты */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <div className="text-3xl mb-2">🌟</div>
            <div className="text-sm text-gray-400">Уже построено</div>
            <div className="text-2xl font-bold text-white">12,345</div>
            <div className="text-sm text-gray-400">карт</div>
          </div>
          <div className="text-center p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
            <div className="text-3xl mb-2">💫</div>
            <div className="text-sm text-gray-400">Точность</div>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-sm text-gray-400">предсказаний</div>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="text-3xl mb-2">🔮</div>
            <div className="text-sm text-gray-400">Счастливых</div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm text-gray-400">пользователей</div>
          </div>
        </div>
      </div>
    </div>
  )
}