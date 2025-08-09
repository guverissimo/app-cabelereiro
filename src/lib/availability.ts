import type { Appointment } from './api/appointments'
import { getAppointments } from './api/appointments'

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
    const appointments = await getAppointments({
      collaborator_id: collaboratorId,
      status: 'AGENDADO'
    })

    const conflictingAppointments = appointments.filter(appointment => {
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
  durationMinutes: number,
  serviceDurationMinutes?: number
): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = []
  const dayStart = new Date(preferredTime)
  dayStart.setHours(8, 0, 0, 0) // 8h
  const dayEnd = new Date(preferredTime)
  dayEnd.setHours(18, 0, 0, 0) // 18h

  // Buscar agendamentos do dia
  const appointments = await getAppointments({
    collaborator_id: collaboratorId,
    status: 'AGENDADO'
  })

  const busySlots = appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.datetime)
      return appointmentDate >= dayStart && appointmentDate <= dayEnd
    })
    .map(appointment => {
      const start = new Date(appointment.datetime)
      const end = new Date(start.getTime() + appointment.duration_minutes * 60000)
      return { start, end }
    })

  // Gerar slots com base na duração do serviço, se fornecida
  const slotDuration = serviceDurationMinutes ? serviceDurationMinutes : 30 * 60000;
  // Gerar slots de 30 minutos
  //const slotDuration = 30 * 60000 // 30 minutos em ms
  let currentTime = new Date(dayStart)

  while (currentTime < dayEnd) {
    const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000)

    if (slotEnd <= dayEnd) {
      const isSlotAvailable = !busySlots.some(busySlot =>
        hasTimeConflict(currentTime, slotEnd, busySlot.start, busySlot.end)
      )

      slots.push({
        start: new Date(currentTime),
        end: new Date(slotEnd),
        isAvailable: isSlotAvailable
      })
    }

    currentTime = new Date(currentTime.getTime() + slotDuration)
  }

  return slots
}

// Obter horário de trabalho do colaborador
export async function getCollaboratorWorkSchedule(
  collaboratorId: string,
  date: Date
): Promise<{ start: Date; end: Date } | null> {
  // Por enquanto, retorna horário padrão (8h às 18h)
  // TODO: Implementar busca na tabela de horários de trabalho
  const dayOfWeek = date.getDay()

  // Segunda a sexta (1-5)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const start = new Date(date)
    start.setHours(8, 0, 0, 0)
    const end = new Date(date)
    end.setHours(18, 0, 0, 0)
    return { start, end }
  }

  return null
}

// Obter agenda do colaborador para uma data específica
export async function getCollaboratorSchedule(
  collaboratorId: string,
  date: Date
): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = []

  // Obter horário de trabalho
  const workSchedule = await getCollaboratorWorkSchedule(collaboratorId, date)
  if (!workSchedule) return slots

  // Buscar agendamentos do dia
  const appointments = await getAppointments({
    collaborator_id: collaboratorId,
    status: 'AGENDADO'
  })

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const dayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.datetime)
    return appointmentDate >= dayStart && appointmentDate <= dayEnd
  })

  // Gerar slots de 30 minutos
  const slotDuration = 30 * 60000 // 30 minutos
  let currentTime = new Date(workSchedule.start)

  while (currentTime < workSchedule.end) {
    const slotEnd = new Date(currentTime.getTime() + 30 * 60000) // 30 minutos

    // Verificar se há agendamento neste slot
    const appointment = dayAppointments.find(app => {
      const appStart = new Date(app.datetime)
      const appEnd = new Date(appStart.getTime() + app.duration_minutes * 60000)
      return hasTimeConflict(currentTime, slotEnd, appStart, appEnd)
    })

    slots.push({
      start: new Date(currentTime),
      end: new Date(slotEnd),
      isAvailable: !appointment,
      appointment: appointment ? {
        ...appointment,
        services: appointment.service
      } : undefined
    })

    currentTime = new Date(currentTime.getTime() + slotDuration)
  }

  return slots
}

// Formatar horário para exibição
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatar duração para exibição
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
  }
  return `${mins}min`
} 