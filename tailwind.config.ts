import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        destiny: {
          orange: '#ff6b1a',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          gold: '#f59e0b',
          void: '#9333ea',
          arc: '#06b6d4',
          solar: '#f97316',
        },
        background: {
          DEFAULT: '#fafafa',
          card: '#ffffff',
          muted: '#f5f5f5',
        },
        border: {
          DEFAULT: '#e5e5e5',
          muted: '#f0f0f0',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#666666',
          muted: '#9ca3af',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
export default config