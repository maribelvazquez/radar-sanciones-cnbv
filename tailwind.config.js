/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        '360': {
          violeta: '#a663cc',
          coral: '#ff8361',
          gris: '#4d4d4d',
          oscuro: '#393e41',
          verde: '#87d895',
          negro: '#1b1b1e',
        }
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
