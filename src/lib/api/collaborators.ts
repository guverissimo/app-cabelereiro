import { collaborator, collaboratorSchema } from "@/types/collaborator";

export const getCollaborators = async () => {
    try {
        const res = await fetch('/api/collaborators')
        if (!res.ok) { throw new Error('Erro ao buscar colaboradores') }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar clientes');
    }
}

export const createCollaborator = async (data: collaborator) => {
    try {
        const validatedData = collaboratorSchema.parse(data);

        const res = await fetch('/api/collaborators', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedData),
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