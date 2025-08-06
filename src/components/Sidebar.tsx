'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, Permission, UserRole } from '@/contexts/AuthContext'
import { 
  Home, 
  Users, 
  Calendar, 
  Package, 
  DollarSign, 
  Settings, 
  LogOut,
  BarChart3,
  CreditCard,
  Gift,
  UserCheck,
  Clock,
  Palette
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import ThemeCustomizer from './ThemeCustomizer'
import ThemePaletteSelector from './ThemePaletteSelector'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout, hasPermission, hasRole } = useAuth()

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      permission: Permission.VIEW_OWN_DATA
    },
    {
      name: 'Colaboradores',
      href: '/collaborators',
      icon: Users,
      permission: Permission.MANAGE_COLLABORATORS
    },
    {
      name: 'Agendamentos',
      href: '/appointments',
      icon: Calendar,
      permission: Permission.MANAGE_APPOINTMENTS
    },
    {
      name: 'Serviços',
      href: '/services',
      icon: Settings,
      permission: Permission.MANAGE_SERVICES
    },
    {
      name: 'Estoque',
      href: '/inventory',
      icon: Package,
      permission: Permission.MANAGE_INVENTORY
    },
    {
      name: 'Fluxo de Caixa',
      href: '/cashflow',
      icon: DollarSign,
      permission: Permission.MANAGE_FINANCIAL
    },
    {
      name: 'Vendas Rápidas',
      href: '/quick-sales',
      icon: CreditCard,
      permission: Permission.MANAGE_APPOINTMENTS
    },
    {
      name: 'Assinaturas',
      href: '/subscriptions',
      icon: UserCheck,
      permission: Permission.MANAGE_SUBSCRIPTIONS
    },
    {
      name: 'Gift Cards',
      href: '/gift-cards',
      icon: Gift,
      permission: Permission.MANAGE_GIFT_CARDS
    },
    {
      name: 'Relatórios',
      href: '/reports',
      icon: BarChart3,
      permission: Permission.VIEW_REPORTS
    },
    {
      name: 'Horários',
      href: '/schedule',
      icon: Clock,
      permission: Permission.MANAGE_APPOINTMENTS
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Palette,
      permission: Permission.VIEW_OWN_DATA
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission)
  )

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Salão</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">{user.role.toLowerCase()}</p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="space-y-2 flex-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Theme Controls */}
        {!isCollapsed && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">Tema</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <ThemeCustomizer />
              </div>
              <ThemePaletteSelector />
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="pt-6">
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-3">Sair</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 