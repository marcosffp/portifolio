/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        'primary-dark': '#1d4ed8',
        'secondary-dark': '#2563eb',
        canvas: '#030014',
        'canvas-alt': '#0a0a1a',
        'nav-text': '#bfdbfe',  // azul claro para textos de nav
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        sm: '4px',
      },
      animation: {
        blob: 'blob 8s infinite',
        shine: 'shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shine: {
          from: { left: '-100%' },
          to: { left: '200%' },
        },
      },
    },
  },
  plugins: [],
}