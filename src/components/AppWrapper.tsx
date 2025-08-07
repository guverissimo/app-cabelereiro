'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'

interface AppWrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname()
  
  // Páginas que não precisam de autenticação
  const publicPages = ['/login', '/setup']
  
  // Se estiver em uma página pública, não mostrar sidebar nem proteção
  if (publicPages.includes(pathname)) {
    return <>{children}</>
  }
  
  // Para outras páginas, mostrar com sidebar e proteção
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 