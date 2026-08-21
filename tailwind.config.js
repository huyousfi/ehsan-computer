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
          sky: {
            50: '#eef4ff',
            100: '#dce8ff',
            200: '#bed2ff',
            300: '#91b2f2',
            400: '#5f86cf',
            500: '#1F4F9D',
            600: '#1F4F9D',
            700: '#173f80',
            800: '#123568',
            900: '#0d294f',
            950: '#081b35',
          },
          amber: {
            50: '#fff4ed',
            100: '#ffe4d2',
            200: '#ffc6a6',
            300: '#ffa06e',
            400: '#f98143',
            500: '#F26522',
            600: '#F26522',
            700: '#cf4c12',
            800: '#a83c0d',
            900: '#85320f',
            950: '#481808',
          },
        brand: {
            50: '#eef4ff',
            100: '#dce8ff',
            200: '#bed2ff',
            300: '#91b2f2',
            400: '#5f86cf',
            500: '#1F4F9D',
            600: '#1F4F9D',
            700: '#173f80',
            800: '#123568',
            900: '#0d294f',
            950: '#081b35',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          hover: '#20bd5a',
        },
        darkbg: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
