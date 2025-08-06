export interface Cashflow {
  id: string
  type: 'ENTRADA' | 'SAIDA'
  description: string
  amount: number
  date: string
  category: string
  appointment_id?: string
}

export interface CashflowFilters {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
}

export async function getCashflow(filters?: CashflowFilters): Promise<Cashflow[]> {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.category) params.append('category', filters.category)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const response = await fetch(`/api/cashflow?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar fluxo de caixa')
  }
  return response.json()
}

export async function createCashflow(data: Omit<Cashflow, 'id'>): Promise<Cashflow> {
  const response = await fetch('/api/cashflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao criar transação')
  }
  return response.json()
}

export async function updateCashflow(id: string, data: Partial<Omit<Cashflow, 'id'>>): Promise<Cashflow> {
  const response = await fetch(`/api/cashflow/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao atualizar transação')
  }
  return response.json()
}

export async function deleteCashflow(id: string): Promise<void> {
  const response = await fetch(`/api/cashflow/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao deletar transação')
  }
} 