'use client'

import { useTheme, Theme } from '@/contexts/ThemeContext'
import { useState } from 'react'

const themeNames: Record<Theme, string> = {
  light: 'Light Mode',
  dark: 'Dark Mode'
}

const themeDescriptions: Record<Theme, string> = {
  light: 'Clean and bright interface',
  dark: 'Easy on the eyes dark theme'
}

export default function ThemeSelector() {
  const { theme, setTheme, colors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] hover:shadow-md"
        style={{
          backgroundColor: colors.surface,
          color: colors.text.primary,
          border: `1px solid ${colors.border.primary}`
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.button.secondary;
          e.currentTarget.style.borderColor = colors.primary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = colors.surface;
          e.currentTarget.style.borderColor = colors.border.primary;
        }}
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        <span>{themeNames[theme]}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-72 rounded-xl shadow-xl border z-50 backdrop-blur-sm"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border.primary,
            boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
          }}
        >
          <div className="p-3 space-y-1">
            {(Object.keys(themeNames) as Theme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => {
                  setTheme(themeKey)
                  setIsOpen(false)
                }}
                className="w-full text-left p-4 rounded-lg transition-all duration-200 group"
                style={{
                  backgroundColor: theme === themeKey ? colors.primary : 'transparent',
                  color: theme === themeKey ? '#ffffff' : colors.text.primary
                }}
                onMouseOver={(e) => {
                  if (theme !== themeKey) {
                    e.currentTarget.style.backgroundColor = colors.button.secondary;
                  }
                }}
                onMouseOut={(e) => {
                  if (theme !== themeKey) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  {themeKey === 'dark' ? (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-base">{themeNames[themeKey]}</div>
                    <div
                      className="text-sm opacity-75 mt-1"
                      style={{ color: theme === themeKey ? '#ffffff' : colors.text.secondary }}
                    >
                      {themeDescriptions[themeKey]}
                    </div>
                  </div>
                  {theme === themeKey && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

