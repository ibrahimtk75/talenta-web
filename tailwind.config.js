/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Modern Stadium Light — navy · white · fiery orange
        ink: '#0B1A38',          // base navy
        'ink-2': '#0E2046',
        surface: '#122146',
        'surface-2': '#16284F',
        primary: '#FF5A2C',      // fiery orange
        'primary-2': '#FF9F3C',
        accent: '#FF2A4D',       // crimson (live)
        sky: '#5AA9FF',
        amber: '#FFB23C',
        mute: '#9AA6C2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 50px -16px rgba(0,0,0,.55)',
        glow: '0 10px 40px -8px rgba(255,90,44,.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
