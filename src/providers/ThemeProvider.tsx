'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import themeData from '@/lib/ui/theme.json';

export interface Theme {
  id: string;
  title: string;
  dates: Array<{
    start: string; // MM-DD format
    end: string;   // MM-DD format
  }>;
  priority: number;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    gradient: string;
  };
  decor: {
    emoji: string;
    particles: string[];
    animation: string;
  };
}

interface ThemeContextType {
  currentTheme: Theme;
  isThemeEnabled: boolean;
  toggleTheme: () => void;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getDefaultTheme());
  const [isThemeEnabled, setIsThemeEnabled] = useState(true);
  const [availableThemes] = useState<Theme[]>(themeData.themes as Theme[]);

  useEffect(() => {
    // Загружаем настройки из localStorage
    const savedEnabled = localStorage.getItem('theme_enabled');
    const savedThemeId = localStorage.getItem('current_theme');
    
    if (savedEnabled !== null) {
      setIsThemeEnabled(savedEnabled === 'true');
    }

    // Определяем актуальную тему
    const activeTheme = isThemeEnabled 
      ? (savedThemeId ? findThemeById(savedThemeId) || getDefaultTheme() : getActiveTheme())
      : getDefaultTheme();
    
    setCurrentTheme(activeTheme);
    applyThemeToDOM(activeTheme);
  }, [isThemeEnabled]);

  useEffect(() => {
    // Автоматическое обновление темы каждые 10 минут
    const interval = setInterval(() => {
      if (isThemeEnabled) {
        const newTheme = getActiveTheme();
        if (newTheme.id !== currentTheme.id) {
          setCurrentTheme(newTheme);
          applyThemeToDOM(newTheme);
        }
      }
    }, 10 * 60 * 1000); // 10 минут

    return () => clearInterval(interval);
  }, [currentTheme.id, isThemeEnabled]);

  const toggleTheme = () => {
    const newEnabled = !isThemeEnabled;
    setIsThemeEnabled(newEnabled);
    localStorage.setItem('theme_enabled', newEnabled.toString());
    
    const newTheme = newEnabled ? getActiveTheme() : getDefaultTheme();
    setCurrentTheme(newTheme);
    applyThemeToDOM(newTheme);
  };

  const setTheme = (themeId: string) => {
    const theme = findThemeById(themeId) || getDefaultTheme();
    setCurrentTheme(theme);
    applyThemeToDOM(theme);
    localStorage.setItem('current_theme', themeId);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        isThemeEnabled,
        toggleTheme,
        availableThemes,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function getDefaultTheme(): Theme {
  return themeData.themes.find(theme => theme.id === 'default') as Theme;
}

function findThemeById(id: string): Theme | null {
  return themeData.themes.find(theme => theme.id === id) as Theme || null;
}

function getActiveTheme(): Theme {
  const now = new Date();
  const currentDate = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // Находим все подходящие темы
  const matchingThemes = themeData.themes.filter(theme => {
    if (theme.dates.length === 0) return false; // Исключаем дефолтную тему
    
    return theme.dates.some(dateRange => {
      return isDateInRange(currentDate, dateRange.start, dateRange.end);
    });
  }) as Theme[];
  
  // Сортируем по приоритету (больше = важнее)
  matchingThemes.sort((a, b) => b.priority - a.priority);
  
  // Возвращаем тему с наивысшим приоритетом или дефолтную
  return matchingThemes[0] || getDefaultTheme();
}

function isDateInRange(currentDate: string, startDate: string, endDate: string): boolean {
  // Конвертируем даты в числа для сравнения
  const current = dateToNumber(currentDate);
  const start = dateToNumber(startDate);
  const end = dateToNumber(endDate);
  
  // Обрабатываем переход через новый год
  if (start > end) {
    // Диапазон пересекает новый год (например, 12-25 до 01-07)
    return current >= start || current <= end;
  } else {
    // Обычный диапазон
    return current >= start && current <= end;
  }
}

function dateToNumber(dateStr: string): number {
  const [month, day] = dateStr.split('-').map(Number);
  return month * 100 + day;
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  
  // Применяем CSS переменные
  root.style.setProperty('--theme-primary', theme.palette.primary);
  root.style.setProperty('--theme-secondary', theme.palette.secondary);
  root.style.setProperty('--theme-accent', theme.palette.accent);
  root.style.setProperty('--theme-background', theme.palette.background);
  root.style.setProperty('--theme-card', theme.palette.card);
  root.style.setProperty('--theme-gradient', theme.palette.gradient);
  
  // Обновляем базовые переменные для совместимости
  root.style.setProperty('--accent-primary', theme.palette.primary);
  root.style.setProperty('--accent-secondary', theme.palette.secondary);
  root.style.setProperty('--accent-gradient', theme.palette.gradient);
  root.style.setProperty('--bg-primary', theme.palette.background);
  root.style.setProperty('--bg-card', theme.palette.card);
  
  // Добавляем класс для анимаций
  document.body.setAttribute('data-theme', theme.id);
  document.body.setAttribute('data-theme-animation', theme.decor.animation);
}