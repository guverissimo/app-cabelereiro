'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105"
      title={theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="w-4 h-4 text-gray-300" />
      )}
    </button>
  )
} 