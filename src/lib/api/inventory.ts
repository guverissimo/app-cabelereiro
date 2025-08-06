export interface Inventory {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  last_updated: string
}

export async function getInventory(): Promise<Inventory[]> {
  const response = await fetch('/api/inventory')
  if (!response.ok) {
    throw new Error('Erro ao buscar inventário')
  }
  return response.json()
}

export async function createInventory(data: Omit<Inventory, 'id'>): Promise<Inventory> {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao criar produto')
  }
  return response.json()
}

export async function updateInventory(id: string, data: Partial<Omit<Inventory, 'id'>>): Promise<Inventory> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao atualizar produto')
  }
  return response.json()
}

export async function deleteInventory(id: string): Promise<void> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao deletar produto')
  }
} 