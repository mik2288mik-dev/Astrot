'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, MapPin, User, Sparkles, Star, Moon, Sun, Heart } from 'lucide-react'

interface FormData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  timeUnknown: boolean
}

interface ChartData {
  planets: Array<{
    name: string
    sign: string
    degree: number
    house: number
    symbol: string
  }>
  houses: Array<{
    number: number
    sign: string
    degree: number
  }>
  aspects: Array<{
    planet1: string
    planet2: string
    type: string
    angle: number
  }>
}

export default function NatalPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    timeUnknown: false
  })

  const [showChart, setShowChart] = useState(false)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateChart = useCallback(async (data?: FormData) => {
    const dataToUse = data || formData
    
    // Сохраняем данные в localStorage
    localStorage.setItem('natalFormData', JSON.stringify(dataToUse))
    
    setIsLoading(true)
    
    // Имитация загрузки и генерации данных
    setTimeout(() => {
      // Моковые данные для демонстрации
      setChartData({
        planets: [
          { name: 'Солнце', sign: 'Овен', degree: 15, house: 1, symbol: '☉' },
          { name: 'Луна', sign: 'Телец', degree: 23, house: 2, symbol: '☽' },
          { name: 'Меркурий', sign: 'Близнецы', degree: 7, house: 3, symbol: '☿' },
          { name: 'Венера', sign: 'Рак', degree: 18, house: 4, symbol: '♀' },
          { name: 'Марс', sign: 'Лев', degree: 29, house: 5, symbol: '♂' },
          { name: 'Юпитер', sign: 'Дева', degree: 12, house: 6, symbol: '♃' },
          { name: 'Сатурн', sign: 'Весы', degree: 3, house: 7, symbol: '♄' }
        ],
        houses: Array.from({ length: 12 }, (_, i) => ({
          number: i + 1,
          sign: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'][i],
          degree: (i * 30) % 360
        })),
        aspects: [
          { planet1: 'Солнце', planet2: 'Луна', type: 'Секстиль', angle: 60 },
          { planet1: 'Венера', planet2: 'Марс', type: 'Квадрат', angle: 90 },
          { planet1: 'Юпитер', planet2: 'Сатурн', type: 'Трин', angle: 120 }
        ]
      })
      setShowChart(true)
      setIsLoading(false)
    }, 2000)
  }, [formData])

  // Загружаем сохраненные данные при монтировании
  useEffect(() => {
    const savedData = localStorage.getItem('natalFormData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setFormData(parsed)
      if (parsed.name && parsed.birthDate && parsed.birthPlace) {
        handleGenerateChart(parsed)
      }
    }
  }, [handleGenerateChart])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    }
    setFormData(newData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.birthDate || !formData.birthPlace) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }
    handleGenerateChart()
  }

  const resetForm = () => {
    setShowChart(false)
    setChartData(null)
    localStorage.removeItem('natalFormData')
    setFormData({
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      timeUnknown: false
    })
  }

  const zodiacColors: Record<string, string> = {
    'Овен': 'from-red-400 to-orange-400',
    'Телец': 'from-green-400 to-emerald-400',
    'Близнецы': 'from-yellow-400 to-amber-400',
    'Рак': 'from-blue-400 to-cyan-400',
    'Лев': 'from-orange-400 to-yellow-400',
    'Дева': 'from-emerald-400 to-green-400',
    'Весы': 'from-pink-400 to-rose-400',
    'Скорпион': 'from-red-600 to-purple-600',
    'Стрелец': 'from-purple-400 to-indigo-400',
    'Козерог': 'from-gray-600 to-slate-600',
    'Водолей': 'from-blue-500 to-indigo-500',
    'Рыбы': 'from-indigo-400 to-purple-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-32">
      <div className="max-w-screen-md mx-auto px-4 pt-6">
        
        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Натальная карта
          </h1>
          <p className="text-gray-600 font-medium">
            🌟 Твой космический паспорт 🌟
          </p>
        </div>

        {!showChart ? (
          <>
            {/* Форма ввода данных */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Имя */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-purple-500" />
                    Твоё имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Как тебя зовут?"
                    className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>

                {/* Дата рождения */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors"
                    required
                  />
                </div>

                {/* Время рождения */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Время рождения
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="time"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleInputChange}
                      disabled={formData.timeUnknown}
                      className="flex-1 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="timeUnknown"
                        checked={formData.timeUnknown}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Не знаю</span>
                    </label>
                  </div>
                </div>

                {/* Место рождения */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Место рождения
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    placeholder="Город, страна"
                    className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-green-400 transition-colors"
                    required
                  />
                </div>

                {/* Кнопка отправки */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full py-4 rounded-2xl font-bold text-white
                    bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    active:scale-95 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isLoading ? 'animate-pulse' : ''}
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Строим карту...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Построить карту
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Информационный блок */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Что такое натальная карта?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Это твой персональный космический снимок на момент рождения. 
                    Карта показывает расположение планет и их влияние на твою личность, 
                    таланты и жизненный путь.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Визуализация карты */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-6">
              {/* Кнопка изменения данных */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Карта для {formData.name}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
                >
                  Изменить данные
                </button>
              </div>

              {/* Круговая диаграмма (упрощенная визуализация) */}
              <div className="relative w-full aspect-square max-w-md mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-white rounded-full shadow-inner" />
                
                {/* Центр карты */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌟</div>
                    <p className="text-sm font-bold text-gray-700">{formData.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(formData.birthDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                {/* Планеты по кругу */}
                {chartData?.planets.map((planet, index) => {
                  const angle = (index * 360) / chartData.planets.length
                  const radius = 35
                  const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180)
                  const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180)
                  
                  return (
                    <div
                      key={planet.name}
                      className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${zodiacColors[planet.sign]} shadow-lg flex items-center justify-center text-white font-bold text-xl`}>
                        {planet.symbol}
                      </div>
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                        {planet.name}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Интерпретации */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Твои космические особенности
                </h3>
                
                <div className="grid gap-3">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-800">Солнце в {chartData?.planets[0].sign}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ты обладаешь яркой харизмой и лидерскими качествами. 
                      Твоя энергия вдохновляет окружающих.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-gray-800">Луна в {chartData?.planets[1].sign}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Твой эмоциональный мир глубок и насыщен. 
                      Ты ценишь стабильность и комфорт.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span className="font-bold text-gray-800">Любовный прогноз</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Венера благоволит романтическим отношениям. 
                      Открой сердце новым чувствам!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Дневной гороскоп */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔮</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Совет на сегодня</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Звёзды советуют довериться интуиции. Сегодня отличный день 
                    для творчества и самовыражения. Не бойся показать свою уникальность!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}