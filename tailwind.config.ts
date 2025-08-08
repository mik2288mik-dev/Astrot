import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f5f7ff',
          100: '#edf0ff',
          200: '#dfe5ff',
          300: '#c8d1ff',
          400: '#aab5ff',
          500: '#8a97ff',
          600: '#6d79f2',
          700: '#585fcc',
          800: '#474da3',
          900: '#3b4184'
        },
        nebula: {
          50: '#fdf7fb',
          100: '#f9eaf5',
          200: '#f2d5eb',
          300: '#e6b6db',
          400: '#d68ac5',
          500: '#c765b2',
          600: '#ad4b98',
          700: '#8d3c7b',
          800: '#743364',
          900: '#5f2c52'
        },
        // Design tokens per spec
        bg: '#0F1020',
        surface: '#17182C',
        on: '#EAEAF2',
        muted: '#B7B8C8',
        primary: '#B28DFF',
        accent: '#60D6FF',
        gold: '#E7C86E',
      },
      borderRadius: {
        // radius.sm/md/lg/xl — 8 / 12 / 16 / 24 px
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        // keep larger radii too
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        glass: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 30px rgba(0,0,0,0.12)',
        // elev.card
        card: '0 8px 24px rgba(0,0,0,.25)',
        // focus ring
        focus: '0 0 0 4px rgba(96,214,255,.12)'
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0b132b 100%)',
        'nebula-gradient': 'radial-gradient(1200px 600px at 100% -20%, rgba(199,101,178,0.25), transparent), radial-gradient(800px 400px at -10% 120%, rgba(106,142,251,0.25), transparent)'
      },
      fontFamily: {
        sans: ['Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: [],
};

export default config;