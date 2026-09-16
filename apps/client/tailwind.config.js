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
        bg: {
          base: 'var(--bg-base, #0A0A12)',
          surface: 'var(--bg-surface, #14141F)',
          elevated: 'var(--bg-elevated, #1C1C29)',
        },
        accent: {
          blue: 'var(--accent-blue, #2E7CF6)',
          purple: 'var(--accent-purple, #9B3CFF)',
        },
        text: {
          primary: 'var(--text-primary, #F5F5FA)',
          muted: 'var(--text-muted, #8B8B9E)',
        },
        border: {
          subtle: 'var(--border, #26263A)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-up': 'floatUp 2.5s ease-out forwards',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '1' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-140px) scale(1.3)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
