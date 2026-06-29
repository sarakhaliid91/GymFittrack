/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#F3F3FE',
          100: '#E5E5FC',
          200: '#DEDEFC',
          300: '#C7C7F8',
          400: '#A7A7F5',
          500: '#8B8BF5',
          600: '#6E6EE8',
          700: '#5A5AD1',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
