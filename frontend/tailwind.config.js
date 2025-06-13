/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores cálidos inspirados en la imagen
        primary: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8bc6d',
          400: '#f59532',
          500: '#e67e22', // Naranja principal
          600: '#d35400',
          700: '#b7472a',
          800: '#92400e',
          900: '#78350f',
        },
        secondary: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d5d3',
          300: '#f4b4b0',
          400: '#ec8481',
          500: '#dc5855',
          600: '#c53030',
          700: '#9b2c2c',
          800: '#822727',
          900: '#63171b',
        },
        warm: {
          50: '#fefdfb',
          100: '#fef9f3',
          200: '#fdf2e9',
          300: '#fde8d7',
          400: '#fbd9b8',
          500: '#f6c794',
          600: '#e6a96b',
          700: '#d4894a',
          800: '#b8713d',
          900: '#9a5f36',
        },
        cream: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}