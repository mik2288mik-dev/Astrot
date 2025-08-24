'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void
        expand?: () => void
        disableVerticalSwipes?: () => void
        disableClosingConfirmation?: () => void
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
            language_code?: string
            photo_url?: string
          }
        }
      }
    }
  }
}

export default function SafeAreaInit() {
  useEffect(() => {
    // Инициализация Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      
      // Готовность приложения
      tg.ready?.()
      
      // Разворачиваем на весь экран
      tg.expand?.()
      
      // Отключаем вертикальные свайпы для закрытия
      tg.disableVerticalSwipes?.()
      
      // Отключаем подтверждение закрытия
      tg.disableClosingConfirmation?.()
    }
    
    // Отключаем overscroll behavior для предотвращения bounce эффекта
    if (typeof document !== 'undefined') {
      document.documentElement.style.overscrollBehavior = 'none'
      document.body.style.overscrollBehavior = 'none'
      
      // Добавляем CSS переменные для safe area
      const updateViewportHeight = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }
      
      updateViewportHeight()
      window.addEventListener('resize', updateViewportHeight)
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', updateViewportHeight)
      }
    }
  }, [])
  
  // Добавляем глобальные стили для анимаций
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Плавные переходы для кнопок */
      button {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      /* Предотвращаем выделение текста при тапе */
      * {
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Фикс для iOS Safari */
      body {
        position: fixed;
        width: 100%;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
        overflow: hidden;
      }
      
      /* Основной контейнер приложения */
      #__next {
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return null
}