'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      title={theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600" />
      ) : (
        <Sun className="w-5 h-5 text-gray-300" />
      )}
    </button>
  )
} 