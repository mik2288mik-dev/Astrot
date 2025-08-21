// Design tokens for Cartoon/Doodle style bottom bar
export const cartoonTokens = {
  colors: {
    // Яркие мультяшные цвета
    primary: {
      purple: '#9333EA', // Яркий фиолетовый
      pink: '#EC4899', // Яркий розовый
      blue: '#3B82F6', // Яркий голубой
      cyan: '#06B6D4', // Бирюзовый
      yellow: '#FCD34D', // Желтый
    },
    // Градиенты для кнопок
    gradients: {
      home: 'linear-gradient(135deg, #EC4899 0%, #9333EA 100%)',
      center: 'linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #3B82F6 100%)',
      more: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      barBg: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
    },
    // Обводки
    stroke: {
      white: '#FFFFFF',
      thickness: '4px',
    },
    // Тени
    shadows: {
      button: '0 4px 0 rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)',
      buttonActive: '0 2px 0 rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
      bar: '0 -4px 20px rgba(0, 0, 0, 0.1), 0 -2px 10px rgba(147, 51, 234, 0.1)',
      glow: '0 0 30px rgba(236, 72, 153, 0.4), 0 0 60px rgba(147, 51, 234, 0.2)',
      sticker: '2px 2px 0 rgba(0, 0, 0, 0.1)',
    },
    // Фоны
    bg: {
      bar: '#FFF7ED', // Светлый кремовый
      barStroke: '#9333EA', // Фиолетовая обводка
    },
  },
  spacing: {
    navHeight: '88px',
    centerButtonSize: '72px',
    sideButtonSize: '56px',
    barPadding: '12px',
    safeAreaBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  typography: {
    fontFamily: "'Comic Neue', 'Baloo 2', 'Fredoka', cursive",
    fontSize: {
      label: '14px',
      centerLabel: '16px',
    },
    fontWeight: 'bold',
  },
  animation: {
    bounce: 'bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    wobble: 'wobble 0.8s ease-in-out infinite',
    pulse: 'cartoonPulse 1.5s ease-in-out infinite',
    tap: 'cartoonTap 0.2s ease-out',
    float: 'float 3s ease-in-out infinite',
  },
  borderRadius: {
    bar: '32px 32px 0 0',
    button: '24px',
    centerButton: '28px',
  },
} as const;

export type CartoonTokens = typeof cartoonTokens;