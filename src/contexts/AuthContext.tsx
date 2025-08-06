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

// Mapeamento de roles para permissões padrão
const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.COLLABORATOR]: [
    Permission.VIEW_OWN_DATA,
    Permission.MANAGE_APPOINTMENTS
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_OWN_DATA,
    Permission.VIEW_ALL_DATA,
    Permission.MANAGE_COLLABORATORS,
    Permission.MANAGE_SERVICES,
    Permission.MANAGE_APPOINTMENTS,
    Permission.MANAGE_INVENTORY,
    Permission.MANAGE_SUBSCRIPTIONS,
    Permission.MANAGE_GIFT_CARDS
  ],
  [UserRole.OWNER]: [
    Permission.VIEW_OWN_DATA,
    Permission.VIEW_ALL_DATA,
    Permission.MANAGE_COLLABORATORS,
    Permission.MANAGE_SERVICES,
    Permission.MANAGE_APPOINTMENTS,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_FINANCIAL,
    Permission.MANAGE_SUBSCRIPTIONS,
    Permission.MANAGE_GIFT_CARDS
  ]
}

// Função helper para garantir que o usuário tenha permissões válidas
const ensureUserPermissions = (userData: any): User => {
  const role = userData.role as UserRole
  const defaultPermissions = DEFAULT_PERMISSIONS[role] || []
  
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: role,
    permissions: userData.permissions || defaultPermissions
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Simular verificação de login no carregamento
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
    // Simulação de login - em produção, isso seria uma chamada para a API
    if (email === 'admin@salon.com' && password === '123456') {
      const userData: User = {
        id: '1',
        name: 'Administrador',
        email: 'admin@salon.com',
        role: UserRole.ADMIN,
        permissions: DEFAULT_PERMISSIONS[UserRole.ADMIN]
      }
      setUser(userData)
      localStorage.setItem('salon_user', JSON.stringify(userData))
      return true
    } else if (email === 'owner@salon.com' && password === '123456') {
      const userData: User = {
        id: '2',
        name: 'Proprietário',
        email: 'owner@salon.com',
        role: UserRole.OWNER,
        permissions: DEFAULT_PERMISSIONS[UserRole.OWNER]
      }
      setUser(userData)
      localStorage.setItem('salon_user', JSON.stringify(userData))
      return true
    } else if (email === 'collaborator@salon.com' && password === '123456') {
      const userData: User = {
        id: '3',
        name: 'Colaborador',
        email: 'collaborator@salon.com',
        role: UserRole.COLLABORATOR,
        permissions: DEFAULT_PERMISSIONS[UserRole.COLLABORATOR]
      }
      setUser(userData)
      localStorage.setItem('salon_user', JSON.stringify(userData))
      return true
    }
    return false
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