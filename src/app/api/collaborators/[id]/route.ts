import { prisma } from "@/lib/prisma";
import { collaboratorSchema } from "@/types/collaborator";
import { NextRequest, NextResponse } from "next/server";
import z, { json } from "zod";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const collaboratorId = params.id
        const body = await req.json()

        const validatedData = collaboratorSchema.partial(body);

        const existingCollaborator = await prisma.client.findUnique({
            where: { id: collaboratorId }
        })

        if (!existingCollaborator) {
            return NextResponse.json(
                { error: 'Colaborador não encontrado' },
                { status: 404 }
            )
        }

        const updatedCollaborator = await prisma.collaborator.update({
            where: { id: collaboratorId },
            data: validatedData
        })

        return NextResponse.json(updatedCollaborator, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Erro de validação', issues: error.format() },
                { status: 400 }
            )
        }

        console.error('[PATCH_CLIENT_ERROR]', error)

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
}