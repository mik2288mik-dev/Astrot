import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pastel palette per spec
        pink: '#FFD1DC',
        beige: '#FFF4E6',
        blue: '#C6E6F5',
        lavender: '#E6D6FF',
        gold: '#E7C86E',
        // Semantic tokens for app
        bg: '#FFF7F4',
        surface: '#FFFFFF',
        on: '#0F1020',
        muted: '#6B7280',
        primary: '#E6D6FF',
        accent: '#C6E6F5',
        // Added brand tokens
        'ink-900': '#1B1B1F',
        'moon-50': '#FFF8FD',
        'rose-100': '#F7E6F3',
        'rose-200': '#F1D6EB',
        'orb-300': '#E6D6FF',
        'nebula-500': '#A16BFE',
        'dawn-500': '#F09EC8',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0,0,0,0.06)',
        card: '0 8px 24px rgba(0,0,0,.08)',
        focus: '0 0 0 4px rgba(198,230,245,.35)'
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #FFF4E6 0%, #FFD1DC 50%, #E6D6FF 100%)',
        'nebula-gradient': 'radial-gradient(1000px 500px at 100% -20%, rgba(230,214,255,0.45), transparent), radial-gradient(800px 400px at -10% 120%, rgba(198,230,245,0.45), transparent)',
        // Added utilities per spec
        'grad-soft': 'linear-gradient(135deg, #F7E6F3 0%, #E6D6FF 55%, #F1D6EB 100%)',
        'grad-accent': 'linear-gradient(90deg, #A16BFE 0%, #F09EC8 100%)',
      },
      fontFamily: {
        sans: ['ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', '"Playfair Display"', 'Georgia', 'serif']
      }
    }
  },
  plugins: [],
};

export default config;