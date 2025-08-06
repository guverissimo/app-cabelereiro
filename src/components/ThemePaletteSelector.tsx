'use client'

import { useState } from 'react'
import { Palette, ChevronDown } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { colorPalettes } from '@/config/theme'

export default function ThemePaletteSelector() {
  const { setColorPalette, customPalettes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const allPalettes = { ...colorPalettes, ...customPalettes }

  const paletteOptions = Object.entries(allPalettes).map(([key, palette]) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    color: palette.light.primary,
    isCustom: !!customPalettes[key]
  }))

  const handlePaletteSelect = (paletteKey: string) => {
    setColorPalette(paletteKey)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Selecionar paleta de cores"
      >
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-gray-700 dark:text-gray-300">Paleta</span>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">Paletas de Cores</div>
          {paletteOptions.map((palette) => (
            <button
              key={palette.key}
              onClick={() => handlePaletteSelect(palette.key)}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: palette.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{palette.name}</span>
              {palette.isCustom && (
                <span className="text-xs text-blue-600 dark:text-blue-400">•</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 