/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        thai: ['Sarabun', 'sans-serif'],
      },
      colors: {
        gold: { 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706' },
        hp:   { bar: '#EF4444', bg: '#7F1D1D' },
        exp:  { bar: '#8B5CF6', bg: '#4C1D95' },
      },
      keyframes: {
        floatUp: {
          '0%':   { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
        shakeX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%':       { transform: 'translateX(-6px)' },
          '75%':       { transform: 'translateX(6px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 4px #FBBF24' },
          '50%':       { boxShadow: '0 0 16px #FBBF24, 0 0 32px #F59E0B' },
        },
      },
      animation: {
        floatUp: 'floatUp 1.2s ease-out forwards',
        shakeX:  'shakeX 0.3s ease-in-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
