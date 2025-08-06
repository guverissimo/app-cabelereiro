'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, UserCheck, Calendar, DollarSign, Users } from 'lucide-react'
import { getClients, Client } from '@/lib/api/clients'
import { getServices, Service } from '@/lib/api/services'
import { toast } from 'react-toastify'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Permission } from '@/contexts/AuthContext'

interface Subscription {
  id: string
  client_id: string
  name: string
  description: string
  price: number
  start_date: string
  end_date: string | null
  is_active: boolean
  services: SubscriptionService[]
  client: Client
}

interface SubscriptionService {
  id: string
  service_id: string
  usage_limit: number
  used_count: number
  service: Service
}

interface SubscriptionForm {
  client_id: string
  name: string
  description: string
  price: number
  start_date: string
  end_date: string
  services: Array<{
    service_id: string
    usage_limit: number
  }>
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState<SubscriptionForm>({
    client_id: '',
    name: '',
    description: '',
    price: 0,
    start_date: '',
    end_date: '',
    services: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [clientsData, servicesData] = await Promise.all([
        getClients(),
        getServices()
      ])
      setClients(clientsData)
      setServices(servicesData)
      
      // Simular dados de assinaturas
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          client_id: '1',
          name: 'Pacote Mensal Premium',
          description: 'Acesso ilimitado a todos os serviços básicos',
          price: 299.90,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          is_active: true,
          services: [
            {
              id: '1',
              service_id: '1',
              usage_limit: 4,
              used_count: 2,
              service: { id: '1', name: 'Corte Feminino', duration_minutes: 60, price: 80, description: 'Corte feminino completo' }
            }
          ],
          client: { id: '1', client_name: 'Maria Silva', client_phone: '11999999999' }
        }
      ]
      setSubscriptions(mockSubscriptions)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.client_id || !formData.name || formData.services.length === 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      // Aqui você implementaria a chamada para a API
      toast.success(editingSubscription ? 'Assinatura atualizada!' : 'Assinatura criada!')
      setShowForm(false)
      setEditingSubscription(null)
      setFormData({
        client_id: '',
        name: '',
        description: '',
        price: 0,
        start_date: '',
        end_date: '',
        services: []
      })
      loadData()
    } catch (error) {
      toast.error('Erro ao salvar assinatura')
    }
  }

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setFormData({
      client_id: subscription.client_id,
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      start_date: subscription.start_date,
      end_date: subscription.end_date || '',
      services: subscription.services.map(s => ({
        service_id: s.service_id,
        usage_limit: s.usage_limit
      }))
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta assinatura?')) {
      try {
        // Aqui você implementaria a chamada para a API
        toast.success('Assinatura excluída!')
        loadData()
      } catch (error) {
        toast.error('Erro ao excluir assinatura')
      }
    }
  }

  const addService = () => {
    const serviceId = prompt('Selecione o serviço (ID):')
    const usageLimit = prompt('Limite de uso por mês:')
    
    if (serviceId && usageLimit) {
      const service = services.find(s => s.id === serviceId)
      if (service) {
        setFormData(prev => ({
          ...prev,
          services: [...prev.services, {
            service_id: serviceId,
            usage_limit: parseInt(usageLimit)
          }]
        }))
      }
    }
  }

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const getActiveSubscriptions = () => subscriptions.filter(s => s.is_active)
  const getTotalRevenue = () => subscriptions.reduce((sum, s) => sum + s.price, 0)

  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_SUBSCRIPTIONS}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Assinaturas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Assinatura
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Assinaturas</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assinaturas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{getActiveSubscriptions().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {getTotalRevenue().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingSubscription ? 'Editar Assinatura' : 'Nova Assinatura'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <select
                      value={formData.client_id}
                      onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.client_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Assinatura
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço Mensal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Fim (Opcional)
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Serviços */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Serviços Inclusos
                    </label>
                    <button
                      type="button"
                      onClick={addService}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Adicionar Serviço
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.services.map((service, index) => {
                      const serviceData = services.find(s => s.id === service.service_id)
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{serviceData?.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                              {service.usage_limit} usos/mês
                            </span>
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    {editingSubscription ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingSubscription(null)
                      setFormData({
                        client_id: '',
                        name: '',
                        description: '',
                        price: 0,
                        start_date: '',
                        end_date: '',
                        services: []
                      })
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Assinaturas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assinatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{subscription.client.client_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{subscription.name}</div>
                        <div className="text-sm text-gray-500">{subscription.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {subscription.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscription.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {subscription.end_date 
                          ? new Date(subscription.end_date).toLocaleDateString('pt-BR')
                          : 'Sem data de fim'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(subscription)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subscription.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 