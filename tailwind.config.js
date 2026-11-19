/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        alabaster: '#F8F7F4',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        navy: '#0F1E36',
        charcoal: '#334155',
        muted: '#64748B',
        cobalt: '#2563EB',
        gold: '#B48A3E',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        editorial: '0.16em',
      },
    },
  },
  plugins: [],
};
