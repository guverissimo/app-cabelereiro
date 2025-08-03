import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseUrl = "https://phnvurlqgpiaefrewzms.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobnZ1cmxxZ3BpYWVmcmV3em1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTAwMDUsImV4cCI6MjA2OTMyNjAwNX0.8JSv_ANpm31ijWrEpUEJ2Di-mjBzIJWtMBXXS7cPO5s"

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

export interface Client {
  id: string
  client_name: string
  client_phone: string
}