/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A73E8',
          soft: '#E8F0FE',
          deep: '#185ABC',
          glow: 'rgba(26, 115, 232, 0.28)',
        },
        accent: {
          DEFAULT: '#188038',
          soft: '#E6F4EA',
        },
        surface: {
          DEFAULT: '#F7F9FC',
          card: '#FFFFFF',
          elevated: '#EEF3FA',
          dark: '#0F172A',
          glass: 'rgba(255, 255, 255, 0.75)',
        },
        status: {
          concern: '#F9AB00',
          crisis: '#D93025',
          safe: '#188038',
        },
        text: {
          primary: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
        },
      },
      borderRadius: {
        unified: '22px',
        huge: '40px',
      },
      boxShadow: {
        'tier-1': '0 2px 12px rgba(15, 23, 42, 0.06)',
        'tier-2': '0 12px 30px rgba(15, 23, 42, 0.12)',
        'tier-3': '0 24px 50px rgba(15, 23, 42, 0.18)',
        premium: '0 14px 38px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.06)',
        'listening-glow': '0 0 40px rgba(26, 115, 232, 0.35)',
        'crisis-glow': '0 0 30px rgba(217, 48, 37, 0.35)',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
