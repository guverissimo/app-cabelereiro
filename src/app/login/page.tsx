'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Login realizado com sucesso!')
        router.push('/')
      } else {
        toast.error('Email ou senha incorretos')
      }
    } catch (error) {
      toast.error('Erro ao fazer login')
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

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
            <Sparkles className="w-8 h-8" style={{ color: colors.primary }} />
          </div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Bem-vindo de volta
          </h1>
          <p 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Login Form */}
        <div 
          className="backdrop-blur-lg rounded-2xl shadow-2xl border p-8"
          style={{ 
            backgroundColor: `${colors.surface}CC`,
            borderColor: colors.border
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium block"
                style={{ color: colors.text }}
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: colors.textSecondary }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-0"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                    '--tw-ring-color': colors.primary,
                  } as React.CSSProperties}
                  placeholder="Digite seu email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium block"
                style={{ color: colors.text }}
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: colors.textSecondary }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-0"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                    '--tw-ring-color': colors.primary,
                  } as React.CSSProperties}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: colors.textSecondary }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              backgroundColor: `${colors.primary}10`,
              border: `1px solid ${colors.primary}30`
            }}
          >
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: colors.primary }}
            >
              Primeira vez usando o sistema?
            </h3>
            <p
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              Entre em contato com o administrador para obter suas credenciais de acesso.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p 
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            Sistema de Gerenciamento de Salão de Beleza
          </p>
        </div>
      </div>
    </div>
  )
} 