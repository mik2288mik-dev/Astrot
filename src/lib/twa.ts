import { useEffect, useState, useCallback } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive?: boolean) => void
          hideProgress: () => void
          setParams: (params: {
            text?: string
            color?: string
            text_color?: string
            is_active?: boolean
            is_visible?: boolean
          }) => void
        }
        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        showPopup: (params: {
          title?: string
          message: string
          buttons?: Array<{
            id?: string
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
            text?: string
          }>
        }, callback?: (buttonId: string) => void) => void
        showAlert: (message: string, callback?: () => void) => void
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
        enableClosingConfirmation: () => void
        disableClosingConfirmation: () => void
        onEvent: (eventType: string, callback: () => void) => void
        offEvent: (eventType: string, callback: () => void) => void
        sendData: (data: string) => void
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void
        openTelegramLink: (url: string) => void
        openInvoice: (url: string, callback?: (status: string) => void) => void
        initDataUnsafe: {
          query_id?: string
          user?: {
            id: number
            is_bot?: boolean
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
            photo_url?: string
          }
          receiver?: {
            id: number
            is_bot?: boolean
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
            photo_url?: string
          }
          chat?: {
            id: number
            type: string
            title?: string
            username?: string
            photo_url?: string
          }
          chat_type?: string
          chat_instance?: string
          start_param?: string
          can_send_after?: number
          auth_date: number
          hash: string
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
          secondary_bg_color?: string
          header_bg_color?: string
          accent_text_color?: string
          section_bg_color?: string
          section_header_text_color?: string
          subtitle_text_color?: string
          destructive_text_color?: string
        }
        colorScheme: 'light' | 'dark'
        viewportHeight: number
        viewportStableHeight: number
        isExpanded: boolean
        headerColor: string
        backgroundColor: string
        platform: string
        version: string
        isVersionAtLeast: (version: string) => boolean
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
        requestWriteAccess: (callback?: (granted: boolean) => void) => void
        requestContact: (callback?: (shared: boolean) => void) => void
        invokeCustomMethod: (method: string, params?: any, callback?: (result: any) => void) => void
      }
    }
  }
}

export interface TWATheme {
  bgColor: string
  textColor: string
  hintColor: string
  linkColor: string
  buttonColor: string
  buttonTextColor: string
  secondaryBgColor: string
  headerBgColor: string
  accentTextColor: string
  sectionBgColor: string
  sectionHeaderTextColor: string
  subtitleTextColor: string
  destructiveTextColor: string
}

export interface TWAUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  languageCode?: string
  isPremium?: boolean
  photoUrl?: string
}

