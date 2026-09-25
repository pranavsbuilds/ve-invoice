/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vedant: {
          blue: '#003eb8',
          dark: '#0f172a',
          accent: '#1e40af'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        pad: ['Arial', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
