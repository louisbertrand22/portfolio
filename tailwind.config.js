/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1c3f66',
          foreground: '#f6f3ec',
          dark: '#6fa0cc',
        },
        secondary: {
          DEFAULT: '#3d6c96',
          foreground: '#f6f3ec',
        },
        border: 'var(--border)',
        background: 'var(--bg)',
        foreground: 'var(--text)',
        muted: {
          DEFAULT: 'var(--bg-subtle)',
          foreground: 'var(--text-muted)',
        },
      },
      borderRadius: {
        lg: '0.875rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
