'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, MapPin, Sparkles, Star, Heart, Zap, Trophy, Gift, Loader2 } from 'lucide-react'
import { ProfileService } from '@/services/profile.service'
import { NatalChartService } from '@/services/natal-chart.service'
import { useTelegram } from '@/hooks/useTelegram'
import '@/styles/astrot-boinkers.css'

interface FormData {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  timeUnknown: boolean
  lat?: number
  lon?: number
}

interface ChartResult {
  planets: any
  houses: any
  aspects: any
}

// Дружелюбные описания вместо астрологических терминов
const FRIENDLY_TRAITS = {
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

// Дружелюбные интерпретации для Луны
const MOON_TRAITS = {
  aries: 'Твои эмоции как фейерверк - яркие и мгновенные! Ты не умеешь долго злиться.',
  taurus: 'Тебе нужен комфорт и стабильность. Обнимашки и вкусная еда - твои антистресс.',
  gemini: 'Твои чувства меняются как погода весной. Поговорить по душам - лучшая терапия!',
  cancer: 'Ты чувствуешь все на 200%. Дом и близкие - твоя эмоциональная крепость.',
  leo: 'Тебе нужно чувствовать себя особенным. Комплименты - твое эмоциональное топливо!',
  virgo: 'Ты анализируешь свои чувства как детектив. Порядок вокруг = порядок внутри.',
  libra: 'Гармония в отношениях - твой эмоциональный баланс. Конфликты выбивают из колеи.',
  scorpio: 'Твои эмоции глубже Марианской впадины. Ты либо любишь, либо... очень любишь!',
  sagittarius: 'Свобода и приключения поднимают настроение. Рутина - твой эмоциональный криптонит.',
  capricorn: 'Ты контролируешь эмоции как босс. Но внутри ты мягкий зефир!',
  aquarius: 'Твои эмоции нестандартные и непредсказуемые. Ты эмоциональный инноватор!',
  pisces: 'Ты впитываешь эмоции как губка. Твоя интуиция работает на уровне телепатии!'
}

export default function NatalPage() {
  const { user } = useTelegram()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    timeUnknown: false
  })

  const [showResult, setShowResult] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartResult | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string>('')

  // Загрузка профиля из Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        // Получаем профиль из Supabase
        const profileData = await ProfileService.getProfileByTelegramId(user.id)
        
        if (profileData) {
          setProfile(profileData)
          
          // Если есть данные о рождении, заполняем форму
          if (profileData.birth_date) {
            setFormData({
              name: profileData.first_name || user.first_name || '',
              birthDate: profileData.birth_date,
              birthTime: profileData.birth_time || '',
              birthPlace: profileData.birth_place || '',
              timeUnknown: !profileData.birth_time,
              lat: undefined,
              lon: undefined
            })
          } else {
            // Заполняем только имя из Telegram
            setFormData(prev => ({
              ...prev,
              name: user.first_name || ''
            }))
          }
          
          // Если есть рассчитанная карта, показываем результат
          if (profileData.natal_chart) {
            const chart = Array.isArray(profileData.natal_chart) 
              ? profileData.natal_chart[0] 
              : profileData.natal_chart
            if (chart) {
              const chartData = NatalChartService.getParsedChartData(chart)
              if (chartData) {
                setChartData(chartData as ChartResult)
                setShowResult(true)
              }
            }
          }
        } else {
          // Создаем новый профиль
          const newProfile = await ProfileService.upsertProfile({
            telegram_id: user.id,
            username: user.username,
            first_name: user.first_name
          })
          
          if (newProfile) {
            setProfile(newProfile)
            setFormData(prev => ({
              ...prev,
              name: user.first_name || ''
            }))
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Не удалось загрузить профиль')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user])

  // Геокодинг для получения координат
  const geocodePlace = async (place: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(place)}`)
      if (!response.ok) return null
      
      const data = await response.json()
      if (data.lat && data.lon) {
        return { lat: data.lat, lon: data.lon }
      }
    } catch (err) {
      console.error('Geocoding error:', err)
    }
    return null
  }

  const handleCalculate = async () => {
    if (!formData.name || !formData.birthDate || !formData.birthPlace) {
      setError('Эй, друг! Заполни все поля, чтобы я смог рассказать о тебе! 🌟')
      return
    }

    setIsCalculating(true)
    setError('')
    
    try {
      // Получаем координаты места рождения
      let lat = formData.lat
      let lon = formData.lon
      
      if (!lat || !lon) {
        const coords = await geocodePlace(formData.birthPlace)
        if (coords) {
          lat = coords.lat
          lon = coords.lon
        } else {
          // Используем координаты Москвы по умолчанию
          lat = 55.7558
          lon = 37.6173
        }
      }

      // Сохраняем данные профиля
      if (profile) {
        await ProfileService.updateProfile(profile.id, {
          first_name: formData.name,
          birth_date: formData.birthDate,
          birth_time: formData.timeUnknown ? null : formData.birthTime,
          birth_place: formData.birthPlace
        })
      }

      // Вызываем API для расчета натальной карты
      const response = await fetch('/api/natal/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth: {
            year: parseInt(formData.birthDate.split('-')[0]),
            month: parseInt(formData.birthDate.split('-')[1]),
            day: parseInt(formData.birthDate.split('-')[2]),
            hour: formData.timeUnknown ? 12 : parseInt(formData.birthTime.split(':')[0] || '12'),
            minute: formData.timeUnknown ? 0 : parseInt(formData.birthTime.split(':')[1] || '0'),
            lat,
            lon,
            place: formData.birthPlace
          }
        })
      })

      if (!response.ok) {
        throw new Error('Ошибка при расчете карты')
      }

      const result = await response.json()
      setChartData(result)

      // Сохраняем результат в Supabase
      if (profile) {
        await NatalChartService.saveCalculation(profile.id, result)
      }

      setShowResult(true)
    } catch (err) {
      console.error('Error calculating chart:', err)
      setError('Упс! Что-то пошло не так. Попробуй еще раз! 🌟')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #0F0F1E 0%, #1A1A2E 100%)' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загружаю твои данные...</p>
        </div>
      </div>
    )
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

  if (showResult && chartData) {
    const sunSign = chartData.planets?.sun?.sign?.toLowerCase() || 'aries'
    const moonSign = chartData.planets?.moon?.sign?.toLowerCase() || 'aries'
    const sunTraits = FRIENDLY_TRAITS[sunSign as keyof typeof FRIENDLY_TRAITS] || FRIENDLY_TRAITS.aries
    const moonDesc = MOON_TRAITS[moonSign as keyof typeof MOON_TRAITS] || MOON_TRAITS.aries
    
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
                {sunTraits.emoji}
              </div>
            </div>

            <div className="space-y-4">
              <div className="astrot-message">
                <span className="astrot-message-emoji">{sunTraits.emoji}</span>
                <span className="text-xl font-bold text-white">{sunTraits.title}</span>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                {sunTraits.desc}
              </p>
            </div>
          </div>

          {/* Карточки с характеристиками */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🌙</span>
                <h3 className="text-lg font-bold text-white">Твой эмоциональный мир</h3>
              </div>
              <p className="text-gray-300">
                {moonDesc}
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Heart className="w-6 h-6 text-pink-400 mr-3" />
                <h3 className="text-lg font-bold text-white">В любви ты...</h3>
              </div>
              <p className="text-gray-300">
                {chartData.planets?.venus?.sign === 'Aries' || chartData.planets?.venus?.sign === 'Leo' || chartData.planets?.venus?.sign === 'Sagittarius' 
                  ? 'Страстный и импульсивный! Любовь для тебя - это приключение и фейерверк эмоций!'
                  : chartData.planets?.venus?.sign === 'Taurus' || chartData.planets?.venus?.sign === 'Virgo' || chartData.planets?.venus?.sign === 'Capricorn'
                  ? 'Надежный и преданный! Ты строишь отношения как крепость - основательно и навсегда.'
                  : chartData.planets?.venus?.sign === 'Gemini' || chartData.planets?.venus?.sign === 'Libra' || chartData.planets?.venus?.sign === 'Aquarius'
                  ? 'Легкий и общительный! Тебе нужен партнер-друг, с которым можно болтать до утра.'
                  : 'Глубокий и чувственный! Ты любишь всей душой и ждешь такой же отдачи.'}
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Твоя суперсила</h3>
              </div>
              <p className="text-gray-300">
                {chartData.planets?.mars?.sign === 'Aries' || chartData.planets?.mars?.sign === 'Scorpio'
                  ? 'Несгибаемая воля! Ты пробиваешь стены головой и не знаешь слова "невозможно".'
                  : chartData.planets?.mars?.sign === 'Taurus' || chartData.planets?.mars?.sign === 'Capricorn'
                  ? 'Железное терпение! Ты как скала - спокойный, но неудержимый в достижении целей.'
                  : chartData.planets?.mars?.sign === 'Gemini' || chartData.planets?.mars?.sign === 'Virgo'
                  ? 'Острый ум! Твой интеллект - твое главное оружие. Ты решаешь проблемы играючи.'
                  : 'Магнетизм! Люди тянутся к тебе как мотыльки к свету. Твоя энергия заразительна!'}
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Gift className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Твой талант</h3>
              </div>
              <p className="text-gray-300">
                {chartData.planets?.mercury?.sign === 'Air' 
                  ? 'Коммуникация на высшем уровне! Ты можешь продать снег эскимосам и подружиться с кем угодно.'
                  : chartData.planets?.mercury?.sign === 'Fire'
                  ? 'Вдохновлять других! Твой энтузиазм зажигает сердца и двигает горы.'
                  : chartData.planets?.mercury?.sign === 'Earth'
                  ? 'Превращать идеи в реальность! Ты мастер воплощения - от мечты до результата.'
                  : 'Чувствовать людей! Твоя интуиция и эмпатия помогают понимать других без слов.'}
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <Star className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Совет от звезд</h3>
              </div>
              <p className="text-gray-300">
                {chartData.houses?.[9]?.sign === 'Fire'
                  ? 'Следуй за своей страстью! Вселенная поддержит твои самые смелые начинания.'
                  : chartData.houses?.[9]?.sign === 'Earth'
                  ? 'Строй планы и действуй! Твоя практичность - ключ к успеху.'
                  : chartData.houses?.[9]?.sign === 'Air'
                  ? 'Учись и общайся! Знания и связи откроют тебе все двери.'
                  : 'Доверься интуиции! Твой внутренний голос знает правильный путь.'}
              </p>
            </div>

            <div className="astrot-card">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-lg font-bold text-white">Твоя миссия</h3>
              </div>
              <p className="text-gray-300">
                {chartData.houses?.[10]?.sign 
                  ? `Твое предназначение связано с ${
                    chartData.houses[10].sign.includes('Aries') || chartData.houses[10].sign.includes('Leo') 
                      ? 'лидерством и вдохновением других!'
                      : chartData.houses[10].sign.includes('Taurus') || chartData.houses[10].sign.includes('Virgo')
                      ? 'созданием чего-то ценного и долговечного!'
                      : chartData.houses[10].sign.includes('Gemini') || chartData.houses[10].sign.includes('Libra')
                      ? 'общением и объединением людей!'
                      : 'глубокой трансформацией себя и мира!'
                    }`
                  : 'Быть собой и светить другим своим примером!'}
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
                Твоя карта показывает, что у тебя есть все необходимое для счастливой и успешной жизни. 
                Главное - оставайся собой, доверяй своей интуиции и не бойся идти своим путем! 
                Звезды на твоей стороне! ✨
              </p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                setShowResult(false)
                setChartData(null)
              }}
              className="astrot-button flex-1"
            >
              <Sparkles className="w-5 h-5 mr-2 inline" />
              Обновить данные
            </button>
            <button 
              className="astrot-button flex-1" 
              style={{ background: 'var(--astrot-gradient-pink)' }}
              onClick={() => {
                // Можно добавить функцию шаринга в Telegram
                if (window.Telegram?.WebApp) {
                  window.Telegram.WebApp.showAlert('Твоя карта сохранена! 🌟')
                }
              }}
            >
              <Heart className="w-5 h-5 mr-2 inline" />
              Поделиться
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
        <div className="astrot-message mb-6">
          <span className="astrot-message-emoji">👋</span>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Привет{user?.first_name ? `, ${user.first_name}` : ', друг'}!
            </h2>
            <p className="text-gray-300">
              Я ASTROT - твой космический приятель! Расскажи мне о себе, и я покажу, 
              какие классные штуки написаны в звездах специально для тебя! 🌟
            </p>
          </div>
        </div>

        {/* Показываем ошибки */}
        {error && (
          <div className="astrot-message mb-6" style={{ borderColor: '#EF4444' }}>
            <span className="astrot-message-emoji">⚠️</span>
            <p className="text-red-400">{error}</p>
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
              disabled={isCalculating}
            >
              <Sparkles className="w-6 h-6 mr-2 inline" />
              Узнать мою космическую историю!
            </button>

            {/* Подсказка */}
            <div className="text-center text-sm text-gray-500">
              <p>🔒 Твои данные в полной безопасности</p>
              <p>Мы сохраняем их в защищенной базе Supabase</p>
            </div>
          </div>
        </div>

        {/* Забавные факты */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <div className="text-3xl mb-2">🌟</div>
            <div className="text-sm text-gray-400">Точность расчетов</div>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-sm text-gray-400">Swiss Ephemeris</div>
          </div>
          <div className="text-center p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
            <div className="text-3xl mb-2">💫</div>
            <div className="text-sm text-gray-400">База данных</div>
            <div className="text-2xl font-bold text-white">Supabase</div>
            <div className="text-sm text-gray-400">Надежно и быстро</div>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="text-3xl mb-2">🔮</div>
            <div className="text-sm text-gray-400">Интеграция</div>
            <div className="text-2xl font-bold text-white">Telegram</div>
            <div className="text-sm text-gray-400">Web App SDK</div>
          </div>
        </div>
      </div>
    </div>
  )
}