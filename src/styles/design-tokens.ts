// Дизайн-система для премиум-продукта
export const designTokens = {
  // Типографика
  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif',
      secondary: 'Manrope, sans-serif',
    },
    fontSize: {
      heading: '20px',      // Заголовки
      body: '16px',         // Основной текст
      caption: '14px',      // Подписи
      small: '12px',        // Мелкий текст
      button: '14px',       // Текст кнопок
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,           // leading-tight для подписей
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Цвета
  colors: {
    text: {
      primary: '#2C2C2C',   // Основной текст
      secondary: '#666666',
      hint: '#999999',
      white: '#FFFFFF',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F0F2F5',
    },
    gradient: {
      button: 'linear-gradient(135deg, #FDCBFF 0%, #B3CFFF 100%)',
      buttonHover: 'linear-gradient(135deg, #FDB8FF 0%, #A0C0FF 100%)',
      card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 245, 237, 0.98) 100%)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.06)',
      medium: 'rgba(0, 0, 0, 0.12)',
    },
  },

  // Отступы (8px сетка)
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px',
    xxl: '48px',
  },

  // Скругления
  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    button: '16px',
    card: '24px',
  },

  // Тени
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    glow: '0 0 20px rgba(183, 148, 246, 0.3)',
  },

  // Размеры кнопок
  button: {
    height: {
      sm: '36px',
      md: '44px',
      lg: '52px',
    },
    padding: {
      vertical: '12px',
      horizontal: '24px',
    },
  },

  // Анимации
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

// Tailwind классы для быстрого применения
export const designClasses = {
  // Заголовки
  heading: 'font-semibold text-[20px] text-[#2C2C2C]',
  
  // Текст
  body: 'font-normal text-[16px] text-[#2C2C2C]',
  
  // Подписи
  caption: 'text-[14px] leading-tight text-[#666666]',
  
  // Кнопки
  button: {
    base: 'w-full rounded-[16px] py-3 text-sm font-semibold transition-all duration-300',
    primary: 'bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white border border-gray-200 text-[#2C2C2C] shadow-sm hover:shadow-md',
  },
  
  // Карточки
  card: 'rounded-[24px] shadow-md bg-white p-6',
  
  // Сетка
  grid8: 'gap-2', // 8px
  grid16: 'gap-4', // 16px
  grid24: 'gap-6', // 24px
};