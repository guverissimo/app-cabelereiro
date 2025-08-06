export interface Appointment {
  id: string
  client_name: string
  service_id: string
  price: number
  collaborator_id: string
  datetime: string
  duration_minutes: number
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO'
  created_at: string
  service?: {
    name: string
    duration_minutes: number
    price: number
  }
  collaborator?: {
    name: string
    role: string
  }
}

export interface AppointmentFilters {
  status?: string
  collaborator_id?: string
  date?: string
}

export async function getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.collaborator_id) params.append('collaborator_id', filters.collaborator_id)
  if (filters?.date) params.append('date', filters.date)

  const response = await fetch(`/api/appointments?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar agendamentos')
  }
  return response.json()
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'created_at' | 'service' | 'collaborator'>): Promise<Appointment> {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao criar agendamento')
  }
  return response.json()
}

export async function updateAppointment(id: string, data: Partial<Omit<Appointment, 'id' | 'created_at' | 'service' | 'collaborator'>>): Promise<Appointment> {
  const response = await fetch(`/api/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao atualizar agendamento')
  }
  return response.json()
}

export async function deleteAppointment(id: string): Promise<void> {
  const response = await fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao deletar agendamento')
  }
} 