'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  DollarSign, 
  Package, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getAppointments } from '@/lib/api/appointments'
import { getCollaborators } from '@/lib/api/collaborators'
import { getInventory } from '@/lib/api/inventory'
import { getCashflow } from '@/lib/api/cashflow'
import { useTheme } from '@/contexts/ThemeContext'
import { toast } from 'react-toastify'

interface ChartData {
  name: string
  revenue?: number
  clients?: number
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalRevenue: 0,
    totalInventory: 0,
    completedAppointments: 0
  })
  const [revenueByCollaborator, setRevenueByCollaborator] = useState<ChartData[]>([])
  const [clientsByCollaborator, setClientsByCollaborator] = useState<ChartData[]>([])
  const [cashflowSummary, setCashflowSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  })

  const { colors } = useTheme()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Carregar dados usando as novas APIs
      const [appointments, collaborators, inventory, cashflow] = await Promise.all([
        getAppointments({ status: 'CONCLUIDO' }),
        getCollaborators(),
        getInventory(),
        getCashflow()
      ]);

      // Calcular estatísticas
      const completedAppointments = appointments || []
      const totalRevenue = completedAppointments.reduce((sum, app) => sum + Number(app.price), 0)
      const totalInventory = (inventory || []).reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      
      const totalIncome = (cashflow || []).filter(c => c.type === 'ENTRADA').reduce((sum, c) => sum + Number(c.amount), 0)
      const totalExpenses = (cashflow || []).filter(c => c.type === 'SAIDA').reduce((sum, c) => sum + Number(c.amount), 0)

      setStats({
        totalClients: completedAppointments.length,
        totalRevenue,
        totalInventory,
        completedAppointments: completedAppointments.length
      })

      setCashflowSummary({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses
      })

      // Calcular dados para gráficos
      if (collaborators && appointments) {
        const revenueData = collaborators.map(collab => {
          const collabAppointments = appointments.filter(app => app.collaborator_id === collab.id)
          const revenue = collabAppointments.reduce((sum, app) => sum + app.price, 0)
          return {
            name: collab.name,
            revenue
          }
        })

        const clientsData = collaborators.map(collab => {
          const collabAppointments = appointments.filter(app => app.collaborator_id === collab.id)
          return {
            name: collab.name,
            clients: collabAppointments.length
          }
        })

        setRevenueByCollaborator(revenueData)
        setClientsByCollaborator(clientsData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Visão geral do seu salão de beleza
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl transform hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Clientes Atendidos
              </p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.totalClients}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl transform hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Receita Total
              </p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900">
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl transform hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Valor do Estoque
              </p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {formatCurrency(stats.totalInventory)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900">
              <Package className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl transform hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Agendamentos Concluídos
              </p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.completedAppointments}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900">
              <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Receita por Colaborador
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCollaborator}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:#374151" />
              <XAxis 
                dataKey="name" 
                style={{ fontSize: '12px', fill: '#6b7280' }}
              />
              <YAxis style={{ fontSize: '12px', fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff dark:#1f2937',
                  border: '1px solid #e5e7eb dark:#374151',
                  borderRadius: '8px',
                  color: '#111827 dark:#f9fafb'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clients Chart */}
        <div className="p-6 rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Clientes por Colaborador
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientsByCollaborator}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:#374151" />
              <XAxis 
                dataKey="name" 
                style={{ fontSize: '12px', fill: '#6b7280' }}
              />
              <YAxis style={{ fontSize: '12px', fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff dark:#1f2937',
                  border: '1px solid #e5e7eb dark:#374151',
                  borderRadius: '8px',
                  color: '#111827 dark:#f9fafb'
                }}
              />
              <Bar 
                dataKey="clients" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cashflow Summary */}
      <div className="p-6 rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Resumo Financeiro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Entradas
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(cashflowSummary.totalIncome)}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="h-6 w-6 mr-2 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Saídas
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(cashflowSummary.totalExpenses)}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Saldo
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(cashflowSummary.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
