'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Filter } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Permission } from '@/contexts/AuthContext'

interface ReportData {
  totalClients: number
  totalRevenue: number
  totalAppointments: number
  averageTicket: number
  topServices: Array<{ name: string; count: number; revenue: number }>
  collaboratorPerformance: Array<{ name: string; appointments: number; revenue: number }>
  monthlyRevenue: Array<{ month: string; revenue: number }>
  clientRetention: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [dateFilter, setDateFilter] = useState('month')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [dateFilter])

  const loadReportData = async () => {
    setIsLoading(true)
    try {
      // Simular dados de relatório - em produção, isso seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: ReportData = {
        totalClients: 156,
        totalRevenue: 45230.50,
        totalAppointments: 89,
        averageTicket: 508.21,
        topServices: [
          { name: 'Corte Feminino', count: 45, revenue: 13500 },
          { name: 'Coloração', count: 32, revenue: 12800 },
          { name: 'Manicure', count: 28, revenue: 5600 },
          { name: 'Pedicure', count: 25, revenue: 5000 },
          { name: 'Hidratação', count: 20, revenue: 4000 }
        ],
        collaboratorPerformance: [
          { name: 'Bruna Souza', appointments: 35, revenue: 15750 },
          { name: 'Carlos Lima', appointments: 28, revenue: 12600 },
          { name: 'Juliana Freitas', appointments: 26, revenue: 11700 }
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 38000 },
          { month: 'Fev', revenue: 42000 },
          { month: 'Mar', revenue: 45000 },
          { month: 'Abr', revenue: 48000 },
          { month: 'Mai', revenue: 52000 },
          { month: 'Jun', revenue: 45230 }
        ],
        clientRetention: 78.5
      }
      
      setReportData(mockData)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute requiredPermission={Permission.VIEW_REPORTS}>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!reportData) {
    return (
      <ProtectedRoute requiredPermission={Permission.VIEW_REPORTS}>
        <div className="p-6">
          <div className="text-center">
            <p className="text-gray-600">Erro ao carregar relatórios.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_REPORTS}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="today">Hoje</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {reportData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {reportData.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Receita Mensal */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
            <div className="space-y-3">
              {reportData.monthlyRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ 
                          width: `${(item.revenue / Math.max(...reportData.monthlyRevenue.map(r => r.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      R$ {item.revenue.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retenção de Clientes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Retenção de Clientes</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-pink-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${reportData.clientRetention}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{reportData.clientRetention}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Taxa de retenção de clientes
            </p>
          </div>
        </div>

        {/* Tabelas de Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Serviços Mais Populares */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Serviços Mais Populares</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receita
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.topServices.map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {service.revenue.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance dos Colaboradores */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Performance dos Colaboradores</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colaborador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agendamentos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receita
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.collaboratorPerformance.map((collaborator, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {collaborator.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collaborator.appointments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {collaborator.revenue.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 