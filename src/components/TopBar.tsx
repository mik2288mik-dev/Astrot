'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'

interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

/**
 * TopBar компонент в стиле Boinkers
 * Высота: 56px + safe-area-inset-top + 6px
 * Темная консоль с четкими границами
 */
export default function TopBar() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Получаем данные пользователя из Telegram WebApp
    const getTelegramUser = () => {
      try {
        const tg = window?.Telegram?.WebApp
        const userData = tg?.initDataUnsafe?.user as TelegramUser | undefined
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error getting Telegram user:', error)
      }
    }

    // Пробуем получить данные сразу и через небольшую задержку
    getTelegramUser()
    const timer = setTimeout(getTelegramUser, 500)

    return () => clearTimeout(timer)
  }, [])

  // Формируем отображаемое имя
  const displayName = user?.first_name || user?.username || 'Гость'
  const avatarUrl = user?.photo_url

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-surfaceDark shadow-inner-bar"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6px)',
      }}
    >
      <div className="h-14 flex items-center justify-between px-4">
        {/* Левая часть: Аватар и имя */}
        <div className="flex items-center gap-3">
          {/* Аватар с белой рамкой */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
            {avatarUrl ? (
              <Image 
                src={avatarUrl} 
                alt="Avatar" 
                fill 
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accentAstrotFrom to-accentAstrotTo flex items-center justify-center">
                <span className="text-white font-manrope font-semibold text-base">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Имя пользователя */}
          <div className="flex flex-col">
            <span className="font-manrope font-semibold text-[15px] leading-tight text-white">
              {displayName}
            </span>
            {user?.username && user?.first_name && (
              <span className="font-manrope text-xs leading-tight text-white/60">
                @{user.username}
              </span>
            )}
          </div>
        </div>

        {/* Правая часть: Кнопка меню */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 active:scale-95 hover:bg-white/10"
          aria-label="Открыть меню"
        >
          <Menu 
            size={22}
            strokeWidth={2.5}
            className="text-white"
          />
        </button>
      </div>
    </header>
  )
}