export interface Collaborator {
    id: string;
    name: string;
    role: string;
    email: string;
    created_at: string;
}

export const getCollaborators = async (): Promise<Collaborator[]> => {
    try {
        const res = await fetch('/api/collaborators')
        if (!res.ok) { throw new Error('Erro ao buscar colaboradores') }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar colaboradores');
    }
}

export const createCollaborator = async (data: Omit<Collaborator, 'id' | 'created_at'>): Promise<Collaborator> => {
    try {
        const res = await fetch('/api/collaborators', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || 'Erro ao criar o colaborador');
        }

        return await res.json();
    } catch (error) {
        throw new Error('Erro interno do servidor');
    }
}

export const updateCollaborator = async (id: string, data: Partial<Omit<Collaborator, 'id' | 'created_at'>>): Promise<Collaborator> => {
    try {
        const res = await fetch(`/api/collaborators/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || 'Erro ao atualizar o colaborador');
        }

        return await res.json();
    } catch (error) {        
        throw new Error('Erro interno do servidor');
    }
}

export const deleteCollaborator = async (id: string): Promise<void> => {
    try {
        const res = await fetch(`/api/collaborators/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || 'Erro ao deletar o colaborador');
        }
    } catch (error) {
        throw new Error('Erro interno do servidor');
    }
}