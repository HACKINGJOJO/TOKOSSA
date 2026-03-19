/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#B8941E',
          light: '#D4AF37',
          dark: '#8B7014',
          pale: '#F4E4C1',
        },
        cream: {
          DEFAULT: '#FDFBF7',
          secondary: '#F8F4EB',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          secondary: '#1A1A1A',
          card: '#141414',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
        'montserrat': ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease',
        'fade-in-up': 'fadeInUp 0.5s ease',
        'slide-in-left': 'slideInLeft 0.5s ease',
        'pulse-slow': 'pulse 2s infinite',
        'shake': 'shake 0.5s ease',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 15px rgba(184, 148, 30, 0.3)',
        'gold-lg': '0 6px 20px rgba(184, 148, 30, 0.4)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 15px 40px rgba(184, 148, 30, 0.15)',
      },
    },
  },
  plugins: [],
}
