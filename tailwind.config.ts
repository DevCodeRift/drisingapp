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
        }
      },
      fontFamily: {
        destiny: ['Futura', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config