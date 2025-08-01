'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  DollarSign, 
  Package, 
  CheckCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { supabase } from '@/lib/supabase'

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

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Carregar agendamentos concluídos
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'concluído')

      // Carregar colaboradores
      const { data: collaborators } = await supabase
        .from('collaborators')
        .select('*')

      // Carregar estoque
      const { data: inventory } = await supabase
        .from('inventory')
        .select('*')

      // Carregar fluxo de caixa
      const { data: cashflow } = await supabase
        .from('cashflow')
        .select('*')

      // Calcular estatísticas
      const completedAppointments = appointments || []
      const totalRevenue = completedAppointments.reduce((sum, app) => sum + app.price, 0)
      const totalInventory = (inventory || []).reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      
      const totalIncome = (cashflow || []).filter(c => c.type === 'entrada').reduce((sum, c) => sum + c.amount, 0)
      const totalExpenses = (cashflow || []).filter(c => c.type === 'saída').reduce((sum, c) => sum + c.amount, 0)

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
    }
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000']

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes Atendidos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor em Estoque</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {stats.totalInventory.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agendamentos Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturamento por Colaborador</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCollaborator}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes por Colaborador</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientsByCollaborator}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="clients"
              >
                {clientsByCollaborator.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo do Fluxo de Caixa */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Fluxo de Caixa</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total de Entradas</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {cashflowSummary.totalIncome.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total de Saídas</p>
            <p className="text-2xl font-bold text-red-600">
              R$ {cashflowSummary.totalExpenses.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Saldo</p>
            <p className={`text-2xl font-bold ${cashflowSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {cashflowSummary.balance.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
