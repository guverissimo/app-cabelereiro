export interface Service {
  id: string
  name: string
  duration_minutes: number
  price: number
  description?: string
  created_at: string
}

export async function getServices(): Promise<Service[]> {
  const response = await fetch('/api/services')
  if (!response.ok) {
    throw new Error('Erro ao buscar serviços')
  }
  return response.json()
}

export async function createService(data: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao criar serviço')
  }
  return response.json()
}

export async function updateService(id: string, data: Partial<Omit<Service, 'id' | 'created_at'>>): Promise<Service> {
  const response = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao atualizar serviço')
  }
  return response.json()
}

export async function deleteService(id: string): Promise<void> {
  const response = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao deletar serviço')
  }
} 