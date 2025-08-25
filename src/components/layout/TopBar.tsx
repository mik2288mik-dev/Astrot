'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { appBar, iconButton, label } from '@/ui/variants'
import SettingsIcon from '@/ui/icons/settings.svg'

export default function TopBar() {
  const [userData, setUserData] = useState<{
    firstName?: string
    lastName?: string
    username?: string
    photoUrl?: string
  }>({})

  useEffect(() => {
    // Получаем данные пользователя из Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      const user = tg.initDataUnsafe?.user
      
      if (user) {
        setUserData({
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          photoUrl: user.photo_url
        })
      }
    }
  }, [])

  const displayName = userData.firstName 
    ? `${userData.firstName}${userData.lastName ? ' ' + userData.lastName : ''}`
    : userData.username 
    ? `@${userData.username}`
    : 'User'

  return (
    <div
      className={appBar({ variant: 'top' }) + ' h-[56px] flex items-center px-4 gap-3 motion-safe:animate-fade-up'}
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}
    >
      {/* Аватар пользователя */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/90 shrink-0">
        {userData.photoUrl ? (
          <Image 
            src={userData.photoUrl} 
            alt="Avatar" 
            width={40} 
            height={40}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accentFrom to-accentTo flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Имя пользователя */}
      <div className="flex-1 min-w-0">
        <p className={label({ size: 'md', weight: 'semibold' }) + ' truncate'}>
          {displayName}
        </p>
      </div>

      {/* Кнопка настроек */}
      <button
        className={iconButton({ size: 36 })}
        onClick={() => console.log('Settings clicked')}
        aria-label="Settings"
      >
        <SettingsIcon width={24} height={24} />
      </button>
    </div>
  )
}