'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Calendar, Clock, Settings, ChevronRight, Sparkles, Star } from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  birthDate: string
  zodiacSign: string
  notifications: boolean
  darkMode: boolean
  language: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    birthDate: '',
    zodiacSign: '',
    notifications: true,
    darkMode: false,
    language: 'ru'
  })

  const [editMode, setEditMode] = useState(false)

  // Загружаем данные профиля при монтировании
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    const natalData = localStorage.getItem('natalFormData')
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (natalData) {
      const natal = JSON.parse(natalData)
      setProfile(prev => ({
        ...prev,
        name: natal.name || '',
        birthDate: natal.birthDate || ''
      }))
    }
  }, [])

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    setEditMode(false)
  }

  const handleToggle = (field: 'notifications' | 'darkMode') => {
    const newProfile = { ...profile, [field]: !profile[field] }
    setProfile(newProfile)
    localStorage.setItem('userProfile', JSON.stringify(newProfile))
  }

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      localStorage.clear()
      window.location.href = '/home'
    }
  }

  const stats = [
    { icon: '🌟', label: 'Дней с нами', value: '42' },
    { icon: '🔮', label: 'Карт построено', value: '7' },
    { icon: '💫', label: 'Уровень', value: 'Звездочёт' }
  ]

  const menuItems = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Уведомления',
      description: 'Получать прогнозы',
      toggle: true,
      field: 'notifications' as const,
      color: 'text-purple-500'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Тёмная тема',
      description: 'Ночной режим',
      toggle: true,
      field: 'darkMode' as const,
      color: 'text-blue-500'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Язык',
      description: 'Русский',
      arrow: true,
      color: 'text-green-500'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Конфиденциальность',
      description: 'Настройки приватности',
      arrow: true,
      color: 'text-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-32">
      <div className="max-w-screen-md mx-auto px-4 pt-6">
        
        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Профиль
          </h1>
          <p className="text-gray-600 font-medium">
            ⚙️ Твои настройки ⚙️
          </p>
        </div>

        {/* Карточка профиля */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.name ? profile.name[0].toUpperCase() : '👤'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profile.name || 'Космический путешественник'}
                </h2>
                <p className="text-sm text-gray-500">
                  {profile.zodiacSign || 'Знак зодиака не указан'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 bg-purple-100 rounded-xl hover:bg-purple-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {/* Форма редактирования */}
          {editMode && (
            <div className="space-y-3 mb-4 p-4 bg-purple-50 rounded-2xl">
              <input
                type="text"
                placeholder="Имя"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-2 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-2 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Настройки */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Настройки
          </h3>
          
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                
                {item.toggle && item.field && (
                  <button
                    onClick={() => handleToggle(item.field)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${profile[item.field] ? 'bg-purple-500' : 'bg-gray-300'}
                    `}
                  >
                    <div className={`
                      absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                      ${profile[item.field] ? 'translate-x-6' : 'translate-x-1'}
                    `} />
                  </button>
                )}
                
                {item.arrow && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Премиум блок */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 rounded-3xl blur-lg opacity-60" />
          <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Премиум</h3>
                </div>
                <p className="text-sm text-white/90">
                  Разблокируй все функции и получи доступ к эксклюзивным прогнозам
                </p>
              </div>
              <button className="px-4 py-2 bg-white text-orange-500 rounded-xl font-bold hover:shadow-lg transition-shadow">
                Узнать
              </button>
            </div>
          </div>
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={handleLogout}
          className="w-full p-4 bg-red-50 rounded-2xl flex items-center justify-center gap-2 text-red-600 font-medium hover:bg-red-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Выйти из аккаунта
        </button>

        {/* Версия приложения */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Astrot v1.0.0 • Made with 💜
          </p>
        </div>

      </div>
    </div>
  )
}