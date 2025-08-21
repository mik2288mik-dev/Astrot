// Design tokens for Astrot navigation - Premium Minimalist Style
export const navTokens = {
  colors: {
    // Градиенты для иконок
    gradient: {
      home: 'linear-gradient(135deg, #A07CFF 0%, #FFD6EC 100%)',
      center: 'linear-gradient(135deg, #FFB3FF 0%, #A07CFF 100%)',
      more: 'linear-gradient(135deg, #A0E3FF 0%, #A07CFF 100%)',
      active: 'linear-gradient(135deg, #A07CFF 0%, #FFD6EC 100%)',
    },
    // Цвета текста
    text: {
      default: '#444444',
      inactive: 'rgba(68, 68, 68, 0.7)',
    },
    // Центральная кнопка
    centerButton: {
      glow: 'rgba(160, 124, 255, 0.3)',
      shadow: 'rgba(160, 124, 255, 0.2)',
      innerShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3)',
    },
    // Фон навигации
    navBg: 'rgba(255, 255, 255, 0.98)',
    navBorder: 'rgba(160, 124, 255, 0.08)',
  },
  spacing: {
    navHeight: '72px',
    iconSize: '24px',
    centerButtonSize: '56px', // 1.3x от обычной кнопки
    safeAreaBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  typography: {
    fontSize: '13px',
    fontWeight: '600', // semi-bold
    fontFamily: 'Inter, SF Pro Display, system-ui, -apple-system, sans-serif',
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    glow: 'glow 3s ease-in-out infinite',
  },
  shadows: {
    nav: '0 -2px 20px rgba(160, 124, 255, 0.05)',
    centerButton: '0 4px 24px rgba(160, 124, 255, 0.25)',
    centerButtonHover: '0 6px 32px rgba(160, 124, 255, 0.35)',
    soft: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  borderRadius: {
    nav: '24px 24px 0 0',
    centerButton: '20px',
    button: '12px',
  },
} as const;

export type NavTokens = typeof navTokens;