export function useTWA() {
  const [isReady, setIsReady] = useState(false)
  const [theme, setTheme] = useState<TWATheme | null>(null)
  const [user, setUser] = useState<TWAUser | null>(null)
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tg = window.Telegram?.WebApp
    if (!tg) {
      console.warn('Telegram WebApp is not available')
      return
    }

    // Initialize TWA
    tg.ready()
    tg.expand()
    setIsReady(true)

    // Set initial theme
    const themeParams = tg.themeParams
    if (themeParams) {
      setTheme({
        bgColor: themeParams.bg_color || '#ffffff',
        textColor: themeParams.text_color || '#000000',
        hintColor: themeParams.hint_color || '#999999',
        linkColor: themeParams.link_color || '#0088cc',
        buttonColor: themeParams.button_color || '#0088cc',
        buttonTextColor: themeParams.button_text_color || '#ffffff',
        secondaryBgColor: themeParams.secondary_bg_color || '#f0f0f0',
        headerBgColor: themeParams.header_bg_color || '#ffffff',
        accentTextColor: themeParams.accent_text_color || '#0088cc',
        sectionBgColor: themeParams.section_bg_color || '#ffffff',
        sectionHeaderTextColor: themeParams.section_header_text_color || '#000000',
        subtitleTextColor: themeParams.subtitle_text_color || '#999999',
        destructiveTextColor: themeParams.destructive_text_color || '#ff0000',
      })

      // Apply theme to CSS variables
      const root = document.documentElement
      root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff')
      root.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000')
      root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color || '#999999')
      root.style.setProperty('--tg-theme-link-color', themeParams.link_color || '#0088cc')
      root.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#0088cc')
      root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff')
      root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color || '#f0f0f0')
    }

    // Set user data
    const userData = tg.initDataUnsafe?.user
    if (userData) {
      setUser({
        id: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        languageCode: userData.language_code,
        isPremium: userData.is_premium,
        photoUrl: userData.photo_url,
      })
    }

    // Set other properties
    setColorScheme(tg.colorScheme)
    setViewportHeight(tg.viewportHeight)
    setIsExpanded(tg.isExpanded)

    // Listen to theme changes
    const handleThemeChange = () => {
      setColorScheme(tg.colorScheme)
      // Re-apply theme if changed
      const newThemeParams = tg.themeParams
      if (newThemeParams) {
        const root = document.documentElement
        root.style.setProperty('--tg-theme-bg-color', newThemeParams.bg_color || '#ffffff')
        root.style.setProperty('--tg-theme-text-color', newThemeParams.text_color || '#000000')
        root.style.setProperty('--tg-theme-hint-color', newThemeParams.hint_color || '#999999')
        root.style.setProperty('--tg-theme-link-color', newThemeParams.link_color || '#0088cc')
        root.style.setProperty('--tg-theme-button-color', newThemeParams.button_color || '#0088cc')
        root.style.setProperty('--tg-theme-button-text-color', newThemeParams.button_text_color || '#ffffff')
        root.style.setProperty('--tg-theme-secondary-bg-color', newThemeParams.secondary_bg_color || '#f0f0f0')
      }
    }

    const handleViewportChange = () => {
      setViewportHeight(tg.viewportHeight)
      setIsExpanded(tg.isExpanded)
    }

    tg.onEvent('themeChanged', handleThemeChange)
    tg.onEvent('viewportChanged', handleViewportChange)

    return () => {
      tg.offEvent('themeChanged', handleThemeChange)
      tg.offEvent('viewportChanged', handleViewportChange)
    }
  }, [])

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.MainButton.setParams({
      text,
      is_visible: true,
      is_active: true,
    })
    tg.MainButton.onClick(onClick)
    tg.MainButton.show()
  }, [])

  const hideMainButton = useCallback(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.MainButton.hide()
  }, [])

  const showBackButton = useCallback((onClick: () => void) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.BackButton.onClick(onClick)
    tg.BackButton.show()
  }, [])

  const hideBackButton = useCallback(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.BackButton.hide()
  }, [])

  const showPopup = useCallback((message: string, title?: string) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.showPopup({
      title,
      message,
    })
  }, [])

  const showAlert = useCallback((message: string) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.showAlert(message)
  }, [])

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = window.Telegram?.WebApp
      if (!tg) {
        resolve(false)
        return
      }

      tg.showConfirm(message, (confirmed) => {
        resolve(confirmed)
      })
    })
  }, [])

  const hapticFeedback = useCallback((type: 'impact' | 'notification' | 'selection', style?: string) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    if (type === 'impact') {
      tg.HapticFeedback.impactOccurred((style as any) || 'medium')
    } else if (type === 'notification') {
      tg.HapticFeedback.notificationOccurred((style as any) || 'success')
    } else if (type === 'selection') {
      tg.HapticFeedback.selectionChanged()
    }
  }, [])

  const openLink = useCallback((url: string) => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.openLink(url)
  }, [])

  const close = useCallback(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.close()
  }, [])

  return {
    isReady,
    theme,
    user,
    colorScheme,
    viewportHeight,
    isExpanded,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showPopup,
    showAlert,
    showConfirm,
    hapticFeedback,
    openLink,
    close,
    webApp: typeof window !== 'undefined' ? window.Telegram?.WebApp : null,
  }
}