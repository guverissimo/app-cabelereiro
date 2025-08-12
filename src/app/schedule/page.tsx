/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import { Clock, User, ChevronLeft, ChevronRight, Scissors, Plus, Calendar } from 'lucide-react'
import { getCollaborators, type Collaborator } from '@/lib/api/collaborators'
import { getServices, type Service } from '@/lib/api/services'
import { getCollaboratorSchedule, formatTime, formatDuration, TimeSlot } from '@/lib/availability'
import { toast } from 'react-toastify'
import { getClients } from '@/lib/api/clients'
import { Client } from '@/types/cliente'
import AsyncSelect from 'react-select/async'
import { Appointment, createAppointment } from '@/lib/api/appointments'

export default function SchedulePage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [schedule, setSchedule] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  const [appointmentForm, setAppointmentForm] = useState<Appointment>({
    client_id: '',
    client_name: '',
    collaborator_id: '',
    service_id: '',
    price: 0,
    duration_minutes: 0.0,
    datetime: new Date().toISOString(),
  })

  useEffect(() => {
    loadCollaborators()
    getServices().then((data) => setServices(data))
  }, [])

  useEffect(() => {
    if (selectedCollaborator) {
      loadSchedule()
    }
  }, [selectedCollaborator, selectedDate])

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
      if (data && data.length > 0) {
        setSelectedCollaborator(data[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error)
    }
  }


  const searchClients = async (search?: string) => {
    try {
      const data: Client[] = await getClients(search);
      setClients(data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const loadSchedule = async () => {
    if (!selectedCollaborator) return

    setIsLoading(true)
    try {
      const slots = await getCollaboratorSchedule(selectedCollaborator, selectedDate)
      console.log('Slots carregados:', slots)
      console.log('Data selecionada:', selectedDate)
      console.log('Colaborador selecionado:', selectedCollaborator)
      setSchedule(slots)
    } catch (error) {
      console.error('Erro ao carregar agenda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot)
      setShowAppointmentForm(true)
    }
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setAppointmentForm({
        ...appointmentForm,
        service_id: serviceId,
        price: service.price,
        duration_minutes: service.duration_minutes
      })
    }
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !selectedCollaborator) return

    try {

      const data = await createAppointment(appointmentForm);

      // Limpar formulário
      setAppointmentForm({
        client_id: '',
        client_name: '',
        collaborator_id: '',
        service_id: '',
        price: 0,
        duration_minutes: 0.0,
        datetime: new Date().toISOString(),
      })
      setSelectedSlot(null)
      setShowAppointmentForm(false)

      // Recarregar agenda
      loadSchedule()
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
    }
  }

  const getTimeSlots = () => {
    return schedule
  }

  const timeSlots = getTimeSlots()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
      </div>

      {/* Controles */}
      <div className="rounded-xl bg-white p-4  shadow-md mb-6 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
            <select
              value={selectedCollaborator}
              onChange={(e) => setSelectedCollaborator(e.target.value)}
              className="w-full border rounded-xl bg-white border-gray-30 px-3 py-2 text-gray-900"
            >
              {collaborators.map((collaborator) => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.name} ({collaborator.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDate('prev')}
                className="rounded-full p-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className=" text-sm font-medium text-gray-900 min-w-[200px] text-center">
                {formatDate(selectedDate)}
              </span>
              <button
                onClick={() => changeDate('next')}
                className=" rounded-full p-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setSelectedDate(new Date())}
              className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              Hoje
            </button>
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-600">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando agenda...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 divide-y-0">
                {timeSlots.map((slot, index) => (
                  <tr
                    key={index}
                    className={`${slot.isAvailable
                      ? 'hover:bg-gray-600 cursor-pointer'
                      : 'bg-pink-50'
                      }`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${slot.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {slot.isAvailable ? 'Livre' : 'Ocupado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {slot.appointment?.client_name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Scissors className="h-4 w-4 text-gray-400 mr-2" />
                        {(() => {
                          const serviceId = slot.appointment?.service_id
                          if (!serviceId) return '-'
                          const service = services.find(s => s.id === serviceId)
                          return service ? service.name : '-'
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slot.appointment && slot.appointment.duration_minutes && typeof slot.appointment.duration_minutes === 'number'
                        ? formatDuration(slot.appointment.duration_minutes)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slot.isAvailable && (
                        <div className="flex items-center text-green-600">
                          <Plus className="h-4 w-4 mr-1" />
                          <span className="text-xs">Criar agendamento</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulário de Agendamento */}
      {showAppointmentForm && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 ">
                <strong>Horário selecionado:</strong> {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
              </p>
            </div>
            <form onSubmit={handleCreateAppointment} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <AsyncSelect<Client>
                  className=" text-black"
                  cacheOptions
                  defaultOptions
                  loadOptions={searchClients}
                  getOptionLabel={(client) => `${client.client_name} ${client.client_phone ?? ""}`}
                  getOptionValue={(client) => client.id}
                  placeholder="Selecione ou pesquise um cliente..."
                  onChange={(client) => {
                    appointmentForm.client_name = client?.client_name || ''
                    appointmentForm.client_id = client?.id || ''
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">
                  Serviço
                </label>
                <select
                  value={appointmentForm.service_id}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full border-b border-gray-300 l px-3 py-2 text-gray-50 bg-white outline-none"
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
                <label className="block text-sm font-medium text-gray-100 mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={appointmentForm.price}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, price: e.target.value })}
                  className="w-full border-b border-gray-300 l px-3 py-2 text-gray-50 bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  value={appointmentForm.duration_minutes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, duration_minutes: e.target.value })}
                  className="w-full border-b border-gray-300 l px-3 py-2 text-gray-50 bg-white outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700"
                >
                  Criar Agendamento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentForm(false)
                    setSelectedSlot(null)
                    setAppointmentForm({
                      client_id: '',
                      client_name: '',
                      collaborator_id: '',
                      service_id: '',
                      price: '',
                      duration_minutes: ''
                    })
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div >
      )
      }

      {/* Legenda */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Legenda</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-700">Horário Livre (clique para agendar)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-700">Horário Ocupado</span>
          </div>
        </div>
      </div>
    </div >
  )
} 