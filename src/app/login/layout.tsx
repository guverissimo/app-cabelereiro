import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Sistema Salão de Beleza',
  description: 'Faça login para acessar o sistema',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 