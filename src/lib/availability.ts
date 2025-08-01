import { supabase } from './supabase'
import type { Appointment } from './supabase'

export interface TimeSlot {
  start: Date
  end: Date
  isAvailable: boolean
  appointment?: Appointment & {
    services?: {
      name: string
      duration_minutes: number
      price: number
    }
  }
}

export interface AvailabilityCheck {
  isAvailable: boolean
  conflictingAppointments: Appointment[]
  suggestedSlots: TimeSlot[]
}

// Verificar se há conflito entre dois horários
export function hasTimeConflict(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1
}

// Verificar disponibilidade para um horário específico
export async function checkAvailability(
  collaboratorId: string,
  startTime: Date,
  durationMinutes: number
): Promise<AvailabilityCheck> {
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000)
  
  try {
    // Buscar agendamentos do colaborador no período
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('collaborator_id', collaboratorId)
      .eq('status', 'agendado')
      .gte('datetime', startTime.toISOString())
      .lte('datetime', new Date(endTime.getTime() + 24 * 60 * 60000).toISOString())

    const conflictingAppointments = (appointments || []).filter(appointment => {
      const appointmentStart = new Date(appointment.datetime)
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000)
      
      return hasTimeConflict(startTime, endTime, appointmentStart, appointmentEnd)
    })

    const isAvailable = conflictingAppointments.length === 0

    // Gerar sugestões de horários disponíveis
    const suggestedSlots = await generateSuggestedSlots(
      collaboratorId,
      startTime,
      durationMinutes
    )

    return {
      isAvailable,
      conflictingAppointments,
      suggestedSlots
    }
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error)
    return {
      isAvailable: false,
      conflictingAppointments: [],
      suggestedSlots: []
    }
  }
}

// Gerar horários sugeridos
export async function generateSuggestedSlots(
  collaboratorId: string,
  preferredTime: Date,
  durationMinutes: number
): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = []
  const dayStart = new Date(preferredTime)
  dayStart.setHours(8, 0, 0, 0) // 8h
  const dayEnd = new Date(preferredTime)
  dayEnd.setHours(18, 0, 0, 0) // 18h

  // Buscar agendamentos do dia
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('collaborator_id', collaboratorId)
    .eq('status', 'agendado')
    .gte('datetime', dayStart.toISOString())
    .lte('datetime', dayEnd.toISOString())

  const busySlots = (appointments || []).map(appointment => {
    const start = new Date(appointment.datetime)
    const end = new Date(start.getTime() + appointment.duration_minutes * 60000)
    return { start, end }
  })

  // Gerar slots de 30 minutos
  const slotDuration = 30 * 60000 // 30 minutos em ms
  let currentTime = new Date(dayStart)

  while (currentTime < dayEnd) {
    const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000)
    
    if (slotEnd <= dayEnd) {
      const hasConflict = busySlots.some(busySlot =>
        hasTimeConflict(currentTime, slotEnd, busySlot.start, busySlot.end)
      )

      if (!hasConflict) {
        slots.push({
          start: new Date(currentTime),
          end: slotEnd,
          isAvailable: true
        })
      }
    }

    currentTime = new Date(currentTime.getTime() + slotDuration)
  }

  return slots.slice(0, 10) // Retornar apenas os primeiros 10 slots
}

// Obter horários de trabalho de um colaborador
export async function getCollaboratorWorkSchedule(
  collaboratorId: string,
  date: Date
): Promise<{ start: Date; end: Date } | null> {
  const dayOfWeek = date.getDay() // 0 = Domingo, 1 = Segunda, etc.

  try {
    const { data: schedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('collaborator_id', collaboratorId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true)
      .single()

    if (!schedule) return null

    const start = new Date(date)
    const [startHour, startMinute] = schedule.start_time.split(':').map(Number)
    start.setHours(startHour, startMinute, 0, 0)

    const end = new Date(date)
    const [endHour, endMinute] = schedule.end_time.split(':').map(Number)
    end.setHours(endHour, endMinute, 0, 0)

    return { start, end }
  } catch (error) {
    console.error('Erro ao buscar horário de trabalho:', error)
    return null
  }
}

// Obter horários ocupados de um colaborador
export async function getCollaboratorSchedule(
  collaboratorId: string,
  date: Date
): Promise<TimeSlot[]> {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  try {
    console.log('Buscando agendamentos para:', { collaboratorId, dayStart, dayEnd })
    
    // Buscar horário de trabalho do colaborador
    const workSchedule = await getCollaboratorWorkSchedule(collaboratorId, date)
    
    // Buscar agendamentos do dia
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (
          name,
          duration_minutes,
          price
        )
      `)
      .eq('collaborator_id', collaboratorId)
      .eq('status', 'agendado')
      .gte('datetime', dayStart.toISOString())
      .lte('datetime', dayEnd.toISOString())
      .order('datetime')

    if (error) {
      console.error('Erro na query:', error)
      return []
    }

    console.log('Agendamentos encontrados:', appointments)

    // Criar slots ocupados
    const occupiedSlots = (appointments || []).map(appointment => {
      const start = new Date(appointment.datetime)
      const end = new Date(start.getTime() + appointment.duration_minutes * 60000)
      
      return {
        start,
        end,
        isAvailable: false,
        appointment
      }
    })

    // Se não há horário de trabalho definido, retornar apenas os agendamentos
    if (!workSchedule) {
      return occupiedSlots
    }

    // Gerar slots livres baseados no horário de trabalho
    const freeSlots: TimeSlot[] = []
    const slotDuration = 30 * 60000 // 30 minutos
    let currentTime = new Date(workSchedule.start)

    while (currentTime < workSchedule.end) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration)
      
      if (slotEnd <= workSchedule.end) {
        // Verificar se o slot está ocupado
        const isOccupied = occupiedSlots.some(occupied => 
          hasTimeConflict(currentTime, slotEnd, occupied.start, occupied.end)
        )

        if (!isOccupied) {
          freeSlots.push({
            start: new Date(currentTime),
            end: slotEnd,
            isAvailable: true
          })
        }
      }

      currentTime = new Date(currentTime.getTime() + slotDuration)
    }

    // Combinar slots ocupados e livres
    return [...occupiedSlots, ...freeSlots].sort((a, b) => a.start.getTime() - b.start.getTime())
  } catch (error) {
    console.error('Erro ao buscar agenda do colaborador:', error)
    return []
  }
}

// Formatar horário para exibição
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatar duração
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
  }
  return `${mins}min`
} 