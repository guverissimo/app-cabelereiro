'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

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
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.background} 100%)`
      }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 
            className="text-3xl font-bold"
            style={{ color: colors.text }}
          >
            Configuração Inicial
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: colors.textSecondary }}
          >
            Configure os usuários iniciais do sistema
          </p>
        </div>

        <div 
          className="py-8 px-6 shadow-xl rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <div className="space-y-6">
            {message && (
              <div 
                className={`border rounded-lg p-3 flex items-center ${
                  messageType === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                {messageType === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                )}
                <span 
                  className={`text-sm ${
                    messageType === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {message}
                </span>
              </div>
            )}

            <div>
              <h3 
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                Usuários que serão criados:
              </h3>
              
              <div className="space-y-3">
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }}
                >
                  <h4 
                    className="font-medium"
                    style={{ color: colors.text }}
                  >
                    Proprietário
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Email: owner@salon.com | Senha: 123456
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    Acesso completo ao sistema
                  </p>
                </div>

                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }}
                >
                  <h4 
                    className="font-medium"
                    style={{ color: colors.text }}
                  >
                    Administrador
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Email: admin@salon.com | Senha: 123456
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    Gerenciamento de colaboradores e serviços
                  </p>
                </div>

                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }}
                >
                  <h4 
                    className="font-medium"
                    style={{ color: colors.text }}
                  >
                    Colaborador
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Email: collaborator@salon.com | Senha: 123456
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    Acesso básico para agendamentos
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={createUsers}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando usuários...
                  </>
                ) : (
                  'Criar Usuários'
                )}
              </button>
            </div>

            <div 
              className="text-center"
              style={{ color: colors.textSecondary }}
            >
              <p className="text-xs">
                Após criar os usuários, você pode fazer login em{' '}
                <a 
                  href="/login"
                  className="underline hover:no-underline"
                  style={{ color: colors.primary }}
                >
                  /login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
