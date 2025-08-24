'use client'

import { useEffect } from 'react'

/**
 * Компонент инициализации Telegram WebApp с полной защитой от системных жестов
 * и правильной настройкой safe area
 */
export default function SafeAreaInit() {
  useEffect(() => {
    // Получаем объект Telegram WebApp
    const tg = (window as any)?.Telegram?.WebApp
    
    if (tg) {
      // Инициализация WebApp
      tg.ready?.()
      
      // Разворачиваем на весь экран
      tg.expand?.()
      
      // Отключаем вертикальные свайпы (закрытие приложения)
      tg.disableVerticalSwipes?.()
      
      // Отключаем подтверждение закрытия
      tg.disableClosingConfirmation?.()
      
      // Устанавливаем цвета для системных элементов
      tg.setHeaderColor?.('#1e1f36')
      tg.setBackgroundColor?.('#1e1f36')
    }
    
    // Настройка стилей для предотвращения системных жестов
    const html = document.documentElement
    const body = document.body
    
    // Предотвращаем pull-to-refresh и bounce эффекты
    html.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
    
    // Блокируем выделение текста для предотвращения случайных действий
    html.style.userSelect = 'none'
    html.style.webkitUserSelect = 'none'
    
    // Настройка touch-action для предотвращения зума и других жестов
    html.style.touchAction = 'pan-y'
    body.style.touchAction = 'pan-y'
    
    // Отключаем контекстное меню на долгое нажатие
    ;(html.style as any).webkitTouchCallout = 'none'
    
    // Настройка CSS переменных для safe area
    const setSafeAreaVars = () => {
      // Верхний отступ с учетом safe area
      const topInset = 'calc(env(safe-area-inset-top) + 6px)'
      const bottomInset = 'env(safe-area-inset-bottom)'
      
      html.style.setProperty('--safe-area-top', topInset)
      html.style.setProperty('--safe-area-bottom', bottomInset)
      html.style.setProperty('--topbar-offset', 'calc(env(safe-area-inset-top) + 6px + 56px)')
      html.style.setProperty('--bottomnav-height', 'calc(64px + env(safe-area-inset-bottom))')
    }
    
    setSafeAreaVars()
    
    // Обработчик изменения viewport
    const handleViewportChange = () => {
      setSafeAreaVars()
      
      // Принудительный reflow для применения изменений
      void document.body.offsetHeight
    }
    
    // Слушаем изменения размера окна
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('orientationchange', handleViewportChange)
    
    // Предотвращаем случайное закрытие через history back
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href)
    }
    
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', preventBack)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('orientationchange', handleViewportChange)
      window.removeEventListener('popstate', preventBack)
      
      // Восстанавливаем стандартные стили
      html.style.overscrollBehavior = ''
      body.style.overscrollBehavior = ''
      html.style.userSelect = ''
      html.style.webkitUserSelect = ''
      html.style.touchAction = ''
      body.style.touchAction = ''
      ;(html.style as any).webkitTouchCallout = ''
    }
  }, [])
  
  return null
}