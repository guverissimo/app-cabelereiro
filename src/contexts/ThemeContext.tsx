'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { lightThemeColors, darkThemeColors, colorPalettes } from '@/config/theme'

export type Theme = 'light' | 'dark'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
}

export interface ThemeConfig {
  theme: Theme
  colors: ThemeColors
}

interface ThemeContextType {
  theme: Theme
  colors: ThemeColors
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  updateColors: (colors: Partial<ThemeColors>) => void
  resetColors: () => void
  setColorPalette: (palette: string) => void
  customPalettes: Record<string, { light: ThemeColors, dark: ThemeColors }>
  addCustomPalette: (name: string, light: ThemeColors, dark: ThemeColors) => void
  removeCustomPalette: (name: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [colors, setColors] = useState<ThemeColors>(lightThemeColors)
  const [customPalettes, setCustomPalettes] = useState<Record<string, { light: ThemeColors, dark: ThemeColors }>>({})

  // Carregar tema do localStorage na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const savedColors = localStorage.getItem('themeColors')
    const savedPalette = localStorage.getItem('themePalette')
    const savedCustomPalettes = localStorage.getItem('customPalettes')
    
    if (savedTheme) {
      setThemeState(savedTheme)
    }
    
    if (savedCustomPalettes) {
      try {
        const parsedCustomPalettes = JSON.parse(savedCustomPalettes)
        setCustomPalettes(parsedCustomPalettes)
      } catch (error) {
        console.error('Erro ao carregar paletas personalizadas:', error)
      }
    }
    
    if (savedPalette) {
      const allPalettes = { ...colorPalettes, ...customPalettes }
      if (allPalettes[savedPalette]) {
        const paletteColors = allPalettes[savedPalette][savedTheme || 'light']
        setColors(paletteColors)
      }
    } else if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors)
        setColors(parsedColors)
      } catch (error) {
        console.error('Erro ao carregar cores do tema:', error)
        setColors(savedTheme === 'dark' ? darkThemeColors : lightThemeColors)
      }
    }
  }, [])

  // Aplicar tema ao documento
  useEffect(() => {
    const root = document.documentElement
    
    // Aplicar tema
    root.setAttribute('data-theme', theme)
    
    // Aplicar cores como variáveis CSS
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    // Salvar no localStorage
    localStorage.setItem('theme', theme)
    localStorage.setItem('themeColors', JSON.stringify(colors))
  }, [theme, colors])

  // Salvar paletas personalizadas no localStorage
  useEffect(() => {
    localStorage.setItem('customPalettes', JSON.stringify(customPalettes))
  }, [customPalettes])

  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      // Atualizar cores para o novo tema
      const currentPalette = localStorage.getItem('themePalette')
      const allPalettes = { ...colorPalettes, ...customPalettes }
      if (currentPalette && allPalettes[currentPalette]) {
        setColors(allPalettes[currentPalette][newTheme])
      } else {
        setColors(newTheme === 'dark' ? darkThemeColors : lightThemeColors)
      }
      return newTheme
    })
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    // Atualizar cores para o novo tema
    const currentPalette = localStorage.getItem('themePalette')
    const allPalettes = { ...colorPalettes, ...customPalettes }
    if (currentPalette && allPalettes[currentPalette]) {
      setColors(allPalettes[currentPalette][newTheme])
    } else {
      setColors(newTheme === 'dark' ? darkThemeColors : lightThemeColors)
    }
  }

  const updateColors = (newColors: Partial<ThemeColors>) => {
    setColors(prev => ({ ...prev, ...newColors }))
  }

  const resetColors = () => {
    const currentPalette = localStorage.getItem('themePalette')
    const allPalettes = { ...colorPalettes, ...customPalettes }
    if (currentPalette && allPalettes[currentPalette]) {
      setColors(allPalettes[currentPalette][theme])
    } else {
      const defaultColors = theme === 'light' ? lightThemeColors : darkThemeColors
      setColors(defaultColors)
    }
  }

  const setColorPalette = (palette: string) => {
    const allPalettes = { ...colorPalettes, ...customPalettes }
    if (allPalettes[palette]) {
      const paletteColors = allPalettes[palette][theme]
      setColors(paletteColors)
      localStorage.setItem('themePalette', palette)
    }
  }

  const addCustomPalette = (name: string, light: ThemeColors, dark: ThemeColors) => {
    setCustomPalettes(prev => ({ ...prev, [name]: { light, dark } }))
  }

  const removeCustomPalette = (name: string) => {
    setCustomPalettes(prev => {
      const newPalettes = { ...prev }
      delete newPalettes[name]
      return newPalettes
    })
  }

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
    updateColors,
    resetColors,
    setColorPalette,
    customPalettes,
    addCustomPalette,
    removeCustomPalette
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
} 