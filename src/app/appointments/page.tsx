'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, User, Edit, Trash2, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, Appointment } from '@/lib/api/appointments'
import { getCollaborators, Collaborator } from '@/lib/api/collaborators'
import { getServices, Service } from '@/lib/api/services'
import { getClients, Client } from '@/lib/api/clients'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Permission } from '@/contexts/AuthContext'

interface CheckoutForm {
  appointmentId: string
  clientId: string
  collaboratorId: string
  services: Array<{
    serviceId: string
    name: string
    price: number
    coveredBySubscription: boolean
  }>
  subtotal: number
  discount: number
  total: number
  paymentMethod: string
  giftCardCode: string
  giftCardAmount: number
  notes: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    appointmentId: '',
    clientId: '',
    collaboratorId: '',
    services: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    paymentMethod: 'dinheiro',
    giftCardCode: '',
    giftCardAmount: 0,
    notes: ''
  })

  const [formData, setFormData] = useState({
    client_name: '',
    service_id: '',
    price: 0,
    collaborator_id: '',
    datetime: '',
    duration_minutes: 0,
    notes: ''
  })

  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('Iniciando carregamento de dados...')
      
      const [appointmentsData, collaboratorsData, servicesData, clientsData] = await Promise.all([
        getAppointments().catch(error => {
          console.error('Erro ao carregar appointments:', error)
          return []
        }),
        getCollaborators().catch(error => {
          console.error('Erro ao carregar collaborators:', error)
          return []
        }),
        getServices().catch(error => {
          console.error('Erro ao carregar services:', error)
          return []
        }),
        getClients().catch(error => {
          console.error('Erro ao carregar clients:', error)
          return []
        })
      ])
      
      console.log('Dados carregados:', {
        appointments: appointmentsData.length,
        collaborators: collaboratorsData.length,
        services: servicesData.length,
        clients: clientsData.length
      })
      
      // Verificar se os dados foram carregados corretamente
      if (appointmentsData.length === 0) {
        console.warn('Nenhum agendamento encontrado')
      }
      if (collaboratorsData.length === 0) {
        console.warn('Nenhum colaborador encontrado')
      }
      if (servicesData.length === 0) {
        console.warn('Nenhum serviço encontrado')
      }
      if (clientsData.length === 0) {
        console.warn('Nenhum cliente encontrado')
      }
      
      setAppointments(appointmentsData)
      setCollaborators(collaboratorsData)
      setServices(servicesData)
      setClients(clientsData)
      
      console.log('Dados definidos no estado:', {
        appointments: appointmentsData.length,
        collaborators: collaboratorsData.length,
        services: servicesData.length,
        clients: clientsData.length
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, formData)
        toast.success('Agendamento atualizado com sucesso!', {
          render({ data }: { data: any }) {
            return <div className="text-green-600">{data}</div>
          }
        })
      } else {
        await createAppointment(formData)
        toast.success('Agendamento criado com sucesso!', {
          render({ data }: { data: any }) {
            return <div className="text-green-600">{data}</div>
          }
        })
      }
      
      setShowForm(false)
      setEditingAppointment(null)
      setFormData({
        client_name: '',
        service_id: '',
        price: 0,
        collaborator_id: '',
        datetime: '',
        duration_minutes: 0,
        notes: ''
      })
      loadData()
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      toast.error('Erro ao salvar agendamento')
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      client_name: appointment.client_name,
      service_id: appointment.service_id,
      price: Number(appointment.price),
      collaborator_id: appointment.collaborator_id,
      datetime: appointment.datetime,
      duration_minutes: appointment.duration_minutes,
      notes: appointment.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await deleteAppointment(id)
        toast.success('Agendamento excluído com sucesso!', {
          render({ data }: { data: any }) {
            return <div className="text-green-600">{data}</div>
          }
        })
        loadData()
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error)
        toast.error('Erro ao excluir agendamento')
      }
    }
  }

  const debugData = () => {
    console.log('=== DEBUG DADOS ===')
    console.log('Agendamentos:', appointments)
    console.log('Serviços:', services)
    console.log('Clientes:', clients)
    console.log('Colaboradores:', collaborators)
    
    // Verificar se há agendamentos com dados incompletos
    appointments.forEach((appointment, index) => {
      const service = services.find(s => s.id === appointment.service_id)
      const client = clients.find(c => c.client_name === appointment.client_name)
      const collaborator = collaborators.find(c => c.id === appointment.collaborator_id)
      
      console.log(`Agendamento ${index + 1}:`, {
        id: appointment.id,
        client_name: appointment.client_name,
        service_id: appointment.service_id,
        collaborator_id: appointment.collaborator_id,
        service_found: !!service,
        client_found: !!client,
        collaborator_found: !!collaborator
      })
    })
    
    toast.info('Dados de debug enviados para o console')
  }

  const handleCheckout = (appointment: Appointment) => {
    console.log('Iniciando checkout para agendamento:', appointment)
    
    // Verificar se o agendamento tem todos os campos necessários
    if (!appointment.service_id || !appointment.client_name || !appointment.collaborator_id) {
      toast.error('Agendamento com dados incompletos. Verifique se todos os campos estão preenchidos.')
      console.error('Agendamento incompleto:', {
        service_id: appointment.service_id,
        client_name: appointment.client_name,
        collaborator_id: appointment.collaborator_id
      })
      return
    }
    
    console.log('Serviços disponíveis:', services.length, services.map(s => ({ id: s.id, name: s.name })))
    console.log('Clientes disponíveis:', clients.length, clients.map(c => ({ id: c.id, name: c.client_name })))
    console.log('Colaboradores disponíveis:', collaborators.length, collaborators.map(c => ({ id: c.id, name: c.name })))
    
    // Verificar se os dados foram carregados
    if (services.length === 0 || clients.length === 0 || collaborators.length === 0) {
      toast.error('Dados não foram carregados completamente. Tente novamente.')
      console.error('Dados não carregados:', { services: services.length, clients: clients.length, collaborators: collaborators.length })
      return
    }
    
    // Preparar dados do agendamento para a página de vendas rápidas
    let service = services.find(s => s.id === appointment.service_id)
    let client = clients.find(c => c.client_name === appointment.client_name)
    let collaborator = collaborators.find(c => c.id === appointment.collaborator_id)
    
    console.log('Dados encontrados:', {
      service: service ? { id: service.id, name: service.name } : null,
      client: client ? { id: client.id, name: client.client_name } : null,
      collaborator: collaborator ? { id: collaborator.id, name: collaborator.name } : null
    })
    
    // Se não encontrou o serviço, criar um temporário
    if (!service) {
      console.warn(`Serviço não encontrado para ID: ${appointment.service_id}, criando temporário`)
      service = {
        id: appointment.service_id,
        name: `Serviço ${appointment.service_id}`,
        duration_minutes: 60,
        price: Number(appointment.price),
        created_at: new Date().toISOString()
      }
    }
    
    // Se não encontrou o cliente, criar um temporário
    if (!client) {
      console.warn(`Cliente não encontrado: "${appointment.client_name}", criando temporário`)
      client = {
        id: `temp-${Date.now()}`,
        client_name: appointment.client_name,
        client_phone: ''
      }
    }
    
    // Se não encontrou o colaborador, criar um temporário
    if (!collaborator) {
      console.warn(`Colaborador não encontrado para ID: ${appointment.collaborator_id}, criando temporário`)
      collaborator = {
        id: appointment.collaborator_id,
        name: `Colaborador ${appointment.collaborator_id}`,
        role: 'PROFISSIONAL',
        email: '',
        created_at: new Date().toISOString()
      }
    }

    // Criar objeto com dados do checkout para passar via URL ou localStorage
    const checkoutData = {
      fromAppointment: true,
      appointmentId: appointment.id,
      clientId: client.id,
      clientName: client.client_name,
      clientPhone: client.client_phone || '',
      collaboratorId: collaborator.id,
      collaboratorName: collaborator.name,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: Number(appointment.price),
      appointmentDateTime: appointment.datetime,
      appointmentNotes: appointment.notes || '',
      status: appointment.status
    }

    console.log('Dados do checkout preparados:', checkoutData)

    // Salvar dados no localStorage para a página de vendas rápidas acessar
    localStorage.setItem('appointmentCheckoutData', JSON.stringify(checkoutData))
    
    // Redirecionar para a página de vendas rápidas
    router.push('/quick-sales')
    
    toast.success('Redirecionando para finalizar a compra...')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return 'bg-blue-100 text-blue-800'
      case 'CONCLUIDO':
        return 'bg-green-100 text-green-800'
      case 'CANCELADO':
        return 'bg-red-100 text-red-800'
      case 'NO_SHOW':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return <Clock className="h-4 w-4" />
      case 'CONCLUIDO':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELADO':
        return <XCircle className="h-4 w-4" />
      case 'NO_SHOW':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_APPOINTMENTS}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <div className="flex gap-2">
            <button
              onClick={debugData}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              title="Debug - Verificar dados no console"
            >
              <span>🐛</span>
              Debug
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Agendamento
            </button>
          </div>
        </div>

        {/* Formulário de Agendamento */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço
                  </label>
                  <select
                    value={formData.service_id}
                    onChange={(e) => {
                      const service = services.find(s => s.id === e.target.value)
                      setFormData({
                        ...formData,
                        service_id: e.target.value,
                        price: service?.price || 0,
                        duration_minutes: service?.duration_minutes || 0
                      })
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - R$ {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colaborador
                  </label>
                  <select
                    value={formData.collaborator_id}
                    onChange={(e) => setFormData({ ...formData, collaborator_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Selecione um colaborador</option>
                    {collaborators.map(collaborator => (
                      <option key={collaborator.id} value={collaborator.id}>
                        {collaborator.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.datetime}
                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    {editingAppointment ? 'Atualizar' : 'Agendar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingAppointment(null)
                      setFormData({
                        client_name: '',
                        service_id: '',
                        price: 0,
                        collaborator_id: '',
                        datetime: '',
                        duration_minutes: 0,
                        notes: ''
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

        {/* Checkout Modal */}
        {showCheckout && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Checkout</h2>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                {/* Informações do Agendamento */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Informações do Agendamento</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cliente:</span> {selectedAppointment.client_name}
                    </div>
                    <div>
                      <span className="font-medium">Data:</span> {new Date(selectedAppointment.datetime).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Hora:</span> {new Date(selectedAppointment.datetime).toLocaleTimeString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span> {selectedAppointment.duration_minutes} min
                    </div>
                  </div>
                </div>

                {/* Serviços */}
                <div>
                  <h3 className="font-semibold mb-2">Serviços</h3>
                  <div className="space-y-2">
                    {checkoutForm.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{service.name}</span>
                          {service.coveredBySubscription && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Coberto pela assinatura
                            </span>
                          )}
                        </div>
                        <span className="font-medium">
                          {service.coveredBySubscription ? 'Grátis' : `R$ ${service.price.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gift Card */}
                <div>
                  <h3 className="font-semibold mb-2">Gift Card</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código do gift card"
                      value={checkoutForm.giftCardCode}
                      onChange={(e) => setCheckoutForm({...checkoutForm, giftCardCode: e.target.value})}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={applyGiftCard}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Aplicar
                    </button>
                  </div>
                  {checkoutForm.giftCardAmount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Gift card aplicado: R$ {checkoutForm.giftCardAmount.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Método de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={checkoutForm.notes}
                    onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>

                {/* Resumo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>R$ {checkoutForm.subtotal.toFixed(2)}</span>
                  </div>
                  {checkoutForm.discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Desconto (Assinatura):</span>
                      <span>-R$ {checkoutForm.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {checkoutForm.giftCardAmount > 0 && (
                    <div className="flex justify-between mb-2 text-blue-600">
                      <span>Gift Card:</span>
                      <span>-R$ {checkoutForm.giftCardAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>R$ {checkoutForm.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Finalizar Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckout(false)
                      setSelectedAppointment(null)
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

        {/* Lista de Agendamentos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colaborador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{appointment.client_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {services.find(s => s.id === appointment.service_id)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collaborators.find(c => c.id === appointment.collaborator_id)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(appointment.datetime).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(appointment.datetime).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {Number(appointment.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1">{appointment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {appointment.status === 'AGENDADO' && (
                          <button
                            onClick={() => handleCheckout(appointment)}
                            className="text-green-600 hover:text-green-900"
                            title="Checkout"
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
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