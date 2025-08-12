import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--tg-bg-color) / <alpha-value>)',
        text: 'rgb(var(--tg-text-color) / <alpha-value>)',
        hint: 'rgb(var(--tg-hint-color) / <alpha-value>)',
        link: 'rgb(var(--tg-link-color) / <alpha-value>)',
        button: 'rgb(var(--tg-button-color) / <alpha-value>)',
        'button-text': 'rgb(var(--tg-button-text-color) / <alpha-value>)',
        'astrot-accent': 'rgb(var(--astrot-accent) / <alpha-value>)',
        'astrot-muted': 'rgb(var(--astrot-muted) / <alpha-value>)',
        'astrot-surface': 'rgb(var(--astrot-surface) / <alpha-value>)',
        'astrot-card-bg': 'rgb(var(--astrot-card-bg) / <alpha-value>)',
        'astrot-border': 'rgb(var(--astrot-border) / <alpha-value>)'
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
        card: '0 8px 24px rgba(0,0,0,.06)'
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      }
    }
  },
  plugins: [],
};

export default config;