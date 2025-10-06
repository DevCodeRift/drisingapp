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
          orange: '#f2721b',
          blue: '#4a90e2',
          purple: '#8e44ad',
          gold: '#f1c40f',
          dark: '#1a1a1a',
          darker: '#0f0f0f',
          bg: {
            primary: '#0a0a0a',
            secondary: '#151515',
            tertiary: '#1f1f1f',
          },
          border: {
            subtle: '#2a2a2a',
            DEFAULT: '#3a3a3a',
            focus: '#4a4a4a',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
            muted: '#6a6a6a',
          }
        }
      },
      fontFamily: {
        destiny: ['Futura', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'destiny-glow': '0 0 20px rgba(242, 114, 27, 0.3)',
        'destiny-card': '0 4px 6px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
export default config