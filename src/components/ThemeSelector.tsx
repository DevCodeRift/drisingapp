'use client'

import { useTheme, Theme } from '@/contexts/ThemeContext'
import { useState } from 'react'

const themeNames: Record<Theme, string> = {
  light: 'Light Mode',
  dark: 'Dark Mode',
  cabal: 'Cabal',
  vex: 'Vex',
  fallen: 'Fallen'
}

const themeDescriptions: Record<Theme, string> = {
  light: 'Clean and bright interface',
  dark: 'Easy on the eyes dark theme',
  cabal: 'Red Legion industrial warfare aesthetic',
  vex: 'Cybernetic synthwave digital landscape',
  fallen: 'Eliksni purple and teal technology'
}

export default function ThemeSelector() {
  const { theme, setTheme, colors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px]"
        style={{
          backgroundColor: colors.button.secondary,
          color: colors.text.primary,
          border: `1px solid ${colors.border.primary}`
        }}
      >
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.accent
          }}
        />
        {themeNames[theme]}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg border z-50"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border.primary
          }}
        >
          <div className="p-2">
            {(Object.keys(themeNames) as Theme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => {
                  setTheme(themeKey)
                  setIsOpen(false)
                }}
                className="w-full text-left p-3 rounded-md transition-colors hover:opacity-80"
                style={{
                  backgroundColor: theme === themeKey ? colors.button.primary : 'transparent',
                  color: theme === themeKey ? '#ffffff' : colors.text.primary
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                    style={{
                      backgroundColor: themes[themeKey].primary,
                      borderColor: themes[themeKey].accent
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{themeNames[themeKey]}</div>
                    <div
                      className="text-xs opacity-70"
                      style={{ color: theme === themeKey ? '#ffffff' : colors.text.secondary }}
                    >
                      {themeDescriptions[themeKey]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper to access themes from component
const themes = {
  light: {
    primary: '#3b82f6',
    accent: '#f59e0b'
  },
  dark: {
    primary: '#3b82f6',
    accent: '#f59e0b'
  },
  cabal: {
    primary: '#dc2626',
    accent: '#fbbf24'
  },
  vex: {
    primary: '#06b6d4',
    accent: '#a855f7'
  },
  fallen: {
    primary: '#7c3aed',
    accent: '#14b8a6'
  }
}