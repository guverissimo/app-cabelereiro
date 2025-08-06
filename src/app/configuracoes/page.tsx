'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { colorPalettes, lightThemeColors, darkThemeColors } from '@/config/theme'
import { ThemeColors } from '@/contexts/ThemeContext'
import { 
  Palette, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Copy,
  Download,
  Upload
} from 'lucide-react'

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
  disabled?: boolean
}

function ColorPicker({ label, color, onChange, disabled = false }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium min-w-[120px]">{label}</label>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title={label}
        disabled={disabled}
      />
      <span className="text-xs text-gray-500 font-mono">{color}</span>
    </div>
  )
}

interface PaletteEditorProps {
  paletteName: string
  lightColors: ThemeColors
  darkColors: ThemeColors
  onSave: (name: string, light: ThemeColors, dark: ThemeColors) => void
  onCancel: () => void
  isNew?: boolean
}

function PaletteEditor({ 
  paletteName, 
  lightColors, 
  darkColors, 
  onSave, 
  onCancel, 
  isNew = false 
}: PaletteEditorProps) {
  const [name, setName] = useState(paletteName)
  const [light, setLight] = useState<ThemeColors>(lightColors)
  const [dark, setDark] = useState<ThemeColors>(darkColors)
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light')

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), light, dark)
    }
  }

  const updateColor = (theme: 'light' | 'dark', key: keyof ThemeColors, value: string) => {
    if (theme === 'light') {
      setLight(prev => ({ ...prev, [key]: value }))
    } else {
      setDark(prev => ({ ...prev, [key]: value }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isNew ? 'Nova Paleta' : `Editar Paleta: ${paletteName}`}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>

          {/* Nome da Paleta */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Nome da Paleta</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite o nome da paleta"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('light')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'light'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Tema Claro
            </button>
            <button
              onClick={() => setActiveTab('dark')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'dark'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Tema Escuro
            </button>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Cores Primárias</h3>
              <ColorPicker
                label="Primária"
                color={activeTab === 'light' ? light.primary : dark.primary}
                onChange={(color) => updateColor(activeTab, 'primary', color)}
              />
              <ColorPicker
                label="Secundária"
                color={activeTab === 'light' ? light.secondary : dark.secondary}
                onChange={(color) => updateColor(activeTab, 'secondary', color)}
              />
              <ColorPicker
                label="Destaque"
                color={activeTab === 'light' ? light.accent : dark.accent}
                onChange={(color) => updateColor(activeTab, 'accent', color)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Cores de Fundo</h3>
              <ColorPicker
                label="Fundo"
                color={activeTab === 'light' ? light.background : dark.background}
                onChange={(color) => updateColor(activeTab, 'background', color)}
              />
              <ColorPicker
                label="Superfície"
                color={activeTab === 'light' ? light.surface : dark.surface}
                onChange={(color) => updateColor(activeTab, 'surface', color)}
              />
              <ColorPicker
                label="Borda"
                color={activeTab === 'light' ? light.border : dark.border}
                onChange={(color) => updateColor(activeTab, 'border', color)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Cores de Texto</h3>
              <ColorPicker
                label="Texto"
                color={activeTab === 'light' ? light.text : dark.text}
                onChange={(color) => updateColor(activeTab, 'text', color)}
              />
              <ColorPicker
                label="Texto Secundário"
                color={activeTab === 'light' ? light.textSecondary : dark.textSecondary}
                onChange={(color) => updateColor(activeTab, 'textSecondary', color)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Cores de Status</h3>
              <ColorPicker
                label="Sucesso"
                color={activeTab === 'light' ? light.success : dark.success}
                onChange={(color) => updateColor(activeTab, 'success', color)}
              />
              <ColorPicker
                label="Aviso"
                color={activeTab === 'light' ? light.warning : dark.warning}
                onChange={(color) => updateColor(activeTab, 'warning', color)}
              />
              <ColorPicker
                label="Erro"
                color={activeTab === 'light' ? light.error : dark.error}
                onChange={(color) => updateColor(activeTab, 'error', color)}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Preview</h3>
            <div 
              className="p-4 rounded-lg"
              style={{ 
                backgroundColor: activeTab === 'light' ? light.background : dark.background,
                color: activeTab === 'light' ? light.text : dark.text
              }}
            >
              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: activeTab === 'light' ? light.primary : dark.primary,
                    color: 'white'
                  }}
                >
                  Botão Primário
                </button>
                <button 
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: activeTab === 'light' ? light.secondary : dark.secondary,
                    color: 'white'
                  }}
                >
                  Botão Secundário
                </button>
                <div 
                  className="px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: activeTab === 'light' ? light.surface : dark.surface,
                    border: `1px solid ${activeTab === 'light' ? light.border : dark.border}`
                  }}
                >
                  Card de Exemplo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const { setColorPalette, customPalettes, addCustomPalette, removeCustomPalette } = useTheme()
  const [editingPalette, setEditingPalette] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSavePalette = (name: string, light: ThemeColors, dark: ThemeColors) => {
    if (isCreating) {
      addCustomPalette(name, light, dark)
      setIsCreating(false)
    } else {
      addCustomPalette(name, light, dark)
      setEditingPalette(null)
    }
  }

  const handleDeletePalette = (name: string) => {
    if (confirm(`Tem certeza que deseja excluir a paleta "${name}"?`)) {
      removeCustomPalette(name)
    }
  }

  const handleExportPalettes = () => {
    const allPalettes = { ...colorPalettes, ...customPalettes }
    const dataStr = JSON.stringify(allPalettes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'paletas-cores.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportPalettes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          // Importar apenas paletas personalizadas
          Object.entries(imported).forEach(([name, palette]: [string, any]) => {
            if (!colorPalettes[name as keyof typeof colorPalettes]) {
              addCustomPalette(name, palette.light, palette.dark)
            }
          })
          alert('Paletas importadas com sucesso!')
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique se é um JSON válido.')
        }
      }
      reader.readAsText(file)
    }
  }

  const allPalettes = { ...colorPalettes, ...customPalettes }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações de Cores</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportPalettes}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Importar
            <input
              type="file"
              accept=".json"
              onChange={handleImportPalettes}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Paleta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(allPalettes).map(([name, palette]) => (
          <div key={name} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setColorPalette(name)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Aplicar paleta"
                >
                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setEditingPalette(name)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Editar paleta"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                {customPalettes[name] && (
                  <button
                    onClick={() => handleDeletePalette(name)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                    title="Excluir paleta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Preview das cores */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.light.primary }}
                  title="Primária (Claro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.light.accent }}
                  title="Destaque (Claro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.light.success }}
                  title="Sucesso (Claro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.light.warning }}
                  title="Aviso (Claro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.light.error }}
                  title="Erro (Claro)"
                />
              </div>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.dark.primary }}
                  title="Primária (Escuro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.dark.accent }}
                  title="Destaque (Escuro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.dark.success }}
                  title="Sucesso (Escuro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.dark.warning }}
                  title="Aviso (Escuro)"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: palette.dark.error }}
                  title="Erro (Escuro)"
                />
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              {customPalettes[name] ? 'Paleta personalizada' : 'Paleta padrão'}
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingPalette && allPalettes[editingPalette] && (
        <PaletteEditor
          paletteName={editingPalette}
          lightColors={allPalettes[editingPalette].light}
          darkColors={allPalettes[editingPalette].dark}
          onSave={handleSavePalette}
          onCancel={() => setEditingPalette(null)}
        />
      )}

      {/* Criar Nova Paleta Modal */}
      {isCreating && (
        <PaletteEditor
          paletteName=""
          lightColors={lightThemeColors}
          darkColors={darkThemeColors}
          onSave={handleSavePalette}
          onCancel={() => setIsCreating(false)}
          isNew={true}
        />
      )}
    </div>
  )
} 