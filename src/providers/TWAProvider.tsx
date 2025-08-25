'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useTWA } from '@/lib/twa'

interface TWAContextType {
  isReady: boolean
  isExpanded: boolean
  colorScheme: 'light' | 'dark'
}

const TWAContext = createContext<TWAContextType>({
  isReady: false,
  isExpanded: false,
  colorScheme: 'light',
})

export function TWAProvider({ children }: { children: ReactNode }) {
  const { isReady, isExpanded, colorScheme, theme } = useTWA()
  
  useEffect(() => {
    // Apply TWA theme to document
    if (theme) {
      const root = document.documentElement
      
      // Apply theme colors as CSS variables
      root.style.setProperty('--tg-bg-color', theme.bgColor)
      root.style.setProperty('--tg-text-color', theme.textColor)
      root.style.setProperty('--tg-hint-color', theme.hintColor)
      root.style.setProperty('--tg-link-color', theme.linkColor)
      root.style.setProperty('--tg-button-color', theme.buttonColor)
      root.style.setProperty('--tg-button-text-color', theme.buttonTextColor)
      root.style.setProperty('--tg-secondary-bg-color', theme.secondaryBgColor)
      
      // Apply color scheme
      root.setAttribute('data-theme', colorScheme)
    }
  }, [theme, colorScheme])
  
  return (
    <TWAContext.Provider value={{ isReady, isExpanded, colorScheme }}>
      {children}
    </TWAContext.Provider>
  )
}

export function useTWAContext() {
  return useContext(TWAContext)
}