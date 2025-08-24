// Фирменная палитра Astrot - стильные, насыщенные цвета
export const astrotColors = {
  // Основные градиентные цвета
  primary: {
    start: '#9B59B6', // Глубокий фиолетовый
    end: '#5E72E4',   // Космический синий
  },
  
  // Акцентные цвета
  accent: {
    purple: '#8B5CF6',  // Яркий фиолетовый
    pink: '#EC4899',    // Насыщенный розовый
    blue: '#3B82F6',    // Чистый синий
    cosmic: '#6366F1',  // Космический индиго
  },
  
  // Градиенты для кнопок и элементов
  gradients: {
    main: 'linear-gradient(135deg, #9B59B6 0%, #5E72E4 100%)',
    accent: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    soft: 'linear-gradient(135deg, #F3E7FC 0%, #E0E7FF 100%)',
    glow: 'linear-gradient(135deg, #FF6B9D 0%, #C66FBC 50%, #8B5CF6 100%)',
  },
  
  // Нейтральные цвета
  neutral: {
    white: '#FFFFFF',
    offWhite: '#FAFBFC',
    light: '#F3F4F6',
    gray: '#6B7280',
    dark: '#1F2937',
    black: '#111827',
  },
  
  // Фоновые цвета
  background: {
    primary: '#FFF6FB',   // Светло-лавандовый
    secondary: '#FBEFFF', // Мягкий фиолетовый
    card: 'rgba(255, 255, 255, 0.85)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Тени для 3D эффектов
  shadows: {
    soft: '0 4px 14px rgba(155, 89, 182, 0.15)',
    medium: '0 8px 30px rgba(155, 89, 182, 0.2)',
    strong: '0 12px 40px rgba(155, 89, 182, 0.25)',
    glow: '0 0 40px rgba(139, 92, 246, 0.4)',
  },
} as const

// Старая палитра для обратной совместимости
export const pastel = {
  pink: '#FFE5EC',
  purple: '#E8E3FF',
  blue: '#E3F2FF',
  mint: '#E5FFF7',
  peach: '#FFF0E5',
  lavender: '#F3E8FF',
  cream: '#FFF9F0',
} as const

export type PastelColor = keyof typeof pastel
export type AstrotColor = typeof astrotColors
