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
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

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
      name: 'Clientes',
      href: '/clients',
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
    }
  ]

  const filteredMenuItems = menuItems.filter(item =>
    hasPermission(item.permission)
  )

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Salão
              </h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Theme Toggle - Compacto */}
        {!isCollapsed && (
          <div className="mb-4 flex justify-center rounded-md hover:rounded-xl">
            <ThemeToggle />
          </div>
        )}

        {/* Logout - Ajustado para não sair da tela */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 w-full group"
          >
            <LogOut className="h-4 w-4 group-hover:text-red-600 dark:group-hover:text-red-400" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">Sair</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 