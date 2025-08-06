'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeDemo() {
  const { theme, colors } = useTheme()

  return (
    <div className="p-6 space-y-6">
      <h2 
        className="text-2xl font-bold"
        style={{ color: colors.text }}
      >
        Demonstração do Sistema de Temas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cores Primárias */}
        <div 
          className="card"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Cores Primárias
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.primary,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Primária: {colors.primary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.secondary,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Secundária: {colors.secondary}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.accent,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Destaque: {colors.accent}
              </span>
            </div>
          </div>
        </div>

        {/* Cores de Fundo */}
        <div 
          className="card"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Cores de Fundo
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Fundo: {colors.background}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Superfície: {colors.surface}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.border,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Borda: {colors.border}
              </span>
            </div>
          </div>
        </div>

        {/* Cores de Texto */}
        <div 
          className="card"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Cores de Texto
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.text,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Texto: {colors.text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.textSecondary,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Texto Secundário: {colors.textSecondary}
              </span>
            </div>
          </div>
        </div>

        {/* Cores de Status */}
        <div 
          className="card"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Cores de Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.success,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Sucesso: {colors.success}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.warning,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Aviso: {colors.warning}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ 
                  backgroundColor: colors.error,
                  borderColor: colors.border
                }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Erro: {colors.error}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Exemplo */}
      <div 
        className="card"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}
      >
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: colors.text }}
        >
          Botões de Exemplo
        </h3>
        <div className="flex flex-wrap gap-4">
          <button 
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white' 
            }}
          >
            Botão Primário
          </button>
          <button 
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.secondary, 
              color: 'white' 
            }}
          >
            Botão Secundário
          </button>
          <button 
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.success, 
              color: 'white' 
            }}
          >
            Botão Sucesso
          </button>
          <button 
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.warning, 
              color: 'white' 
            }}
          >
            Botão Aviso
          </button>
          <button 
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.error, 
              color: 'white' 
            }}
          >
            Botão Erro
          </button>
        </div>
      </div>

      {/* Informações do Tema */}
      <div 
        className="card"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}
      >
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: colors.text }}
        >
          Informações do Tema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p style={{ color: colors.text }}>
              <strong>Tema Atual:</strong> {theme === 'light' ? 'Claro' : 'Escuro'}
            </p>
            <p style={{ color: colors.text }}>
              <strong>Paleta:</strong> {localStorage.getItem('themePalette') || 'Padrão'}
            </p>
          </div>
          <div>
            <p style={{ color: colors.text }}>
              <strong>Variáveis CSS:</strong> 12 cores personalizáveis
            </p>
            <p style={{ color: colors.text }}>
              <strong>Persistência:</strong> localStorage
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 