'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { astrotColors } from '../../styles/colors'

interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

/**
 * TopBar компонент для Telegram WebApp
 * Высота: 56px + отступ сверху calc(env(safe-area-inset-top) + 8px)
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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
      }}
    >
      <div className="mx-auto max-w-screen-md px-4">
        <div 
          className="h-14 rounded-[20px] flex items-center justify-between px-4"
          style={{
            background: astrotColors.background.card,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: astrotColors.shadows.medium,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Левая часть: Аватар и имя */}
          <div className="flex items-center gap-3">
            {/* Аватар */}
            <div 
              className="relative w-10 h-10 rounded-full overflow-hidden"
              style={{
                background: astrotColors.gradients.accent,
                boxShadow: astrotColors.shadows.soft,
              }}
            >
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
                <div className="w-full h-full flex items-center justify-center text-white font-manrope font-semibold text-base">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Имя пользователя */}
            <div className="flex flex-col">
              <span 
                className="font-manrope font-semibold text-sm leading-tight"
                style={{ color: astrotColors.neutral.dark }}
              >
                {displayName}
              </span>
              {user?.username && user?.first_name && (
                <span 
                  className="font-manrope text-xs leading-tight"
                  style={{ color: astrotColors.neutral.gray }}
                >
                  @{user.username}
                </span>
              )}
            </div>
          </div>

          {/* Правая часть: Кнопка меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{
              background: isMenuOpen 
                ? astrotColors.gradients.accent 
                : 'rgba(255, 255, 255, 0.5)',
              boxShadow: isMenuOpen 
                ? astrotColors.shadows.soft 
                : 'none',
            }}
            aria-label="Открыть меню"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              className="transition-colors duration-200"
              style={{
                color: isMenuOpen 
                  ? astrotColors.neutral.white 
                  : astrotColors.neutral.dark
              }}
            >
              <path 
                d="M3 5h14M3 10h14M3 15h14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}