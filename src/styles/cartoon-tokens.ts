// Design tokens for Premium Cartoon style - УЮТНЫЙ МУЛЬТЯШНЫЙ СТИЛЬ
export const cartoonTokens = {
  colors: {
    // Мягкие яркие пастельные цвета - премиум мультяшный стиль
    primary: {
      purple: '#A07CFF', // Мягкий фиолетовый
      pink: '#FFB3FF', // Нежный розовый
      blue: '#A0E3FF', // Небесно-голубой
      peach: '#FEE3B2', // Персиковый
      mint: '#B2FFE3', // Мятный
      lavender: '#E3D0FF', // Лавандовый
      coral: '#FFD0C3', // Коралловый
      yellow: '#FFF3B2', // Солнечный кремовый
    },
    // Премиум градиенты - мягкие и уютные
    gradients: {
      home: 'linear-gradient(135deg, #FFB3FF 0%, #E3D0FF 100%)',
      center: 'radial-gradient(circle at 30% 30%, #A07CFF 0%, #A0E3FF 50%, #E3D0FF 100%)',
      more: 'linear-gradient(135deg, #A0E3FF 0%, #B2FFE3 100%)',
      barBg: 'linear-gradient(180deg, #FFFFFF 0%, #F8F5FF 50%, #FFF8F3 100%)',
      glow: 'radial-gradient(circle, rgba(160, 124, 255, 0.3) 0%, rgba(160, 227, 255, 0.2) 50%, transparent 100%)',
      shine: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      soft: 'linear-gradient(135deg, #FFB3FF 0%, #A0E3FF 33%, #FEE3B2 66%, #B2FFE3 100%)',
    },
    // Чёткие мультяшные обводки
    stroke: {
      white: '#FFFFFF',
      dark: '#4A5568', // Мягкий тёмный для обводок
      light: '#E2E8F0', // Светлая обводка
      thickness: '3px',
      thicknessSmall: '2px',
      thicknessLarge: '4px',
    },
    // Мягкие тени для стикерного эффекта
    shadows: {
      button: '0 4px 0 rgba(74, 85, 104, 0.15), 0 8px 16px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      buttonActive: '0 2px 0 rgba(74, 85, 104, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
      bar: '0 -4px 20px rgba(160, 124, 255, 0.08), 0 -2px 10px rgba(0, 0, 0, 0.04)',
      glow: '0 0 20px rgba(160, 124, 255, 0.3), 0 0 40px rgba(160, 227, 255, 0.2)',
      sticker: '0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
      soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
      card: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(160, 124, 255, 0.05)',
    },
    // Уютные фоны с лёгкой текстурой
    bg: {
      bar: 'linear-gradient(135deg, #FFFFFF 0%, #FAF9FF 100%)', // Чистый светлый фон
      barStroke: '#E2E8F0', // Светлая обводка
      texture: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(160, 124, 255, 0.02) 20px, rgba(160, 124, 255, 0.02) 40px)',
      dots: 'radial-gradient(circle, rgba(160, 124, 255, 0.08) 1px, transparent 1px)',
      clouds: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 60%)',
      muar: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, rgba(160, 227, 255, 0.03) 10px, rgba(160, 227, 255, 0.03) 20px)',
    },
  },
  spacing: {
    navHeight: '88px', // Оптимальная высота
    centerButtonSize: '72px', // Выделяющаяся центральная кнопка
    sideButtonSize: '56px', // Комфортные боковые кнопки
    barPadding: '12px',
    safeAreaBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  typography: {
    fontFamily: "'Fredoka', 'Comic Neue', 'Baloo 2', -apple-system, system-ui, sans-serif",
    fontSize: {
      label: '13px',
      centerLabel: '14px',
    },
    fontWeight: '600', // Средне-жирный для читаемости
  },
  animation: {
    bounce: 'bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    wobble: 'wobble 0.6s ease-in-out',
    pulse: 'cartoonPulse 2s ease-in-out infinite',
    tap: 'cartoonTap 0.15s ease-out',
    float: 'float 4s ease-in-out infinite',
    glow: 'glowPulse 3s ease-in-out infinite',
    subtle: 'subtleMove 6s ease-in-out infinite',
  },
  borderRadius: {
    bar: '32px 32px 0 0', // Скруглённые углы
    button: '20px',
    centerButton: '50%', // Круглая центральная кнопка
    sticker: '16px',
  },
} as const;

export type CartoonTokens = typeof cartoonTokens;