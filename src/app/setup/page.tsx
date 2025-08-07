'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { CheckCircle, AlertCircle, Loader2, Users, Shield, Crown } from 'lucide-react'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const { colors } = useTheme()

  const createUsers = async () => {
    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/users/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Usuários criados com sucesso! Você pode fazer login com qualquer um dos usuários criados.')
        setMessageType('success')
      } else {
        setMessage(data.error || 'Erro ao criar usuários')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Erro de conexão. Verifique se o servidor está rodando.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.background} 50%, ${colors.surface} 100%)`
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ backgroundColor: colors.primary }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full" style={{ backgroundColor: colors.accent }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: `${colors.primary}20` }}>
            <Users className="w-10 h-10" style={{ color: colors.primary }} />
          </div>
          <h1 
            className="text-4xl font-bold mb-3"
            style={{ color: colors.text }}
          >
            Configuração Inicial
          </h1>
          <p 
            className="text-lg"
            style={{ color: colors.textSecondary }}
          >
            Configure os usuários iniciais do sistema
          </p>
        </div>

        {/* Main Content */}
        <div 
          className="backdrop-blur-lg rounded-2xl shadow-2xl border p-8"
          style={{ 
            backgroundColor: `${colors.surface}CC`,
            borderColor: colors.border
          }}
        >
          {message && (
            <div 
              className={`mb-6 p-4 rounded-xl flex items-center ${
                messageType === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 mr-3 text-red-500" />
              )}
              <span 
                className={`text-sm font-medium ${
                  messageType === 'success' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {message}
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Owner Card */}
            <div 
              className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full mr-3" style={{ backgroundColor: `${colors.primary}20` }}>
                  <Crown className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: colors.text }}
                  >
                    Proprietário
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Acesso completo
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Email: owner@salon.com
                </p>
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Senha: 123456
                </p>
                <p 
                  className="text-xs mt-3"
                  style={{ color: colors.textSecondary }}
                >
                  Controle total do sistema, incluindo relatórios financeiros e configurações avançadas.
                </p>
              </div>
            </div>

            {/* Admin Card */}
            <div 
              className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full mr-3" style={{ backgroundColor: `${colors.secondary}20` }}>
                  <Shield className="h-6 w-6" style={{ color: colors.secondary }} />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: colors.text }}
                  >
                    Administrador
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Gerenciamento
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Email: admin@salon.com
                </p>
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Senha: 123456
                </p>
                <p 
                  className="text-xs mt-3"
                  style={{ color: colors.textSecondary }}
                >
                  Gerenciamento de colaboradores, serviços, agendamentos e inventário.
                </p>
              </div>
            </div>

            {/* Collaborator Card */}
            <div 
              className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full mr-3" style={{ backgroundColor: `${colors.accent}20` }}>
                  <Users className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: colors.text }}
                  >
                    Colaborador
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Acesso básico
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Email: collaborator@salon.com
                </p>
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Senha: 123456
                </p>
                <p 
                  className="text-xs mt-3"
                  style={{ color: colors.textSecondary }}
                >
                  Acesso básico para visualizar dados próprios e gerenciar agendamentos.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={createUsers}
              disabled={isLoading}
              className="inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ 
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Criando usuários...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5 mr-2" />
                  Criar Usuários
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div 
            className="text-center mt-8 pt-6 border-t"
            style={{ borderColor: colors.border }}
          >
            <p 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              Após criar os usuários, você pode fazer login em{' '}
              <a 
                href="/login"
                className="underline hover:no-underline font-medium"
                style={{ color: colors.primary }}
              >
                /login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
