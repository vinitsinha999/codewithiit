/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        'cinzel-deco': ['"Cinzel Decorative"', 'cursive'],
        code: ['"Source Code Pro"', 'monospace'],
      },
      colors: {
        ink: '#0e0c1a',
        parchment: '#f5ead8',
        gold: {
          DEFAULT: '#c8922a',
          light: '#e8b84b',
        },
        magic: {
          DEFAULT: '#7b4fcf',
          light: '#b08cf0',
        },
        sage: {
          DEFAULT: '#2e7d52',
          light: '#4aad78',
        },
        panel: {
          DEFAULT: '#1a1530',
          2: '#231e3d',
        },
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#2B4EA0',
          600: '#1e3a8a',
          700: '#1e3a8a',
        }
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fadeSlide': 'fadeSlide 0.5s ease both',
        'popIn': 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeSlide: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
