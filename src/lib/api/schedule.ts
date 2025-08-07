export interface Schedule {
  id: string
  collaborator_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}

export interface ScheduleFilters {
  collaborator_id?: string
  day_of_week?: number
}

export async function getSchedule(filters?: ScheduleFilters): Promise<Schedule[]> {
  const params = new URLSearchParams()
  if (filters?.collaborator_id) params.append('collaborator_id', filters.collaborator_id)
  if (filters?.day_of_week) params.append('day_of_week', filters.day_of_week.toString())

  const response = await fetch(`/api/schedule?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar agenda')
  }
  console.log('Response from getSchedule:', response)
  return response.json()
}

export async function createSchedule(data: Omit<Schedule, 'id' | 'created_at'>): Promise<Schedule> {
  const response = await fetch('/api/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao criar horário')
  }
  return response.json()
} 