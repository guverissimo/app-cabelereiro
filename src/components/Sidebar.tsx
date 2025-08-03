'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Home, 
  Calendar, 
  Package, 
  DollarSign, 
  Users, 
  LogOut,
  Scissors,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Agendamentos', href: '/appointments', icon: Calendar },
  { name: 'Agenda', href: '/schedule', icon: Calendar },
  { name: 'Serviços', href: '/services', icon: Scissors },
  { name: 'Estoque', href: '/inventory', icon: Package },
  { name: 'Fluxo de Caixa', href: '/cashflow', icon: DollarSign },
  { name: 'Colaboradores', href: '/collaborators', icon: Users },
  { name: 'Clientes', href: '/clients', icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-pink-600">
        <Scissors className="h-8 w-8 text-white" />
        <h1 className="ml-2 text-xl font-bold text-white">Salão de Beleza</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-pink-100 text-pink-700 border-r-2 border-pink-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200 space-y-2">
        {user && (
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{user.email}</div>
          </div>
        )}
        
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
} 