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
    primary: '#ff6b35',
    secondary: '#2d3748',
    accent: '#ffd700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      muted: '#718096'
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.2)',
      secondary: 'rgba(255, 255, 255, 0.1)'
    },
    button: {
      primary: '#ff6b35',
      secondary: 'rgba(255, 255, 255, 0.1)',
      hover: '#e55a2b'
    },
    navigation: {
      background: 'rgba(255, 255, 255, 0.1)',
      text: '#1a202c',
      active: '#ff6b35'
    }
  },
  dark: {
    primary: '#ff8c42',
    secondary: '#a0aec0',
    accent: '#ffd700',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    surface: 'rgba(26, 32, 46, 0.95)',
    text: {
      primary: '#f7fafc',
      secondary: '#e2e8f0',
      muted: '#a0aec0'
    },
    border: {
      primary: 'rgba(255, 140, 66, 0.3)',
      secondary: 'rgba(255, 140, 66, 0.1)'
    },
    button: {
      primary: '#ff8c42',
      secondary: 'rgba(255, 140, 66, 0.1)',
      hover: '#ff7629'
    },
    navigation: {
      background: 'rgba(26, 32, 46, 0.95)',
      text: '#f7fafc',
      active: '#ff8c42'
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