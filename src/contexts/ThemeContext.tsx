'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'cabal' | 'vex' | 'fallen'

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
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      muted: '#9ca3af'
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db'
    },
    button: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      hover: '#2563eb'
    },
    navigation: {
      background: '#ffffff',
      text: '#1f2937',
      active: '#3b82f6'
    }
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#111827',
    surface: '#1f2937',
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      muted: '#9ca3af'
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563'
    },
    button: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      hover: '#2563eb'
    },
    navigation: {
      background: '#1f2937',
      text: '#f9fafb',
      active: '#3b82f6'
    }
  },
  cabal: {
    primary: '#dc2626', // Red Legion red
    secondary: '#b91c1c',
    accent: '#fbbf24', // Cabal gold
    background: '#1c1917', // Dark industrial
    surface: '#292524',
    text: {
      primary: '#fbbf24', // Gold text
      secondary: '#dc2626', // Red secondary
      muted: '#a8a29e'
    },
    border: {
      primary: '#44403c',
      secondary: '#57534e'
    },
    button: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      hover: '#b91c1c'
    },
    navigation: {
      background: '#292524',
      text: '#fbbf24',
      active: '#dc2626'
    }
  },
  vex: {
    primary: '#06b6d4', // Cybernetic blue
    secondary: '#0891b2',
    accent: '#a855f7', // Synthwave purple
    background: '#0f172a', // Deep space blue
    surface: '#1e293b',
    text: {
      primary: '#06b6d4', // Cyan text
      secondary: '#a855f7', // Purple secondary
      muted: '#64748b'
    },
    border: {
      primary: '#334155',
      secondary: '#475569'
    },
    button: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      hover: '#0891b2'
    },
    navigation: {
      background: '#1e293b',
      text: '#06b6d4',
      active: '#a855f7'
    }
  },
  fallen: {
    primary: '#7c3aed', // Eliksni purple
    secondary: '#6d28d9',
    accent: '#14b8a6', // Fallen tech teal
    background: '#1e1b4b', // Deep purple space
    surface: '#312e81',
    text: {
      primary: '#c4b5fd', // Light purple text
      secondary: '#14b8a6', // Teal secondary
      muted: '#8b5cf6'
    },
    border: {
      primary: '#4c1d95',
      secondary: '#5b21b6'
    },
    button: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      hover: '#6d28d9'
    },
    navigation: {
      background: '#312e81',
      text: '#c4b5fd',
      active: '#14b8a6'
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
  const [theme, setThemeState] = useState<Theme>('dark')

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