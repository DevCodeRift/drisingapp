'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    muted: string
  }
  border: {
    primary: string
    secondary: string
  }
  button: {
    primary: string
    secondary: string
    hover: string
  }
  navigation: {
    background: string
    text: string
    active: string
  }
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      muted: '#9ca3af'
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#f3f4f6'
    },
    button: {
      primary: '#3b82f6',
      secondary: '#f3f4f6',
      hover: '#2563eb'
    },
    navigation: {
      background: '#ffffff',
      text: '#111827',
      active: '#3b82f6'
    }
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    accent: '#fbbf24',
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      muted: '#94a3b8'
    },
    border: {
      primary: '#334155',
      secondary: '#1e293b'
    },
    button: {
      primary: '#60a5fa',
      secondary: '#334155',
      hover: '#3b82f6'
    },
    navigation: {
      background: '#1e293b',
      text: '#f1f5f9',
      active: '#60a5fa'
    }
  }
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('destiny-theme') as Theme
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('destiny-theme', newTheme)
  }

  const colors = themes[theme]

  useEffect(() => {
    // Apply CSS variables to root
    const root = document.documentElement
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text-primary', colors.text.primary)
    root.style.setProperty('--color-text-secondary', colors.text.secondary)
    root.style.setProperty('--color-text-muted', colors.text.muted)
    root.style.setProperty('--color-border-primary', colors.border.primary)
    root.style.setProperty('--color-border-secondary', colors.border.secondary)
    root.style.setProperty('--color-button-primary', colors.button.primary)
    root.style.setProperty('--color-button-secondary', colors.button.secondary)
    root.style.setProperty('--color-button-hover', colors.button.hover)
    root.style.setProperty('--color-nav-background', colors.navigation.background)
    root.style.setProperty('--color-nav-text', colors.navigation.text)
    root.style.setProperty('--color-nav-active', colors.navigation.active)
  }, [colors])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}