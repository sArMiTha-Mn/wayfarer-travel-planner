/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdfbf7',
          100: '#f7f4ed',
          200: '#efe9dc',
          300: '#e1d7c3',
          400: '#cfbfa3',
          500: '#bca686',
        },
        ocean: {
          50: '#f0f7f9',
          100: '#dbeff3',
          200: '#bce0e8',
          300: '#8dc8d6',
          400: '#55a7be',
          500: '#388ba3',
          600: '#2d7187',
          700: '#285d70',
          800: '#1d4857',
          900: '#144355',
          950: '#0d2d3a',
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
