/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GlobalFundConnect — trust-first fintech palette
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // primary emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        ink: {
          DEFAULT: '#0b1220',
          50: '#f5f7fa',
          100: '#e9edf4',
          200: '#cdd6e4',
          300: '#a3b1c8',
          400: '#6f819e',
          500: '#4a5b76',
          600: '#33425a',
          700: '#212e42',
          800: '#141d2e',
          900: '#0b1220',
        },
        gold: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(11,18,32,.18)',
        glow: '0 12px 40px -10px rgba(16,185,129,.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s ease-out both',
      },
    },
  },
  plugins: [],
};
