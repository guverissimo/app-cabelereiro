'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'

interface AppWrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname()
  
  // Se estiver na página de login, não mostrar sidebar nem proteção
  if (pathname === '/login') {
    return <>{children}</>
  }
  
  // Para outras páginas, mostrar com sidebar e proteção
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 