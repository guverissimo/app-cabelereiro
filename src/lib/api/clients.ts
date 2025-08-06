import { Client } from "@/types/cliente";

export const getClients = async () => {
    try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('Erro ao buscar clientes');
        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar clientes');
    }
};

export const getClientByPhone = async (client_phone: string) => {
    try {
        const res = await fetch(`/api/clients/client_phone?value=${client_phone}`)
        return await res.json();
    } catch (error) {
        throw new Error('Erro ao buscar o cliente');
    }
}

export const createClient = async (data: Client) => {
  const res = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || 'Erro ao criar o cliente');
  }

  return await res.json();
};

export const updateClient = async (data: Partial<Client>) => {
    try {
        const res = await fetch(`/api/clients/${data.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        return res.json();

    } catch (error) {
        throw new Error('Erro ao atualizar o cliente');
    }
}

export const deleteClient = async (id: string) => {
    try {
        const res = await fetch(`/api/clients/${id}`, {
            method: 'DELETE',
        })

        return res.json();
    } catch (error) {
        throw new Error('Erro ao atualizar o cliente');
    }
}