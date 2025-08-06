import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import AppWrapper from '@/components/AppWrapper'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema Salão de Beleza',
  description: 'Sistema completo de agendamento, estoque e fluxo de caixa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <AppWrapper>{children}</AppWrapper>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Slide}
              toastClassName="dark:bg-gray-800 dark:text-white"
              bodyClassName="dark:bg-gray-800 dark:text-white"
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
