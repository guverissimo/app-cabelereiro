import { Client } from "@/types/cliente";

export const getClients = async (search?: string): Promise<Client[]> => {

    try {
        const queryParam = search?.trim() ? `?q=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/clients${queryParam}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error("Falha ao buscar clientes");   
        }
        const data = await res.json();
        console.log(data);
        
        return data;
    } catch (error) {
        console.error("Erro em getClients:", error);
        throw error instanceof Error ? error : new Error("Erro desconhecido");
    }
};

export const getClientByPhone = async (client_phone: string) => {
    try {
        const res = await fetch(`/api/clients/client_phone?value=${client_phone}`)
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(`Erro ao buscar cliente por telefone: ${res.status} - ${errorData.error || 'Erro desconhecido'}`)
        }
        return await res.json();
    } catch (error) {
        console.error('Erro em getClientByPhone:', error);
        throw error;
    }
}

export const createClient = async (data: Client) => {
    try {
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
    } catch (error) {
        console.error('Erro em createClient:', error);
        throw error;
    }
};

export const updateClient = async (data: Partial<Client>) => {
    try {
        const res = await fetch(`/api/clients/${data.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || 'Erro ao atualizar o cliente');
        }

        return res.json();
    } catch (error) {
        console.error('Erro em updateClient:', error);
        throw error;
    }
}

export const deleteClient = async (id: string) => {
    try {
        const res = await fetch(`/api/clients/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || 'Erro ao deletar o cliente');
        }

        return res.json();
    } catch (error) {
        console.error('Erro em deleteClient:', error);
        throw error;
    }
}