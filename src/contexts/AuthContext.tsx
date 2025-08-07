'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export enum UserRole {
  COLLABORATOR = 'COLLABORATOR',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

export enum Permission {
  VIEW_OWN_DATA = 'VIEW_OWN_DATA',
  VIEW_ALL_DATA = 'VIEW_ALL_DATA',
  MANAGE_COLLABORATORS = 'MANAGE_COLLABORATORS',
  MANAGE_SERVICES = 'MANAGE_SERVICES',
  MANAGE_APPOINTMENTS = 'MANAGE_APPOINTMENTS',
  MANAGE_INVENTORY = 'MANAGE_INVENTORY',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MANAGE_FINANCIAL = 'MANAGE_FINANCIAL',
  MANAGE_SUBSCRIPTIONS = 'MANAGE_SUBSCRIPTIONS',
  MANAGE_GIFT_CARDS = 'MANAGE_GIFT_CARDS'
}

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: Permission[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Função helper para garantir que o usuário tenha permissões válidas
const ensureUserPermissions = (userData: any): User => {
  const role = userData.role as UserRole
  
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: role,
    permissions: userData.permissions || []
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar se há usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('salon_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        const userWithPermissions = ensureUserPermissions(parsedUser)
        setUser(userWithPermissions)
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error)
        localStorage.removeItem('salon_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const userWithPermissions = ensureUserPermissions(data.user)
        setUser(userWithPermissions)
        localStorage.setItem('salon_user', JSON.stringify(userWithPermissions))
        return true
      } else {
        console.error('Erro no login:', data.error)
        return false
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('salon_user')
    router.push('/login')
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 