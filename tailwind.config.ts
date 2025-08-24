import type { Config } from 'tailwindcss';
import { pastel } from './styles/colors';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['var(--font-rubik)', 'system-ui', 'sans-serif'],
        'manrope': ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-rubik)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Boinkers style colors
        surfaceDark: '#1e1f36',
        accentAstrotFrom: '#cf5cff',
        accentAstrotTo: '#ff6ad9',
        // Премиальная мультяшная палитра
        cartoon: {
          // Основные тона
          purple: {
            light: '#E8D5FF',
            DEFAULT: '#B794F6',
            dark: '#805AD5',
            glow: 'rgba(183, 148, 246, 0.3)',
          },
          pink: {
            light: '#FFE0EC',
            DEFAULT: '#FF9EC7',
            dark: '#EC4899',
            glow: 'rgba(255, 158, 199, 0.3)',
          },
          blue: {
            light: '#D6ECFF',
            DEFAULT: '#7DD3FC',
            dark: '#0EA5E9',
            glow: 'rgba(125, 211, 252, 0.3)',
          },
          mint: {
            light: '#D6FFE8',
            DEFAULT: '#6EE7B7',
            dark: '#10B981',
            glow: 'rgba(110, 231, 183, 0.3)',
          },
          peach: {
            light: '#FFE5D6',
            DEFAULT: '#FCA5A5',
            dark: '#F87171',
            glow: 'rgba(252, 165, 165, 0.3)',
          },
          yellow: {
            light: '#FFF9D6',
            DEFAULT: '#FDE047',
            dark: '#FACC15',
            glow: 'rgba(253, 224, 71, 0.3)',
          },
        },
        // Основные цвета
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        pastel,
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Telegram цвета (для обратной совместимости)
        telegram: {
          bg: '#ffffff',
          bgSecondary: '#f4f4f5',
          text: '#000000',
          hint: '#999999',
          link: '#3390ec',
          button: '#3390ec',
          buttonText: '#ffffff',
        },
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'tg-viewport': 'var(--tg-viewport-height, 100vh)',
        'available': 'calc(var(--tg-viewport-height, 100vh) - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      boxShadow: {
        // Boinkers style shadows
        'nav-dark': '0 -4px 8px rgba(0,0,0,.45)',
        'logo-3d': '0 6px 12px rgba(0,0,0,.45)',
        'inner-bar': 'inset 0 -1px 2px rgba(0,0,0,.4)',
        'cartoon-sm': '0 2px 8px rgba(183, 148, 246, 0.15)',
        'cartoon-md': '0 4px 16px rgba(183, 148, 246, 0.2)',
        'cartoon-lg': '0 8px 30px rgba(183, 148, 246, 0.25)',
        'cartoon-xl': '0 12px 40px rgba(183, 148, 246, 0.3)',
        'cartoon-glow': '0 0 30px rgba(183, 148, 246, 0.4)',
        'cartoon-inner': 'inset 0 2px 8px rgba(255, 255, 255, 0.5)',
        'button-3d': '0 4px 0 rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.15)',
        'button-pressed': '0 2px 0 rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)',
        'nav-soft': '0 -4px 20px rgba(0, 0, 0, 0.08)',
        'premium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'premium-lg': '0 12px 40px rgba(0, 0, 0, 0.18)',
      },
      backgroundImage: {
        'gradient-cartoon': 'linear-gradient(135deg, #FFE0EC 0%, #E8D5FF 50%, #D6ECFF 100%)',
        'gradient-premium': 'linear-gradient(135deg, #B794F6 0%, #FF9EC7 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
        'gradient-button': 'linear-gradient(135deg, #B794F6 0%, #9F7AEA 100%)',
        'gradient-center-button': 'linear-gradient(135deg, #B794F6 0%, #EC4899 50%, #7DD3FC 100%)',
      },
      animation: {
        'cartoon-bounce': 'cartoonBounce 0.6s ease-in-out',
        'cartoon-pop': 'cartoonPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'cartoon-wobble': 'cartoonWobble 0.5s ease-in-out',
        'cartoon-pulse': 'cartoonPulse 2s infinite',
        'cartoon-tap': 'cartoonTap 0.3s ease-in-out',
        'cartoon-float': 'cartoonFloat 3s ease-in-out infinite',
      },
      keyframes: {
        cartoonBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        cartoonPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cartoonWobble: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        cartoonPulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1)',
          },
          '50%': { 
            transform: 'scale(1.05)',
            filter: 'brightness(1.1)',
          },
        },
        cartoonTap: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(0.9) rotate(-5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        cartoonFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '33%': { transform: 'translateY(-3px) rotate(2deg)' },
          '66%': { transform: 'translateY(3px) rotate(-1deg)' },
        },
      },
    }
  },
  plugins: [],
};

export default config;