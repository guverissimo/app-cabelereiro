'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, XCircle, Clock, AlertCircle, Scissors } from 'lucide-react'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, type Appointment } from '@/lib/api/appointments'
import { getCollaborators, type Collaborator } from '@/lib/api/collaborators'
import { getServices, type Service } from '@/lib/api/services'
import { toast } from 'react-toastify'

interface AppointmentWithRelations extends Appointment {
  services?: {
    name: string
    duration_minutes: number
    price: number
  }
  collaborators?: {
    name: string
    email: string
  }
}
import { checkAvailability, formatTime, formatDuration } from '@/lib/availability'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [availabilityCheck, setAvailabilityCheck] = useState<{
    isAvailable: boolean
    conflictingAppointments: Appointment[]
    suggestedSlots: Array<{ start: Date; end: Date; isAvailable: boolean }>
  } | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  
  const [filters, setFilters] = useState({
    collaborator: '',
    status: '',
    date: ''
  })

  const [formData, setFormData] = useState({
    client_name: '',
    service_id: '',
    price: '',
    collaborator_id: '',
    datetime: '',
    duration_minutes: '',
    status: 'agendado' as const
  })

  const loadAppointments = async () => {
    try {
      const filters = {
        collaborator_id: filters.collaborator || undefined,
        status: filters.status || undefined,
        date: filters.date || undefined
      }
      
      const data = await toast.promise(
        getAppointments(filters),
        {
          pending: 'Buscando agendamentos...',
          success: 'Agendamentos carregados!',
          error: {
            render({ data }) {
              return data?.message || 'Erro ao buscar agendamentos';
            },
          },
        }
      );
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    }
  }

  useEffect(() => {
    loadAppointments()
    loadCollaborators()
    loadServices()
  }, [filters])

  const loadCollaborators = async () => {
    try {
      const data = await toast.promise(
        getCollaborators(),
        {
          pending: 'Buscando colaboradores...',
          success: 'Colaboradores carregados!',
          error: {
            render({ data }) {
              return data?.message || 'Erro ao buscar colaboradores';
            },
          },
        }
      );
      setCollaborators(data);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error)
    }
  }

  const loadServices = async () => {
    try {
      const data = await toast.promise(
        getServices(),
        {
          pending: 'Buscando serviços...',
          success: 'Serviços carregados!',
          error: {
            render({ data }) {
              return data?.message || 'Erro ao buscar serviços';
            },
          },
        }
      );
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    }
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setFormData({
        ...formData,
        service_id: serviceId,
        price: service.price.toString(),
        duration_minutes: service.duration_minutes.toString()
      })
    }
  }

  const checkAvailabilityForSlot = async () => {
    if (!formData.collaborator_id || !formData.datetime || !formData.duration_minutes) {
      return
    }

    setIsCheckingAvailability(true)
    try {
      const startTime = new Date(formData.datetime)
      const duration = parseInt(formData.duration_minutes)
      
      const result = await checkAvailability(
        formData.collaborator_id,
        startTime,
        duration
      )
      
      setAvailabilityCheck(result)
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar disponibilidade antes de salvar
    if (availabilityCheck && !availabilityCheck.isAvailable) {
      alert('Este horário não está disponível. Verifique os conflitos listados abaixo.')
      return
    }

    try {
      const appointmentData = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
        status: formData.status.toUpperCase() as 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO'
      }

      await toast.promise(
        createAppointment(appointmentData),
        {
          pending: 'Criando agendamento...',
          success: 'Agendamento criado com sucesso!',
          error: {
            render({ data }) {
              return data?.message || 'Erro ao criar agendamento';
            },
          },
        }
      );

      setFormData({
        client_name: '',
        service_id: '',
        price: '',
        collaborator_id: '',
        datetime: '',
        duration_minutes: '',
        status: 'agendado'
      })
      setAvailabilityCheck(null)
      setShowForm(false)
      loadAppointments()
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
    }
  }

  const updateStatus = async (id: string, status: 'agendado' | 'concluído' | 'cancelado') => {
    try {
      const statusUpper = status === 'concluído' ? 'CONCLUIDO' : status.toUpperCase() as 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO'
      
      await toast.promise(
        updateAppointment(id, { status: statusUpper }),
        {
          pending: 'Atualizando status...',
          success: 'Status atualizado com sucesso!',
          error: {
            render({ data }) {
              return data?.message || 'Erro ao atualizar status';
            },
          },
        }
      );
      loadAppointments()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await toast.promise(
          deleteAppointment(id),
          {
            pending: 'Deletando agendamento...',
            success: 'Agendamento deletado com sucesso!',
            error: {
              render({ data }) {
                return data?.message || 'Erro ao deletar agendamento';
              },
            },
          }
        );
        loadAppointments()
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800'
      case 'concluído':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Agendamento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
            <select
              value={filters.collaborator}
              onChange={(e) => setFilters({ ...filters, collaborator: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            >
              <option value="">Todos</option>
              {collaborators.map((collaborator) => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            >
              <option value="">Todos</option>
              <option value="agendado">Agendado</option>
              <option value="concluído">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ collaborator: '', status: '', date: '' })}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Formulário de agendamento */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço
                  </label>
                  <select
                    value={formData.service_id}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({formatDuration(service.duration_minutes)}) - R$ {service.price}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    required
                  >
                    <option value="">Selecione um colaborador</option>
                    {collaborators.map((collaborator) => (
                      <option key={collaborator.id} value={collaborator.id}>
                        {collaborator.name} ({collaborator.role})
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Verificação de disponibilidade */}
              {formData.collaborator_id && formData.datetime && formData.duration_minutes && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={checkAvailabilityForSlot}
                    disabled={isCheckingAvailability}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    {isCheckingAvailability ? 'Verificando...' : 'Verificar Disponibilidade'}
                  </button>
                </div>
              )}

              {/* Resultado da verificação */}
              {availabilityCheck && (
                <div className={`mt-4 p-4 rounded-lg ${
                  availabilityCheck.isAvailable 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {availabilityCheck.isAvailable ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      availabilityCheck.isAvailable ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {availabilityCheck.isAvailable ? 'Horário Disponível!' : 'Horário Indisponível'}
                    </span>
                  </div>
                  
                  {!availabilityCheck.isAvailable && availabilityCheck.conflictingAppointments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-red-700 mb-2">Conflitos encontrados:</p>
                                             <ul className="text-sm text-red-600 space-y-1">
                         {availabilityCheck.conflictingAppointments.map((appointment: Appointment, index: number) => (
                          <li key={index}>
                            • {appointment.client_name} - {formatDate(appointment.datetime)} ({formatDuration(appointment.duration_minutes)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {availabilityCheck.suggestedSlots.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 mb-2">Horários sugeridos:</p>
                                             <div className="flex flex-wrap gap-2">
                         {availabilityCheck.suggestedSlots.slice(0, 5).map((slot: { start: Date; end: Date; isAvailable: boolean }, index: number) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                datetime: slot.start.toISOString().slice(0, 16)
                              })
                            }}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            {formatTime(slot.start)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  Salvar Agendamento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      client_name: '',
                      service_id: '',
                      price: '',
                      collaborator_id: '',
                      datetime: '',
                      duration_minutes: '',
                      status: 'agendado'
                    })
                    setAvailabilityCheck(null)
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

      {/* Lista de agendamentos */}
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
                  Duração
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
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.client_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Scissors className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {appointment.services?.name || 'Serviço não encontrado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.collaborators?.name || 'Colaborador não encontrado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(appointment.datetime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDuration(appointment.duration_minutes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {appointment.price.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {appointment.status === 'agendado' && (
                        <>
                          <button
                            onClick={() => updateStatus(appointment.id, 'concluído')}
                            className="text-green-600 hover:text-green-900"
                            title="Marcar como concluído"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(appointment.id, 'cancelado')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
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
  )
} 