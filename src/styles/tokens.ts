// Design tokens for Astrot navigation
export const navTokens = {
  colors: {
    // Пастельные градиенты для фона
    gradient: {
      primary: 'linear-gradient(135deg, #F3E8FF 0%, #FFE5EC 50%, #E3F2FF 100%)',
      secondary: 'linear-gradient(135deg, #E8E3FF 0%, #FFE5EC 100%)',
      glow: 'linear-gradient(135deg, #D8B4FE 0%, #F9A8D4 50%, #93C5FD 100%)',
    },
    // Цвета для элементов
    icon: {
      default: '#9CA3AF', // neutral-400
      active: '#8B5CF6', // violet-500
      hover: '#7C3AED', // violet-600
    },
    text: {
      default: '#6B7280', // gray-500
      active: '#7C3AED', // violet-600
    },
    // Центральная кнопка
    centerButton: {
      bg: 'linear-gradient(135deg, #C084FC 0%, #F472B6 50%, #60A5FA 100%)',
      shadow: 'rgba(196, 132, 252, 0.4)',
      glow: 'rgba(196, 132, 252, 0.6)',
    },
    // Фон навигации
    navBg: 'rgba(255, 255, 255, 0.95)',
    navBorder: 'rgba(229, 231, 235, 0.3)',
  },
  spacing: {
    navHeight: '68px',
    iconSize: '24px',
    centerButtonSize: '56px',
    safeAreaBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    glow: 'glow 2s ease-in-out infinite',
    tap: 'scale 0.15s ease-out',
  },
  shadows: {
    nav: '0 -4px 20px rgba(0, 0, 0, 0.03)',
    centerButton: '0 4px 20px rgba(196, 132, 252, 0.3)',
    centerButtonHover: '0 6px 30px rgba(196, 132, 252, 0.4)',
  },
  borderRadius: {
    nav: '20px 20px 0 0',
    centerButton: '18px',
  },
} as const;

export type NavTokens = typeof navTokens;