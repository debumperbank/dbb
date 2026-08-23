import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e0f11',
        'bg-soft': '#17181b',
        'bg-soft-2': '#1e2024',
        paper: '#f4f3f0',
        'paper-2': '#ebe9e4',
        ink: '#141517',
        muted: '#9195a0',
        'muted-dark': '#6b6e76',
        orange: '#ff5a1f',
        'orange-bright': '#ff7a3d',
        'orange-deep': '#c2410c',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      maxWidth: {
        site: '1180px',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '9.5': '2.375rem',
        '13': '3.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
