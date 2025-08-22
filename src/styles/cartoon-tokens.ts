// Design tokens for Cartoon/Doodle style bottom bar - BOINKERS STYLE
export const cartoonTokens = {
  colors: {
    // СУПЕР ЯРКИЕ мультяшные цвета - как стикеры и bubble UI
    primary: {
      purple: '#8B5CF6', // Яркий фиолетовый
      pink: '#FF006E', // Насыщенный розовый
      blue: '#00B4D8', // Яркий голубой
      cyan: '#00F5FF', // Неоновый бирюзовый
      yellow: '#FFD60A', // Солнечный желтый
      orange: '#FF6B35', // Сочный оранжевый
      green: '#00F593', // Неоновый зеленый
      coral: '#FF4365', // Коралловый
    },
    // Супер-градиенты для кнопок - живые и насыщенные
    gradients: {
      home: 'linear-gradient(145deg, #FF006E 0%, #FF4365 25%, #FFD60A 75%, #FF6B35 100%)',
      center: 'radial-gradient(circle at 30% 30%, #FFD60A 0%, #FF006E 25%, #8B5CF6 50%, #00F5FF 75%, #00B4D8 100%)',
      more: 'linear-gradient(145deg, #00F5FF 0%, #00B4D8 50%, #8B5CF6 100%)',
      barBg: 'linear-gradient(180deg, #FFE66D 0%, #FF6B9D 50%, #C66EFD 100%)',
      glow: 'radial-gradient(circle, rgba(255,214,10,0.8) 0%, rgba(255,0,110,0.6) 40%, rgba(139,92,246,0.4) 70%, transparent 100%)',
      shine: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
      rainbow: 'conic-gradient(from 0deg, #FF006E, #FFD60A, #00F593, #00F5FF, #8B5CF6, #FF006E)',
    },
    // Толстые мультяшные обводки
    stroke: {
      white: '#FFFFFF',
      black: '#2D3748',
      purple: '#6B46C1',
      thickness: '5px',
      thicknessSmall: '3px',
      thicknessLarge: '7px',
    },
    // Объёмные тени и эффекты
    shadows: {
      button: '0 6px 0 rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
      buttonActive: '0 3px 0 rgba(0, 0, 0, 0.3), 0 6px 12px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
      bar: '0 -8px 32px rgba(139, 92, 246, 0.3), 0 -4px 16px rgba(255, 0, 110, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.8)',
      glow: '0 0 40px rgba(255, 214, 10, 0.6), 0 0 80px rgba(255, 0, 110, 0.4), 0 0 120px rgba(139, 92, 246, 0.3)',
      sticker: '4px 4px 0 rgba(0, 0, 0, 0.2), 8px 8px 16px rgba(0, 0, 0, 0.1)',
      neon: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      cartoon: '3px 3px 0 #2D3748, 6px 6px 0 rgba(45, 55, 72, 0.3)',
      bubble: 'inset 0 4px 8px rgba(255, 255, 255, 0.6), 0 8px 0 rgba(0, 0, 0, 0.2), 0 12px 24px rgba(0, 0, 0, 0.15)',
    },
    // Яркие фоны с текстурой
    bg: {
      bar: 'linear-gradient(135deg, #FFE66D 0%, #FF6B9D 100%)', // Яркий градиентный фон
      barStroke: '#2D3748', // Темная обводка для контраста
      texture: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
      dots: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
      clouds: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4) 0%, transparent 70%)',
    },
  },
  spacing: {
    navHeight: '96px', // Увеличенная высота для большего вайба
    centerButtonSize: '84px', // Большая центральная кнопка
    sideButtonSize: '64px', // Увеличенные боковые кнопки
    barPadding: '16px',
    safeAreaBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  typography: {
    fontFamily: "'Fredoka', 'Comic Neue', 'Baloo 2', system-ui, cursive",
    fontSize: {
      label: '15px',
      centerLabel: '18px',
    },
    fontWeight: '700', // Более жирный шрифт
  },
  animation: {
    bounce: 'bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    wobble: 'wobble 0.8s ease-in-out infinite',
    pulse: 'cartoonPulse 1.5s ease-in-out infinite',
    tap: 'cartoonTap 0.2s ease-out',
    float: 'float 3s ease-in-out infinite',
    jiggle: 'jiggle 0.4s ease-in-out',
    swing: 'swing 2s ease-in-out infinite',
    glow: 'glowPulse 2s ease-in-out infinite',
    rotate: 'rotate360 20s linear infinite',
    shake: 'shake 0.5s ease-in-out',
  },
  borderRadius: {
    bar: '40px 40px 0 0', // Более круглые углы
    button: '28px',
    centerButton: '50%', // Полностью круглая центральная кнопка
    bubble: '32px',
  },
} as const;

export type CartoonTokens = typeof cartoonTokens;