'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Scissors, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/')
      } else {
        setError('Email ou senha incorretos')
      }
    } catch {
      setError('Erro ao fazer login')
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
          <div className="flex justify-center">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Scissors className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 
            className="mt-6 text-3xl font-bold"
            style={{ color: colors.text }}
          >
            Sistema Salão de Beleza
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: colors.textSecondary }}
          >
            Faça login para acessar o sistema
          </p>
        </div>

        <div 
          className="py-8 px-6 shadow-xl rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div 
                className="border rounded-lg p-3 flex items-center"
                style={{ 
                  backgroundColor: `${colors.error}10`,
                  borderColor: colors.error
                }}
              >
                <AlertCircle 
                  className="h-5 w-5 mr-2" 
                  style={{ color: colors.error }}
                />
                <span 
                  className="text-sm"
                  style={{ color: colors.error }}
                >
                  {error}
                </span>
              </div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="admin@salon.com"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                  placeholder="123456"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff 
                      className="h-5 w-5" 
                      style={{ color: colors.textSecondary }}
                    />
                  ) : (
                    <Eye 
                      className="h-5 w-5" 
                      style={{ color: colors.textSecondary }}
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary }}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div 
            className="mt-6 p-4 rounded-lg"
            style={{ 
              backgroundColor: `${colors.primary}10`,
              border: `1px solid ${colors.primary}30`
            }}
          >
            <h3 
              className="text-sm font-medium mb-2"
              style={{ color: colors.primary }}
            >
              Credenciais de Teste:
            </h3>
            <div 
              className="text-sm space-y-1"
              style={{ color: colors.textSecondary }}
            >
              <p><strong>Email:</strong> admin@salon.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 