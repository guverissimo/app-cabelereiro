import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface Collaborator {
  id: string
  name: string
  role: string
  email: string
  created_at: string
}

export interface Service {
  id: string
  name: string
  duration_minutes: number
  price: number
  description?: string
  created_at: string
}

export interface Schedule {
  id: string
  collaborator_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}

export interface Appointment {
  id: string
  client_name: string
  service_id: string
  price: number
  collaborator_id: string
  datetime: string
  duration_minutes: number
  status: 'agendado' | 'concluído' | 'cancelado'
  created_at: string
}

export interface Inventory {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  last_updated: string
}

export interface Cashflow {
  id: string
  type: 'entrada' | 'saída'
  description: string
  amount: number
  date: string
  category: string
  appointment_id?: string
} 