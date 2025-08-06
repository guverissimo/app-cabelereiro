import { ThemeColors } from '@/contexts/ThemeContext'

// Configuração de cores para tema claro
export const lightThemeColors: ThemeColors = {
  primary: '#3b82f6',      // Azul principal
  secondary: '#64748b',    // Cinza azulado
  accent: '#f59e0b',       // Laranja/dourado
  background: '#ffffff',   // Branco
  surface: '#f8fafc',      // Cinza muito claro
  text: '#1e293b',         // Cinza escuro
  textSecondary: '#64748b', // Cinza médio
  border: '#e2e8f0',       // Cinza claro
  success: '#10b981',      // Verde
  warning: '#f59e0b',      // Laranja
  error: '#ef4444'         // Vermelho
}

// Configuração de cores para tema escuro
export const darkThemeColors: ThemeColors = {
  primary: '#60a5fa',      // Azul mais claro
  secondary: '#94a3b8',    // Cinza mais claro
  accent: '#fbbf24',       // Amarelo mais claro
  background: '#0f172a',   // Azul muito escuro
  surface: '#1e293b',      // Azul escuro
  text: '#f1f5f9',         // Cinza muito claro
  textSecondary: '#94a3b8', // Cinza claro
  border: '#334155',       // Cinza escuro
  success: '#34d399',      // Verde mais claro
  warning: '#fbbf24',      // Amarelo mais claro
  error: '#f87171'         // Vermelho mais claro
}

// Paletas de cores pré-definidas
export const colorPalettes = {
  default: {
    light: lightThemeColors,
    dark: darkThemeColors
  },
  purple: {
    light: {
      ...lightThemeColors,
      primary: '#8b5cf6',
      accent: '#a855f7'
    },
    dark: {
      ...darkThemeColors,
      primary: '#a78bfa',
      accent: '#c084fc'
    }
  },
  green: {
    light: {
      ...lightThemeColors,
      primary: '#10b981',
      accent: '#059669'
    },
    dark: {
      ...darkThemeColors,
      primary: '#34d399',
      accent: '#10b981'
    }
  },
  pink: {
    light: {
      ...lightThemeColors,
      primary: '#ec4899',
      accent: '#db2777'
    },
    dark: {
      ...darkThemeColors,
      primary: '#f472b6',
      accent: '#ec4899'
    }
  },
  orange: {
    light: {
      ...lightThemeColors,
      primary: '#f97316',
      accent: '#ea580c'
    },
    dark: {
      ...darkThemeColors,
      primary: '#fb923c',
      accent: '#f97316'
    }
  }
}

// Função para obter cores baseadas no tema
export function getThemeColors(theme: 'light' | 'dark', palette: keyof typeof colorPalettes = 'default'): ThemeColors {
  return colorPalettes[palette][theme]
}

// Função para gerar variações de cores
export function generateColorVariations(baseColor: string) {
  // Esta função pode ser expandida para gerar variações automáticas
  // como cores mais claras, mais escuras, etc.
  return {
    light: baseColor,
    dark: baseColor,
    lighter: baseColor,
    darker: baseColor
  }
} 