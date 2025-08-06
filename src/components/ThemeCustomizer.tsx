'use client'

import { useState } from 'react'
import { Palette, RotateCcw } from 'lucide-react'
import { useTheme, ThemeColors } from '@/contexts/ThemeContext'

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium min-w-[100px] text-gray-900 dark:text-white">{label}</label>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border cursor-pointer"
        title={label}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{color}</span>
    </div>
  )
}

export default function ThemeCustomizer() {
  const { colors, updateColors, resetColors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [tempColors, setTempColors] = useState<ThemeColors>(colors)

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setTempColors(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateColors(tempColors)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempColors(colors)
    setIsOpen(false)
  }

  const handleReset = () => {
    resetColors()
    setTempColors(colors)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Personalizar cores"
      >
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personalizar Cores</h3>
              <button
                onClick={handleReset}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Restaurar cores padrão"
              >
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              <ColorPicker
                label="Primária"
                color={tempColors.primary}
                onChange={(color) => handleColorChange('primary', color)}
              />
              <ColorPicker
                label="Secundária"
                color={tempColors.secondary}
                onChange={(color) => handleColorChange('secondary', color)}
              />
              <ColorPicker
                label="Destaque"
                color={tempColors.accent}
                onChange={(color) => handleColorChange('accent', color)}
              />
              <ColorPicker
                label="Fundo"
                color={tempColors.background}
                onChange={(color) => handleColorChange('background', color)}
              />
              <ColorPicker
                label="Superfície"
                color={tempColors.surface}
                onChange={(color) => handleColorChange('surface', color)}
              />
              <ColorPicker
                label="Texto"
                color={tempColors.text}
                onChange={(color) => handleColorChange('text', color)}
              />
              <ColorPicker
                label="Texto Secundário"
                color={tempColors.textSecondary}
                onChange={(color) => handleColorChange('textSecondary', color)}
              />
              <ColorPicker
                label="Borda"
                color={tempColors.border}
                onChange={(color) => handleColorChange('border', color)}
              />
              <ColorPicker
                label="Sucesso"
                color={tempColors.success}
                onChange={(color) => handleColorChange('success', color)}
              />
              <ColorPicker
                label="Aviso"
                color={tempColors.warning}
                onChange={(color) => handleColorChange('warning', color)}
              />
              <ColorPicker
                label="Erro"
                color={tempColors.error}
                onChange={(color) => handleColorChange('error', color)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 